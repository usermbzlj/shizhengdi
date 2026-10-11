"""
Territory transitions between consecutive keyframes, for the "ink spreading" animation.

For keyframes A -> B we overlay the two partitions:
  * pieces owned by the same (faction, strength) in both stay one static feature (never cross-faded,
    so unchanged land does not flicker);
  * pieces that change hands are cut into small hexagons, each with a start time `t` in [0, 0.72]:
    how far it lies from where the gaining faction already stood in A (plus a little smooth noise),
    so colour spreads outward from the old frontier like ink;
  * border lines are split into what both keyframes share (static), what only A has (fades out as the
    front passes) and what only B has (fades in as the front arrives).

Writes public/data/transitions/<A id>.json and src/data/transitions.json (index with play times).
"""
import json
import math
from collections import defaultdict
from pathlib import Path

from shapely import STRtree, make_valid
from shapely.geometry import LineString, MultiLineString, MultiPolygon, Point, Polygon, mapping, shape
from shapely.ops import polylabel, substring, unary_union

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public" / "data"
SRC = ROOT / "src" / "data"
OUT = PUB / "transitions"
OUT.mkdir(parents=True, exist_ok=True)

HEX = 0.25  # hexagon size (deg of latitude) for the spreading front
TMAX = 0.72  # latest start; each piece then fades over the remaining window
LINE_TOL = 0.012  # borders closer than this in A and B count as the same border
SEG = 0.3  # length of the border pieces that fade individually
MIN_AREA = 1e-7


def rnd(geom, nd=3):
    def r(c):
        if isinstance(c, (list, tuple)) and c and isinstance(c[0], (int, float)):
            return [round(c[0], nd), round(c[1], nd)]
        return [r(x) for x in c]

    m = mapping(geom)
    return {"type": m["type"], "coordinates": r(m["coordinates"])}


def polys(g):
    if g is None or g.is_empty:
        return []
    if isinstance(g, Polygon):
        return [g]
    if isinstance(g, MultiPolygon):
        return list(g.geoms)
    return [p for x in getattr(g, "geoms", []) for p in polys(x)]


def as_poly(g):
    ps = [p for p in polys(g) if p.area > MIN_AREA]
    if not ps:
        return None
    return ps[0] if len(ps) == 1 else MultiPolygon(ps)


def lines(g):
    if g is None or g.is_empty:
        return []
    if isinstance(g, LineString):
        return [g]
    return [p for x in getattr(g, "geoms", []) for p in lines(x)]


# Factions are compared by colour: 曹操 -> 魏 or 孙氏 -> 吴 is a new name on the same land, not a change to animate.
COLOR = {f["id"]: f["color"].lower() for f in json.loads((SRC / "factions.json").read_text(encoding="utf-8"))}
REP = {}
for fid, c in COLOR.items():
    REP.setdefault(c, fid)


def ckey(f):
    return COLOR.get(f, f)


def load(fid):
    """Fills keyed by (colour, strength) and outlines keyed by colour."""
    d = json.loads((PUB / "territory" / f"{fid}.json").read_text(encoding="utf-8"))
    fills = defaultdict(list)
    borders = defaultdict(list)
    for ft in d["features"]:
        p = ft["properties"]
        g = shape(ft["geometry"])
        if p["k"] == "fill":
            # coordinates were rounded on export, which can leave small self-intersections
            fills[(ckey(p["f"]), p["s"])].append(make_valid(g).buffer(0))
        else:
            borders[ckey(p["f"])].append(g)
    return {k: unary_union(v).buffer(0) for k, v in fills.items()}, {k: unary_union(v) for k, v in borders.items()}


def rep(c):
    return REP.get(c, c)


# ---- smooth value noise, so the front is organic rather than a perfect ring ----
def _hash(i, j):
    h = (i * 374761393 + j * 668265263) & 0xFFFFFFFF
    h = ((h ^ (h >> 13)) * 1274126177) & 0xFFFFFFFF
    return (h & 0xFFFF) / 0xFFFF * 2 - 1


def noise(x, y, scale=1.3):
    x, y = x / scale, y / scale
    i, j = math.floor(x), math.floor(y)
    fx, fy = x - i, y - j
    sx, sy = fx * fx * (3 - 2 * fx), fy * fy * (3 - 2 * fy)
    a, b = _hash(i, j), _hash(i + 1, j)
    c, d = _hash(i, j + 1), _hash(i + 1, j + 1)
    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy


def hexgrid(bounds, size):
    """Pointy hexagons in lon/lat, widened in longitude so they look regular on the map."""
    minx, miny, maxx, maxy = bounds
    lat0 = (miny + maxy) / 2
    k = 1 / max(0.5, math.cos(math.radians(lat0)))
    r = size / 2
    w = math.sqrt(3) * r * k
    h = 1.5 * r
    out = []
    row = 0
    y = miny - h
    while y < maxy + h:
        x0 = minx - w + (w / 2 if row % 2 else 0)
        x = x0
        while x < maxx + w:
            pts = [(x + r * k * math.cos(math.radians(a)), y + r * math.sin(math.radians(a))) for a in range(30, 390, 60)]
            out.append(Polygon(pts))
            x += w
        y += h
        row += 1
    return out


def orient_like(line, territory):
    """Keep the faction's interior on the left of the line (the edge wash is offset to that side)."""
    if territory is None or line.length < 1e-6:
        return line
    mid = line.interpolate(0.5, normalized=True)
    a = line.interpolate(max(0.0, line.length / 2 - 0.01))
    b = line.interpolate(min(line.length, line.length / 2 + 0.01))
    dx, dy = b.x - a.x, b.y - a.y
    n = math.hypot(dx, dy) or 1
    left = Point(mid.x - dy / n * 0.03, mid.y + dx / n * 0.03)
    return line if territory.contains(left) else LineString(list(line.coords)[::-1])


def split(line, seg=SEG):
    n = max(1, round(line.length / seg))
    if n == 1:
        return [line]
    step = line.length / n
    return [substring(line, i * step, (i + 1) * step) for i in range(n)]


def by_faction(fills):
    out = defaultdict(list)
    for (f, _), g in fills.items():
        out[f].append(g)
    return {f: unary_union(v) for f, v in out.items()}


def transition(ka, kb):
    A, LA = load(ka["id"])
    B, LB = load(kb["id"])
    uA = unary_union(list(A.values()))
    uB = unary_union(list(B.values()))
    FA, FB = by_faction(A), by_faction(B)

    same = defaultdict(list)
    changed = []  # (geom, ga, gb)
    for ga, a in A.items():
        for gb, b in B.items():
            if not a.envelope.intersects(b.envelope):
                continue
            x = as_poly(a.intersection(b))
            if x is None:
                continue
            if ga == gb:
                same[ga].append(x)
            else:
                changed.append((x, ga, gb))
        rest = as_poly(a.difference(uB))
        if rest is not None:
            changed.append((rest, ga, None))
    for gb, b in B.items():
        rest = as_poly(b.difference(uA))
        if rest is not None:
            changed.append((rest, None, gb))

    feats = []
    for g, gs in same.items():
        u = as_poly(unary_union(gs))
        if u is not None:
            feats.append({"type": "Feature", "properties": {"k": "f", "ch": 0, "fa": rep(g[0]), "sa": g[1]}, "geometry": rnd(u)})

    # ---- cut the changing land into hexagons and give each a start time ----
    caps = {ckey(c["faction"]): Point(c["lng"], c["lat"]) for c in kb.get("capitals", []) if c.get("lng") is not None}
    pieces = []  # (geom, ga, gb, key, seed)
    if changed:
        # coarser cells for sweeping changes keep a transition near 1500 pieces
        size = max(HEX, math.sqrt(sum(c[0].area for c in changed) / 1170))
        grid = hexgrid(unary_union([c[0] for c in changed]).bounds, size)
        tree = STRtree(grid)
        for geom, ga, gb in changed:
            if gb is not None and (ga is None or ga[0] != gb[0]):
                f = gb[0]
                key = ("gain", f)
                seed = FA.get(f)
                if seed is None or seed.is_empty:
                    region = unary_union([c[0] for c in changed if c[2] is not None and c[2][0] == f])
                    seed = caps.get(f) or polylabel(max(polys(region), key=lambda p: p.area), tolerance=0.05)
            elif gb is None:
                f = ga[0]
                key = ("loss", f)
                seed = FA[f].boundary
            else:
                f = gb[0]
                key = ("tone", f)
                seed = A.get(gb)
                if seed is None or seed.is_empty:
                    seed = FA[f].boundary
            for i in tree.query(geom, predicate="intersects"):
                x = as_poly(geom.intersection(grid[i]))
                if x is not None:
                    pieces.append((x, ga, gb, key, seed))

    dist = [p[0].representative_point().distance(p[4]) for p in pieces]
    dmax = defaultdict(float)
    for p, d in zip(pieces, dist):
        dmax[p[3]] = max(dmax[p[3]], d)
    area = 0.0
    starts = []
    for (geom, ga, gb, key, _), d in zip(pieces, dist):
        c = geom.representative_point()
        t = TMAX * d / dmax[key] if dmax[key] > 1e-6 else TMAX / 2
        t = min(TMAX, max(0.0, t + 0.05 * noise(c.x, c.y)))
        starts.append(t)
        area += geom.area * (0.3 if key[0] == "tone" else 1)
        feats.append({
            "type": "Feature",
            "properties": {"k": "f", "ch": 1, "fa": rep(ga[0]) if ga else "", "sa": ga[1] if ga else "",
                           "fb": rep(gb[0]) if gb else "", "sb": gb[1] if gb else "", "t": round(t, 3)},
            "geometry": rnd(geom),
        })

    # ---- borders ----
    ptree = STRtree([p[0] for p in pieces]) if pieces else None

    def start_near(g, lag):
        if ptree is None:
            return 0.35
        i = ptree.nearest(g)
        return round(min(TMAX, starts[i] + lag), 3)

    for f in sorted(set(LA) | set(LB)):
        la, lb = LA.get(f), LB.get(f)
        if la is not None and lb is not None:
            common = la.intersection(lb.buffer(LINE_TOL))
            only_a = la.difference(lb.buffer(LINE_TOL))
            only_b = lb.difference(la.buffer(LINE_TOL))
        else:
            common, only_a, only_b = None, la, lb
        for part in lines(common):
            if part.length > 0.02:
                part = orient_like(part, FA.get(f))
                feats.append({"type": "Feature", "properties": {"k": "l", "m": "c", "f": rep(f), "t": 0}, "geometry": rnd(part)})
        for mode, geom, terr, lag in (("a", only_a, FA.get(f), 0.0), ("b", only_b, FB.get(f), 0.14)):
            for part in lines(geom):
                if part.length < 0.02:
                    continue
                part = orient_like(part, terr)
                for s in split(part):
                    feats.append({"type": "Feature", "properties": {"k": "l", "m": mode, "f": rep(f), "t": start_near(s.interpolate(0.5, normalized=True), lag)},
                                  "geometry": rnd(s)})

    seconds = 0.25 if area < 0.05 else min(2.4, 1.1 + 0.4 * math.log2(1 + area))
    return feats, round(area, 2), round(seconds, 2), len(pieces)


keyframes = sorted(json.loads((SRC / "keyframes.json").read_text(encoding="utf-8")), key=lambda k: k["year"])
index = []
total = 0
for ka, kb in zip(keyframes, keyframes[1:]):
    feats, area, seconds, n = transition(ka, kb)
    path = OUT / f"{ka['id']}.json"
    path.write_text(json.dumps({"type": "FeatureCollection", "features": feats}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    size = path.stat().st_size
    total += size
    index.append({"from": ka["id"], "to": kb["id"], "seconds": seconds, "area": area})
    print(f"  {ka['id']} -> {kb['id']}: {n} moving pieces, {area} deg2 changes, {seconds}s, {size / 1024:.0f} KB")
(SRC / "transitions.json").write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"transitions: {len(index)}, {total / 1024 / 1024:.1f} MB")
