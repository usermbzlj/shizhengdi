"""Base geography: land, world land, modern overlay and the modern-city gazetteer.

Run with the data venv:  ..\\data\\.venv\\Scripts\\python.exe scripts/build_base.py
"""
import json
import sys
from pathlib import Path

import geopandas as gpd
from shapely.geometry import box, mapping, LineString
from shapely.ops import unary_union

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT.parent / "data"
NE = DATA / "raw" / "naturalearth"
OUT = ROOT / "public" / "data"
SRC = ROOT / "src" / "data"
OUT.mkdir(parents=True, exist_ok=True)

CHINA = box(70, 10, 142, 56)


def read_zip(name):
    return gpd.read_file(f"zip://{NE / (name + '.zip')}")


def write_fc(path, features):
    path.write_text(json.dumps({"type": "FeatureCollection", "features": features}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{path.name}: {path.stat().st_size / 1024:.0f} KB, {len(features)} features")


def rnd(geom, nd=3):
    """Round coordinates to keep files small."""
    def r(c):
        if isinstance(c, (list, tuple)) and c and isinstance(c[0], (int, float)):
            return [round(c[0], nd), round(c[1], nd)]
        return [r(x) for x in c]
    m = mapping(geom)
    return {"type": m["type"], "coordinates": r(m["coordinates"])}


# ---- land: 10m inside the China window, 50m elsewhere (for the globe) ----
land10 = read_zip("ne_10m_land")
land50 = read_zip("ne_50m_land")
inner = unary_union(land10.geometry).intersection(CHINA).simplify(0.01)
outer = unary_union(land50.geometry).difference(CHINA).simplify(0.03)
# one polygon, so the coastline layers do not outline the seam of the China window
land = unary_union([inner, outer]).buffer(0)
write_fc(OUT / "land.geojson", [{"type": "Feature", "properties": {}, "geometry": rnd(land)}])
world = unary_union(land50.geometry).simplify(0.03)
write_fc(OUT / "world-land.geojson", [{"type": "Feature", "properties": {}, "geometry": rnd(world, 2)}])

# ---- modern overlay ----
features = []
rail = read_zip("ne_10m_railroads")
rail = rail[rail.intersects(box(73, 18, 135, 53.5))]
for g in rail.geometry.intersection(box(73, 18, 135, 53.5)).simplify(0.01):
    if g.is_empty:
        continue
    features.append({"type": "Feature", "properties": {"kind": "rail"}, "geometry": rnd(g)})

places = read_zip("ne_10m_populated_places")
cols = {c.lower(): c for c in places.columns}
adm = places[cols["adm0name"]]
cn = places[adm.isin(["China", "Taiwan", "Hong Kong S.A.R.", "Macao S.A.R"])]
gaz = []
for _, p in cn.iterrows():
    pop = int(p[cols["pop_max"]] or 0)
    features.append({"type": "Feature", "properties": {"kind": "city", "pop": pop}, "geometry": rnd(p.geometry)})
    zh = p.get(cols.get("name_zh", "NAME_ZH"))
    if isinstance(zh, str) and zh:
        name = zh.replace("市", "") if len(zh) > 2 and zh.endswith("市") else zh
        gaz.append({"name": name, "alt": [], "lng": round(p.geometry.x, 3), "lat": round(p.geometry.y, 3), "kind": "modern", "pop": pop})

# Ming Great Wall and the Grand Canal, approximate traces for the opening rewind
WALL = [(119.8, 40.0), (119.0, 40.3), (117.9, 40.45), (117.2, 40.5), (116.07, 40.35), (115.5, 40.55), (114.6, 40.75),
        (113.8, 40.5), (113.1, 40.3), (112.3, 39.95), (111.5, 39.4), (110.9, 38.9), (109.7, 38.3), (108.6, 37.9),
        (107.3, 37.9), (106.3, 38.5), (105.6, 37.6), (104.6, 37.3), (103.4, 37.6), (102.6, 37.9), (101.6, 38.3),
        (100.45, 38.93), (99.4, 39.3), (98.5, 39.7), (98.22, 39.8)]
CANAL = [(116.4, 39.9), (116.66, 39.9), (117.2, 39.13), (116.85, 38.3), (116.3, 37.45), (115.7, 36.84), (115.98, 36.45),
         (116.59, 35.41), (117.2, 34.26), (118.2, 33.95), (119.0, 33.6), (119.42, 32.39), (119.45, 32.2), (119.95, 31.78),
         (120.3, 31.57), (120.62, 31.3), (120.75, 30.75), (120.16, 30.28)]
features.append({"type": "Feature", "properties": {"kind": "wall"}, "geometry": rnd(LineString(WALL))})
features.append({"type": "Feature", "properties": {"kind": "canal"}, "geometry": rnd(LineString(CANAL))})
write_fc(OUT / "modern.geojson", features)

MODERN_FIX = {
    "安溪": (118.187, 25.056),
    "吴川": (110.778, 21.441),
    "常平镇": (113.996, 22.978),
    "婺源": (117.862, 29.248),
    "峄山镇": (117.053, 35.478),
    "锦溪": (120.905, 31.172),
}
for g in gaz:
    if g["name"] in MODERN_FIX:
        g["lng"], g["lat"] = MODERN_FIX[g["name"]]
gaz.sort(key=lambda g: -g["pop"])
seen = set()
uniq = []
for g in gaz:
    if g["name"] in seen:
        continue
    seen.add(g["name"])
    g.pop("pop")
    uniq.append(g)
(DATA / "derived" / "gazetteer_modern.json").write_text(json.dumps(uniq, ensure_ascii=False, indent=0), encoding="utf-8")
print("modern gazetteer:", len(uniq))
