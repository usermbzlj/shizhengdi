import json
import os
from collections import Counter

base = os.path.join(os.path.dirname(__file__), "..", "src", "data")
for fn in sorted(os.listdir(base)):
    if not fn.endswith(".json"):
        continue
    d = json.load(open(os.path.join(base, fn), encoding="utf-8"))
    n = len(d) if isinstance(d, list) else "obj"
    print(f"{fn:22} {n}")

e = json.load(open(os.path.join(base, "events.json"), encoding="utf-8"))
print("event kinds", dict(Counter(x["kind"] for x in e)))
print("importance", dict(Counter(x["importance"] for x in e)))
lens = [len(x.get("summary", "")) for x in e]
print("summary chars min/med/max", min(lens), sorted(lens)[len(lens) // 2], max(lens))
print("thin<120", sum(1 for n in lens if n < 120))
print("missing geo/outcome/then", sum(1 for x in e if not x.get("geography")), sum(1 for x in e if not x.get("outcome")), sum(1 for x in e if not x.get("thenVsNow")))
print("--- events ---")
for x in e:
    print(f"{x['year']:4} {x['kind']:12} i{x['importance']} {x['id']:28} {x['name']} s={len(x.get('summary',''))}")

p = json.load(open(os.path.join(base, "persons.json"), encoding="utf-8"))
print("--- persons ---")
for x in p:
    print(f"{x['id']:16} {x['name']:6} idlen={len(x.get('identity',''))} locs={len(x.get('locations',[]))}")

c = json.load(open(os.path.join(base, "cities.json"), encoding="utf-8"))
print("--- cities ---")
for x in c:
    print(f"{x['id']:16} {x['modern']:8} tl={len(x.get('timeline',[]))} why={len(x.get('whyHere',''))}")

w = json.load(open(os.path.join(base, "world.json"), encoding="utf-8"))
print("--- world ---")
for x in w:
    print(f"{x['year']:4} {x['id']:24} {x['name']}")

ch = json.load(open(os.path.join(base, "chapters.json"), encoding="utf-8"))
print("--- chapters ---")
for x in ch:
    print(x["id"], x["title"], "steps", len(x["steps"]))

ln = json.load(open(os.path.join(base, "lines.json"), encoding="utf-8"))
print("--- lines ---")
for x in ln:
    print(x["id"], x["name"], "story", len(x.get("story", [])))
