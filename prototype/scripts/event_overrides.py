"""Apply researched scene corrections after the older review suggestions."""
import json


def apply_event_overrides(events, path):
    corrections = json.loads(path.read_text(encoding="utf-8"))
    by_id = {event["id"]: event for event in events}
    for event_id, fields in corrections.items():
        if event_id not in by_id:
            raise ValueError(f"Scene correction targets an unknown event: {event_id}")
        if "id" in fields:
            raise ValueError(f"Scene correction must not replace the event ID: {event_id}")
        unknown = fields.keys() - by_id[event_id].keys()
        if unknown:
            raise ValueError(f"Unknown corrected fields for {event_id}: {sorted(unknown)}")
        by_id[event_id].update(fields)
    return events
