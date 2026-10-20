import { cellIndex, links, realOwners } from './board'
import { factionOfReal, type Fid } from './roster'
import { atWar, ownerOf, yearOf, type State } from './sim'

/**
 * What each side really set out to do, and when. While a corner of the world still looks the way it really did,
 * the AI follows these; the further the player pushes it away, the weaker the pull, until the AI is on its own.
 */
export interface Intent {
  id: string
  f: Fid
  from: number
  until: number
  /** campaign: gather, then take these in order. hold: stand at `stage` and let them come. */
  kind: 'campaign' | 'hold'
  stage?: string
  take: string[]
  /** share of the field army that goes */
  share: number
  /** opens a war on this side when it begins, as history did */
  war?: Fid
  /** what really happened; the player sees it as the shadow of history */
  real: string
  needs?: (st: State) => boolean
}

const alive = (st: State, f: Fid) => !!st.factions[f]?.alive
const holds = (st: State, f: Fid, ids: string[]) => ids.some((id) => ownerOf(st, id) === f)

export const INTENTS: Intent[] = [
  // ---- 官渡 ----
  {
    id: 'yuan-guandu', f: 'yuan', from: 200.1, until: 200.95, kind: 'campaign', stage: '魏郡', take: ['东郡', '陈留', '颍川'], share: 0.8,
    real: '200 年二月，袁绍进军黎阳，派颜良围白马；八月大军进逼官渡，与曹操相持。',
    needs: (st) => atWar(st, 'yuan', 'cao'),
  },
  {
    id: 'cao-guandu', f: 'cao', from: 200.1, until: 200.95, kind: 'hold', stage: '陈留', take: [], share: 0.65,
    real: '曹操把主力收缩到官渡，挡住袁军通往许都的大路，坚守半年。',
    needs: (st) => atWar(st, 'yuan', 'cao'),
  },
  {
    id: 'cao-hebei', f: 'cao', from: 201.2, until: 206.5, kind: 'campaign', take: ['东郡', '魏郡', '清河', '巨鹿', '安平', '渤海', '河间', '平原', '中山', '常山', '涿郡'], share: 0.7,
    real: '201 年仓亭再破袁绍；204 年攻下邺城；205 年平定冀州、青州；206 年平定并州。',
    needs: (st) => alive(st, 'yuan') && atWar(st, 'cao', 'yuan'),
  },
  // ---- 荆州 ----
  {
    id: 'sun-jiangxia', f: 'sun', from: 203, until: 208.4, kind: 'campaign', take: ['江夏'], share: 0.55,
    real: '孙权在 203、207、208 年三次进攻江夏的黄祖，208 年春终于攻破，杀黄祖。',
    needs: (st) => atWar(st, 'sun', 'liubiao'),
  },
  {
    id: 'cao-south', f: 'cao', from: 208.5, until: 208.85, kind: 'campaign', stage: '南阳郡', take: ['南郡'], share: 0.75,
    real: '208 年七月曹操南征，刘琮投降，曹军在长坂追上刘备，九月占领江陵，接收了荆州水军。',
    needs: (st) => !alive(st, 'yuan') || !atWar(st, 'cao', 'yuan'),
  },
  {
    id: 'cao-east', f: 'cao', from: 208.85, until: 209.1, kind: 'campaign', stage: '南郡', take: ['江夏'], share: 0.75,
    real: '208 年冬，曹操率大军从江陵顺江东下，号称八十万，在赤壁与孙刘联军隔江对峙。',
    needs: (st) => ownerOf(st, '南郡') === 'cao',
  },
  {
    id: 'sun-chibi', f: 'sun', from: 208.6, until: 209.15, kind: 'hold', stage: '江夏', take: [], share: 0.7,
    real: '208 年冬，周瑜、程普率三万水军西上，与刘备合兵，在赤壁迎击顺江而下的曹军。',
    needs: (st) => atWar(st, 'sun', 'cao'),
  },
  {
    id: 'sun-jiangling', f: 'sun', from: 209.1, until: 210, kind: 'campaign', take: ['南郡'], share: 0.6,
    real: '208 年冬周瑜开始围攻江陵，209 年曹仁弃城北撤。',
    needs: (st) => atWar(st, 'sun', 'cao'),
  },
  {
    id: 'liubei-jingnan', f: 'liubei', from: 209, until: 210.5, kind: 'campaign', take: ['武陵', '长沙', '桂阳', '零陵'], share: 0.9,
    real: '209 年刘备南征武陵、长沙、桂阳、零陵四郡，四郡太守相继投降。',
  },
  // ---- 西边 ----
  {
    id: 'cao-tongguan', f: 'cao', from: 211.5, until: 212.3, kind: 'campaign', take: ['京兆尹', '左冯翊', '右扶风'], share: 0.6, war: 'ma',
    real: '211 年马超、韩遂起兵，曹操亲征，在潼关、渭南用离间计大破关西联军。',
  },
  {
    id: 'liubei-shu', f: 'liubei', from: 212, until: 214.6, kind: 'campaign', take: ['巴郡', '广汉', '蜀郡'], share: 0.7, war: 'liuzhang',
    real: '211 年刘备应刘璋之邀入蜀，212 年翻脸南下，214 年围成都，刘璋出降。',
    needs: (st) => holds(st, 'liubei', ['南郡', '武陵', '长沙', '零陵', '桂阳', '固陵']),
  },
  {
    id: 'cao-hanzhong', f: 'cao', from: 215.2, until: 215.9, kind: 'campaign', take: ['汉中郡'], share: 0.55, war: 'zhanglu',
    real: '215 年曹操亲征张鲁，攻破阳平关，张鲁投降。',
  },
  {
    id: 'sun-hefei', f: 'sun', from: 215.55, until: 215.9, kind: 'campaign', take: ['九江郡'], share: 0.7,
    real: '215 年孙权率十万人围合肥，张辽带八百人冲阵，孙权大败而还。',
    needs: (st) => atWar(st, 'sun', 'cao'),
  },
  {
    id: 'liubei-hanzhong', f: 'liubei', from: 217.9, until: 219.5, kind: 'campaign', take: ['汉中郡'], share: 0.7,
    real: '217 年起刘备争夺汉中，219 年定军山斩夏侯渊，曹操退走，刘备称汉中王。',
    needs: (st) => holds(st, 'liubei', ['巴郡', '广汉', '蜀郡']),
  },
  {
    id: 'guanyu-fancheng', f: 'liubei', from: 219.55, until: 219.95, kind: 'campaign', take: ['南阳郡'], share: 0.35,
    real: '219 年关羽从江陵北攻樊城，汉水暴涨，水淹于禁七军，威震华夏。',
    needs: (st) => ownerOf(st, '南郡') === 'liubei' && st.gens.guanyu?.f === 'liubei' && !st.gens.guanyu.dead,
  },
  {
    id: 'sun-baiyi', f: 'sun', from: 219.8, until: 220.2, kind: 'campaign', take: ['南郡', '武陵', '零陵'], share: 0.6, war: 'liubei',
    real: '219 年冬吕蒙白衣渡江，偷袭江陵，关羽败走麦城被擒。',
    needs: (st) => ownerOf(st, '南郡') === 'liubei',
  },
  // ---- 三国 ----
  {
    id: 'liubei-yiling', f: 'liubei', from: 221.5, until: 222.6, kind: 'campaign', take: ['南郡', '武陵'], share: 0.7,
    real: '221 年刘备为关羽报仇东征孙权，222 年在夷陵被陆逊火烧连营，大败退回白帝城。',
    needs: (st) => atWar(st, 'liubei', 'sun'),
  },
  {
    id: 'cao-wu222', f: 'cao', from: 222.75, until: 223.3, kind: 'campaign', take: ['江夏', '庐江', '丹阳'], share: 0.6, war: 'sun',
    real: '222 年秋曹丕三路伐吴，在江陵、濡须、洞口都没能取胜，次年撤回。',
  },
  {
    id: 'shu-north', f: 'liubei', from: 228, until: 234.7, kind: 'campaign', take: ['汉阳郡', '陇西郡', '右扶风'], share: 0.6,
    real: '228 至 234 年诸葛亮五次北伐，出祁山、战街亭、屯五丈原，最后病逝军中。',
    needs: (st) => holds(st, 'liubei', ['汉中郡']) && atWar(st, 'liubei', 'cao'),
  },
]

function region(it: Intent) {
  const s = new Set<string>(it.take)
  if (it.stage) s.add(it.stage)
  for (const id of [...s]) for (const l of links(id)) s.add(l.to)
  return [...s]
}

function likeness(st: State, ids: string[], year: number, it?: Intent) {
  const real = realOwners(year)
  const taken = it ? new Set(it.take) : null
  let same = 0
  let n = 0
  for (const id of ids) {
    // an objective this side has already taken counts as following the plan, not as leaving the map behind
    if (it && taken?.has(id) && ownerOf(st, id) === it.f) {
      n++
      same++
      continue
    }
    const f = factionOfReal(real.f[cellIndex.get(id)!])
    // land whose real master is already gone in this game says nothing either way
    if (!f || !alive(st, f)) continue
    n++
    if (f === ownerOf(st, id)) same++
  }
  return n ? same / n : 0.6
}

/** 0 … 1: how much this corner of the world still looks like it really did. */
export function pull(st: State, it: Intent) {
  if (!alive(st, it.f)) return 0
  const ids = region(it)
  const y = yearOf(st)
  return Math.max(likeness(st, ids, Math.min(y, it.from), it), likeness(st, ids, y, it))
}

export function activeIntents(st: State, f: Fid) {
  const y = yearOf(st)
  return INTENTS.filter((it) => it.f === f && y >= it.from && y < it.until && (!it.needs || it.needs(st)))
    .map((it) => ({ it, p: pull(st, it) }))
    .filter((x) => x.p >= 0.45)
}

/** Where this side's current campaign is being fought, or null when it has none. Stage, objectives, and their neighbours. */
export function theatre(st: State, f: Fid) {
  const plans = activeIntents(st, f)
  if (!plans.length) return null
  const ids = new Set<string>()
  for (const { it } of plans) {
    if (it.stage) ids.add(it.stage)
    for (const id of it.take) ids.add(id)
  }
  const zone = new Set(ids)
  for (const id of ids) for (const l of links(id)) zone.add(l.to)
  return zone
}

/** Campaigns of this side about to begin, while the world still looks like it did. */
export function soonIntents(st: State, f: Fid, within: number) {
  const y = yearOf(st)
  return INTENTS.filter((it) => it.f === f && it.from > y && it.from <= y + within && pull(st, it) >= 0.45)
}

/**
 * 0 … 1: how firmly history keeps this commandery with its owner for the next two years,
 * weighted by how much the neighbourhood still looks real. High inertia makes the AI think twice.
 */
export function inertia(st: State, id: string) {
  const o = ownerOf(st, id)
  if (!o) return 0
  const y = yearOf(st)
  const i = cellIndex.get(id)!
  if (![0.5, 1, 2].every((d) => factionOfReal(realOwners(y + d).f[i]) === o)) return 0
  return likeness(st, [id, ...links(id).map((l) => l.to)], y)
}

/** What history was doing at this moment, for the player's shadow. */
export function historyNow(st: State) {
  const y = yearOf(st)
  return INTENTS.filter((it) => y >= it.from && y < it.until)
}
