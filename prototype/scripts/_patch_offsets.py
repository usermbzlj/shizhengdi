import re
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "src" / "styles.css"
css = p.read_text(encoding="utf-8")


def bump(selector_regex, old, new):
    global css
    m = re.search(selector_regex + r"\s*\{[^}]*?" + re.escape(old), css, flags=re.S)
    if not m:
        print("miss", selector_regex, old)
        return
    s = m.group(0)
    css = css.replace(s, s[: -len(old)] + new, 1)


bump(r"\n\.panel", "bottom: 128px;", "bottom: 152px;")
bump(r"\n\.guide", "bottom: 124px;", "bottom: 150px;")
bump(r"\n\.homecard", "bottom: 126px;", "bottom: 150px;")
bump(r"\n\.chat", "bottom: 128px;", "bottom: 152px;")
bump(r"\n\.toast", "bottom: 130px;", "bottom: 156px;")
# mobile block
mob = css.index("@media (max-width: 760px)")
head, tail = css[:mob], css[mob:]
tail = tail.replace("height: 100px;\n    padding: 0 12px 10px;", "height: 124px;\n    padding: 0 12px 8px 40px;")
tail = tail.replace("bottom: 118px;\n    width: auto;\n    height: 52vh;", "bottom: 132px;\n    width: auto;\n    height: 50vh;")
tail = tail.replace(".guide {\n    bottom: 104px;", ".guide {\n    bottom: 130px;")
tail = tail.replace(".homecard {\n    left: 8px;\n    bottom: 104px;", ".homecard {\n    left: 8px;\n    bottom: 130px;")
css = head + tail
p.write_text(css, encoding="utf-8")
print("ok")
