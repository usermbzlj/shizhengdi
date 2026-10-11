"""Turn the research notes into the prototype's map + content data.

Run with the data venv:  ..\\data\\.venv\\Scripts\\python.exe scripts/build_map.py
"""
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

import geopandas as gpd
import pyogrio
from shapely.geometry import MultiPoint, Point, box, mapping, shape, Polygon, MultiPolygon, LineString, MultiLineString
from shapely import concave_hull, coverage_simplify
from shapely.ops import unary_union, voronoi_diagram, polylabel
from shapely.strtree import STRtree
from shapely.geometry.polygon import orient

from research import blocks, RESEARCH
from event_overrides import (apply_event_overrides, apply_fact_capitals, apply_fact_events, apply_fact_world,
                             load_fact_corrections)

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT.parent / "data"
PUB = ROOT / "public" / "data"
SRC = ROOT / "src" / "data"
CHGIS = DATA / "raw" / "chgis" / "v6"
for d in (PUB / "territory", PUB / "cells", PUB / "provinces"):
    d.mkdir(parents=True, exist_ok=True)

WARN = []


def warn(msg):
    WARN.append(msg)


def dump(path, obj):
    path.write_text(json.dumps(obj, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def rnd(geom, nd=3):
    def r(c):
        if isinstance(c, (list, tuple)) and c and isinstance(c[0], (int, float)):
            return [round(c[0], nd), round(c[1], nd)]
        return [r(x) for x in c]
    m = mapping(geom)
    return {"type": m["type"], "coordinates": r(m["coordinates"])}


# --------------------------------------------------------------------------------------
# factions
# --------------------------------------------------------------------------------------
FACTIONS = [
    ("han", "东汉", "#d4b06a", "han"),
    ("huangjin", "黄巾", "#e3c84a", None),
    ("heishan", "黑山军", "#8c8c86", None),
    ("dong", "董卓集团", "#a0625a", None),
    ("yuanshao", "袁绍", "#b9a24e", None),
    ("yuanshu", "袁术", "#a877b5", None),
    ("cao", "曹操", "#6f9fdc", "wei"),
    ("wei", "魏", "#6f9fdc", "wei"),
    ("liubei", "刘备", "#6fbf8e", "shu"),
    ("shu", "蜀", "#6fbf8e", "shu"),
    ("sun", "孙氏", "#e07b62", "wu"),
    ("wu", "吴", "#e07b62", "wu"),
    ("jin", "晋", "#ad93dc", "jin"),
    ("liubiao", "刘表", "#4fb7b1", None),
    ("liuzhang", "刘璋", "#9cc36a", None),
    ("zhanglu", "张鲁", "#cbbd7c", None),
    ("gongsunzan", "公孙瓒", "#8093ad", None),
    ("taoqian", "陶谦", "#b08f72", None),
    ("lvbu", "吕布", "#c9607f", None),
    ("zhangxiu", "张绣", "#9c84bf", None),
    ("liang", "凉州诸将", "#c98e52", None),
    ("gongsun_liaodong", "辽东公孙氏", "#63aaa6", None),
    ("shixie", "士燮", "#bda865", None),
    ("zhangyang", "张杨", "#a4a07a", None),
    ("liuyao", "刘繇", "#7aa2b8", None),
    ("minor_hanfu", "韩馥", "#a99a78", None),
    ("minor_kongrong", "孔融", "#a3b38a", None),
    ("minor_wanglang", "王朗", "#98a8a0", None),
    ("xianbei", "鲜卑", "#8c8474", None),
    ("wuhuan", "乌桓", "#8c8474", None),
    ("xiongnu", "匈奴", "#8c8474", None),
    ("qiang", "羌", "#8c8474", None),
    ("di", "氐", "#8c8474", None),
    ("goguryeo", "高句丽", "#8c8474", None),
    ("nanzhong", "南中", "#8c8474", None),
]
FACTION_IDS = {f[0] for f in FACTIONS}

# --------------------------------------------------------------------------------------
# commandery names and seats
# --------------------------------------------------------------------------------------
ALIASES = {
    "甘陵": "清河", "丹杨": "丹阳", "勃海": "渤海", "琅琊": "琅邪", "牂牁": "牂柯", "钜鹿": "巨鹿",
    "雒阳": "洛阳", "汝阴": "汝阴", "张掖居延属国": "居延属国", "居延": "居延属国",
}


def base_name(n):
    n = n.strip()
    hint = ""
    m = re.match(r"^(.*?)[（(](.*?)[)）]\s*$", n)
    if m:
        n, hint = m.group(1).strip(), m.group(2)
    if not n.endswith("属国") and len(n) > 2:
        n = re.sub(r"(郡|国|尹)$", "", n)
    n = ALIASES.get(n, n)
    n = SINGLE.get(n, n)
    return n, hint


SINGLE = {"沛": "沛国", "陈": "陈国", "鲁": "鲁国", "梁": "梁国", "赵": "赵国", "齐": "齐国", "蜀": "蜀郡", "吴": "吴郡",
          "巴": "巴郡", "代": "代郡", "涿": "涿郡", "魏": "魏郡", "谯": "谯郡", "东": "东郡", "沛郡": "沛国", "陈郡": "陈国",
          "梁郡": "梁国", "赵郡": "赵国", "齐郡": "齐国", "鲁郡": "鲁国"}

# seats missing from both CHGIS and the commandery list (治所今地约数)
MANUAL_SEATS = {
    "东郡": (115.03, 35.76), "张掖属国": (101.1, 38.6), "辽东属国": (121.1, 41.5), "带方": (125.9, 38.3),
    "襄城": (113.48, 33.85), "汝阴": (115.82, 32.9), "城阳": (118.83, 35.58), "西海": (101.1, 41.9),
    "淮南": (116.78, 32.56), "东广汉": (105.05, 30.95), "九德": (105.68, 18.7), "九真属国": (105.8, 19.8),
    "南安": (104.6, 34.95), "合浦北部都尉": (110.1, 22.6), "庐陵南部都尉": (115.4, 25.95), "新昌": (105.6, 21.3),
    "昌黎": (121.24, 41.53), "武平": (105.9, 21.6), "毗陵典农": (119.95, 31.78), "珠崖": (110.3, 20.0),
    "带方郡": (125.9, 38.3),
}


com = blocks("commanderies.md")[0]
SEAT = {}
PROVINCE_OF = {}
for c in com["commanderies"]:
    b, _ = base_name(c["name"])
    if c.get("lng") is not None and c.get("lat") is not None:
        SEAT[b] = (c["lng"], c["lat"])
    PROVINCE_OF[b] = c["province"]
CHANGES = []
for ch in com["changes"]:
    b, hint = base_name(ch["name"])
    if ch.get("lng") and ch.get("lat"):
        SEAT.setdefault(b, (ch["lng"], ch["lat"]))
        if hint:
            SEAT[f"{b}|{hint}"] = (ch["lng"], ch["lat"])
    parents = ch.get("from") or []
    prov = next((PROVINCE_OF.get(base_name(p)[0]) for p in parents if PROVINCE_OF.get(base_name(p)[0])), None)
    if prov:
        PROVINCE_OF.setdefault(b, prov)
    CHANGES.append({**ch, "base": b})

pp = pyogrio.read_dataframe(CHGIS / "v6_time_pref_pts_utf_wgs84" / "v6_time_pref_pts_utf_wgs84.shp")
pp = pp[(pp.BEG_YR <= 300) & (pp.END_YR >= 150)]
CHGIS_PREF = defaultdict(list)
for _, r in pp.iterrows():
    if r.TYPE_CH in ("州",):
        continue
    b, _ = base_name(r.NAME_CH)
    CHGIS_PREF[b].append((int(r.BEG_YR), int(r.END_YR), float(r.geometry.x), float(r.geometry.y)))

cp = pyogrio.read_dataframe(CHGIS / "v6_time_cnty_pts_utf_wgs84" / "v6_time_cnty_pts_utf_wgs84.shp")
cp = cp[(cp.BEG_YR <= 300) & (cp.END_YR >= 150)]
COUNTIES = [(int(r.BEG_YR), int(r.END_YR), float(r.geometry.x), float(r.geometry.y)) for _, r in cp.iterrows()]


def seat_for(name, year, controller=None):
    b, hint = base_name(name)
    cands = [c for c in CHGIS_PREF.get(b, []) if c[0] <= year <= c[1]]
    if not cands:
        near = sorted(CHGIS_PREF.get(b, []), key=lambda c: min(abs(c[0] - year), abs(c[1] - year)))
        cands = [c for c in near if min(abs(c[0] - year), abs(c[1] - year)) <= 15][:1]
    if hint and f"{b}|{hint}" in SEAT:
        return SEAT[f"{b}|{hint}"]
    if len(cands) > 1 and hint:
        if "北" in hint:
            return max(cands, key=lambda c: c[3])[2:]
        if "南" in hint or "江" in hint or "皖" == hint:
            return min(cands, key=lambda c: c[3])[2:]
    if cands:
        return cands[0][2:]
    if b in SEAT:
        return SEAT[b]
    return MANUAL_SEATS.get(b)


# --------------------------------------------------------------------------------------
# keyframes
# --------------------------------------------------------------------------------------
def summaries(fname):
    """Paragraph(s) between each '## heading' and the following json block."""
    text = (RESEARCH / fname).read_text(encoding="utf-8")
    out = []
    for m in re.finditer(r"```json", text):
        before = text[: m.start()].rstrip()
        paras = [p.strip() for p in re.split(r"\n\s*\n", before) if p.strip()]
        body = ""
        for p in reversed(paras):
            if p.startswith(("#", "|", "-", "```")):
                break
            body = p
            break
        out.append(re.sub(r"\s*\n\s*", "", body))
    return out


YONG = {"京兆", "左冯翊", "右扶风", "冯翊", "扶风", "新平", "安定", "北地", "陇西", "汉阳", "天水", "南安", "广魏", "武都", "阴平"}


def province_220(b, controller):
    p = PROVINCE_OF.get(b)
    if b in YONG:
        p = "雍州"
    if p in ("荆州", "扬州") and controller in ("wu", "shixie"):
        p = p + "（吴）"
    return p or "?"


raw_frames = []
for fname in ("keyframes_184_199.md", "keyframes_200_219.md", "keyframes_220_280.md"):
    sums = summaries(fname)
    bs = [b for b in blocks(fname) if isinstance(b, dict) and "overrides" in b]
    for i, b in enumerate(bs):
        b["_summary"] = sums[i] if i < len(sums) else ""
        b["_file"] = fname
        raw_frames.append(b)

HAN105 = [base_name(c["name"])[0] for c in com["commanderies"]]
frames = []
for b in sorted(raw_frames, key=lambda f: f["year"] + ((f.get("month") or 6) - 1) / 12):
    y = b["year"]
    t = round(y + ((b.get("month") or 6) - 1) / 12, 3)
    prov_default = {p["province"]: (p["controller"], p["strength"]) for p in b["provinces"]}
    entries = {}
    full_list = b["_file"] == "keyframes_220_280.md"
    if not full_list:
        names = list(HAN105)
        for ch in CHANGES:
            if ch["type"] in ("新设", "分置", "复置") and ch["year"] <= y and ch["base"] not in names and ch.get("lng"):
                if y < 220 and ch.get("polity") in ("魏", "蜀", "吴", "晋"):
                    continue
                names.append(ch["base"])
        for n in names:
            prov = PROVINCE_OF.get(n)
            ctrl, st = prov_default.get(prov, (None, None))
            if ctrl is None:
                continue
            entries[n] = {"name": n, "controller": ctrl, "strength": st, "province": prov}
    for o in b["overrides"]:
        bn, hint = base_name(o["name"])
        key = f"{bn}|{hint}" if hint else bn
        ctrl = o.get("controller")
        st = o.get("strength") or "core"
        if ctrl is None:
            st = "lost"
        prov = PROVINCE_OF.get(bn) if not full_list else province_220(bn, ctrl)
        entries[key] = {"name": o["name"], "controller": ctrl or "han", "strength": st, "province": prov,
                        "contenders": o.get("contenders") or [], "note": o.get("note", "")}
        if hint and bn in entries and not full_list:
            entries.pop(bn, None)
    frames.append({"t": t, "year": y, "month": b.get("month"), "label": b["label"], "summary": b["_summary"],
                   "capitals": b.get("capitals", []), "entries": entries})

# Baseline before the Yellow Turbans: the whole realm under the Han court. Two copies so the
# cross-fade into 184 happens only in the last weeks before the uprising.
first = frames[0]
base_entries = {k: {**e, "controller": "han", "strength": "core", "contenders": [], "note": ""} for k, e in first["entries"].items()}
BASE_SUMMARY = ("东汉中后期，十三州、一百多个郡国都在朝廷治下，洛阳是全国的中心。表面统一，内里已经松动："
                "外戚和宦官轮流把持朝政，166 年和 169 年两次党锢之祸把大批士人赶出官场；"
                "边郡羌乱不断，并州北部的郡县开始内迁。地方豪强越来越强，而朝廷越来越弱。")
for t in (150.0, 183.95):
    frames.insert(0 if t == 150.0 else 1, {"t": t, "year": int(t), "month": None, "label": "东汉中后期",
                                           "summary": BASE_SUMMARY,
                                           "capitals": [{"faction": "han", "city": "雒阳", "lng": 112.61, "lat": 34.72}],
                                           "entries": base_entries})
print("keyframes:", [f["t"] for f in frames])

# generalised land for building cells; the fine coastline for the final fills (so they meet the basemap coast)
land_fine = unary_union(gpd.read_file(PUB / "land.geojson").geometry).intersection(box(70, 10, 142, 56)).buffer(0)
land = land_fine.simplify(0.04).buffer(0.02)
# the edge wash is not drawn along coasts: the basemap already treats the shoreline
coast_zone = land_fine.boundary.buffer(0.07, 6)
ENVELOPE = box(60, 0, 150, 62)


def frame_geometry(fr):
    y = fr["year"]
    pts, props = [], []
    used = set()
    for key, e in fr["entries"].items():
        s = seat_for(e["name"], y, e["controller"])
        if not s or s[0] is None or s[1] is None:
            warn(f"{fr['t']}: no seat for {e['name']}")
            continue
        s = (round(s[0], 3), round(s[1], 3))
        while s in used:
            s = (s[0] + 0.02, s[1] + 0.015)
        used.add(s)
        pts.append(Point(s))
        props.append(e)
    counties = [Point(c[2], c[3]) for c in COUNTIES if c[0] <= y <= c[1]]
    mask = realm_mask(counties + pts)
    # Commandery = union of the county cells whose nearest seat it is, so boundaries follow the
    # county pattern instead of long straight Voronoi edges between seats.
    gens = [(p, i) for i, p in enumerate(pts)] + [(c, None) for c in counties]
    vor = voronoi_diagram(MultiPoint([g[0] for g in gens]), envelope=ENVELOPE)
    tree = STRtree([g[0] for g in gens])
    owner_parts = defaultdict(list)
    for poly in vor.geoms:
        hits = tree.query(poly, predicate="contains")
        if len(hits) == 0:
            continue
        gp, gi = gens[hits[0]]
        if gi is None:
            gi = min(range(len(pts)), key=lambda k: (pts[k].x - gp.x) ** 2 + (pts[k].y - gp.y) ** 2)
        owner_parts[gi].append(poly)
    cells = []
    for i, polys in owner_parts.items():
        g = unary_union(polys).intersection(mask)
        if not g.is_empty:
            cells.append((g, props[i], pts[i]))
    return cells


def parts(g):
    if isinstance(g, MultiPolygon):
        return list(g.geoms)
    if isinstance(g, Polygon):
        return [g]
    return [x for x in getattr(g, "geoms", []) if isinstance(x, (Polygon, MultiPolygon))]


def chaikin_ring(coords, n=2):
    pts = list(coords)[:-1]
    for _ in range(n):
        out = []
        for i in range(len(pts)):
            a, b = pts[i], pts[(i + 1) % len(pts)]
            out.append((0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]))
            out.append((0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]))
        pts = out
    return pts + [pts[0]]


def chaikin_poly(g, n=2):
    """Smooth every ring without re-noding. Shared borders between neighbouring polygons smooth identically
    (Chaikin is symmetric along a chain), so fills still meet except in a tiny area at triple junctions."""
    out = []
    for p in parts(g):
        ext = chaikin_ring(p.exterior.coords, n)
        holes = [chaikin_ring(r.coords, n) for r in p.interiors if len(r.coords) > 3]
        out.append(Polygon(ext, holes))
    return out[0] if len(out) == 1 else MultiPolygon(out)


def smooth_poly(g):
    """Round the realm's outer rim (the county-circle scallops) before cells are cut from it."""
    out = []
    for p in parts(g.simplify(0.03)):
        p2 = Polygon(chaikin_ring(p.exterior.coords), [chaikin_ring(r.coords) for r in p.interiors]).buffer(0)
        out.append(p2)
    return unary_union(out)


def realm_mask(points):
    """Administered area as a calm outline: cluster the county seats, wrap each cluster in a concave hull,
    pad it, and round the corners. A union of per-county circles gives a scalloped rim instead."""
    clusters = parts(unary_union([p.buffer(0.95, 8) for p in points]))
    shapes = []
    for c in clusters:
        inside = [p for p in points if c.contains(p)]
        if len(inside) >= 3:
            hull = concave_hull(MultiPoint(inside), ratio=0.22)
        else:
            hull = MultiPoint(inside).convex_hull
        shapes.append(hull.buffer(0.45, 16))
    m = unary_union(shapes).buffer(0.25, 16).buffer(-0.25, 16)
    return smooth_poly(drop_small(fill_holes(m, 3), 0.25)).intersection(land)


def inland_border(g):
    """Ring boundaries (direction kept, so line-offset still points inward) minus the stretches along the coast."""
    lines = []
    for p in parts(g):
        for ring in [p.exterior, *p.interiors]:
            rest = LineString(ring.coords).difference(coast_zone)
            for seg in getattr(rest, "geoms", [rest]):
                if isinstance(seg, LineString) and seg.length > 0.15:
                    lines.append(seg)
    if not lines:
        return None
    return lines[0] if len(lines) == 1 else MultiLineString(lines)


def oriented(g):
    """Exterior rings counter-clockwise, holes clockwise: the map's inner-edge wash relies on it."""
    ps = [orient(p, 1.0) for p in parts(g)]
    return ps[0] if len(ps) == 1 else MultiPolygon(ps)


def fill_holes(g, max_area):
    out = []
    for p in parts(g):
        keep = [r for r in p.interiors if Polygon(r).area > max_area]
        out.append(Polygon(p.exterior, keep))
    return unary_union(out)


def drop_small(g, min_area):
    return unary_union([p for p in parts(g) if p.area >= min_area])


def largest(g):
    if isinstance(g, MultiPolygon):
        return max(g.geoms, key=lambda x: x.area)
    return g


keyframes_out = []
for fr in frames:
    cells = frame_geometry(fr)
    # topology-preserving simplification of the whole commandery coverage, so neighbours keep identical borders
    simplified = coverage_simplify([g for g, _, _ in cells], 0.02)
    cells = [(sg, e, p) for sg, (_, e, p) in zip(simplified, cells) if not sg.is_empty]
    fid = f"kf-{fr['t']:.3f}".replace(".", "-")
    # cells (for place lookup)
    cell_features = []
    for g, e, p in cells:
        prov = (e.get("province") or "").replace("（吴）", "").replace("（魏）", "")
        cell_features.append({"type": "Feature", "properties": {"name": e["name"], "province": prov, "f": e["controller"], "s": e["strength"]},
                              "geometry": rnd(g.simplify(0.02))})
    dump(PUB / "cells" / f"{fid}.json", {"type": "FeatureCollection", "features": cell_features})
    # territory
    groups = defaultdict(list)
    for g, e, p in cells:
        if e["strength"] == "lost":
            continue
        groups[(e["controller"], e["strength"])].append(g)
    terr = []
    for (f, s), gs in groups.items():
        if f not in FACTION_IDS:
            warn(f"{fr['t']}: unknown faction {f}")
        u = unary_union(gs)
        if u.is_empty:
            continue
        g = chaikin_poly(u).buffer(0).intersection(land_fine)
        if g.is_empty:
            continue
        terr.append({"type": "Feature", "properties": {"k": "fill", "f": f, "s": s}, "geometry": rnd(g)})
    # outlines only between factions, not between strength classes of the same faction
    by_faction = defaultdict(list)
    for (f, s), gs in groups.items():
        by_faction[f].extend(gs)
    for f, gs in by_faction.items():
        u = unary_union(gs)
        # the edge wash follows the outer border only: fill interior gaps, drop specks
        u = drop_small(fill_holes(u, 12), 0.3).simplify(0.02)
        if u.is_empty:
            continue
        border = inland_border(oriented(chaikin_poly(u)))
        if border is not None:
            terr.append({"type": "Feature", "properties": {"k": "line", "f": f}, "geometry": rnd(border)})
    dump(PUB / "territory" / f"{fid}.json", {"type": "FeatureCollection", "features": terr})
    # provinces
    pg = defaultdict(list)
    for g, e, p in cells:
        pg[e.get("province") or "?"].append(g)
    provs = [{"type": "Feature", "properties": {"name": k}, "geometry": rnd(unary_union(v).buffer(0.01).buffer(-0.01).simplify(0.02))} for k, v in pg.items()]
    dump(PUB / "provinces" / f"{fid}.json", {"type": "FeatureCollection", "features": provs})
    # labels per faction
    fg = defaultdict(list)
    for g, e, p in cells:
        if e["strength"] != "lost":
            fg[e["controller"]].append(g)
    labels = []
    for f, gs in fg.items():
        u = unary_union(gs)
        big = largest(u)
        area = big.area
        if area < 1.2:
            continue
        pt = polylabel(big, tolerance=0.05)
        size = 3 if area > 55 else 2 if area > 14 else 1
        labels.append({"faction": f, "lng": round(pt.x, 3), "lat": round(pt.y, 3), "size": size})
    seats = [{"name": e["name"], "lng": round(p.x, 3), "lat": round(p.y, 3)} for g, e, p in cells]
    caps = [{"faction": c["faction"], "city": c["city"], "lng": c["lng"], "lat": c["lat"]} for c in fr["capitals"] if c.get("lng")]
    keyframes_out.append({"id": fid, "year": fr["t"], "label": fr["label"], "summary": fr["summary"], "capitals": caps,
                          "labels": labels, "seats": seats})
    print(f"  {fid}: {len(cells)} cells, {len(terr)} territory parts, {len(labels)} labels")

# ---- independent fact-check (research/review_data.md) ----
REVIEW = []
if (RESEARCH / "review_data.md").exists():
    REVIEW = next((b["fixes"] for b in blocks("review_data.md") if isinstance(b, dict) and "fixes" in b), [])
# doubts judged not to adopt: keep the conventional year / span used across the rest of the data
SKIP_REVIEW = {("jingzhou_shishou", "year"), ("simayan_daiwei", "year"), ("nanjun_zhizhan", "endYear"), ("we-himiko-238", "year")}
KF_SUMMARY = {
    "kf-220-750": "公元220年十月，曹丕在颍川繁阳受禅称帝，东汉的招牌换成了魏，随后定都洛阳。北方、关中、河西和荆州北部归魏；刘备在成都，手里是益州，荆州已在前一年丢给孙权。孙权这时驻在公安，第二年才迁到武昌（今鄂州）。交州名义上听孙权的，实际由士燮家族管理。这一年的地图是三国成形的前夕：魏已称帝，蜀、吴还没有。",
}


def clean_suggestion(s):
    # drop notes addressed to the data editor that slipped into suggested text
    parts = re.split(r"(?<=[。！？])", s)
    return "".join(p for p in parts if not re.search(r"summary|制作说明|郡目|不要放", p)).strip()


def review_for(file):
    for f in REVIEW:
        if f.get("file") == file and (f.get("id"), f.get("field")) not in SKIP_REVIEW:
            yield f


for f in review_for("keyframes.json"):
    if f["field"] != "summary":
        continue
    for k in keyframes_out:
        if k["id"] == f["id"]:
            k["summary"] = KF_SUMMARY.get(k["id"]) or clean_suggestion(str(f["suggested"]))
FACTS = load_fact_corrections(RESEARCH / "fact_corrections.json")
apply_fact_capitals(keyframes_out, FACTS)
dump(SRC / "keyframes.json", keyframes_out)
dump(SRC / "factions.json", [{"id": f[0], "name": f[1], "color": f[2], **({"family": f[3]} if f[3] else {})} for f in FACTIONS])

# --------------------------------------------------------------------------------------
# periphery
# --------------------------------------------------------------------------------------
per = blocks("periphery.md")[0]["groups"]
pf, plabels = [], []
for g in per:
    for i, p in enumerate(g.get("periods", [])):
        ring = p.get("polygon")
        if not ring or len(ring) < 4:
            continue
        try:
            poly = Polygon(ring).buffer(0)
        except Exception:
            warn(f"periphery polygon bad: {g['id']}")
            continue
        if poly.is_empty:
            continue
        poly = smooth_poly(poly)
        pf.append({"type": "Feature", "properties": {"id": g["id"], "name": g["name"], "from": p["from"], "to": p["to"]},
                   "geometry": rnd(oriented(poly), 2)})
        c = p.get("center") or [poly.representative_point().x, poly.representative_point().y]
        plabels.append({"id": f"{g['id']}-{i}", "group": g["id"], "name": g["name"], "from": p["from"], "to": p["to"],
                        "lng": round(c[0], 2), "lat": round(c[1], 2), "strength": p.get("strength", "medium")})
dump(PUB / "periphery.geojson", {"type": "FeatureCollection", "features": pf})
dump(SRC / "periphery.json", plabels)
print("periphery polygons:", len(pf))

# --------------------------------------------------------------------------------------
# events
# --------------------------------------------------------------------------------------
KIND = {"institution": "institution", "law": "law", "economy": "economy", "science": "science", "culture": "culture", "society": "society"}
events = []
mil_path = RESEARCH / "events_military.md"
if mil_path.exists():
    for b in blocks("events_military.md"):
        for e in (b.get("events", []) if isinstance(b, dict) else []):
            routes = [{"side": r.get("side", ""), "label": r.get("label", ""), "points": r["points"]} for r in (e.get("route") or []) if r.get("points")]
            events.append({
                "id": e["id"], "name": e["name"], "year": e["year"], "month": e.get("month"), "endYear": e.get("end_year"),
                "kind": e.get("type", "political"), "place": e.get("location_name", ""), "placeModern": e.get("location_modern", ""),
                "lng": e["lng"], "lat": e["lat"], "participants": e.get("participants", []), "importance": e.get("importance", 2),
                "summary": e.get("summary", ""), "geography": e.get("geography", ""), "outcome": e.get("outcome", ""),
                "routes": routes, "sources": e.get("sources", []), "note": e.get("fiction_note") or "",
            })
for b in blocks("events_institutions.md"):
    for e in b.get("items", []):
        y = e.get("year") or e.get("start_year")
        if y is None or e.get("lng") is None:
            continue
        events.append({
            "id": e["id"], "name": e["name"], "year": y, "month": None, "endYear": e.get("end_year"),
            "kind": KIND.get(e.get("category"), "society"), "place": e.get("location_name", ""), "placeModern": e.get("location_modern", ""),
            "lng": e["lng"], "lat": e["lat"], "participants": [], "importance": min(3, max(2, e.get("importance", 2))),
            "summary": e.get("summary", ""), "thenVsNow": e.get("then_vs_now", ""), "sources": e.get("sources", []),
            "note": e.get("uncertainty") or "", "people": e.get("related_people") or [],
        })
seen = set()
events = [e for e in events if not (e["id"] in seen or seen.add(e["id"]))]
FIELD = {"endYear": "endYear", "end_year": "endYear"}
by_id = {e["id"]: e for e in events}
for f in review_for("events.json"):
    e = by_id.get(f["id"])
    if not e:
        warn(f"review: unknown event {f['id']}")
        continue
    field = FIELD.get(f["field"], f["field"])
    val = f["suggested"]
    if field in ("year", "month", "endYear"):
        val = int(val)
    elif isinstance(val, str):
        val = clean_suggestion(val)
    e[field] = val
# The three finished scenes have newer, source-checked corrections. Apply them
# last so older research/review notes cannot restore guessed dates or locations.
apply_event_overrides(events, RESEARCH / "scene_event_overrides.json")
apply_fact_events(events, FACTS)
dump(SRC / "events.json", events)
print("events:", len(events))

# --------------------------------------------------------------------------------------
# world events
# --------------------------------------------------------------------------------------
we = blocks("world_events.md")[0]
world = []
for w in we["world_events"]:
    y = w.get("start_year") or w.get("year")
    if y is None or y < 150 or y > 300:
        continue
    world.append({
        "id": w["id"], "name": w["name"], "year": y, "endYear": w.get("end_year"), "region": w.get("region", ""),
        "place": w.get("location_name", ""), "lng": w["lng"], "lat": w["lat"], "bbox": w["map_bbox"],
        "features": w.get("map_features", []), "summary": w.get("summary", ""), "chinaLink": w.get("china_link", ""),
        "importance": w.get("importance", 2), "sources": w.get("sources", []),
    })
apply_fact_world(world, FACTS)
dump(SRC / "world.json", world)
print("world events:", len(world))

# --------------------------------------------------------------------------------------
# cities
# --------------------------------------------------------------------------------------
cities = []
for fname in ("cities_north.md", "cities_south.md"):
    for c in blocks(fname):
        if not isinstance(c, dict) or "names" not in c:
            continue
        site = c.get("ancient_site") or {}
        lng = site.get("lng", c.get("lng")) if isinstance(site, dict) else c.get("lng")
        lat = site.get("lat", c.get("lat")) if isinstance(site, dict) else c.get("lat")
        names = []
        for n in c["names"]:
            if n.get("from") is None:
                continue
            names.append({"name": n["name"], "from": n["from"], "to": n.get("to") if n.get("to") is not None else 2026,
                          "note": n.get("note", ""), **({"capitalOf": n["capital_of"]} if n.get("capital_of") else {})})
        cities.append({
            "id": c["id"], "modern": c.get("modern_name", ""), "lng": lng, "lat": lat, "names": names,
            "whyHere": c.get("why_here", ""),
            "timeline": [{"year": t["year"], "title": t.get("title", ""), "text": t.get("text") or t.get("summary", "")} for t in c.get("timeline", [])],
            "threeKingdoms": c.get("three_kingdoms", ""),
            "people": [{"name": p["name"], "text": p.get("text") or p.get("brief", "")} for p in c.get("people", [])],
            "today": c.get("today", ""), "sources": c.get("sources", []),
        })
# review: before Sui the city was 番禺; 广州 was the province name
for c in cities:
    if c["id"] == "guangzhou":
        for n in c["names"]:
            if n["name"] == "广州" and n["from"] < 589:
                n["name"] = "番禺"
dump(SRC / "cities.json", cities)
print("cities:", len(cities))

# --------------------------------------------------------------------------------------
# persons
# --------------------------------------------------------------------------------------
persons = []
person_files = [("persons_political.md", "政治军事"), ("persons_culture.md", None)]
if (RESEARCH / "persons_more.md").exists():
    person_files.append(("persons_more.md", None))
for fname, cat in person_files:
    for p in blocks(fname):
        if not isinstance(p, dict) or "locations" not in p:
            continue
        qs = [{"q": q.get("question") or q.get("q"), "domain": q.get("domain", "")} for q in p.get("curious_questions", [])]
        quotes = [l.get("text") for l in (p.get("lines") or p.get("speech_lines") or []) if l.get("text")]
        fvh = []
        for f in p.get("fiction_vs_history", []) or []:
            fvh.append(f if isinstance(f, str) else f"{f.get('fiction', '')}——{f.get('history', '')}")
        pers = p.get("personality")
        if isinstance(pers, dict):
            pers = "；".join(str(v) for v in pers.values())
        kb = p.get("knowledge_boundary")
        if isinstance(kb, dict):
            kb = "；".join(f"{k}：{v}" for k, v in kb.items())
        taboo = p.get("taboo_notes")
        if isinstance(taboo, list):
            taboo = "；".join(taboo)
        locs = [{"from": l["from"], "to": l["to"], "place": l.get("place", ""), "lng": l["lng"], "lat": l["lat"], "role": l.get("role", "")}
                for l in p["locations"] if l.get("lng") is not None and l.get("from") is not None]
        persons.append({
            "id": p["id"], "name": p["name"], "courtesy": p.get("zi") or p.get("courtesy_name") or "",
            "birth": p.get("birth"), "death": p.get("death"), "category": cat or p.get("category", ""),
            "fictional": bool(p.get("fictional")), "locations": locs, "identity": p.get("identity", ""),
            "personality": pers or "", "quotes": quotes, "knowledge_boundary": kb or "", "questions": [q for q in qs if q["q"]],
            "taboo": taboo or "", "fiction_vs_history": fvh,
        })
dump(SRC / "persons.json", persons)
print("persons:", len(persons), [p["name"] for p in persons])

# --------------------------------------------------------------------------------------
# gazetteer
# --------------------------------------------------------------------------------------
gaz = []
for c in cities:
    alt = sorted({n["name"] for n in c["names"]} - {c["modern"]})
    gaz.append({"name": c["modern"], "alt": alt, "lng": c["lng"], "lat": c["lat"], "kind": "city", "cityId": c["id"]})
# Natural Earth name_zh confuses homophones; these are the real towns students search for.
MODERN_FIX = {
    "安溪": (118.187, 25.056),
    "吴川": (110.778, 21.441),
    "常平镇": (113.996, 22.978),
    "婺源": (117.862, 29.248),
    "峄山镇": (117.053, 35.478),
    "锦溪": (120.905, 31.172),
}
# Seats with no CHGIS point. Same approximate spots the keyframes already draw.
SEAT_FIX = {
    "东郡": (115.03, 35.76),
    "张掖属国": (101.1, 38.6),
    "辽东属国": (121.1, 41.5),
}
known = {g["name"] for g in gaz}
for c in com["commanderies"]:
    lng, lat = c.get("lng"), c.get("lat")
    if lng is None or lat is None:
        lng, lat = SEAT_FIX.get(c["name"], (None, None))
    if lng is None or lat is None:
        continue
    gaz.append({"name": c["name"], "alt": [c.get("seat", ""), c.get("seat_modern", "")], "lng": lng, "lat": lat, "kind": "seat"})
modern = json.loads((DATA / "derived" / "gazetteer_modern.json").read_text(encoding="utf-8"))
for m in modern:
    if m["name"] in known:
        continue
    if m["name"] in MODERN_FIX:
        m = {**m, "lng": MODERN_FIX[m["name"]][0], "lat": MODERN_FIX[m["name"]][1]}
    known.add(m["name"])
    gaz.append(m)
dump(SRC / "gazetteer.json", gaz)
print("gazetteer:", len(gaz))

print(f"\n{len(WARN)} warnings (see data/derived/build_warnings.txt)")
(DATA / "derived" / "build_warnings.txt").write_text("\n".join(sorted(set(re.sub(r"^[\d.]+: ", "", w) for w in WARN))), encoding="utf-8")
