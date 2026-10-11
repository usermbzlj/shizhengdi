"""Generate narration audio for the guide chapters and story lines with edge-tts.

Only steps whose text changed since the last run are regenerated (tracked in public/audio/manifest.json).
Run with the data venv:  ..\\data\\.venv\\Scripts\\python.exe scripts/tts.py
"""
import asyncio
import hashlib
import json
import sys
import subprocess
from pathlib import Path

import edge_tts

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src" / "data"
AUDIO = ROOT / "public" / "audio"
VOICE = "zh-CN-YunjianNeural"
RATE = "-6%"

manifest_path = AUDIO / "manifest.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {}


def jobs():
    scene_json = subprocess.run(
        ["node", "--input-type=module", "-e", "import {scenes} from './src/data/scenes.ts'; console.log(JSON.stringify(scenes));"],
        cwd=ROOT, capture_output=True, text=True, encoding="utf-8", check=True,
    ).stdout
    for scene in json.loads(scene_json):
        for s in scene["steps"]:
            yield f"scene-{scene['id']}/{s['id']}.mp3", f"{s['title']}。", s["text"]
    if "--scenes" in sys.argv:
        return
    for ch in json.loads((SRC / "chapters.json").read_text(encoding="utf-8")):
        for s in ch["steps"]:
            if s.get("audio"):
                yield f"{ch['id']}/{s['audio']}", (s.get("title") or "") and f"{s['title']}。", s["text"]
    for line in json.loads((SRC / "lines.json").read_text(encoding="utf-8")):
        for s in line["story"]:
            if s.get("audio"):
                yield f"line-{line['id']}/{s['audio']}", (s.get("title") or "") and f"{s['title']}。", s["text"]


async def synth(rel, text):
    out = AUDIO / rel
    out.parent.mkdir(parents=True, exist_ok=True)
    for attempt in range(3):
        try:
            await edge_tts.Communicate(text, VOICE, rate=RATE).save(str(out))
            return True
        except Exception as e:  # service hiccups are common; retry a couple of times
            print(f"  retry {rel}: {e}")
            await asyncio.sleep(2 + attempt * 3)
    return False


async def main():
    todo = []
    for rel, title, text in jobs():
        full = f"{title}{text}"
        h = hashlib.sha1(f"{VOICE}{RATE}{full}".encode()).hexdigest()[:16]
        if manifest.get(rel) == h and (AUDIO / rel).exists():
            continue
        todo.append((rel, full, h))
    print(f"{len(todo)} clips to generate")
    sem = asyncio.Semaphore(4)
    failed = []

    async def run(rel, full, h):
        async with sem:
            if await synth(rel, full):
                manifest[rel] = h
                print("  ok", rel)
            else:
                failed.append(rel)

    await asyncio.gather(*(run(*t) for t in todo))
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    if failed:
        print("Failed clips:", ", ".join(failed))
        raise SystemExit(1)


asyncio.run(main())
