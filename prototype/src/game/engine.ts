import { generalById, neighbors, placeById, places, routeBetween, type Route, type Trait } from './world'
import { sideOf } from './sides'

export const SEASONS = ['春', '夏', '秋', '冬'] as const
const HARVEST = [0.7, 0.9, 1.7, 0.5]

export interface Army {
  id: number
  side: string
  at: string
  troops: number
  navy: number
  generals: string[]
  moved: boolean
  sick: number
}

export interface Factor {
  text: string
  mult: number
  who: 'att' | 'def'
}

export interface Battle {
  att: string
  def: string
  from: string
  to: string
  attTroops: number
  defTroops: number
  attPower: number
  defPower: number
  factors: Factor[]
  won: boolean
  attLost: number
  defLost: number
  note?: string
}

export interface Report {
  side: string
  kind: 'battle' | 'capture' | 'move' | 'season' | 'info'
  title: string
  lines: string[]
  battle?: Battle
  from?: string
  to?: string
}

export interface State {
  scenario: string
  player: string
  year: number
  season: number
  turn: number
  owner: Record<string, string | null>
  armies: Army[]
  grain: Record<string, number>
  ai: Record<string, 0 | 1 | 2>
  recruited: string[]
  nextId: number
  flags: Record<string, boolean>
  /** AI 在这一回合之前只守不攻 */
  calm?: Record<string, number>
  /** 这一方的产粮打折，比如粮要从很远的地方运来 */
  far?: Record<string, number>
  over?: { won: boolean; text: string }
}

/** 城里本来就有的守兵，不会被打光，也不能调走 */
export function militia(id: string) {
  const p = placeById.get(id)!
  return Math.max(1, p.grain * 0.8 + (p.wall ? 2 : 0) + (p.pass ? 3 : 0) + (p.capital ? 3 : 0))
}

export const GORGE_MAX = 10

export interface Order {
  army: number
  to: string
  troops: number
  generals: string[]
}

export type Preview =
  | { ok: false; reason: string }
  | { ok: true; kind: 'move' | 'merge' | 'take'; lines: string[]; upkeep: number }
  | { ok: true; kind: 'attack'; lines: string[]; upkeep: number; battle: Battle; odds: number }

export const RECRUIT = { troops: 5, cost: 4 }
export const DRILL = { gain: 0.25, cost: 2 }

const has = (a: { generals: string[] }, t: Trait) => a.generals.some((g) => generalById.get(g)?.traits.includes(t))
const lead = (a: { generals: string[] }) => {
  const g = a.generals.map((id) => generalById.get(id)).filter(Boolean)
  return g.length ? Math.max(...g.map((x) => x!.lead)) : 40
}
const commander = (a: { generals: string[] }) => (a.generals[0] ? generalById.get(a.generals[0])?.name : undefined)
const navyOf = (a: { navy: number; generals: string[] }) => Math.min(1, a.navy + (has(a, 'navy') ? 0.25 : 0))
const pct = (x: number) => `${Math.round(x * 10)} 成`
export const troopsText = (k: number) => (k >= 10 ? `${+(k / 10).toFixed(1)} 万` : `${Math.round(k * 1000)}`)

export function armyAt(s: State, at: string, side?: string) {
  return s.armies.find((a) => a.at === at && (side ? a.side === side : true))
}

export function seasonName(s: { year: number; season: number }) {
  return `${s.year} 年${SEASONS[s.season]}`
}

/** 从自家大城出发、只走自家地盘，到每个地方要几步 */
export function supplyDistance(s: State, side: string) {
  const d = new Map<string, number>()
  const q: string[] = []
  const own = places.filter((p) => s.owner[p.id] === side)
  let roots = own.filter((p) => p.capital || p.grain >= 4)
  if (!roots.length && own.length) {
    const top = Math.max(...own.map((p) => p.grain))
    roots = own.filter((p) => p.grain === top)
  }
  for (const p of roots) {
    d.set(p.id, 0)
    q.push(p.id)
  }
  while (q.length) {
    const c = q.shift()!
    for (const n of neighbors(c)) {
      if (d.has(n.id) || s.owner[n.id] !== side) continue
      d.set(n.id, d.get(c)! + 1)
      q.push(n.id)
    }
  }
  return d
}

export function supplyLine(s: State, side: string, at: string, dist = supplyDistance(s, side)) {
  const d = dist.get(at)
  if (d === undefined) return { mult: 2, text: '粮道被切断了，吃粮翻倍' }
  if (d <= 2) return { mult: 1, text: '' }
  return { mult: 1 + 0.25 * (d - 2), text: `离大城 ${d} 站路，运粮越远越费` }
}

export function upkeepOf(s: State, a: { side: string; troops: number; generals: string[]; at: string }, dist?: Map<string, number>) {
  const p = placeById.get(a.at)!
  let m = 0.18
  if (p.mountain && !has(a, 'mountain')) m *= 1.6
  m *= supplyLine(s, a.side, a.at, dist).mult
  if (has(a, 'supply')) m *= 0.6
  return a.troops * m
}

export function incomeOf(s: State, side: string) {
  let g = 0
  for (const p of places) if (s.owner[p.id] === side) g += p.grain * HARVEST[s.season]
  g *= s.far?.[side] ?? 1
  if (s.flags.wuchaoDepot && s.owner.wuchao === side) g += 14
  return g
}

export function spendOf(s: State, side: string) {
  const dist = supplyDistance(s, side)
  return s.armies.filter((a) => a.side === side).reduce((t, a) => t + upkeepOf(s, a, dist), 0)
}

function battleOdds(s: State, att: Army & { from: string }, def: Army, route: Route, roll: () => number): Battle {
  const to = placeById.get(def.at)!
  const factors: Factor[] = []
  const f = (who: 'att' | 'def', mult: number, text: string) => factors.push({ who, mult, text })
  const winter = s.season === 3
  const attNavy = navyOf(att)
  const defNavy = navyOf(def)
  const attLead = lead(att)
  const defLead = lead(def)

  f('att', 0.7 + attLead / 200, commander(att) ? `${commander(att)}领兵` : '没有大将，只有校尉带兵')
  f('def', 0.7 + defLead / 200, commander(def) ? `${commander(def)}守在这里` : '守军没有大将')

  if (route.kind === 'river') f('att', 0.45 + 0.55 * attNavy, `横渡${route.name ?? '大江'}：你的船只够装 ${pct(attNavy)} 的兵`)
  if (route.kind === 'river' && defNavy > 0.2) f('def', 1 + 0.4 * defNavy, '对岸的水军在江上拦截')
  if (route.kind === 'water' && attNavy < 0.5) f('att', 0.75, '船不够，只能沿着江岸挤过去')
  if (route.kind === 'water' && attNavy >= 0.5) f('att', 1.1, '顺江而下，船队来得又快又猛')
  if (route.kind === 'ford') f('att', 0.85, `渡${route.name ?? '河'}进攻，半渡最危险`)

  const raid = has(att, 'raid')
  const mountain = has(att, 'mountain')
  if (route.kind === 'hard') {
    if (raid) f('att', 1.15, '翻山奇袭，敌人没想到')
    else if (!mountain) f('att', 0.8, '翻山过来，人困马乏')
  }
  if (route.kind === 'gorge') {
    if (raid) f('att', 1.3, '走险绝小道，出其不意')
    else if (!mountain) f('att', 0.6, '小道险绝，队伍拉成了长线')
  }
  if (winter && (route.kind === 'hard' || route.kind === 'gorge') && !mountain) f('att', 0.85, '冬天翻山，又冷又滑')

  if (generalById.get(att.generals[0] ?? '')?.traits.includes('cavalry')) {
    if (route.kind === 'road' && to.zone === 'north' && !to.mountain && !to.wall && !to.pass) f('att', 1.25, '北方平原，骑兵冲锋')
    else if (to.zone === 'south' || to.mountain) f('att', 0.9, '水网和山地里，骑兵跑不开')
  }

  if (to.wall) f('def', 1.25, `${to.name}有城墙`)
  if (to.wall && has(def, 'wall')) f('def', 1.3, '守城名将，越围越难打')
  if (to.pass) f('def', 1.5, `${to.name}是关口，易守难攻`)
  if (to.mountain) f('def', 1.15, '守军占着山势')
  if (has(def, 'wit')) f('att', 0.9, '对手看穿了你的打法')
  if (has(att, 'wit') && !to.wall) f('def', 0.92, '你的谋士找到了破绽')

  const fireAtt = has(att, 'fire') && to.port && defNavy >= 0.4 && (route.kind === 'water' || route.kind === 'river')
  const fireDef = has(def, 'fire') && attNavy >= 0.4 && (route.kind === 'water' || route.kind === 'river')
  if (fireAtt) f('def', winter ? 0.4 : 0.6, winter ? '火攻！冬天刮东南风，敌船连在一起烧了起来' : '火攻！敌船挤在江边')
  if (fireDef) f('att', winter ? 0.4 : 0.6, winter ? '火攻！你的船队被火船冲进来了' : '火攻！你的船挤在一起被点着了')

  if (att.sick > 0) f('att', 1 - 0.08 * Math.min(att.sick, 3), '军中闹疫病，很多人站不起来')
  if (def.sick > 0) f('def', 1 - 0.08 * Math.min(def.sick, 3), '守军里闹疫病')
  if ((s.grain[att.side] ?? 0) <= 0) f('att', 0.7, '粮食见底，士兵饿着肚子')
  if ((s.grain[def.side] ?? 0) <= 0) f('def', 0.7, '守军断粮')

  const guards = militia(def.at)
  let attPower = att.troops
  let defPower = def.troops + guards
  for (const x of factors) {
    if (x.who === 'att') attPower *= x.mult
    else defPower *= x.mult
  }
  attPower *= roll()
  defPower *= roll()
  const r = attPower / Math.max(0.1, defPower)
  const won = r >= 1
  const attLost = Math.min(att.troops * 0.8, att.troops * Math.max(0.05, 0.1 + 0.22 / r))
  const defLost = def.troops * Math.min(won ? 0.85 : 0.9, Math.max(0.05, won ? 0.25 + 0.2 * r : 0.1 + 0.25 * r))
  return {
    att: att.side,
    def: def.side,
    from: att.from,
    to: def.at,
    attTroops: att.troops,
    defTroops: def.troops + guards,
    attPower,
    defPower,
    factors,
    won,
    attLost,
    defLost,
  }
}

function goneGeneral(s: State, id: string) {
  const g = generalById.get(id)
  return !g || g.died < s.year
}

export function preview(s: State, o: Order): Preview {
  const army = s.armies.find((a) => a.id === o.army)
  if (!army) return { ok: false, reason: '这支军队已经不在了' }
  if (army.moved) return { ok: false, reason: '这一季已经行动过了' }
  const route = routeBetween(army.at, o.to)
  if (!route) return { ok: false, reason: '两地之间没有路' }
  if (o.troops <= 0) return { ok: false, reason: '至少派一些兵' }
  if (!(o.to in s.owner)) return { ok: false, reason: '那边不在这一局的战场上' }
  const moving = { ...army, troops: o.troops, generals: o.generals, from: army.at }
  if (route.kind === 'river' && navyOf(moving) < 0.2) return { ok: false, reason: '没有船，过不了长江。先在港口练水军' }
  if (route.kind === 'gorge' && o.troops > GORGE_MAX) return { ok: false, reason: `${route.name ?? '小道'}太窄，最多只能走一万人` }
  if (route.kind === 'gorge' && !has(moving, 'mountain')) moving.troops *= 0.86
  const lines: string[] = []
  const to = placeById.get(o.to)!
  if (route.kind === 'gorge' && !has(moving, 'mountain')) lines.push('小道险绝，路上会折损一成多的人')
  if (route.kind === 'hard' && !has(moving, 'mountain')) lines.push('山道难走')
  if (to.mountain && !has(moving, 'mountain')) lines.push(`驻在${to.name}山里，吃粮要多六成`)
  if (army.side && sideOf(army.side).home === 'north' && to.zone === 'south') lines.push('北方兵到了南方，容易闹疫病')
  const upkeep = upkeepOf(s, { ...moving, at: o.to })
  const line = supplyLine(s, army.side, o.to)
  if (line.text && s.owner[o.to] === army.side) lines.push(line.text)
  const owner = s.owner[o.to]
  const enemy = s.armies.find((a) => a.at === o.to && a.side !== army.side) ?? (owner && owner !== army.side ? localGuard(owner, o.to) : undefined)
  if (enemy) {
    const b = battleOdds(s, moving, enemy, route, () => 1)
    const odds = b.attPower / Math.max(0.1, b.defPower)
    return { ok: true, kind: 'attack', lines, upkeep, battle: b, odds }
  }
  if (owner === null) return { ok: true, kind: 'take', lines: [`${to.name}没有人守，直接拿下`, ...lines], upkeep }
  if (armyAt(s, o.to, army.side)) return { ok: true, kind: 'merge', lines: ['和那里的军队合在一起', ...lines], upkeep }
  return { ok: true, kind: 'move', lines, upkeep }
}

function localGuard(side: string, at: string): Army {
  const p = placeById.get(at)!
  return { id: -1, side, at, troops: 0, navy: p.port ? 0.3 : 0, generals: [], moved: true, sick: 0 }
}

function retreatTarget(s: State, a: Army, avoid: string) {
  const opts = neighbors(a.at)
    .filter((n) => n.id !== avoid && s.owner[n.id] === a.side && !s.armies.some((x) => x.at === n.id && x.side !== a.side))
    .filter((n) => n.route.kind !== 'river' || navyOf(a) >= 0.2)
  return opts[0]?.id
}

function absorb(s: State, into: Army, from: Army) {
  const t = into.troops + from.troops
  into.navy = t ? (into.navy * into.troops + from.navy * from.troops) / t : 0
  into.troops = t
  into.sick = Math.max(into.sick, from.sick)
  into.generals = [...new Set([...into.generals, ...from.generals])].sort((x, y) => (generalById.get(y)?.lead ?? 0) - (generalById.get(x)?.lead ?? 0))
  s.armies = s.armies.filter((a) => a !== from)
}

export function capture(s: State, side: string, at: string, reports: Report[]) {
  const before = s.owner[at]
  s.owner[at] = side
  const p = placeById.get(at)!
  if (at === 'wuchao' && s.flags.wuchaoDepot && before === 'yuan') {
    s.grain.yuan = Math.min(s.grain.yuan ?? 0, 0) - 20
    s.flags.wuchaoDepot = false
    const lines = ['袁绍大军的粮草，全堆在这里。', '现在，他的兵要饿肚子了。']
    const turncoat = s.armies.find((a) => a.side === 'yuan' && a.generals.includes('zhanghe'))
    const here = s.armies.find((a) => a.side === side && a.at === at)
    if (turncoat) {
      turncoat.troops *= 0.7
      turncoat.generals = turncoat.generals.filter((g) => g !== 'zhanghe')
      if (here && side !== 'yuan') here.generals.push('zhanghe')
      lines.push('袁军军心大乱，大将张郃带着人马投降了。')
    }
    reports.push({ side, kind: 'info', title: '乌巢的粮仓烧起来了', lines, to: at })
  }
  if (p.capital) reports.push({ side, kind: 'capture', title: `${sideOf(side).name}拿下了${p.name}`, lines: [`${p.name}，今天的${p.modern}。`], to: at })
}

export function act(s: State, o: Order, roll: () => number = () => 0.9 + Math.random() * 0.2): Report[] {
  const pv = preview(s, o)
  if (!pv.ok) return []
  const army = s.armies.find((a) => a.id === o.army)!
  const route = routeBetween(army.at, o.to)!
  const reports: Report[] = []
  const from = army.at
  const to = placeById.get(o.to)!
  let mover: Army
  if (o.troops >= army.troops - 0.01) {
    mover = army
  } else {
    mover = { ...army, id: s.nextId++, troops: o.troops, generals: o.generals.filter((g) => army.generals.includes(g)) }
    army.troops -= o.troops
    army.generals = army.generals.filter((g) => !mover.generals.includes(g))
    army.moved = true
    s.armies.push(mover)
  }
  mover.moved = true
  if (route.kind === 'gorge' && !has(mover, 'mountain')) mover.troops *= 0.86

  const owner = s.owner[o.to]
  const enemy = s.armies.find((a) => a.at === o.to && a.side !== mover.side) ?? (owner && owner !== mover.side ? localGuard(owner, o.to) : undefined)
  const who = commander(mover) ?? sideOf(mover.side).name
  if (enemy) {
    const b = battleOdds(s, { ...mover, from }, enemy, route, roll)
    mover.troops = Math.max(0, mover.troops - b.attLost)
    enemy.troops = Math.max(0, enemy.troops - b.defLost)
    if (b.won && enemy.id === -1) {
      b.note = '城里的守兵投降了'
      mover.at = o.to
      const mine = s.armies.find((a) => a !== mover && a.at === o.to && a.side === mover.side)
      if (mine) absorb(s, mine, mover)
      capture(s, mover.side, o.to, reports)
    } else if (b.won) {
      const back = enemy.troops > 1.5 ? retreatTarget(s, enemy, from) : undefined
      if (back) {
        enemy.at = back
        enemy.moved = true
        const there = s.armies.find((a) => a !== enemy && a.at === back && a.side === enemy.side)
        if (there) absorb(s, there, enemy)
        b.note = `残兵退到了${placeById.get(back)!.name}`
      } else {
        s.armies = s.armies.filter((a) => a !== enemy)
        b.note = enemy.generals.length ? `${enemy.generals.map((g) => generalById.get(g)!.name).join('、')}突围逃走，守军散了` : '守军散了'
      }
      mover.at = o.to
      const mine = s.armies.find((a) => a !== mover && a.at === o.to && a.side === mover.side)
      if (mine) absorb(s, mine, mover)
      capture(s, mover.side, o.to, reports)
    } else {
      const home = s.armies.find((a) => a !== mover && a.at === from && a.side === mover.side)
      if (home) absorb(s, home, mover)
      if (enemy.troops <= 0.2) s.armies = s.armies.filter((a) => a !== enemy)
    }
    if (mover.troops <= 0.2) s.armies = s.armies.filter((a) => a !== mover)
    reports.unshift({
      side: mover.side,
      kind: 'battle',
      title: `${who}${b.won ? '攻下' : '没能攻下'}${to.name}`,
      lines: [],
      battle: b,
      from,
      to: o.to,
    })
    return reports
  }
  mover.at = o.to
  const mine = s.armies.find((a) => a !== mover && a.at === o.to && a.side === mover.side)
  if (mine) absorb(s, mine, mover)
  if (s.owner[o.to] !== mover.side) {
    capture(s, mover.side, o.to, reports)
    reports.unshift({ side: mover.side, kind: 'move', title: `${who}占了${to.name}`, lines: ['那里没有守军。'], from, to: o.to })
  } else reports.push({ side: mover.side, kind: 'move', title: `${who}到了${to.name}`, lines: [], from, to: o.to })
  return reports
}

export function recruit(s: State, side: string, at: string) {
  if (s.owner[at] !== side || s.recruited.includes(at)) return false
  if ((s.grain[side] ?? 0) < RECRUIT.cost) return false
  if (s.armies.some((a) => a.at === at && a.side !== side)) return false
  const p = placeById.get(at)!
  const n = Math.max(2, Math.min(RECRUIT.troops, p.grain * 2))
  s.grain[side] -= RECRUIT.cost
  s.recruited.push(at)
  const a = armyAt(s, at, side)
  if (a) {
    a.navy = (a.navy * a.troops + (p.port ? 0.3 : 0) * n) / (a.troops + n)
    a.troops += n
  } else s.armies.push({ id: s.nextId++, side, at, troops: n, navy: p.port ? 0.3 : 0, generals: [], moved: false, sick: 0 })
  return true
}

export function drill(s: State, army: Army) {
  const p = placeById.get(army.at)!
  if (!p.port || army.moved || army.navy >= 1 || (s.grain[army.side] ?? 0) < DRILL.cost) return false
  s.grain[army.side] -= DRILL.cost
  army.navy = Math.min(1, army.navy + DRILL.gain)
  army.moved = true
  return true
}

/** 把一位将领调到同一方的另一支军队，最远隔一条路 */
export function transfer(s: State, gen: string, fromArmy: number, toArmy: number) {
  const a = s.armies.find((x) => x.id === fromArmy)
  const b = s.armies.find((x) => x.id === toArmy)
  if (!a || !b || a.side !== b.side || !a.generals.includes(gen)) return false
  if (a.at !== b.at && !routeBetween(a.at, b.at)) return false
  a.generals = a.generals.filter((g) => g !== gen)
  b.generals = [...b.generals, gen]
  return true
}

/** 到“打得下的敌城”还有几步；strength 是我方能拿去打的兵 */
function distToTargets(s: State, side: string, strength = Infinity) {
  const dist = new Map<string, number>()
  const q: string[] = []
  for (const p of places) {
    const o = s.owner[p.id]
    if (!o || o === side) continue
    const held = s.armies.filter((a) => a.at === p.id && a.side !== side).reduce((t, a) => t + a.troops, 0) + militia(p.id)
    if (held * 1.6 > strength) continue
    dist.set(p.id, 0)
    q.push(p.id)
  }
  while (q.length) {
    const c = q.shift()!
    for (const n of neighbors(c)) {
      if (n.route.kind === 'gorge' || dist.has(n.id) || !(n.id in s.owner)) continue
      dist.set(n.id, dist.get(c)! + 1)
      q.push(n.id)
    }
  }
  return dist
}

function aiTurn(s: State, side: string, level: 0 | 1 | 2, reports: Report[]) {
  const need = level === 2 ? 1.15 : level === 1 ? 1.35 : 2.2
  const calm = (s.calm?.[side] ?? 0) > s.turn
  const dist = distToTargets(s, side)
  const mine = s.armies.filter((a) => a.side === side)
  for (const a of mine) {
    if (!s.armies.includes(a) || a.moved || a.troops < 3) continue
    let best: { to: string; score: number; troops: number } | undefined
    const threatened = neighbors(a.at).some((n) => s.armies.some((x) => x.at === n.id && x.side !== side && x.troops > a.troops * 0.6))
    for (const n of neighbors(a.at)) {
      const owner = s.owner[n.id]
      if (owner === side) continue
      if (level === 0) continue
      if (calm && owner) continue
      const send = threatened && a.troops > 8 ? a.troops * 0.65 : a.troops
      const pv = preview(s, { army: a.id, to: n.id, troops: send, generals: a.generals })
      if (!pv.ok) continue
      const p = placeById.get(n.id)!
      let score = p.grain + (p.capital ? 5 : 0) + (owner === s.player ? 2 : 0)
      if (pv.kind === 'attack') {
        if (pv.odds < need) continue
        score += Math.min(3, pv.odds)
      } else score += 3
      if (!best || score > best.score) best = { to: n.id, score, troops: send }
    }
    if (best) {
      reports.push(...act(s, { army: a.id, to: best.to, troops: best.troops, generals: a.generals }))
      continue
    }
    const p = placeById.get(a.at)!
    if (p.port && a.navy < 0.7 && sideOf(side).home !== 'north' && drill(s, a)) continue
    if (level > 0 && !calm && a.troops >= 6 && !threatened) {
      const near = distToTargets(s, side, a.troops)
      const here = near.get(a.at) ?? 99
      if (here > 1 && here < 99) {
        const step = neighbors(a.at)
          .filter((n) => s.owner[n.id] === side && (near.get(n.id) ?? 99) < here)
          .filter((n) => n.route.kind !== 'river' || navyOf(a) >= 0.2)
          .filter((n) => n.route.kind !== 'gorge')[0]
        if (step) act(s, { army: a.id, to: step.id, troops: placeById.get(a.at)!.capital ? a.troops * 0.75 : a.troops, generals: a.generals })
      }
    }
  }
  const front = places
    .filter((p) => s.owner[p.id] === side && (dist.get(p.id) ?? 9) <= 1)
    .sort((x, y) => y.grain - x.grain)
    .slice(0, 2 + Math.floor((s.grain[side] ?? 0) / 80))
  for (const p of front) {
    if ((s.grain[side] ?? 0) < RECRUIT.cost + spendOf(s, side)) break
    recruit(s, side, p.id)
  }
}

function seasonEnd(s: State, reports: Report[]) {
  for (const side of new Set([s.player, ...Object.keys(s.ai)])) {
    const inc = incomeOf(s, side)
    const out = spendOf(s, side)
    s.grain[side] = (s.grain[side] ?? 0) + inc - out
    if (s.grain[side] < 0) {
      for (const a of s.armies.filter((x) => x.side === side)) a.troops *= 0.86
      if (side === s.player) reports.push({ side, kind: 'season', title: '断粮了', lines: ['粮仓空了，每支军队都有人逃走。', '少带点兵，或者多占几座产粮的城。'] })
      s.grain[side] = 0
    }
  }
  for (const a of s.armies) {
    const p = placeById.get(a.at)!
    const north = sideOf(a.side).home === 'north'
    if (north && p.zone === 'south') {
      a.sick += 1
      if (a.sick <= 5) {
        const loss = a.troops * (s.season === 1 || s.season === 2 ? 0.12 : 0.06)
        a.troops -= loss
        if (a.side === s.player && loss > 0.3)
          reports.push({ side: a.side, kind: 'season', title: `${p.name}闹疫病`, lines: [`北方来的兵水土不服，这一季病倒了 ${troopsText(loss)} 人。`], to: a.at })
      }
    } else a.sick = 0
  }
  s.armies = s.armies.filter((a) => a.troops > 0.3)
  for (const a of s.armies) a.moved = false
  s.recruited = []
  s.season = (s.season + 1) % 4
  if (s.season === 0) s.year += 1
  s.turn += 1
  for (const a of s.armies) {
    const lost = a.generals.filter((g) => goneGeneral(s, g))
    if (lost.length) {
      a.generals = a.generals.filter((g) => !lost.includes(g))
      for (const g of lost) reports.push({ side: a.side, kind: 'info', title: `${generalById.get(g)!.name}去世了`, lines: [`真实历史上，他死在 ${generalById.get(g)!.died} 年。`] })
    }
  }
}

export function endSeason(s: State): Report[] {
  const reports: Report[] = []
  for (const [side, level] of Object.entries(s.ai)) {
    if (!s.armies.some((a) => a.side === side)) continue
    aiTurn(s, side, level, reports)
  }
  seasonEnd(s, reports)
  return reports
}

export function cloneState(s: State): State {
  return structuredClone(s)
}
