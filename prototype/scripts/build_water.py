"""Rivers, lakes, story lines and passes.

Modern Natural Earth water is the fallback; where research/geography.md gives the Han-Jin course of a
river (黄河, 济水, 淮河下游 …) that geometry replaces the modern one.
"""
import json
import sys
from pathlib import Path

import geopandas as gpd
from shapely.geometry import box, mapping, shape

from research import blocks, RESEARCH

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT.parent / "data"
PUB = ROOT / "public" / "data"
SRC = ROOT / "src" / "data"
WIN = box(72, 15, 136, 54)


def rnd(geom, nd=3):
    def r(c):
        if isinstance(c, (list, tuple)) and c and isinstance(c[0], (int, float)):
            return [round(c[0], nd), round(c[1], nd)]
        return [r(x) for x in c]
    m = mapping(geom)
    return {"type": m["type"], "coordinates": r(m["coordinates"])}


def chaikin(coords, n=3):
    """Corner-cutting smoothing for hand-digitised polylines with sparse control points."""
    pts = [tuple(c[:2]) for c in coords]
    for _ in range(n):
        if len(pts) < 3:
            break
        out = [pts[0]]
        for a, b in zip(pts, pts[1:]):
            out.append((0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]))
            out.append((0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]))
        out.append(pts[-1])
        pts = out
    return [[round(x, 3), round(y, 3)] for x, y in pts]


def smooth_geom(g):
    if g["type"] == "LineString":
        return {"type": "LineString", "coordinates": chaikin(g["coordinates"])}
    if g["type"] == "MultiLineString":
        return {"type": "MultiLineString", "coordinates": [chaikin(c) for c in g["coordinates"]]}
    return g


def dump(path, fc):
    path.write_text(json.dumps(fc, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(path.name, f"{path.stat().st_size / 1024:.0f} KB", len(fc.get("features", fc)) if isinstance(fc, dict) else len(fc))


geo = None
if (RESEARCH / "geography.md").exists():
    bs = [b for b in blocks("geography.md") if isinstance(b, dict) and "rivers" in b]
    geo = bs[0] if bs else None

# modern river name -> longitude east of which the ancient course replaces it
REPLACED_FROM = {}
ancient_rivers = []
if geo:
    for r in geo.get("rivers", []):
        g = r.get("geometry")
        if not g:
            continue
        major = any(k in r.get("name", "") for k in ("黄河", "长江", "淮"))
        ancient_rivers.append({"type": "Feature", "properties": {"name": r.get("name", ""), "w": 1.5 if major else 1.0, "ancient": True},
                               "geometry": smooth_geom(g)})
        n = r.get("name", "")
        west = min(c[0] for c in shape(g).coords)
        for key, modern in (("黄河", ("Huang", "Yellow")), ("淮河", ("Huai",)), ("长江", ("Chang Jiang", "Yangtze"))):
            if key in n:
                for m in modern:
                    REPLACED_FROM[m] = min(REPLACED_FROM.get(m, 999), west)

rivers = gpd.read_file(DATA / "derived" / "ne_10m_rivers.geojson")
rivers = rivers[rivers.intersects(WIN)]
feats = []
for _, r in rivers.iterrows():
    name = str(r.get("name") or r.get("name_en") or "")
    geom = r.geometry
    cut = next((v for k, v in REPLACED_FROM.items() if k in name), None)
    if cut is not None:
        geom = geom.difference(box(cut + 0.15, -90, 180, 90))
        if geom.is_empty:
            continue
    sr = r.get("scalerank")
    try:
        sr = float(sr)
    except (TypeError, ValueError):
        sr = 6.0
    w = max(0.5, 2.0 - sr * 0.22)
    feats.append({"type": "Feature", "properties": {"name": name, "w": round(w, 2)}, "geometry": rnd(geom.intersection(WIN).simplify(0.01))})
dump(PUB / "rivers.geojson", {"type": "FeatureCollection", "features": feats + ancient_rivers})

lakes = gpd.read_file(DATA / "derived" / "ne_10m_lakes.geojson")
lakes = lakes[lakes.intersects(WIN)]
lf = [{"type": "Feature", "properties": {}, "geometry": rnd(g.simplify(0.01))} for g in lakes.geometry]
if geo:
    for l in geo.get("lakes", []):
        g = l.get("geometry")
        if not g:
            continue
        # sparse hand-drawn outlines: round them so ancient marshes read as water, not triangles
        poly = shape(g).buffer(0)
        polys = list(getattr(poly, "geoms", [poly]))
        smooth = []
        for p in polys:
            ring = chaikin(list(p.exterior.coords), 4)
            smooth.append([ring])
        geom = {"type": "Polygon", "coordinates": smooth[0]} if len(smooth) == 1 else {"type": "MultiPolygon", "coordinates": smooth}
        lf.append({"type": "Feature", "properties": {"name": l.get("name", ""), "ancient": True}, "geometry": geom})
dump(PUB / "lakes.geojson", {"type": "FeatureCollection", "features": lf})

LINE_COLORS = {"qinling_huaihe": "#8fd1b5", "changjiang": "#7fb2e0", "isohyet_400": "#e0b86a"}
line_features = []
if geo:
    for l in geo.get("lines", []):
        if not l.get("geometry"):
            continue
        line_features.append({"type": "Feature", "properties": {"id": l["id"], "name": l.get("name", ""), "color": LINE_COLORS.get(l["id"], "#e8c77a")},
                              "geometry": smooth_geom(l["geometry"])})
dump(PUB / "lines.geojson", {"type": "FeatureCollection", "features": line_features})

passes = []
if geo:
    for p in geo.get("passes", []):
        g = p.get("geometry") or {}
        lng, lat = p.get("lng"), p.get("lat")
        if lng is None and g.get("type") == "Point":
            lng, lat = g["coordinates"]
        if lng is None:
            continue
        passes.append({"id": p["id"], "name": p["name"], "lng": lng, "lat": lat, "type": p.get("type", ""), "note": p.get("note", "")})
(SRC / "passes.json").write_text(json.dumps(passes, ensure_ascii=False), encoding="utf-8")
print("passes", len(passes))
