"""Apply researched corrections after the older review suggestions."""
import json


def _strip(fields):
    return {k: v for k, v in fields.items() if not k.startswith("_")}


def _apply_by_id(items, corrections, label):
    by_id = {item["id"]: item for item in items}
    for item_id, fields in corrections.items():
        if item_id.startswith("_"):
            continue
        if item_id not in by_id:
            raise ValueError(f"{label} correction targets an unknown id: {item_id}")
        fields = _strip(fields)
        if "id" in fields:
            raise ValueError(f"{label} correction must not replace the ID: {item_id}")
        unknown = fields.keys() - by_id[item_id].keys()
        if unknown:
            raise ValueError(f"Unknown corrected fields for {item_id}: {sorted(unknown)}")
        by_id[item_id].update(fields)
    return items


def apply_event_overrides(events, path):
    return _apply_by_id(events, json.loads(path.read_text(encoding="utf-8")), "Scene")


def load_fact_corrections(path):
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}


def apply_fact_events(events, fc):
    _apply_by_id(events, fc.get("events", {}), "Event")
    template = events[0].keys() if events else ()
    known = {e["id"] for e in events}
    for add in fc.get("events_add", []):
        add = _strip(add)
        if add["id"] in known:
            raise ValueError(f"Added event already exists: {add['id']}")
        missing = set(template) - add.keys() - {"thenVsNow", "people"}
        if missing:
            raise ValueError(f"Added event {add['id']} lacks fields: {sorted(missing)}")
        at = next((i for i, e in enumerate(events) if e["year"] > add["year"]), len(events))
        events.insert(at, add)
    return events


def apply_fact_world(world, fc):
    return _apply_by_id(world, fc.get("world", {}), "World")


def apply_fact_capitals(keyframes, fc):
    fixes = {k: v for k, v in fc.get("keyframe_capitals", {}).items() if not k.startswith("_")}
    by_id = {k["id"]: k for k in keyframes}
    for kf_id, factions in fixes.items():
        if kf_id not in by_id:
            raise ValueError(f"Capital correction targets an unknown keyframe: {kf_id}")
        caps = by_id[kf_id]["capitals"]
        for faction, cap in factions.items():
            hit = [c for c in caps if c["faction"] == faction]
            if len(hit) != 1:
                raise ValueError(f"{kf_id}: expected one capital for {faction}, found {len(hit)}")
            hit[0].update(cap)
    return keyframes
