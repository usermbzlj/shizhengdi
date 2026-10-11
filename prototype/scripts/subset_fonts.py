"""Subset Noto Serif SC to the characters actually used by the app (data + UI strings)."""
import sys
from pathlib import Path

from fontTools import subset

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT.parent / "data" / "raw" / "fonts"
OUT = ROOT / "public" / "fonts"
OUT.mkdir(parents=True, exist_ok=True)

chars = set(chr(c) for c in range(0x20, 0x7F))
chars |= set("，。、；：？！「」『』（）《》〈〉—…·“”‘’〔〕％")
for p in list((ROOT / "src").rglob("*")):
    if p.suffix in (".json", ".tsx", ".ts", ".css"):
        chars |= set(p.read_text(encoding="utf-8"))
text = "".join(sorted(c for c in chars if c >= " "))
print("characters:", len(text))

for weight, name in (("SemiBold", "600"), ("Medium", "500")):
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    opts.hinting = False
    font = subset.load_font(str(FONTS / f"NotoSerifCJKsc-{weight}.otf"), opts)
    s = subset.Subsetter(opts)
    s.populate(text=text)
    s.subset(font)
    out = OUT / f"szd-serif-{name}.woff2"
    subset.save_font(font, str(out), opts)
    print(out.name, f"{out.stat().st_size / 1024:.0f} KB")
