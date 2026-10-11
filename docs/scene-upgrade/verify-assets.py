"""Verify scene assets and the event-generation correction stage without regenerating terrain.

Run from the repository root: python docs/scene-upgrade/verify-assets.py
Requires Node 26 (TypeScript stripping) and Pillow in this project's environment.
"""
import copy
import hashlib
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[2]
PROTOTYPE = ROOT / "prototype"
sys.path.insert(0, str(PROTOTYPE / "scripts"))
from event_overrides import apply_event_overrides

scenes = json.loads(subprocess.run(
    ["node", "--input-type=module", "-e",
     "import {scenes} from './src/data/scenes.ts'; console.log(JSON.stringify(scenes));"],
    cwd=PROTOTYPE, capture_output=True, text=True, encoding="utf-8", check=True,
).stdout)
assert [scene["id"] for scene in scenes] == ["chibi", "jiupin", "yinping"]
manifest = json.loads((PROTOTYPE / "public/audio/manifest.json").read_text(encoding="utf-8"))
audio_results = []
for scene in scenes:
    assert len(scene["steps"]) == 5
    assert len({step["id"] for step in scene["steps"]}) == 5
    for step in scene["steps"]:
        rel = f"scene-{scene['id']}/{step['id']}.mp3"
        full = f"{step['title']}。{step['text']}"
        expected = hashlib.sha1(f"zh-CN-YunjianNeural-6%{full}".encode()).hexdigest()[:16]
        path = PROTOTYPE / "public/audio" / rel
        assert manifest.get(rel) == expected, f"Stale narration: {rel}"
        assert path.stat().st_size > 1000, f"Missing/truncated narration: {rel}"
        audio_results.append({"file": rel, "bytes": path.stat().st_size, "text_hash_matches": True})

portrait_results = []
for name in ("zhouyu", "chenqun", "dengai"):
    source = ROOT / "docs/scene-upgrade/source-portraits" / f"{name}.png"
    output = PROTOTYPE / "public/images/portraits" / f"{name}.webp"
    with Image.open(source) as a, Image.open(output) as b:
        assert a.size == b.size == (1086, 1448)
        assert ImageChops.difference(a.convert("RGB"), b.convert("RGB")).getbbox() is None
    portrait_results.append({"name": name, "pixels_identical": True, "source_bytes": source.stat().st_size,
                             "webp_bytes": output.stat().st_size})

events = json.loads((PROTOTYPE / "src/data/events.json").read_text(encoding="utf-8"))
original = json.loads((ROOT / "docs/scene-upgrade/original-events.json").read_text(encoding="utf-8"))
old_by_id = {event["id"]: event for event in original}
assert set(old_by_id) == {"chibi_zhizhan", "inst-jiupin-220", "yinping_mieshu"}
restored = [copy.deepcopy(old_by_id.get(event["id"], event)) for event in events]
overrides = ROOT / "research/scene_event_overrides.json"
assert apply_event_overrides(restored, overrides) == events
assert len(events) == 108
assert next(event for event in restored if event["id"] == "chibi_zhizhan")["month"] is None
try:
    apply_event_overrides([], overrides)
except ValueError:
    pass
else:
    raise AssertionError("Missing event must reject the correction")
generator = (PROTOTYPE / "scripts/build_map.py").read_text(encoding="utf-8")
assert generator.index('apply_event_overrides(events,') > generator.index('for f in review_for("events.json")')
assert generator.index('apply_event_overrides(events,') < generator.index('dump(SRC / "events.json", events)')

result = {"scene_count": len(scenes), "step_count": len(audio_results), "audio": audio_results,
          "portraits": portrait_results, "events": {"total": len(events), "corrections": len(original),
          "other_records_unchanged": 105, "reconstructed_output_matches": True,
          "unknown_id_rejected": True, "override_runs_after_review_before_dump": True}}
output = ROOT / "docs/scene-upgrade/asset-checks.json"
output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("Passed: 3 scenes / 15 current audio clips / 3 lossless portraits / event correction stage.")
print(output)
