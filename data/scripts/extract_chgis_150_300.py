"""Filter CHGIS time-series layers to features overlapping 150–300 CE.

Reads the UTF-8 shapefiles (and MapInfo TAB regime layers, if extracted)
under data/raw/chgis, keeps attributes, reprojects to WGS84, and writes
GeoJSON plus a summary JSON under data/derived.
"""

from __future__ import annotations

import json
from pathlib import Path

import geopandas as gpd
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "raw" / "chgis"
OUT = ROOT / "derived"
YEAR_MIN = 150
YEAR_MAX = 300
SNAPSHOTS = (190, 210, 240, 270)

LAYERS = [
    {
        "key": "pref_pgn",
        "out": "chgis_pref_pgn_150_300.geojson",
        "path": RAW
        / "v6"
        / "v6_time_pref_pgn_utf_wgs84"
        / "v6_time_pref_pgn_utf_wgs84.shp",
        "source": "CHGIS V6 time-series prefecture polygons, UTF-8, WGS84",
    },
    {
        "key": "pref_pts",
        "out": "chgis_pref_pts_150_300.geojson",
        "path": RAW
        / "v6"
        / "v6_time_pref_pts_utf_wgs84"
        / "v6_time_pref_pts_utf_wgs84.shp",
        "source": "CHGIS V6 time-series prefecture points, UTF-8, WGS84",
    },
    {
        "key": "cnty_pts",
        "out": "chgis_cnty_pts_150_300.geojson",
        "path": RAW
        / "v6"
        / "v6_time_cnty_pts_utf_wgs84"
        / "v6_time_cnty_pts_utf_wgs84.shp",
        "source": "CHGIS V6 time-series county points, UTF-8, WGS84",
    },
    {
        "key": "prov_pgn",
        "out": "chgis_prov_pgn_150_300.geojson",
        "path": RAW / "v4" / "v4_time_prov_pgn_utf" / "v4_time_prov_pgn_utf.shp",
        "source": "CHGIS V4 time-series province polygons (distributed in the V5 shapefile archive), UTF-8, Xian 1980 GK zone 19",
    },
    {
        "key": "prov_pts",
        "out": "chgis_prov_pts_150_300.geojson",
        "path": RAW / "v4" / "v4_time_prov_pts_utf" / "v4_time_prov_pts_utf.shp",
        "source": "CHGIS V4 time-series province points (distributed in the V5 shapefile archive), UTF-8, Xian 1980",
    },
    {
        "key": "polity_pgn",
        "out": "chgis_polity_pgn_150_300.geojson",
        "path": RAW / "v4" / "v4_time_reg_pgn_utf" / "v4_time_reg_pgn_utf.shp",
        "source": "CHGIS V4 time-series regime polygons, UTF-8 shapefile inside V4_Data_Archive.zip",
    },
    {
        "key": "polity_pts",
        "out": "chgis_polity_pts_150_300.geojson",
        "path": RAW / "v4" / "v4_time_reg_pts_utf" / "v4_time_reg_pts_utf.shp",
        "source": "CHGIS V4 time-series regime seats, UTF-8 shapefile inside V4_Data_Archive.zip",
    },
]


def _year(series: pd.Series) -> pd.Series:
    return pd.to_numeric(series, errors="coerce")


def overlaps(gdf: gpd.GeoDataFrame) -> pd.Series:
    beg = _year(gdf["BEG_YR"])
    end = _year(gdf["END_YR"])
    return (beg <= YEAR_MAX) & (end >= YEAR_MIN)


def active(gdf: gpd.GeoDataFrame, year: int) -> pd.Series:
    beg = _year(gdf["BEG_YR"])
    end = _year(gdf["END_YR"])
    return (beg <= year) & (end >= year)


def repair_text(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    """V4 UTF-8 shapefiles have no .cpg, so GDAL may decode them as Latin-1."""

    def fix(value):
        if not isinstance(value, str) or not value:
            return value
        if any("\u4e00" <= ch <= "\u9fff" for ch in value):
            return value
        try:
            repaired = value.encode("latin1").decode("utf-8")
        except UnicodeError:
            return value
        return repaired

    out = gdf.copy()
    for col in out.columns:
        if col == "geometry" or pd.api.types.is_numeric_dtype(out[col]):
            continue
        out[col] = out[col].map(fix)
    return out


def to_wgs84(gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    if gdf.crs is None:
        raise ValueError("layer has no CRS")
    if gdf.crs.to_epsg() != 4326:
        gdf = gdf.to_crs(4326)
    return gdf


def write_geojson(gdf: gpd.GeoDataFrame, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = json.loads(gdf.to_json(default=str))
    path.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")


def name_list(gdf: gpd.GeoDataFrame) -> list[str]:
    names = gdf["NAME_CH"].fillna("").astype(str).str.strip()
    return sorted({n for n in names if n})


def snapshot_rows(points: gpd.GeoDataFrame, provinces: gpd.GeoDataFrame | None) -> list[dict]:
    rows = []
    for year in SNAPSHOTS:
        pts = points.loc[active(points, year)].copy()
        parent = {}
        if provinces is not None and len(pts) and len(provinces):
            prov = provinces.loc[active(provinces, year)]
            if len(prov):
                joined = gpd.sjoin(pts, prov[["NAME_CH", "geometry"]], how="left", predicate="within")
                # One point can fall in overlapping province instances; keep unique parents.
                for sys_id, part in joined.groupby(joined.index):
                    parents = sorted(
                        {str(x).strip() for x in part["NAME_CH_right"].dropna() if str(x).strip()}
                    )
                    parent[sys_id] = "、".join(parents)
        items = []
        for idx, rec in pts.iterrows():
            items.append(
                {
                    "name_ch": str(rec.get("NAME_CH") or "").strip(),
                    "name_ft": str(rec.get("NAME_FT") or "").strip(),
                    "type_ch": str(rec.get("TYPE_CH") or "").strip(),
                    "sys_id": None if pd.isna(rec.get("SYS_ID")) else int(rec["SYS_ID"]),
                    "beg_yr": None if pd.isna(rec.get("BEG_YR")) else int(rec["BEG_YR"]),
                    "end_yr": None if pd.isna(rec.get("END_YR")) else int(rec["END_YR"]),
                    "parent_province_spatial": parent.get(idx, ""),
                }
            )
        items.sort(key=lambda r: r["name_ch"])
        rows.append({"year": year, "count": len(items), "units": items})
    return rows


def bounds_of(gdf: gpd.GeoDataFrame) -> list[float] | None:
    if gdf.empty or gdf.geometry.is_empty.all():
        return None
    minx, miny, maxx, maxy = gdf.total_bounds
    return [round(float(minx), 4), round(float(miny), 4), round(float(maxx), 4), round(float(maxy), 4)]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    loaded: dict[str, gpd.GeoDataFrame] = {}
    summary: dict[str, object] = {"layers": [], "missing": []}

    for spec in LAYERS:
        path: Path = spec["path"]
        if not path.exists():
            summary["missing"].append({"key": spec["key"], "path": str(path)})
            continue
        gdf = gpd.read_file(path)
        total = len(gdf)
        part = repair_text(to_wgs84(gdf.loc[overlaps(gdf)].copy()))
        out_path = OUT / spec["out"]
        if part.empty:
            if out_path.exists():
                out_path.unlink()
            summary["missing"].append(
                {
                    "key": spec["key"],
                    "path": str(path),
                    "reason": f"read {total} features; none overlap {YEAR_MIN}–{YEAR_MAX}",
                }
            )
            print(f"{spec['key']}: {total} -> 0 (no output)")
            continue
        write_geojson(part, out_path)
        loaded[spec["key"]] = part
        summary["layers"].append(
            {
                "key": spec["key"],
                "source": spec["source"],
                "input": str(path),
                "input_crs": str(gdf.crs),
                "input_count": total,
                "output": str(out_path),
                "output_count": len(part),
                "distinct_name_ch": len(name_list(part)),
                "columns": [c for c in part.columns if c != "geometry"],
                "bounds_wgs84": bounds_of(part),
                "sample_name_ch": (part["NAME_CH"].dropna().astype(str).head(3).tolist() if len(part) else []),
            }
        )
        print(f"{spec['key']}: {total} -> {len(part)}")

    pref_pts = loaded.get("pref_pts")
    pref_pgn = loaded.get("pref_pgn")
    prov_pgn = loaded.get("prov_pgn")
    if pref_pts is not None:
        summary["prefecture_snapshots"] = snapshot_rows(pref_pts, prov_pgn)
        summary["prefecture_names_150_300"] = name_list(pref_pts)
    if pref_pts is not None and pref_pgn is not None:
        coverage = []
        for year in SNAPSHOTS:
            pts = pref_pts.loc[active(pref_pts, year)]
            pgn = pref_pgn.loc[active(pref_pgn, year)]
            pt_names = set(name_list(pts))
            pg_names = set(name_list(pgn))
            coverage.append(
                {
                    "year": year,
                    "point_count": int(len(pts)),
                    "polygon_count": int(len(pgn)),
                    "polygon_names": sorted(pg_names),
                    "point_names_without_polygon": sorted(pt_names - pg_names),
                }
            )
        summary["prefecture_polygon_coverage"] = coverage
    if prov_pgn is not None:
        summary["province_snapshots"] = [
            {
                "year": year,
                "names": name_list(prov_pgn.loc[active(prov_pgn, year)]),
            }
            for year in SNAPSHOTS
        ]

    stats_path = OUT / "chgis_150_300_summary.json"
    stats_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print("wrote", stats_path)


if __name__ == "__main__":
    main()
