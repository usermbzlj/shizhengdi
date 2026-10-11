import sys
import pyogrio

sys.stdout.reconfigure(encoding="utf-8")
BASE = r"C:\Users\youxi\Desktop\史政地\data\raw\chgis\v6"

for name in ["v6_time_pref_pgn_utf_wgs84", "v6_time_pref_pts_utf_wgs84", "v6_time_cnty_pts_utf_wgs84"]:
    path = rf"{BASE}\{name}\{name}.shp"
    df = pyogrio.read_dataframe(path, read_geometry=False)
    print("==", name, len(df), list(df.columns))
    beg = [c for c in df.columns if c.upper().startswith("BEG")][0]
    end = [c for c in df.columns if c.upper().startswith("END")][0]
    sub = df[(df[beg] <= 280) & (df[end] >= 184)]
    print("rows 184-280:", len(sub))
    for y in (190, 210, 240, 270):
        s = df[(df[beg] <= y) & (df[end] >= y)]
        print(y, len(s))
    print(sub.head(8).to_string())
