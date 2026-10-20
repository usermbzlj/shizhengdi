"""Parse household and population counts per commandery from 《後漢書·郡國志》 (wikisource 卷109–113).

Writes data/derived/junguo_pop.json: [{name, households, people, cities}] using the 永和五年 (140 AD) census.
"""
import glob
import json
import os
import re

ROOT = os.path.join(os.path.dirname(__file__), '..', '..', 'data')
DIGITS = {'〇': 0, '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9}
UNITS = {'十': 10, '百': 100, '千': 1000}
NUM = '〇零一二三四五六七八九十百千萬万'


def small(s: str) -> int:
    total, digit = 0, None
    for ch in s:
        if ch in DIGITS:
            digit = DIGITS[ch]
        elif ch in UNITS:
            total += (1 if digit is None else digit) * UNITS[ch]
            digit = None
    return total + (digit or 0)


def number(s: str) -> int:
    s = s.replace('万', '萬')
    if '萬' in s:
        hi, lo = s.split('萬', 1)
        # 「口万八千」：万前没有数字，按一万计。千/百/十开头由 small() 计为 1。
        hi_n = 1 if hi == '' else small(hi)
        return hi_n * 10000 + small(lo)
    return small(s)


def main():
    out = []
    for f in sorted(glob.glob(os.path.join(ROOT, 'raw', 'junguo', '*.txt'))):
        text = open(f, encoding='utf-8').read()
        heading = None
        for para in re.split(r'\n\s*\n', text):
            h = re.match(r'\s*#+ (.+)', para)
            if h:
                heading = h.group(1).strip()
                continue
            # 属国作「别领三城。户…，口…」；益州郡等户、口之间是句号。
            m = re.search(rf'([{NUM}]+)城[，。](?:永和五年)?[戶户戸]([{NUM}]+)[，。]口([{NUM}]+)', para)
            if not m:
                continue
            # the source prints 巴郡 as 巴陵
            para = para.replace('◎ 巴陵秦置', '◎ 巴郡秦置')
            # 郡(?!属国)：避免把「蜀郡属国」截成「蜀郡」。
            lead = re.match(
                r'\s*(?:◎\s*)?([^\s，。、（〈「]{1,8}?(?:屬國|属国|郡(?!屬國|属国)|國|国|尹))',
                para,
            )
            name = lead.group(1) if lead else heading
            if not name:
                continue
            out.append({
                'name': name,
                'households': number(m.group(2)),
                'people': number(m.group(3)),
                'cities': number(m.group(1)),
            })
    dst = os.path.join(ROOT, 'derived', 'junguo_pop.json')
    with open(dst, 'w', encoding='utf-8', newline='\n') as fh:
        json.dump(out, fh, ensure_ascii=False, indent=1)
    print(len(out), sum(x['people'] for x in out))


if __name__ == '__main__':
    main()
