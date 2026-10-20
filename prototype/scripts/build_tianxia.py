"""Build the province board for the 天下 grand-strategy mode.

Provinces are the 110 commanderies of the keyframe around 200 AD (public/data/cells).
For every province: seat, area, 140 AD census (郡国志), terrain from the Terrarium DEM, coast.
For every border: length, rivers that must be crossed, rivers that carry boats, climb, named pass.
Real owners at every keyframe are sampled at the seat so the ending can compare with history.

Run with data/.venv-geo: python prototype/scripts/build_tianxia.py
"""
import glob
import json
import math
import os
import re

import numpy as np
from PIL import Image
from pyproj import Transformer
from shapely.geometry import LineString, Point, shape
from shapely.ops import transform, unary_union

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(HERE, '..')
DATA = os.path.join(APP, '..', 'data')
BASE = 'kf-200-917'
OUT = os.path.join(APP, 'src', 'game', 'tianxia', 'board.json')

aea = Transformer.from_crs('EPSG:4326', '+proj=aea +lat_1=25 +lat_2=47 +lon_0=105 +ellps=WGS84', always_xy=True)


def proj(g):
    return transform(aea.transform, g)


# ---------- DEM ----------
Z = 6
_tiles = {}


def tile(x, y):
    k = (x, y)
    if k not in _tiles:
        p = os.path.join(APP, 'public', 'terrain', str(Z), str(x), f'{y}.png')
        if os.path.exists(p):
            a = np.asarray(Image.open(p).convert('RGB'), dtype=np.float64)
            _tiles[k] = a[:, :, 0] * 256 + a[:, :, 1] + a[:, :, 2] / 256 - 32768
        else:
            _tiles[k] = None
    return _tiles[k]


def elev(lng, lat):
    n = 2 ** Z
    fx = (lng + 180) / 360 * n
    r = math.radians(lat)
    fy = (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * n
    t = tile(int(fx), int(fy))
    if t is None:
        return 0.0
    px = min(255, int((fx % 1) * 256))
    py = min(255, int((fy % 1) * 256))
    return max(0.0, float(t[py, px]))


# ---------- names ----------
T2S = str.maketrans('潁陳魯鉅趙東濟廣樂會呉長廬陽間漢涼鬱蒼門雲遼樂齊琅邪巂陰萊', '颍陈鲁巨赵东济广乐会吴长庐阳间汉凉郁苍门云辽乐齐琅邪巂阴莱')
ALIAS = {'秦三川郡': '河南', '武帝置爲臨淮郡': '下邳', '勃海': '渤海', '牂牁': '牂柯', '甘陵': '清河'}
# The census has no figures for these (属国, 郡 split off after 140, or text without numbers).
# Rough estimates, shown in the game as 约.
ESTIMATE = {
    '酒泉': 70000, '居延属国': 5000, '益州': 110000, '张掖属国': 17000, '蜀郡属国': 300000, '汶山': 60000,
    '犍为属国': 37000, '交趾': 300000, '广汉属国': 200000, '郁林': 100000, '辽东属国': 40000, '新平': 30000,
}
# commanderies split after 140: parent keeps a share, the child gets the rest
SPLIT = {'庐陵': ('豫章', 0.4), '永宁': ('巴', 0.4), '固陵': ('巴', 0.2)}


def norm(name):
    name = ALIAS.get(name, name).translate(T2S).replace('屬國', '属国')
    if not name.endswith('属国'):
        name = re.sub(r'(郡|国|國|尹)$', '', name)
    return ALIAS.get(name, name)


def main():
    cells = json.load(open(os.path.join(APP, 'public', 'data', 'cells', f'{BASE}.json'), encoding='utf-8'))['features']
    pop = {norm(p['name']): p for p in json.load(open(os.path.join(DATA, 'derived', 'junguo_pop.json'), encoding='utf-8'))}
    gaz = [g for g in json.load(open(os.path.join(APP, 'src', 'data', 'gazetteer.json'), encoding='utf-8')) if g['kind'] == 'seat']
    passes = json.load(open(os.path.join(APP, 'src', 'data', 'passes.json'), encoding='utf-8'))

    rivers_raw = json.load(open(os.path.join(DATA, 'derived', 'ne_10m_rivers.geojson'), encoding='utf-8'))['features']
    CROSS = {'Chang Jiang': 'jiang', 'Yangtze': 'jiang', 'Jinsha': 'jiang', 'Huang': 'he', 'Han': 'han', 'Huai': 'huai'}
    BOATS = {'Chang Jiang', 'Yangtze', 'Han', 'Huai', 'Huang', 'Xiang', 'Gan', 'Jialing', 'Min', 'Wei', 'Yuan'}
    rivers = {}
    for f in rivers_raw:
        n = f['properties'].get('name')
        if n not in CROSS and n not in BOATS:
            continue
        g = shape(f['geometry'])
        if not g.intersects(shape({'type': 'Polygon', 'coordinates': [[[95, 18], [125, 18], [125, 43], [95, 43], [95, 18]]]})):
            continue
        rivers.setdefault(n, []).append(g)
    rivers = {k: unary_union(v) for k, v in rivers.items()}
    coast = unary_union([shape(f['geometry']) for f in json.load(open(os.path.join(DATA, 'derived', 'ne_10m_coastline.geojson'), encoding='utf-8'))['features']
                         if shape(f['geometry']).intersects(shape({'type': 'Polygon', 'coordinates': [[[100, 15], [130, 15], [130, 45], [100, 45], [100, 15]]]}))])

    out_cells = []
    geoms = []
    log = []
    for f in cells:
        p = f['properties']
        g = shape(f['geometry']).buffer(0)
        name = p['name']
        key = norm(name)
        seat = None
        for s in gaz:
            if norm(s['name']) == key and g.buffer(0.05).contains(Point(s['lng'], s['lat'])):
                seat = (s['lng'], s['lat'])
                break
        if seat is None:
            rp = g.representative_point()
            seat = (rp.x, rp.y)
            log.append(f'no seat: {name}')
        census = pop.get(key)
        est = False
        people = census['people'] if census else None
        if key in SPLIT:
            parent, share = SPLIT[key]
            people = round(pop[parent]['people'] * share)
            est = True
        elif key == '巴':
            people = round(people * 0.4)
            est = True
        elif key == '豫章':
            people = round(people * 0.6)
            est = True
        if people is None:
            people = ESTIMATE.get(key)
            est = True
        if people is None:
            log.append(f'no census: {name}')
        # DEM samples on a grid inside the polygon
        minx, miny, maxx, maxy = g.bounds
        step = max(0.08, math.sqrt(g.area) / 14)
        hs = []
        for x in np.arange(minx, maxx, step):
            for y in np.arange(miny, maxy, step):
                if g.contains(Point(x, y)):
                    hs.append(elev(x, y))
        if not hs:
            hs = [elev(*seat)]
        hs = np.array(hs)
        mean, rug = float(hs.mean()), float(hs.std())
        if mean > 2600:
            terrain = 'plateau'
        elif rug > 380 or mean > 1500:
            terrain = 'mountain'
        elif rug > 160 or mean > 700:
            terrain = 'hills'
        else:
            terrain = 'plain'
        boats = sorted({n for n, rg in rivers.items() if n in BOATS and rg.intersects(g)})
        out_cells.append({
            'id': name,
            'province': p['province'],
            'at': [round(seat[0], 3), round(seat[1], 3)],
            'area': round(proj(g).area / 1e6),
            'pop140': people,
            'est': est,
            'cities': census['cities'] if census else None,
            'terrain': terrain,
            'elev': round(mean),
            'rugged': round(rug),
            'seatElev': round(elev(*seat)),
            'coast': bool(g.buffer(0.08).intersects(coast)),
            'boats': [b.replace('Yangtze', 'Chang Jiang') for b in boats],
        })
        geoms.append(g)

    edges = []
    for i in range(len(geoms)):
        for j in range(i + 1, len(geoms)):
            a, b = geoms[i], geoms[j]
            if not a.buffer(0.02).intersects(b.buffer(0.02)):
                continue
            border = a.buffer(0.03).intersection(b.buffer(0.03))
            border_km = proj(border).area / 1e6 / 6.6  # strip ~6.6 km wide
            if border_km < 8:
                continue
            ca, cb = out_cells[i], out_cells[j]
            seg = LineString([ca['at'], cb['at']])
            km = proj(seg).length / 1000
            cross = sorted({CROSS[n] for n, rg in rivers.items() if n in CROSS and rg.intersects(seg)})
            water = sorted({n.replace('Yangtze', 'Chang Jiang') for n, rg in rivers.items() if n in BOATS and rg.intersects(a) and rg.intersects(b) and rg.intersects(border)})
            prof = [elev(*seg.interpolate(t, normalized=True).coords[0]) for t in np.linspace(0, 1, 24)]
            climb = max(prof) - max(ca['seatElev'], cb['seatElev'])
            near = [ps['name'] for ps in passes if ps['type'] == '关隘' and proj(seg).distance(proj(Point(ps['lng'], ps['lat']))) < 35000]
            edges.append({
                'a': ca['id'], 'b': cb['id'],
                'km': round(km * 1.2),
                'border': round(border_km),
                'cross': cross,
                'water': water,
                'climb': round(max(0, climb)),
                'pass': near[0] if near else None,
            })

    # real owners at every keyframe, sampled at the seat
    years, owners, strength = [], [], []
    for path in sorted(glob.glob(os.path.join(APP, 'public', 'data', 'cells', 'kf-*.json'))):
        kid = os.path.basename(path)[:-5]
        m = re.match(r'kf-(\d+)-(\d+)', kid)
        years.append(round(int(m.group(1)) + int(m.group(2)) / 1000, 3))
        feats = [(shape(f['geometry']).buffer(0), f['properties']) for f in json.load(open(path, encoding='utf-8'))['features']]
        row_f, row_s = [], []
        for c in out_cells:
            pt = Point(*c['at'])
            hit = next((pp for gg, pp in feats if gg.contains(pt)), None)
            if hit is None:
                hit = min(feats, key=lambda t: t[0].distance(pt))[1]
            row_f.append(hit['f'])
            row_s.append(hit['s'])
        owners.append(row_f)
        strength.append(row_s)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump({'base': BASE, 'cells': out_cells, 'edges': edges, 'real': {'years': years, 'f': owners, 's': strength}},
              open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    log.append(f'cells {len(out_cells)} edges {len(edges)}')
    for e in edges:
        if e['cross'] or e['pass'] or e['climb'] > 700:
            log.append(f"{e['a']}-{e['b']} {e['km']}km cross={e['cross']} water={e['water']} climb={e['climb']} pass={e['pass']}")
    for c in out_cells:
        log.append(f"{c['id']} {c['terrain']} elev={c['elev']} rug={c['rugged']} pop={c['pop140']} coast={c['coast']} boats={c['boats']}")
    open(os.path.join(os.environ.get('TEMP', '.'), 'tianxia_log.txt'), 'w', encoding='utf-8').write('\n'.join(log))


if __name__ == '__main__':
    main()
