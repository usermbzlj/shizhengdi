export type LngLat = [number, number]

/** north: 北方兵到南方容易生病；south: 湿热多疫；west: 巴蜀 */
export type Zone = 'north' | 'south' | 'west'

export interface Place {
  id: string
  name: string
  modern: string
  at: LngLat
  zone: Zone
  /** 每季产粮（万石），秋收翻倍 */
  grain: number
  port?: boolean
  pass?: boolean
  wall?: boolean
  mountain?: boolean
  capital?: boolean
  note?: string
}

/**
 * road 平原大路；hard 山道，费粮、行军疲惫；gorge 险绝小道；
 * ford 渡黄河、汉水这样的河；river 横渡长江，没船过不去；water 顺江水路，有船走得快
 */
export type RouteKind = 'road' | 'hard' | 'gorge' | 'ford' | 'river' | 'water'

export interface Route {
  a: string
  b: string
  kind: RouteKind
  name?: string
}

export const places: Place[] = [
  { id: 'ji', name: '蓟', modern: '北京', at: [116.4, 39.9], zone: 'north', grain: 3 },
  { id: 'jinyang', name: '晋阳', modern: '太原', at: [112.55, 37.87], zone: 'north', grain: 2, wall: true },
  { id: 'ye', name: '邺', modern: '河北临漳', at: [114.33, 36.33], zone: 'north', grain: 6, wall: true, capital: true },
  { id: 'liyang', name: '黎阳', modern: '河南浚县', at: [114.55, 35.68], zone: 'north', grain: 2, note: '黄河北岸的渡口' },
  { id: 'baima', name: '白马', modern: '河南滑县', at: [114.72, 35.5], zone: 'north', grain: 1, note: '黄河南岸的渡口' },
  { id: 'puyang', name: '濮阳', modern: '河南濮阳', at: [115.03, 35.76], zone: 'north', grain: 3 },
  { id: 'wuchao', name: '乌巢', modern: '河南封丘', at: [114.43, 35.12], zone: 'north', grain: 1, note: '屯粮的地方' },
  { id: 'guandu', name: '官渡', modern: '河南中牟', at: [114.02, 34.72], zone: 'north', grain: 1, wall: true, pass: true, note: '挡在许都前面的营垒' },
  { id: 'xu', name: '许', modern: '河南许昌', at: [113.85, 34.04], zone: 'north', grain: 5, wall: true, capital: true, note: '天子在这里' },
  { id: 'luoyang', name: '洛阳', modern: '河南洛阳', at: [112.45, 34.65], zone: 'north', grain: 3, wall: true, capital: true },
  { id: 'linzi', name: '临淄', modern: '山东淄博', at: [118.3, 36.85], zone: 'north', grain: 4 },
  { id: 'xiapi', name: '下邳', modern: '江苏睢宁', at: [117.95, 34.3], zone: 'north', grain: 4, wall: true },
  { id: 'shouchun', name: '寿春', modern: '安徽寿县', at: [116.78, 32.58], zone: 'north', grain: 3, wall: true },
  { id: 'hefei', name: '合肥', modern: '安徽合肥', at: [117.27, 31.86], zone: 'north', grain: 2, wall: true, note: '东吴要北上，多半得先打这里' },
  { id: 'guangling', name: '广陵', modern: '江苏扬州', at: [119.42, 32.39], zone: 'north', grain: 2, port: true },
  { id: 'wan', name: '宛', modern: '河南南阳', at: [112.53, 33.0], zone: 'north', grain: 4, wall: true },
  { id: 'xinye', name: '新野', modern: '河南新野', at: [112.36, 32.52], zone: 'north', grain: 2 },
  { id: 'changan', name: '长安', modern: '陕西西安', at: [108.94, 34.26], zone: 'north', grain: 4, wall: true, capital: true },
  { id: 'chencang', name: '陈仓', modern: '陕西宝鸡', at: [107.15, 34.36], zone: 'north', grain: 1, wall: true, pass: true },
  { id: 'mei', name: '郿', modern: '陕西眉县', at: [107.75, 34.27], zone: 'north', grain: 1, note: '五丈原就在旁边' },
  { id: 'tianshui', name: '天水', modern: '甘肃天水', at: [105.72, 34.58], zone: 'north', grain: 2 },
  { id: 'jieting', name: '街亭', modern: '甘肃秦安', at: [105.97, 35.0], zone: 'north', grain: 1, pass: true, note: '陇右的咽喉' },
  { id: 'jincheng', name: '金城', modern: '甘肃兰州', at: [103.82, 36.06], zone: 'north', grain: 1 },
  { id: 'qishan', name: '祁山', modern: '甘肃礼县', at: [105.39, 34.15], zone: 'west', grain: 0, mountain: true, wall: true },
  { id: 'wudu', name: '武都', modern: '甘肃成县', at: [105.75, 33.75], zone: 'west', grain: 1, mountain: true },
  { id: 'hanzhong', name: '汉中', modern: '陕西汉中', at: [107.03, 33.07], zone: 'west', grain: 4, mountain: true, wall: true, note: '秦岭和巴山中间的盆地' },
  { id: 'yangping', name: '阳平关', modern: '陕西勉县', at: [106.2, 33.15], zone: 'west', grain: 0, pass: true, mountain: true },
  { id: 'yinping', name: '阴平', modern: '甘肃文县', at: [104.68, 32.93], zone: 'west', grain: 0, mountain: true },
  { id: 'jiange', name: '剑阁', modern: '四川剑阁', at: [105.52, 32.29], zone: 'west', grain: 0, pass: true, mountain: true, note: '一夫当关，万夫莫开' },
  { id: 'zitong', name: '梓潼', modern: '四川梓潼', at: [105.15, 31.64], zone: 'west', grain: 2 },
  { id: 'chengdu', name: '成都', modern: '四川成都', at: [104.07, 30.66], zone: 'west', grain: 6, wall: true, capital: true, note: '天府之国' },
  { id: 'jiangzhou', name: '江州', modern: '重庆', at: [106.55, 29.56], zone: 'west', grain: 2, port: true },
  { id: 'baidi', name: '白帝', modern: '重庆奉节', at: [109.57, 31.04], zone: 'west', grain: 1, port: true, pass: true, note: '三峡的入口' },
  { id: 'nanzhong', name: '南中', modern: '云南曲靖', at: [103.8, 25.5], zone: 'south', grain: 2, mountain: true },
  { id: 'xiangyang', name: '襄阳', modern: '湖北襄阳', at: [112.14, 32.03], zone: 'north', grain: 4, wall: true, port: true, capital: true },
  { id: 'jiangling', name: '江陵', modern: '湖北荆州', at: [112.18, 30.35], zone: 'south', grain: 4, wall: true, port: true, capital: true },
  { id: 'wulin', name: '乌林', modern: '湖北洪湖', at: [113.5, 29.95], zone: 'south', grain: 1, port: true, note: '长江北岸' },
  { id: 'chibi', name: '赤壁', modern: '湖北赤壁', at: [113.9, 29.72], zone: 'south', grain: 1, port: true, note: '长江南岸' },
  { id: 'xiakou', name: '夏口', modern: '湖北武汉', at: [114.28, 30.57], zone: 'south', grain: 2, port: true, wall: true, note: '汉水流进长江的地方' },
  { id: 'gongan', name: '公安', modern: '湖北公安', at: [112.23, 30.06], zone: 'south', grain: 2, port: true },
  { id: 'wuling', name: '武陵', modern: '湖南常德', at: [111.69, 29.03], zone: 'south', grain: 2 },
  { id: 'changsha', name: '长沙', modern: '湖南长沙', at: [112.98, 28.2], zone: 'south', grain: 3 },
  { id: 'lingling', name: '零陵', modern: '湖南永州', at: [111.61, 26.42], zone: 'south', grain: 2 },
  { id: 'guiyang', name: '桂阳', modern: '湖南郴州', at: [113.03, 25.79], zone: 'south', grain: 2 },
  { id: 'chaisang', name: '柴桑', modern: '江西九江', at: [115.99, 29.73], zone: 'south', grain: 2, port: true },
  { id: 'yuzhang', name: '豫章', modern: '江西南昌', at: [115.88, 28.68], zone: 'south', grain: 3 },
  { id: 'wancheng', name: '皖', modern: '安徽潜山', at: [116.57, 30.63], zone: 'south', grain: 2 },
  { id: 'ruxu', name: '濡须', modern: '安徽无为', at: [117.85, 31.35], zone: 'south', grain: 1, port: true, pass: true, note: '江边的水寨' },
  { id: 'jianye', name: '建业', modern: '江苏南京', at: [118.78, 32.06], zone: 'south', grain: 3, port: true, wall: true, capital: true },
  { id: 'jingkou', name: '京口', modern: '江苏镇江', at: [119.45, 32.2], zone: 'south', grain: 2, port: true },
  { id: 'wu', name: '吴', modern: '江苏苏州', at: [120.6, 31.3], zone: 'south', grain: 4, capital: true },
  { id: 'kuaiji', name: '会稽', modern: '浙江绍兴', at: [120.58, 30.0], zone: 'south', grain: 3 },
  { id: 'jiaozhou', name: '番禺', modern: '广东广州', at: [113.26, 23.13], zone: 'south', grain: 3, port: true },
]

export const routes: Route[] = [
  { a: 'ji', b: 'ye', kind: 'road' },
  { a: 'ye', b: 'jinyang', kind: 'hard', name: '太行山' },
  { a: 'ye', b: 'liyang', kind: 'road' },
  { a: 'ye', b: 'puyang', kind: 'road' },
  { a: 'liyang', b: 'baima', kind: 'ford', name: '黄河' },
  { a: 'liyang', b: 'wuchao', kind: 'ford', name: '黄河' },
  { a: 'baima', b: 'wuchao', kind: 'road' },
  { a: 'baima', b: 'puyang', kind: 'road' },
  { a: 'wuchao', b: 'guandu', kind: 'gorge', name: '夜里的小路' },
  { a: 'baima', b: 'guandu', kind: 'road', name: '阳武' },
  { a: 'guandu', b: 'xu', kind: 'road' },
  { a: 'guandu', b: 'luoyang', kind: 'road' },
  { a: 'puyang', b: 'linzi', kind: 'road' },
  { a: 'puyang', b: 'xiapi', kind: 'road' },
  { a: 'linzi', b: 'xiapi', kind: 'road' },
  { a: 'xu', b: 'wan', kind: 'road' },
  { a: 'xu', b: 'shouchun', kind: 'road' },
  { a: 'xu', b: 'xiapi', kind: 'road' },
  { a: 'xiapi', b: 'guangling', kind: 'road' },
  { a: 'xiapi', b: 'shouchun', kind: 'road' },
  { a: 'shouchun', b: 'hefei', kind: 'road' },
  { a: 'luoyang', b: 'jinyang', kind: 'hard', name: '太行山' },
  { a: 'luoyang', b: 'changan', kind: 'road', name: '函谷关' },
  { a: 'luoyang', b: 'wan', kind: 'road' },
  { a: 'changan', b: 'chencang', kind: 'road' },
  { a: 'changan', b: 'mei', kind: 'road' },
  { a: 'mei', b: 'chencang', kind: 'road' },
  { a: 'chencang', b: 'tianshui', kind: 'hard', name: '陇山' },
  { a: 'tianshui', b: 'jieting', kind: 'road' },
  { a: 'jieting', b: 'jincheng', kind: 'road' },
  { a: 'tianshui', b: 'qishan', kind: 'road' },
  { a: 'qishan', b: 'wudu', kind: 'hard' },
  { a: 'qishan', b: 'hanzhong', kind: 'hard', name: '祁山道' },
  { a: 'wudu', b: 'hanzhong', kind: 'hard' },
  { a: 'wudu', b: 'yinping', kind: 'hard' },
  { a: 'hanzhong', b: 'chencang', kind: 'hard', name: '陈仓道' },
  { a: 'hanzhong', b: 'mei', kind: 'hard', name: '褒斜道' },
  { a: 'hanzhong', b: 'changan', kind: 'gorge', name: '子午谷' },
  { a: 'hanzhong', b: 'yangping', kind: 'road' },
  { a: 'yangping', b: 'jiange', kind: 'hard', name: '金牛道' },
  { a: 'jiange', b: 'zitong', kind: 'road' },
  { a: 'yinping', b: 'zitong', kind: 'gorge', name: '阴平小道' },
  { a: 'zitong', b: 'chengdu', kind: 'road' },
  { a: 'chengdu', b: 'jiangzhou', kind: 'water', name: '长江上游' },
  { a: 'chengdu', b: 'nanzhong', kind: 'hard' },
  { a: 'jiangzhou', b: 'nanzhong', kind: 'hard' },
  { a: 'jiangzhou', b: 'baidi', kind: 'water', name: '长江' },
  { a: 'baidi', b: 'jiangling', kind: 'water', name: '三峡' },
  { a: 'wan', b: 'xinye', kind: 'road' },
  { a: 'xinye', b: 'xiangyang', kind: 'ford', name: '汉水' },
  { a: 'xiangyang', b: 'jiangling', kind: 'road' },
  { a: 'xiangyang', b: 'xiakou', kind: 'water', name: '汉水' },
  { a: 'jiangling', b: 'wulin', kind: 'water', name: '长江' },
  { a: 'jiangling', b: 'gongan', kind: 'river', name: '长江' },
  { a: 'wulin', b: 'chibi', kind: 'river', name: '长江' },
  { a: 'wulin', b: 'xiakou', kind: 'water', name: '长江' },
  { a: 'chibi', b: 'xiakou', kind: 'water', name: '长江' },
  { a: 'chibi', b: 'changsha', kind: 'road' },
  { a: 'gongan', b: 'wuling', kind: 'road' },
  { a: 'gongan', b: 'changsha', kind: 'road' },
  { a: 'wuling', b: 'changsha', kind: 'road' },
  { a: 'changsha', b: 'lingling', kind: 'road' },
  { a: 'changsha', b: 'guiyang', kind: 'road' },
  { a: 'lingling', b: 'guiyang', kind: 'road' },
  { a: 'guiyang', b: 'jiaozhou', kind: 'hard', name: '南岭' },
  { a: 'lingling', b: 'jiaozhou', kind: 'hard', name: '南岭' },
  { a: 'changsha', b: 'yuzhang', kind: 'hard' },
  { a: 'xiakou', b: 'chaisang', kind: 'water', name: '长江' },
  { a: 'chaisang', b: 'yuzhang', kind: 'road' },
  { a: 'chaisang', b: 'wancheng', kind: 'river', name: '长江' },
  { a: 'wancheng', b: 'hefei', kind: 'road' },
  { a: 'wancheng', b: 'ruxu', kind: 'road' },
  { a: 'hefei', b: 'ruxu', kind: 'road' },
  { a: 'ruxu', b: 'jianye', kind: 'river', name: '长江' },
  { a: 'chaisang', b: 'jianye', kind: 'water', name: '长江' },
  { a: 'jianye', b: 'jingkou', kind: 'road' },
  { a: 'jingkou', b: 'guangling', kind: 'river', name: '长江' },
  { a: 'jingkou', b: 'wu', kind: 'road' },
  { a: 'wu', b: 'kuaiji', kind: 'road' },
  { a: 'yuzhang', b: 'kuaiji', kind: 'hard' },
  { a: 'xiakou', b: 'xinye', kind: 'road' },
]

export const placeById = new Map(places.map((p) => [p.id, p]))

export function neighbors(id: string) {
  const out: { id: string; route: Route }[] = []
  for (const r of routes) {
    if (r.a === id) out.push({ id: r.b, route: r })
    else if (r.b === id) out.push({ id: r.a, route: r })
  }
  return out
}

export function routeBetween(a: string, b: string) {
  return routes.find((r) => (r.a === a && r.b === b) || (r.a === b && r.b === a))
}

export const routeWords: Record<RouteKind, string> = {
  road: '平原大路',
  hard: '山道',
  gorge: '险绝小道',
  ford: '渡河',
  river: '横渡长江',
  water: '顺江水路',
}

export interface Faction {
  id: string
  name: string
  short: string
  color: string
  home: Zone
}

export const factions: Record<string, Faction> = {
  cao: { id: 'cao', name: '曹操', short: '曹', color: '#6f93dc', home: 'north' },
  wei: { id: 'wei', name: '魏', short: '魏', color: '#6f93dc', home: 'north' },
  yuan: { id: 'yuan', name: '袁绍', short: '袁', color: '#d2b05c', home: 'north' },
  sun: { id: 'sun', name: '孙权', short: '孙', color: '#de6e5c', home: 'south' },
  liu: { id: 'liu', name: '刘备', short: '刘', color: '#6cc082', home: 'west' },
  shu: { id: 'shu', name: '蜀汉', short: '蜀', color: '#6cc082', home: 'west' },
  liubiao: { id: 'liubiao', name: '刘表', short: '表', color: '#4fb6b2', home: 'south' },
  liuzhang: { id: 'liuzhang', name: '刘璋', short: '璋', color: '#c8b45a', home: 'west' },
  zhanglu: { id: 'zhanglu', name: '张鲁', short: '鲁', color: '#a283d6', home: 'west' },
  ma: { id: 'ma', name: '马超', short: '马', color: '#d9934a', home: 'north' },
  shixie: { id: 'shixie', name: '士燮', short: '士', color: '#9c9c8c', home: 'south' },
}

export type Trait = 'navy' | 'fire' | 'raid' | 'wall' | 'cavalry' | 'mountain' | 'supply' | 'wit'

export const traitWords: Record<Trait, { name: string; text: string }> = {
  navy: { name: '水战', text: '会带水军：渡江、走水路时战力更强' },
  fire: { name: '火攻', text: '敌人的船挤在江上时，能放火烧船' },
  raid: { name: '奇袭', text: '走山道、小道突袭时不吃亏，还更猛' },
  wall: { name: '守城', text: '守城时更难被攻破' },
  cavalry: { name: '骑兵', text: '在北方平原上冲锋更强；到了南方水网和山里就施展不开' },
  mountain: { name: '山地', text: '翻山越岭不疲惫，山道上不费额外的粮' },
  supply: { name: '运粮', text: '军队吃粮更省，走得再远也撑得住' },
  wit: { name: '谋略', text: '看得穿对手：被进攻时让敌人占不到便宜' },
}

export interface General {
  id: string
  name: string
  lead: number
  traits: Trait[]
  born: number
  died: number
  line: string
}

export const generals: General[] = [
  { id: 'caocao', name: '曹操', lead: 92, traits: ['wit', 'cavalry'], born: 155, died: 220, line: '平定河北，后来又拿下关中' },
  { id: 'caoren', name: '曹仁', lead: 80, traits: ['wall'], born: 168, died: 223, line: '守江陵、守樊城都守住了' },
  { id: 'zhangliao', name: '张辽', lead: 86, traits: ['raid', 'cavalry'], born: 169, died: 222, line: '以八百人冲进孙权的大营' },
  { id: 'xiahouyuan', name: '夏侯渊', lead: 78, traits: ['raid'], born: 160, died: 219, line: '行军极快，三日五百' },
  { id: 'xuhuang', name: '徐晃', lead: 79, traits: [], born: 169, died: 227, line: '解了樊城之围' },
  { id: 'zhanghe', name: '张郃', lead: 82, traits: ['mountain'], born: 167, died: 231, line: '街亭打败马谡' },
  { id: 'yujin', name: '于禁', lead: 72, traits: ['wall'], born: 160, died: 221, line: '治军最严' },
  { id: 'wenpin', name: '文聘', lead: 72, traits: ['navy', 'wall'], born: 170, died: 230, line: '镇守江夏几十年' },
  { id: 'caizhen', name: '曹真', lead: 78, traits: [], born: 185, died: 231, line: '第一次北伐时守关中' },
  { id: 'simayi', name: '司马懿', lead: 92, traits: ['wit', 'wall'], born: 179, died: 251, line: '在五丈原熬到诸葛亮病逝' },
  { id: 'haozhao', name: '郝昭', lead: 70, traits: ['wall'], born: 180, died: 229, line: '一千多人守住陈仓' },
  { id: 'yuanshao', name: '袁绍', lead: 78, traits: ['cavalry'], born: 154, died: 202, line: '四世三公，河北最强' },
  { id: 'yanliang', name: '颜良', lead: 74, traits: ['cavalry'], born: 160, died: 200, line: '袁绍的猛将' },
  { id: 'chunyuqiong', name: '淳于琼', lead: 58, traits: [], born: 150, died: 200, line: '看守乌巢的粮仓' },
  { id: 'sunquan', name: '孙权', lead: 82, traits: ['wit'], born: 182, died: 252, line: '十九岁接管江东' },
  { id: 'zhouyu', name: '周瑜', lead: 93, traits: ['navy', 'fire'], born: 175, died: 210, line: '赤壁一把火' },
  { id: 'lusu', name: '鲁肃', lead: 76, traits: ['wit'], born: 172, died: 217, line: '最早劝孙权联合刘备' },
  { id: 'chengpu', name: '程普', lead: 75, traits: ['navy'], born: 160, died: 215, line: '三代老将' },
  { id: 'huanggai', name: '黄盖', lead: 72, traits: ['fire', 'navy'], born: 160, died: 215, line: '假装投降，带着火船冲进曹营' },
  { id: 'lvmeng', name: '吕蒙', lead: 86, traits: ['raid', 'navy'], born: 178, died: 220, line: '白衣渡江，偷袭荆州' },
  { id: 'ganning', name: '甘宁', lead: 80, traits: ['raid', 'navy'], born: 175, died: 220, line: '百骑劫魏营' },
  { id: 'luxun', name: '陆逊', lead: 91, traits: ['fire', 'wit'], born: 183, died: 245, line: '夷陵火烧连营' },
  { id: 'liubei', name: '刘备', lead: 80, traits: ['wit'], born: 161, died: 223, line: '屡败屡战' },
  { id: 'guanyu', name: '关羽', lead: 88, traits: ['navy'], born: 160, died: 220, line: '水淹七军' },
  { id: 'zhangfei', name: '张飞', lead: 85, traits: [], born: 166, died: 221, line: '长坂桥头横矛，曹军不敢近' },
  { id: 'zhaoyun', name: '赵云', lead: 82, traits: ['cavalry'], born: 168, died: 229, line: '长坂坡救出阿斗' },
  { id: 'zhugeliang', name: '诸葛亮', lead: 88, traits: ['supply', 'wit'], born: 181, died: 234, line: '木牛流马运粮' },
  { id: 'weiyan', name: '魏延', lead: 82, traits: ['raid', 'mountain'], born: 175, died: 234, line: '想走子午谷奇袭长安' },
  { id: 'machao', name: '马超', lead: 85, traits: ['cavalry'], born: 176, died: 222, line: '西凉铁骑' },
  { id: 'huangzhong', name: '黄忠', lead: 80, traits: [], born: 150, died: 220, line: '定军山斩夏侯渊' },
  { id: 'masu', name: '马谡', lead: 58, traits: [], born: 190, died: 228, line: '失了街亭，死因有两种记载' },
  { id: 'wangping', name: '王平', lead: 72, traits: ['mountain'], born: 190, died: 248, line: '街亭败后稳住了阵脚' },
  { id: 'liubiao', name: '刘表', lead: 64, traits: ['wall'], born: 142, died: 208, line: '守着荆州不出门' },
  { id: 'caimao', name: '蔡瑁', lead: 64, traits: ['navy'], born: 160, died: 220, line: '荆州水军都督' },
  { id: 'liuqi', name: '刘琦', lead: 55, traits: [], born: 180, died: 209, line: '刘表长子，守江夏' },
  { id: 'zhangren', name: '张任', lead: 72, traits: ['wall'], born: 170, died: 214, line: '刘璋的大将' },
  { id: 'zhanglu', name: '张鲁', lead: 55, traits: [], born: 160, died: 216, line: '五斗米道的首领' },
  { id: 'hansui', name: '韩遂', lead: 70, traits: ['cavalry'], born: 150, died: 215, line: '凉州的老军阀' },
  { id: 'shixie', name: '士燮', lead: 58, traits: ['wall'], born: 137, died: 226, line: '在交州一住四十年' },
]

export const generalById = new Map(generals.map((g) => [g.id, g]))
