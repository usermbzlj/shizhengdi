import { events } from '../data'
import { armyAt, type Army, type Report, type State } from './engine'
import { sideOf } from './sides'
import { placeById, places, type LngLat } from './world'

export interface Goal {
  text: string
  done: (s: State) => boolean
}

export interface Pick {
  side: string
  who: string
  blurb: string
}

export interface Scenario {
  id: string
  title: string
  when: string
  hook: string
  picks: Pick[]
  turns: number
  view: { center: LngLat; zoom: number }
  build: (player: string) => State
  goals: (player: string) => Goal[]
  /** 输了的条件，返回原因 */
  lost: (s: State) => string | null
  /** 打完以后，真实历史 */
  history: string[]
  script?: (s: State, reports: Report[]) => void
  intro: (player: string) => string[]
}

type Spawn = [side: string, at: string, troops: number, generals?: string[], navy?: number, sick?: number]

function make(o: {
  scenario: string
  player: string
  year: number
  season: number
  area?: string[]
  owner: Record<string, string[]>
  armies: Spawn[]
  grain: Record<string, number>
  ai: Record<string, 0 | 1 | 2>
  garrison?: number
  flags?: Record<string, boolean>
  calm?: Record<string, number>
  far?: Record<string, number>
}): State {
  const owner: Record<string, string | null> = {}
  const area = new Set(o.area ?? places.map((p) => p.id))
  for (const p of places) if (area.has(p.id)) owner[p.id] = null
  for (const [side, ids] of Object.entries(o.owner)) for (const id of ids) if (area.has(id)) owner[id] = side
  const s: State = {
    scenario: o.scenario,
    player: o.player,
    year: o.year,
    season: o.season,
    turn: 0,
    owner,
    armies: [],
    grain: { ...o.grain },
    ai: Object.fromEntries(Object.entries(o.ai).filter(([k]) => k !== o.player)) as State['ai'],
    recruited: [],
    nextId: 1,
    flags: { ...o.flags },
    calm: o.calm,
    far: o.far,
  }
  for (const [side, at, troops, generals = [], navy, sick = 0] of o.armies) {
    const p = placeById.get(at)!
    s.armies.push({ id: s.nextId++, side, at, troops, navy: navy ?? (p.port && sideOf(side).home !== 'north' ? 0.4 : 0), generals, moved: false, sick })
  }
  const g = o.garrison ?? 3
  for (const [id, side] of Object.entries(owner)) {
    if (!side || armyAt(s, id, side)) continue
    const p = placeById.get(id)!
    if (p.pass || p.capital || p.wall) s.armies.push({ id: s.nextId++, side, at: id, troops: g, navy: p.port ? 0.3 : 0, generals: [], moved: false, sick: 0 })
  }
  return s
}

const sumTroops = (s: State, side: string) => s.armies.filter((a) => a.side === side).reduce((t, a) => t + a.troops, 0)
const owns = (s: State, side: string, ...ids: string[]) => ids.every((id) => s.owner[id] === side)

const CAPITALS = places.filter((p) => p.capital).map((p) => p.id)

const sandbox: Scenario = {
  id: 'sandbox',
  title: '乱世沙盘',
  when: '208 年春',
  hook: '天下还没分成三块。你来分。',
  picks: [
    { side: 'cao', who: '曹操', blurb: '河北已经是你的。兵多粮多，可南方的江、北方兵的病，都在等你。' },
    { side: 'sun', who: '孙权', blurb: '你二十六岁，守着长江。船是你最大的本钱。' },
    { side: 'liu', who: '刘备', blurb: '你寄住在刘表那里，兵不多，还有一群最好的将领。' },
    { side: 'liuzhang', who: '刘璋', blurb: '你守着天府之国，四面是山。可北边的张鲁和外面的人都盯着你。' },
  ],
  turns: 48,
  view: { center: [111.5, 31.5], zoom: 4.6 },
  intro: (p) =>
    p === 'cao'
      ? ['北方平定了。', '往南，是刘表的荆州，再往南，是孙权的长江。', '想一想：你的骑兵到了南方还好用吗？']
      : p === 'sun'
        ? ['曹操平定了河北，下一个就轮到你。', '没有船，想过江难上加难。']
        : p === 'liu'
          ? ['你寄住在刘表的荆州。史书上，这时你屯在樊城，人数没有留下确数。', '曹操的大军就在北边的宛城。', '先活下来，再找一块自己的地盘。']
          : ['北有张鲁，东有刘表。', '剑阁、白帝两道关，是你家的大门。'],
  build: (player) =>
    make({
      scenario: 'sandbox',
      player,
      year: 208,
      season: 0,
      owner: {
        cao: ['ji', 'jinyang', 'ye', 'liyang', 'baima', 'puyang', 'wuchao', 'guandu', 'xu', 'luoyang', 'linzi', 'xiapi', 'shouchun', 'hefei', 'guangling', 'wan', 'changan', 'wancheng'],
        ma: ['chencang', 'mei', 'tianshui', 'jieting', 'jincheng'],
        zhanglu: ['hanzhong', 'yangping', 'wudu', 'qishan'],
        liuzhang: ['yinping', 'jiange', 'zitong', 'chengdu', 'jiangzhou', 'baidi', 'nanzhong'],
        liubiao: ['xiangyang', 'jiangling', 'wulin', 'gongan', 'xiakou', 'chibi', 'wuling', 'changsha', 'lingling', 'guiyang'],
        liu: ['xinye'],
        sun: ['chaisang', 'yuzhang', 'ruxu', 'jianye', 'jingkou', 'wu', 'kuaiji'],
        shixie: ['jiaozhou'],
      },
      armies: [
        ['cao', 'xu', 50, ['caocao', 'xuhuang']],
        ['cao', 'wan', 40, ['caoren', 'yujin']],
        ['cao', 'ye', 25, ['zhanghe']],
        ['cao', 'hefei', 12, ['zhangliao']],
        ['cao', 'changan', 15, ['xiahouyuan']],
        ['cao', 'luoyang', 10],
        ['cao', 'xiapi', 8],
        ['cao', 'ji', 6],
        ['sun', 'chaisang', 30, ['zhouyu', 'chengpu', 'huanggai'], 0.85],
        ['sun', 'jianye', 15, ['sunquan', 'lusu'], 0.6],
        ['sun', 'ruxu', 8, ['lvmeng'], 0.7],
        ['sun', 'yuzhang', 6, ['ganning'], 0.5],
        ['sun', 'wu', 6, ['luxun']],
        ['liu', 'xinye', 10, ['liubei', 'guanyu', 'zhangfei', 'zhaoyun', 'zhugeliang'], 0.2],
        ['liubiao', 'xiangyang', 30, ['liubiao', 'caimao', 'wenpin'], 0.5],
        ['liubiao', 'jiangling', 15, [], 0.4],
        ['liubiao', 'xiakou', 10, ['liuqi'], 0.5],
        ['liubiao', 'changsha', 6, ['huangzhong']],
        ['liuzhang', 'chengdu', 25, ['zhangren']],
        ['liuzhang', 'jiange', 6],
        ['liuzhang', 'baidi', 6],
        ['zhanglu', 'hanzhong', 18, ['zhanglu']],
        ['zhanglu', 'yangping', 6],
        ['ma', 'chencang', 10, ['machao']],
        ['ma', 'jincheng', 10, ['hansui']],
        ['shixie', 'jiaozhou', 8, ['shixie']],
      ],
      grain: { cao: 40, sun: 25, liu: 6, liubiao: 25, liuzhang: 20, zhanglu: 8, ma: 8, shixie: 8 },
      ai: { cao: 1, sun: 1, liu: 1, liubiao: 0, liuzhang: 0, zhanglu: 0, ma: 1, shixie: 0 },
      calm: { cao: 2, sun: 2, liu: 2, ma: 2 },
    }),
  goals: (p) => [
    { text: '拿下全部九座大城：邺、许、洛阳、长安、成都、襄阳、江陵、建业、吴', done: (s) => owns(s, p, ...CAPITALS) },
  ],
  lost: (s) => (Object.values(s.owner).some((o) => o === s.player) ? null : '你已经没有一座城了'),
  history: ['真实的历史里，208 年冬天，曹操在赤壁被孙刘联军打败。', '从此天下分成三块：曹操在北，孙权在东南，刘备几年后拿下了益州。', '直到 280 年，天下才重新统一，统一它的是晋。'],
  script: (s, reports) => {
    if (s.year === 208 && s.season === 2 && s.owner.xiangyang === 'liubiao' && !s.flags.liubiaoDied) {
      s.flags.liubiaoDied = true
      const toCao = s.owner.wan === 'cao' || s.owner.xinye === 'cao'
      reports.push({
        side: 'liubiao',
        kind: 'info',
        title: '刘表病死了',
        lines: toCao ? ['他的小儿子刘琮看见曹操大军压境，把荆州献了出去。', '真实的历史也是这样。'] : ['他的儿子们守着荆州。'],
        to: 'xiangyang',
      })
      if (toCao) {
        for (const p of places) {
          if (s.owner[p.id] !== 'liubiao') continue
          const to = p.id === 'xiakou' ? (s.owner.xinye === 'liu' ? 'liu' : 'sun') : 'cao'
          s.owner[p.id] = to
          for (const a of s.armies) if (a.at === p.id && a.side === 'liubiao') a.side = to
        }
        delete s.ai.liubiao
      }
    }
  },
}

const guandu: Scenario = {
  id: 'guandu',
  title: '官渡',
  when: '200 年春',
  hook: '袁绍十万，你两三万。粮食也快没了。',
  picks: [
    { side: 'cao', who: '曹操', blurb: '你的兵只有对手的三分之一，粮也不够。可你知道，袁绍的粮全囤在一个地方。' },
    { side: 'yuan', who: '袁绍', blurb: '你是天下最强的诸侯。十万大军，只要过了黄河，许都就在眼前。' },
  ],
  turns: 6,
  view: { center: [114.6, 35.0], zoom: 6.6 },
  intro: (p) =>
    p === 'cao'
      ? ['袁绍的大军在黄河北岸。', '你只要守住官渡，许都就安全。', '可光守是守不赢的——看看地图上那个叫乌巢的地方。', '去乌巢只有一条夜里的小路，最多带一万人。你手下谁擅长奇袭？']
      : ['你的大军就在黄河边上。', '对面的曹操兵少粮少。', '小心看好乌巢，那是全军的粮仓。'],
  build: (player) =>
    make({
      scenario: 'guandu',
      player,
      year: 200,
      season: 0,
      area: ['ye', 'liyang', 'baima', 'puyang', 'wuchao', 'guandu', 'xu'],
      owner: {
        yuan: ['ye', 'liyang', 'wuchao'],
        cao: ['baima', 'puyang', 'guandu', 'xu'],
      },
      armies: [
        ['yuan', 'liyang', 60, ['yuanshao', 'zhanghe', 'yanliang']],
        ['yuan', 'wuchao', 10, ['chunyuqiong']],
        ['yuan', 'ye', 15],
        ['cao', 'guandu', 25, ['caocao', 'xuhuang', 'zhangliao', 'guanyu']],
        ['cao', 'baima', 3],
        ['cao', 'xu', 4, ['caoren']],
      ],
      grain: { cao: 6, yuan: 30 },
      ai: { cao: 1, yuan: 2 },
      flags: { wuchaoDepot: true },
      far: { yuan: 0.3 },
    }),
  goals: (p) =>
    p === 'cao'
      ? [
          { text: '守住许都', done: (s) => s.owner.xu === 'cao' },
          { text: '烧掉乌巢的粮仓', done: (s) => !s.flags.wuchaoDepot },
          { text: '把袁绍的兵打到不到一半', done: (s) => sumTroops(s, 'yuan') < 43 },
        ]
      : [{ text: '拿下许都', done: (s) => s.owner.xu === 'yuan' }],
  lost: (s) => {
    if (s.player === 'cao' && s.owner.xu !== 'cao') return '许都丢了，天子落到了袁绍手里'
    if (s.player === 'yuan' && sumTroops(s, 'yuan') < 20) return '十万大军散得只剩两万'
    return null
  },
  history: ['真实的历史里，曹操亲自带五千人，夜里打着袁军的旗号偷袭乌巢，烧光了粮草。', '袁绍大军军心大乱，张郃投降了曹操。', '两年后袁绍病死，北方归了曹操。'],
}

const chibi: Scenario = {
  id: 'chibi',
  title: '赤壁',
  when: '208 年冬',
  hook: '二十万北方兵，坐着船，生着病。',
  picks: [
    { side: 'cao', who: '曹操', blurb: '你刚拿下荆州，带着大军和荆州的船顺江而下。只要过了江，天下就是你的。' },
    { side: 'lianjun', who: '周瑜和刘备', blurb: '你们加起来不到五万人。可你们有船，有长江，还有冬天的风。' },
  ],
  turns: 6,
  view: { center: [113.4, 29.8], zoom: 6.5 },
  intro: (p) =>
    p === 'cao'
      ? ['你的兵大多是北方人，坐船会晕，到了南方就生病。', '对岸的周瑜，船比你的好。', '过江，还是换一条路？']
      : ['曹操的大军就停在对岸的乌林。', '他的船挤在一起，正是冬天。', '单靠一家的兵打不过他，先把两支军队合到一起。'],
  build: (player) =>
    make({
      scenario: 'chibi',
      player,
      year: 208,
      season: 3,
      area: ['xiangyang', 'xinye', 'wan', 'jiangling', 'gongan', 'wulin', 'chibi', 'xiakou', 'chaisang', 'changsha', 'wuling', 'lingling', 'guiyang', 'yuzhang', 'wancheng'],
      owner: {
        cao: ['xiangyang', 'xinye', 'wan', 'jiangling', 'wulin', 'gongan', 'wuling', 'changsha', 'lingling', 'guiyang', 'wancheng'],
        lianjun: ['chibi', 'xiakou', 'chaisang', 'yuzhang'],
      },
      armies: [
        ['cao', 'wulin', 80, ['caocao', 'caimao', 'zhangliao'], 0.45, 2],
        ['cao', 'jiangling', 20, ['caoren'], 0.3, 1],
        ['cao', 'xiangyang', 8, ['yujin']],
        ['cao', 'changsha', 4, ['huangzhong']],
        ['lianjun', 'chibi', 30, ['zhouyu', 'chengpu', 'huanggai'], 0.9],
        ['lianjun', 'xiakou', 20, ['liubei', 'guanyu', 'zhangfei', 'zhaoyun', 'zhugeliang'], 0.5],
        ['lianjun', 'chaisang', 8, ['sunquan', 'lusu', 'ganning'], 0.7],
      ],
      grain: { cao: 20, lianjun: 14 },
      ai: { cao: 1, lianjun: 1 },
      far: { lianjun: 2 },
    }),
  goals: (p) =>
    p === 'cao'
      ? [
          { text: '拿下夏口和赤壁，站上长江南岸', done: (s) => owns(s, 'cao', 'xiakou', 'chibi') },
          { text: '守住江陵', done: (s) => s.owner.jiangling === 'cao' },
        ]
      : [
          { text: '打退乌林的曹军', done: (s) => s.owner.wulin === 'lianjun' },
          { text: '拿下江陵', done: (s) => s.owner.jiangling === 'lianjun' },
        ],
  lost: (s) => {
    if (s.player === 'cao' && sumTroops(s, 'cao') < 30) return '北方来的大军死的死、散的散'
    if (s.player === 'lianjun' && s.owner.chaisang !== 'lianjun' && s.owner.xiakou !== 'lianjun') return '夏口和柴桑都丢了'
    return null
  },
  history: ['真实的历史里，黄盖假装投降，带着装满柴草的船冲进曹军船队，借着东南风放火。', '曹军船连着船，烧成一片，又闹着瘟疫，只好从华容道退回北方。', '周瑜又打了一年，才从曹仁手里拿下江陵。'],
}

const beifa: Scenario = {
  id: 'beifa',
  title: '北伐',
  when: '228 年春',
  hook: '翻过秦岭，粮食比敌人更难对付。',
  picks: [
    { side: 'shu', who: '诸葛亮', blurb: '你从汉中出发，北面是秦岭。走哪条路，决定了你能不能把粮食运到前线。' },
    { side: 'wei', who: '曹真和张郃', blurb: '诸葛亮不知道会从哪条山路出来。你的援军在长安。' },
  ],
  turns: 8,
  view: { center: [106.6, 33.8], zoom: 6.4 },
  intro: (p) =>
    p === 'shu'
      ? ['魏延说：给我五千人，走子午谷，十天就到长安。', '你觉得太险。', '你可以走祁山，绕远一点，先拿下陇右。', '每一条山路，都在吃你的粮。']
      : ['蜀军从汉中出来了。', '他们兵少，粮更少。', '守住关口，等他们饿了自己退。'],
  build: (player) =>
    make({
      scenario: 'beifa',
      player,
      year: 228,
      season: 0,
      area: ['hanzhong', 'yangping', 'wudu', 'qishan', 'tianshui', 'jieting', 'jincheng', 'chencang', 'mei', 'changan', 'yinping', 'jiange', 'zitong', 'chengdu'],
      owner: {
        shu: ['hanzhong', 'yangping', 'jiange', 'zitong', 'chengdu'],
        wei: ['wudu', 'qishan', 'tianshui', 'jieting', 'jincheng', 'chencang', 'mei', 'changan', 'yinping'],
      },
      armies: [
        ['shu', 'hanzhong', 60, ['zhugeliang', 'weiyan', 'zhaoyun', 'masu', 'wangping']],
        ['shu', 'chengdu', 8],
        ['wei', 'changan', 25, ['caizhen']],
        ['wei', 'chencang', 4, ['haozhao']],
        ['wei', 'tianshui', 5],
        ['wei', 'qishan', 3],
        ['wei', 'mei', 6],
        ['wei', 'jincheng', 4],
      ],
      grain: { shu: 14, wei: 30 },
      ai: { shu: 1, wei: 1 },
      garrison: 3,
      far: { wei: 3 },
    }),
  goals: (p) =>
    p === 'shu'
      ? [{ text: '同时占住天水、街亭、祁山（陇右三地），或者拿下长安', done: (s) => owns(s, 'shu', 'tianshui', 'jieting', 'qishan') || s.owner.changan === 'shu' }]
      : [{ text: '守住长安，把蜀军赶回汉中', done: (s) => s.turn >= 7 && s.owner.changan === 'wei' && !['tianshui', 'jieting', 'qishan', 'mei', 'chencang'].some((id) => s.owner[id] === 'shu') }],
  lost: (s) => {
    if (s.player === 'shu' && s.owner.hanzhong !== 'shu') return '汉中丢了，蜀的北大门开了'
    if (s.player === 'wei' && s.owner.changan !== 'wei') return '长安丢了'
    return null
  },
  history: ['真实的历史里，诸葛亮走祁山，陇右三郡一下子都归了蜀。', '可他派马谡守街亭，马谡不听命令，把营扎在山上，被张郃断了水，大败。', '诸葛亮只好退回汉中。此后六年他又北伐了好几次，大多因为运不上粮而退兵。'],
  script: (s, reports) => {
    if (s.turn === 1 && !s.flags.zhanghe) {
      s.flags.zhanghe = true
      const at = s.owner.changan === 'wei' ? 'changan' : s.owner.mei === 'wei' ? 'mei' : null
      if (!at) return
      const a = armyAt(s, at, 'wei')
      if (a) {
        a.troops += 40
        a.generals = [...a.generals, 'zhanghe']
      } else s.armies.push({ id: s.nextId++, side: 'wei', at, troops: 40, navy: 0, generals: ['zhanghe'], moved: false, sick: 0 } as Army)
      s.ai.wei = 2
      reports.push({ side: 'wei', kind: 'info', title: '张郃带着五万援军到了', lines: [`魏明帝从洛阳派来了援兵，驻在${placeById.get(at)!.name}。`], to: at })
    }
  },
}

export const scenarios: Scenario[] = [guandu, chibi, beifa, sandbox]
export const scenarioById = new Map(scenarios.map((x) => [x.id, x]))

export function goalsMet(sc: Scenario, s: State) {
  return sc.goals(s.player).every((g) => g.done(s))
}

const SEASON_MONTHS = [
  [1, 3],
  [4, 6],
  [7, 9],
  [10, 12],
]

export function historyThisSeason(year: number, season: number) {
  const [a, b] = SEASON_MONTHS[season]
  // 史书没写月份的，放在这一年的冬天说
  const month = (m: number | null | undefined) => m ?? 12
  return events
    .filter((e) => e.year === year && month(e.month) >= a && month(e.month) <= b && e.importance <= 2)
    .sort((x, y) => x.importance - y.importance)
    .map((e) => ({ id: e.id, name: e.name, place: e.place, text: firstSentence(e.summary), at: [e.lng, e.lat] as LngLat }))
}

function firstSentence(t: string) {
  const parts = t.split(/(?<=。)/)
  const out = parts.slice(0, 2).join('')
  return out.length > 90 ? parts[0] : out
}