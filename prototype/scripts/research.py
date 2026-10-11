"""Helpers to pull JSON blocks out of the research markdown files."""
import json
import re
import sys
from pathlib import Path

RESEARCH = Path(__file__).resolve().parents[2] / "research"
BLOCK = re.compile(r"```json\s*\n(.*?)\n```", re.S)


def blocks(name):
    text = (RESEARCH / name).read_text(encoding="utf-8")
    out = []
    for i, m in enumerate(BLOCK.finditer(text)):
        raw = m.group(1)
        try:
            out.append(json.loads(raw))
        except json.JSONDecodeError as e:
            # tolerate trailing commas, a common slip in hand-written JSON
            fixed = re.sub(r",(\s*[}\]])", r"\1", raw)
            try:
                out.append(json.loads(fixed))
            except json.JSONDecodeError:
                print(f"[warn] {name} block {i}: {e}", file=sys.stderr)
    return out


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    for f in sorted(RESEARCH.glob("*.md")):
        bs = blocks(f.name)
        print(f"== {f.name}: {len(bs)} blocks")
        for b in bs[:2]:
            if isinstance(b, dict):
                print("  keys:", list(b.keys())[:12])
                for k, v in b.items():
                    if isinstance(v, list) and v and isinstance(v[0], dict):
                        print(f"   {k}[{len(v)}] item keys:", list(v[0].keys()))
            elif isinstance(b, list):
                print("  list", len(b), list(b[0].keys()) if b and isinstance(b[0], dict) else "")
