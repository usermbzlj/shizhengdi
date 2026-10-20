import { cellById, cellIndex, cells, edgeBetween, isFrontier, isSouth, links, realOwners, RIVER_NAME, type Cell, type Edge } from './board'
import { FACTIONS, factionDef, factionOfReal, generalById, GENERALS, naturalEnd, TEMPER, type Fid } from './roster'
import { policyById, type Mod, type Policy } from './policies'
import { theatre } from './intents'
import { startById } from './starts'

// ---------- state ----------

export interface Army {
  id: number
  f: Fid
  at: string
  /** commanderies still to walk through */
  path: string[]
  /** km walked on the current border */
  prog: number
  troops: number
  cav: number
  navy: number
  org: number
  /** days of rations carried */
  food: number
  /** share of men sick */
  sick: number
  /** raised north of the Huai; southern fevers hit them */
  north: boolean
  gens: string[]
  drill: boolean
  siege: number
  /** still being raised: ready on this day */
  ready?: number
  /** guarding this depot */
  guard?: number
  /** days standing still on its own soil; after a few weeks the camp is dug in */
  dug?: number
  /** riding to burn this depot */
  raid?: number
  /** the raid has been spotted on the way */
  seen?: boolean
  /** standing order: attack, hold this city, or pin a neighbour */
  stance?: 'attack' | 'hold' | 'pin'
  /** civilians travelling with the army */
  folk?: number
  /** day a retreat through just-handed land began */
  flee?: number
  /** light horse eats no supply until this day; `raid === -2` while it rides */
  dashUntil?: number
  /** after a truce, may cross land no longer open to fighting, until this day */
  passUntil?: number
}

/** A field granary behind a big army: what 乌巢 was to 袁绍. */
export interface Depot {
  id: number
  f: Fid
  at: string
  /** 万斛 */
  stock: number
  /** sides that know where it is */
  known: Fid[]
  made: number
}

export interface Battle {
  id: number
  at: string
  att: Fid
  def: Fid | null
  /** border the attacker came across */
  from: string | null
  day: number
  start: number
  lossA: number
  lossD: number
  factors: Factor[]
  fire?: boolean
  wind?: boolean
}

export interface Factor {
  side: 'att' | 'def'
  text: string
  k: number
}

export interface CellState {
  owner: Fid | null
  pop: number
  order: number
  fort: number
  dev: number
  /** day it last changed hands */
  taken: number
}

export interface FactionState {
  id: Fid
  alive: boolean
  ruler: string
  capital: string | null
  grain: number
  manpower: number
  done: Record<string, number>
  cur: { id: string; left: number } | null
  title: 0 | 1 | 2
  /** last month's flows, 万斛 */
  income: number
  spend: number
}

export interface Rel {
  s: 'war' | 'peace' | 'ally'
  since: number
  truce: number
}

export interface GenState {
  f: Fid | null
  dead: number | null
  how?: 'natural' | 'battle' | 'history'
}

export type LogKind = 'battle' | 'capture' | 'death' | 'policy' | 'event' | 'war' | 'peace' | 'join' | 'real' | 'fall'

export interface LogEntry {
  t: number
  kind: LogKind
  text: string
  f?: Fid | null
  at?: string
  /** this is where your history leaves the real one */
  div?: string
  mine?: boolean
}

export type EndRule = { kind: 'year'; year: number } | { kind: 'death'; who: string } | { kind: 'unify' }

export interface Ending {
  why: 'year' | 'death' | 'unify' | 'annexed' | 'collapse'
  text: string
  t: number
}

export interface Pending {
  id: string
  title: string
  text: string
  choices: { id: string; label: string; hint?: string }[]
  data?: Record<string, string | number>
}

export interface State {
  v: 1
  start: string
  t0: number
  t: number
  player: Fid
  end: EndRule
  cells: CellState[]
  factions: Record<string, FactionState>
  armies: Army[]
  battles: Battle[]
  depots: Depot[]
  /** where today's wind comes from: 0 north, clockwise in eighths */
  wind: number
  gens: Record<string, GenState>
  rel: Record<string, Rel>
  log: LogEntry[]
  flags: Record<string, number>
  canals: [string, string, string][]
  seed: number
  nextId: number
  pending: Pending[]
  over: Ending | null
}

// ---------- small helpers ----------

export const DAYS_PER_YEAR = 360
export function yearOf(st: State, t = st.t) {
  return st.t0 + t / DAYS_PER_YEAR
}
export function monthOf(st: State, t = st.t) {
  const y = yearOf(st, t)
  return Math.floor((y - Math.floor(y)) * 12 + 1e-6) + 1
}
/** 0 spring … 3 winter */
export function seasonOf(st: State, t = st.t) {
  return Math.floor((monthOf(st, t) - 1) / 3)
}
export const SEASON_NAME = ['春', '夏', '秋', '冬']
const MONTH = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
export function dateText(st: State, t = st.t) {
  const y = yearOf(st, t)
  return `${Math.floor(y + 1e-6)} 年${MONTH[monthOf(st, t) - 1]}月`
}

export function rand(st: State) {
  st.seed = (st.seed + 0x6d2b79f5) | 0
  let r = Math.imul(st.seed ^ (st.seed >>> 15), 1 | st.seed)
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296
}

export function cs(st: State, id: string) {
  return st.cells[cellIndex.get(id)!]
}
export function ownerOf(st: State, id: string) {
  return cs(st, id).owner
}
export function relKey(a: Fid, b: Fid) {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}
export function relOf(st: State, a: Fid, b: Fid): Rel {
  return st.rel[relKey(a, b)] ?? { s: 'peace', since: 0, truce: 0 }
}
export function atWar(st: State, a: Fid | null, b: Fid | null) {
  if (!a || !b || a === b) return false
  return relOf(st, a, b).s === 'war'
}
export function allied(st: State, a: Fid, b: Fid) {
  return a === b || relOf(st, a, b).s === 'ally'
}
/** may an army of `f` enter commandery `id`? */
export function mayEnter(st: State, f: Fid, id: string) {
  const o = ownerOf(st, id)
  return o === null || o === f || atWar(st, f, o) || allied(st, f, o)
}

/** depot raids and the ride home slip past; a light-horse column fights on contact */
function slipping(a: Army) {
  return a.raid !== undefined && a.raid !== -2
}

export function marchMul(a: Army) {
  if (a.folk) return 0.3
  if (a.raid === -2) return 2.5
  if (a.raid !== undefined) return 1.5
  return 1
}

/** a cell handed over in the last 30 days, with no hostile army in it, is still walkable for a retreat */
function freshRoad(st: State, a: Army, id: string) {
  if (a.flee === undefined || st.t - a.flee > 30) return false
  const s = cs(st, id)
  if (st.t - s.taken > 30) return false
  return !st.armies.some((x) => x.at === id && x !== a && !x.ready && !slipping(x) && atWar(st, x.f, a.f))
}

export function mayPass(st: State, a: Army, id: string, dest?: string) {
  if (mayEnter(st, a.f, id) || freshRoad(st, a, id)) return true
  // a column sent home after peace may cross the other side until the grace runs out
  const goal = dest ?? a.path[a.path.length - 1]
  if (goal === undefined || a.passUntil === undefined || st.t > a.passUntil) return false
  const home = ownerOf(st, goal)
  if (home !== a.f && !(home && allied(st, a.f, home))) return false
  const o = ownerOf(st, id)
  return o !== null && !atWar(st, a.f, o)
}

export function ownedBy(st: State, f: Fid) {
  return cells.filter((_, i) => st.cells[i].owner === f)
}
export function armiesOf(st: State, f: Fid) {
  return st.armies.filter((a) => a.f === f)
}
export function troopsOf(st: State, f: Fid) {
  return armiesOf(st, f).reduce((s, a) => s + a.troops, 0)
}
export function popOf(st: State, f: Fid) {
  return cells.reduce((s, _, i) => s + (st.cells[i].owner === f ? st.cells[i].pop : 0), 0)
}
export function modOf(st: State, f: Fid, m: Mod) {
  let v = 0
  for (const id of Object.keys(st.factions[f]?.done ?? {})) v += policyById.get(id)?.mods[m] ?? 0
  return v
}
export function factionLabel(st: State, f: Fid | null) {
  if (!f) return '无主'
  const fs = st.factions[f]
  const d = factionDef.get(f)!
  if (fs?.title === 2) return d.state
  if (fs?.title === 1) return `${generalById.get(fs.ruler)?.name ?? ''}`.slice(0, 1) + '王'
  return generalById.get(fs?.ruler ?? d.heirs[0])?.name ?? d.state
}
export function factionColor(f: Fid | null) {
  return f ? factionDef.get(f)!.color : '#6b665c'
}
export function genName(id: string) {
  return generalById.get(id)?.name ?? id
}
export function commander(a: Army) {
  return a.gens.map((g) => generalById.get(g)!).filter(Boolean).sort((x, y) => y.lead - x.lead)[0] ?? null
}
export function temperOf(a: Army) {
  const id = commander(a)?.id
  return id ? TEMPER[id] : undefined
}
export function hasTrait(a: Army, t: string) {
  return a.gens.some((g) => generalById.get(g)?.traits.includes(t as never))
}

export function log(st: State, e: Omit<LogEntry, 't'>) {
  st.log.push({ t: st.t, ...e })
  if (st.log.length > 600) st.log.splice(0, st.log.length - 600)
}

// ---------- setup ----------

/** People left in 200 compared with the 140 census: the north was ravaged, the south and Shu much less. */
function survivors(c: Cell, year: number) {
  const k = Math.min(1, Math.max(0, (year - 184) / 30))
  const hit = c.province === '司隶' ? 0.72 : ['豫州', '兖州', '徐州', '青州', '冀州'].includes(c.province) ? 0.55 : ['凉州', '并州', '幽州'].includes(c.province) ? 0.5 : c.province === '益州' ? 0.15 : 0.3
  return 1 - hit * k
}

export function newGame(startId: string, player: Fid, end: EndRule, seed = Date.now() >>> 0): State {
  const sd = startById.get(startId)!
  const real = realOwners(sd.t0)
  const st: State = {
    v: 1,
    start: sd.id,
    t0: sd.t0,
    t: 0,
    player,
    end,
    cells: [],
    factions: {},
    armies: [],
    battles: [],
    depots: [],
    wind: 7,
    gens: {},
    rel: {},
    log: [],
    flags: {},
    canals: [],
    seed,
    nextId: 1,
    pending: [],
    over: null,
  }
  cells.forEach((c, i) => {
    const f = factionOfReal(real.f[i])
    const weak = real.s[i] === 'lost' || real.s[i] === 'weak'
    st.cells.push({
      owner: f,
      pop: Math.round(c.pop140 * survivors(c, sd.t0)),
      order: f ? (weak ? 0.55 : 0.75) : 0.4,
      fort: 0,
      dev: 0,
      taken: -999,
    })
  })
  for (const d of FACTIONS) {
    const mine = ownedBy(st, d.id)
    const guest = sd.guests?.find((x) => x[0] === d.id)
    const ruler = d.heirs.find((h) => {
      const g = generalById.get(h)!
      return g.born + 14 <= sd.t0 && g.died > sd.t0
    })
    const alive = !!ruler && (mine.length > 0 || !!guest)
    const capital = mine.length ? [...mine].sort((a, b) => cs(st, b.id).pop - cs(st, a.id).pop)[0].id : null
    st.factions[d.id] = {
      id: d.id,
      alive,
      ruler: ruler ?? d.heirs[0],
      capital,
      grain: 0,
      manpower: 0,
      done: {},
      cur: null,
      title: 0,
      income: 0,
      spend: 0,
    }
    if (!alive) for (const c of mine) cs(st, c.id).owner = null
  }
  // capitals the AI shouldn't get wrong
  const fixed: Partial<Record<Fid, string>> = { cao: sd.t0 < 213 ? '颍川' : '魏郡', yuan: '魏郡', sun: sd.t0 < 212 ? '吴郡' : '丹阳', liubiao: '南郡', liuzhang: '蜀郡', zhanglu: '汉中郡', liubei: '蜀郡' }
  for (const [f, c] of Object.entries(fixed) as [Fid, string][]) {
    const fs = st.factions[f]
    if (fs.alive && ownerOf(st, c) === f) fs.capital = c
  }
  if (sd.t0 >= 220) {
    st.factions.cao.title = 2
    st.factions.liubei.title = st.factions.liubei.alive ? 1 : 0
    st.factions.sun.title = 1
  }
  for (const fs of Object.values(st.factions)) {
    if (!fs.alive || !fs.capital) continue
    cs(st, fs.capital).fort = 2
    // 阳平关 in front of Hanzhong
    if (ownerOf(st, '汉中郡')) cs(st, '汉中郡').fort = 3
    const pop = popOf(st, fs.id)
    fs.grain = Math.round((pop / 10000) * 0.6)
    fs.manpower = Math.round(pop * 0.006)
  }
  for (const [a, b] of sd.wars) if (st.factions[a].alive && st.factions[b].alive) st.rel[relKey(a, b)] = { s: 'war', since: 0, truce: 0 }
  for (const [a, b] of sd.allies) if (st.factions[a].alive && st.factions[b].alive) st.rel[relKey(a, b)] = { s: 'ally', since: 0, truce: 0 }

  // generals
  for (const g of GENERALS) {
    if (g.born + 15 > sd.t0 && !g.serve.some(([from]) => from <= sd.t0)) {
      st.gens[g.id] = { f: null, dead: null }
      continue
    }
    if (g.died <= sd.t0) {
      st.gens[g.id] = { f: null, dead: g.died, how: 'history' }
      continue
    }
    const now = [...g.serve].reverse().find(([from]) => from <= sd.t0)
    const f = now?.[1] ?? null
    st.gens[g.id] = { f: f && st.factions[f]?.alive ? f : null, dead: null }
  }

  // armies: a third of the men under arms, spread over the bigger commanderies
  for (const fs of Object.values(st.factions)) {
    if (!fs.alive) continue
    const mine = ownedBy(st, fs.id).sort((a, b) => cs(st, b.id).pop - cs(st, a.id).pop)
    // the record only gives round numbers; every game the rivals turn out a little stronger or weaker
    const luck = fs.id === player ? 1 : 0.88 + rand(st) * 0.24
    fs.grain = Math.round(fs.grain * (fs.id === player ? 1 : 0.85 + rand(st) * 0.3))
    const total = Math.round(popOf(st, fs.id) * 0.012 * (sd.muster?.[fs.id] ?? 1) * luck)
    const spots = mine.slice(0, Math.max(1, Math.min(4, Math.round(mine.length / 3))))
    const gens = GENERALS.filter((g) => st.gens[g.id].f === fs.id).sort((a, b) => b.lead - a.lead).map((g) => g.id)
    spots.forEach((c, i) => {
      const share = i === 0 ? 0.4 : 0.6 / Math.max(1, spots.length - 1)
      const troops = Math.max(3000, Math.round((total * (spots.length === 1 ? 1 : share)) / 1000) * 1000)
      const a = raise(st, fs.id, c.id, troops)
      const n = i === 0 ? 3 : 2
      a.gens = gens.splice(0, n)
    })
    // everyone left waits in the capital
    if (gens.length && fs.capital) {
      const home = st.armies.find((a) => a.f === fs.id && a.at === fs.capital)
      if (home) home.gens.push(...gens.splice(0, 2))
    }
  }
  for (const [f, at, troops, gens] of sd.guests ?? []) {
    if (!st.factions[f].alive) continue
    const a = raise(st, f, at, troops)
    a.gens = gens.filter((g) => st.gens[g] && !st.gens[g].dead)
    for (const g of a.gens) st.gens[g].f = f
    a.cav = 0.15
    a.food = 90
    st.factions[f].grain = 30
    st.factions[f].manpower = 3000
  }
  // a general can only be in one army
  const seen = new Set<string>()
  for (const a of st.armies) a.gens = a.gens.filter((g) => (seen.has(g) ? false : (seen.add(g), true)))

  // AI calm and history ghosts
  st.flags.calm = sd.calm
  log(st, { kind: 'event', text: sd.text })
  return st
}

export function raise(st: State, f: Fid, at: string, troops: number): Army {
  const c = cellById.get(at)!
  const a: Army = {
    id: st.nextId++,
    f,
    at,
    path: [],
    prog: 0,
    troops,
    cav: isFrontier(c) ? 0.45 : isSouth(c) ? 0.04 : 0.18,
    navy: c.boats.some((b) => ['Chang Jiang', 'Han'].includes(b)) && isSouth(c) ? 0.3 : 0,
    org: 0.9,
    food: 30,
    sick: 0,
    north: !isSouth(c),
    gens: [],
    drill: false,
    siege: 0,
  }
  st.armies.push(a)
  return a
}

// ---------- movement ----------

/** Is this border a waterway for boats (river, or a canal you dug)? */
export function waterway(st: State, e: Edge) {
  if (e.water.length) return e.water[0]
  const c = st.canals.find(([a, b]) => (a === e.a && b === e.b) || (a === e.b && b === e.a))
  return c ? c[2] : null
}

export function kmPerDay(st: State, a: Army, e: Edge, to: string) {
  const c = cellById.get(to)!
  const season = seasonOf(st)
  let v = 26
  const by = waterway(st, e)
  if (by && a.navy >= 0.2) {
    const down = cellById.get(e.a === to ? e.b : e.a)!.seatElev > c.seatElev
    v = down ? 55 : 24
  } else {
    if (c.terrain === 'hills') v *= 0.8
    if (c.terrain === 'mountain') v *= 0.55
    if (c.terrain === 'plateau') v *= 0.5
    if (e.climb > 900) v *= 0.75
    if (season === 3 && !isSouth(c)) v *= 0.85
    if (season === 1 && isSouth(c)) v *= 0.9
    if (a.cav > 0.35) v *= 1.15
    if (hasTrait(a, 'raid')) v *= 1.15
    if (hasTrait(a, 'mountain') && c.terrain !== 'plain') v *= 1.2
  }
  return v
}

/** Extra km for getting across a river without a waterway: finding boats, rafts, a ford. */
export function crossingKm(st: State, a: Army, e: Edge) {
  if (!e.cross.length) return 0
  if (waterway(st, e) && a.navy >= 0.2) return 0
  return e.cross.includes('jiang') ? 90 : 45
}

export function canCross(a: Army, e: Edge) {
  return !e.cross.includes('jiang') || a.navy >= 0.2
}

/** Dijkstra in days. Returns cells after `from`, ending at `to`. */
export function findPath(st: State, a: Army, to: string): { path: string[]; days: number; why?: string } | null {
  if (a.at === to) return { path: [], days: 0 }
  const dist = new Map<string, number>([[a.at, 0]])
  const prev = new Map<string, string>()
  const open = new Set([a.at])
  let blocked: string | undefined
  while (open.size) {
    let cur = ''
    let best = Infinity
    for (const id of open)
      if (dist.get(id)! < best) {
        best = dist.get(id)!
        cur = id
      }
    open.delete(cur)
    if (cur === to) break
    // stop in the first enemy or unowned commandery; do not plan a road through it
    if (cur !== a.at) {
      const o = ownerOf(st, cur)
      if ((o === null || atWar(st, a.f, o)) && !freshRoad(st, a, cur)) continue
    }
    for (const { to: nb, e } of links(cur)) {
      if (!mayPass(st, a, nb, to)) continue
      if (!canCross(a, e)) {
        blocked = `要渡${RIVER_NAME.jiang}，得先有水军`
        continue
      }
      const d = best + (e.km + crossingKm(st, a, e)) / (kmPerDay(st, a, e, nb) * marchMul(a))
      if (d < (dist.get(nb) ?? Infinity)) {
        dist.set(nb, d)
        prev.set(nb, cur)
        open.add(nb)
      }
    }
  }
  if (!dist.has(to)) return blocked ? { path: [], days: Infinity, why: blocked } : null
  const path: string[] = []
  for (let x = to; x !== a.at; x = prev.get(x)!) path.unshift(x)
  return { path, days: dist.get(to)! }
}

function foeAt(st: State, a: Army, to: string) {
  const o = ownerOf(st, to)
  const men = st.armies.filter((x) => x.at === to && !x.ready && x.raid === undefined && atWar(st, x.f, a.f)).reduce((s, x) => s + x.troops, 0)
  const walls = o === null || atWar(st, a.f, o) ? garrisonOf(st, to) : 0
  return men + walls
}

/** pin only steps onto an adjacent cell whose defenders are under half its own men */
function pinOk(st: State, a: Army, to: string) {
  if (!edgeBetween(a.at, to)) return false
  const o = ownerOf(st, to)
  if (o === a.f || (o && !atWar(st, a.f, o))) return false
  return foeAt(st, a, to) < a.troops * 0.5
}

export function stanceBlock(st: State, armyId: number, stance: 'attack' | 'hold' | 'pin'): string | null {
  const a = st.armies.find((x) => x.id === armyId)
  if (!a) return '没有这支军队'
  if (a.ready) return '这支军队还在集结'
  if (a.raid !== undefined) return '奔袭半道上，换不了将令'
  if (inBattle(st, a)) return '正在交战，将令传不进去'
  if (stance === 'hold') {
    const o = ownerOf(st, a.at)
    if (o !== a.f && !(o && allied(st, a.f, o))) return '要固守，得在自己或盟友的城里'
  }
  if (stance === 'pin' && !links(a.at).some((l) => {
    const o = ownerOf(st, l.to)
    return o !== a.f && (o === null || atWar(st, a.f, o))
  })) return '旁边没有敌军，谈不上牵制'
  return null
}

export function setStance(st: State, armyId: number, stance: 'attack' | 'hold' | 'pin') {
  if (stanceBlock(st, armyId, stance)) return false
  const a = st.armies.find((x) => x.id === armyId)!
  a.stance = stance
  if (stance !== 'attack') {
    a.path = []
    a.prog = 0
  }
  return true
}

export function order(st: State, armyId: number, to: string) {
  const a = st.armies.find((x) => x.id === armyId)
  if (!a || a.ready) return false
  if (inBattle(st, a)) return false
  if (a.stance === 'hold') return false
  if (a.stance === 'pin' && !pinOk(st, a, to)) return false
  const p = findPath(st, a, to)
  if (!p || !p.path.length) return false
  a.path = p.path
  a.prog = 0
  a.siege = 0
  return true
}

export function carryBlock(st: State, armyId: number, on: boolean): string | null {
  const a = st.armies.find((x) => x.id === armyId)
  if (!a) return '没有这支军队'
  if (a.ready) return '这支军队还在集结'
  if (inBattle(st, a)) return '正在交战'
  if (a.raid !== undefined) return '奔袭半道上，带不了百姓'
  if (on) {
    if (a.folk) return '已经带着百姓'
    if (cs(st, a.at).pop * 0.12 < 1000) return '这里的百姓不多'
  } else if (!a.folk) return '没有带着百姓'
  return null
}

export function setCarry(st: State, armyId: number, on: boolean) {
  if (carryBlock(st, armyId, on)) return false
  const a = st.armies.find((x) => x.id === armyId)!
  const name = commander(a)?.name ?? factionLabel(st, a.f)
  const mine = a.f === st.player
  if (!on) {
    cs(st, a.at).pop += a.folk!
    log(st, { kind: 'event', f: a.f, at: a.at, text: `${name}让百姓留在${a.at}，自己轻装赶路。`, mine })
    delete a.folk
    return true
  }
  const n = Math.min(Math.round(cs(st, a.at).pop * 0.12), 120000)
  cs(st, a.at).pop -= n
  a.folk = n
  a.dug = 0
  st.flags['n:carry'] = (st.flags['n:carry'] ?? 0) + 1
  const dest = a.path.at(-1)
  log(st, { kind: 'event', f: a.f, at: a.at, text: `${name}带着${wan(n)}百姓离开${a.at}${dest ? `，往${dest}去` : ''}，一天走不了多远。`, mine })
  return true
}

/** Order a real retreat. Teleport only when no safe cell can be reached. */
export function fleeArmy(st: State, a: Army) {
  a.flee = st.t
  delete a.stance
  let best: { id: string; days: number } | null = null
  for (const c of cells) {
    const o = ownerOf(st, c.id)
    if (o !== a.f && !(o && allied(st, a.f, o))) continue
    if (c.id === a.at) continue
    const p = findPath(st, a, c.id)
    if (!p?.path.length || !Number.isFinite(p.days)) continue
    if (!best || p.days < best.days) best = { id: c.id, days: p.days }
  }
  if (best && order(st, a.id, best.id)) return true
  const safe = links(a.at)
    .map((l) => l.to)
    .filter((n) => {
      const o = ownerOf(st, n)
      return o === a.f || (o !== null && allied(st, a.f, o))
    })
    .sort((x, y) => Number(ownerOf(st, y) === a.f) - Number(ownerOf(st, x) === a.f))[0]
  if (safe) {
    a.at = safe
    a.path = []
    a.prog = 0
    a.troops *= 0.8
    return true
  }
  a.troops = 0
  return false
}

export function inBattle(st: State, a: Army) {
  return st.battles.some((b) => b.at === a.at && (b.att === a.f || b.def === a.f))
}

// ---------- supply ----------

/** Cost of moving one 斛 over a border, in 斛 eaten on the way. */
function haulCost(st: State, f: Fid, e: Edge, to: string) {
  const c = cellById.get(to)!
  if (waterway(st, e)) return e.km / 1400
  let k = e.km / 260
  const hard = c.terrain === 'mountain' || c.terrain === 'plateau' || e.climb > 800
  if (hard) k *= 2.2 * (1 - modOf(st, f, 'mountainSupply'))
  else if (c.terrain === 'hills') k *= 1.3
  return k
}

export interface Supply {
  /** extra 斛 eaten per 斛 that arrives */
  cost: number
  ok: boolean
  /** source commandery */
  from: string | null
}

const supplyCache = new WeakMap<State, { t: number; map: Map<string, Supply>[] }>()

/** Supply cost from the nearest granary (capital or a big commandery) to every commandery. */
export function supplyMap(st: State, f: Fid): Map<string, Supply> {
  let cache = supplyCache.get(st)
  if (!cache || cache.t !== st.t) {
    cache = { t: st.t, map: [] }
    supplyCache.set(st, cache)
  }
  const idx = FACTIONS.findIndex((x) => x.id === f)
  if (cache.map[idx]) return cache.map[idx]
  const fs = st.factions[f]
  const own = (id: string) => {
    const o = ownerOf(st, id)
    return o === f || (o !== null && allied(st, f, o))
  }
  const dist = new Map<string, Supply>()
  const open: string[] = []
  for (const c of cells) {
    const s = cs(st, c.id)
    if (s.owner !== f) continue
    if (c.id === fs.capital || (s.pop > 250000 && s.order > 0.5)) {
      dist.set(c.id, { cost: 0, ok: true, from: c.id })
      open.push(c.id)
    }
  }
  // landless lords live off an ally's granaries
  if (!open.length) {
    for (const c of cells) {
      const o = ownerOf(st, c.id)
      if (o && o !== f && allied(st, f, o) && cs(st, c.id).pop > 200000) {
        dist.set(c.id, { cost: 0.3, ok: true, from: c.id })
        open.push(c.id)
      }
    }
  }
  while (open.length) {
    open.sort((x, y) => dist.get(y)!.cost - dist.get(x)!.cost)
    const cur = open.pop()!
    const d = dist.get(cur)!
    if (!own(cur)) continue
    for (const { to, e } of links(cur)) {
      const nd = d.cost + haulCost(st, f, e, to)
      if (nd < (dist.get(to)?.cost ?? Infinity)) {
        dist.set(to, { cost: nd, ok: true, from: d.from })
        open.push(to)
      }
    }
  }
  cache.map[idx] = dist
  return dist
}

export function supplyOf(st: State, a: Army): Supply {
  return supplyMap(st, a.f).get(a.at) ?? { cost: Infinity, ok: false, from: null }
}

/** Rations per man per month, 斛: 《汉书·赵充国传》 has a soldier eating 2.6–3.3 斛 a month. */
export const RATION = 3

// ---------- economy ----------

const YIELD: Record<string, number> = { plain: 1, hills: 0.8, mountain: 0.55, plateau: 0.3 }

function harvest(c: Cell, month: number) {
  if (isSouth(c)) return month >= 7 && month <= 9 ? 2.4 : 0.55
  if (month === 5 || month === 6) return 1.5
  if (month === 8 || month === 9) return 2.0
  return 0.55
}

/** Grain a commandery hands over in a month, 万斛. */
export function cellIncome(st: State, i: number, month = monthOf(st)) {
  const s = st.cells[i]
  if (!s.owner) return 0
  const c = cells[i]
  let k = 1 + modOf(st, s.owner, 'grain')
  if (st.factions[s.owner].done.tuntian && c.terrain === 'plain' && ['司隶', '豫州', '兖州', '冀州', '徐州'].includes(c.province)) k += 0.15
  return (s.pop * 0.12 * YIELD[c.terrain] * s.order * harvest(c, month) * k) / 10000
}

export function incomeOf(st: State, f: Fid, month = monthOf(st)) {
  let v = 0
  st.cells.forEach((s, i) => {
    if (s.owner === f) v += cellIncome(st, i, month)
  })
  return v
}
export function yearIncome(st: State, f: Fid) {
  let v = 0
  for (let m = 1; m <= 12; m++) v += incomeOf(st, f, m)
  return v
}

/** What the armies eat in a month, delivered, 万斛. A closed supply line is not charged: those men eat what they carry. */
export function upkeepOf(st: State, f: Fid) {
  let v = 0
  for (const a of armiesOf(st, f)) {
    const s = supplyOf(st, a)
    if (!s.ok) continue
    const k = hasTrait(a, 'supply') ? 0.8 : 1
    v += ((a.troops * RATION) / 10000) * k * (1 + Math.min(s.cost, 4))
  }
  return v
}

// ---------- policies ----------

export function policyBlock(st: State, f: Fid, p: Policy): string | null {
  const fs = st.factions[f]
  if (fs.done[p.id] !== undefined) return '已经完成'
  if (p.who.length && !p.who.includes(f)) return '不是你的路'
  for (const n of p.needs ?? []) if (fs.done[n] === undefined) return `先要完成「${policyById.get(n)!.name}」`
  for (const h of p.hold ?? []) if (ownerOf(st, h) !== f) return `需要占有${h}`
  if (p.size && ownedBy(st, f).length < p.size) return `需要至少 ${p.size} 个郡`
  if (p.with && st.gens[p.with]?.f !== f) return `需要${genName(p.with)}在你帐下`
  if (p.title && fs.title >= p.title) return '已经完成'
  if (p.title === 1 && f === 'cao' && fs.done.weigong === undefined) return '先要进爵魏公'
  if (p.title === 2 && f === 'cao' && ownerOf(st, '颍川') !== 'cao') return '天子在许县（颍川），要先控制那里'
  if (fs.grain < p.cost) return `粮食不够（要 ${p.cost} 万斛）`
  return null
}

export function startPolicy(st: State, f: Fid, id: string) {
  const p = policyById.get(id)!
  const fs = st.factions[f]
  if (fs.cur || policyBlock(st, f, p)) return false
  fs.grain -= p.cost
  fs.cur = { id, left: p.days }
  return true
}

function finishPolicy(st: State, f: Fid, p: Policy) {
  const fs = st.factions[f]
  fs.done[p.id] = st.t
  fs.cur = null
  if (p.title) fs.title = p.title
  if (p.canal) for (const c of p.canal) if (edgeBetween(c[0], c[1])) st.canals.push(c)
  const y = Math.floor(yearOf(st))
  let div: string | undefined
  const real = p.history?.years[f]
  if (real !== undefined && Math.abs(y - real) >= 2) div = `比历史上${y < real ? '早' : '晚'}了 ${Math.abs(y - real)} 年（历史上是 ${real} 年）。`
  else if (p.history && real === undefined && p.who.length === 1) div = `历史上只有${genName(factionDef.get(p.who[0])!.heirs[0])}一方做过这件事。`
  // claiming a throne while the Han emperor still sits in Xu
  const han = !st.factions.cao.alive ? false : st.factions.cao.title < 2
  if (p.title && han && !(f === 'cao' && p.title === 2)) {
    for (const c of ownedBy(st, f)) cs(st, c.id).order = Math.max(0.2, cs(st, c.id).order - (p.title === 2 ? 0.15 : 0.06))
  }
  log(st, { kind: 'policy', f, text: `${factionLabel(st, f)}完成「${p.name}」。`, div, mine: f === st.player })
  if (p.title === 2 && han && f !== 'cao') {
    for (const o of FACTIONS) {
      if (o.id === f || !st.factions[o.id].alive || allied(st, f, o.id)) continue
      if (relOf(st, f, o.id).s !== 'war') setRel(st, o.id, f, 'war', `${factionLabel(st, o.id)}讨伐僭越称帝的${factionLabel(st, f)}。`)
    }
  }
}

// ---------- recruiting ----------

export const LEVY = 5000
export function recruitBlock(st: State, f: Fid, at: string) {
  const s = cs(st, at)
  const fs = st.factions[f]
  if (s.owner !== f) return '只能在自己的郡招兵'
  if (st.armies.some((a) => a.f === f && a.at === at && a.ready)) return '这里正在招兵'
  if (fs.manpower < LEVY) return '没有可征的壮丁了'
  if (fs.grain < 3) return '粮食不够'
  if (s.pop < 40000) return '这里人太少'
  return null
}
export function recruit(st: State, f: Fid, at: string) {
  if (recruitBlock(st, f, at)) return null
  const fs = st.factions[f]
  fs.manpower -= LEVY
  fs.grain -= 3
  const s = cs(st, at)
  s.pop -= LEVY
  s.order = Math.max(0.2, s.order - 0.02)
  const a = raise(st, f, at, LEVY)
  a.org = 0.5
  a.ready = st.t + 45
  if (st.factions[f].done.qianghu && isFrontier(cellById.get(at)!)) a.cav = Math.min(0.7, a.cav + 0.15)
  return a
}

// ---------- generals ----------

export function idleGenerals(st: State, f: Fid) {
  const busy = new Set(st.armies.flatMap((a) => a.gens))
  return GENERALS.filter((g) => st.gens[g.id]?.f === f && !st.gens[g.id].dead && !busy.has(g.id))
}

export function assign(st: State, armyId: number, gen: string) {
  const a = st.armies.find((x) => x.id === armyId)
  if (!a || st.gens[gen]?.f !== a.f || st.gens[gen].dead) return false
  for (const b of st.armies) b.gens = b.gens.filter((x) => x !== gen)
  a.gens.push(gen)
  if (a.gens.length > 3) a.gens.shift()
  return true
}
export function unassign(st: State, armyId: number, gen: string) {
  const a = st.armies.find((x) => x.id === armyId)
  if (!a) return
  a.gens = a.gens.filter((x) => x !== gen)
}

export function killGeneral(st: State, id: string, how: GenState['how'], text: string) {
  const gs = st.gens[id]
  if (!gs || gs.dead) return
  const g = generalById.get(id)!
  gs.dead = st.t
  gs.how = how
  for (const a of st.armies) a.gens = a.gens.filter((x) => x !== id)
  const y = yearOf(st)
  let div: string | undefined
  if (how === 'battle' && y < g.died - 0.5) div = `历史上${g.name}死于 ${Math.floor(g.died)} 年。`
  if (how === 'natural' && g.killed && y > g.died + 1) div = `历史上${g.name}在 ${Math.floor(g.died)} 年就死了：${g.line}`
  log(st, { kind: 'death', f: gs.f, text, div, mine: gs.f === st.player })
  for (const fs of Object.values(st.factions)) if (fs.alive && fs.ruler === id) succeed(st, fs.id)
}

function succeed(st: State, f: Fid) {
  const d = factionDef.get(f)!
  const fs = st.factions[f]
  const heir = d.heirs.find((h) => !st.gens[h]?.dead && st.gens[h]?.f === f && h !== fs.ruler)
    ?? d.heirs.find((h) => !st.gens[h]?.dead && h !== fs.ruler && generalById.get(h)!.born + 12 < yearOf(st))
    // no son: the officers raise the ablest of them
    ?? GENERALS.filter((g) => st.gens[g.id]?.f === f && !st.gens[g.id].dead && g.id !== fs.ruler).sort((a, b) => b.lead - a.lead)[0]?.id
  if (!heir) {
    collapse(st, f, `${factionLabel(st, f)}后继无人，部众四散。`)
    return
  }
  fs.ruler = heir
  st.gens[heir].f = f
  for (const c of ownedBy(st, f)) cs(st, c.id).order = Math.max(0.2, cs(st, c.id).order - 0.08)
  log(st, { kind: 'event', f, text: `${genName(heir)}继位。`, mine: f === st.player })
}

export function collapse(st: State, f: Fid, text: string) {
  const fs = st.factions[f]
  if (!fs.alive) return
  fs.alive = false
  for (const c of ownedBy(st, f)) cs(st, c.id).owner = null
  st.armies = st.armies.filter((a) => a.f !== f)
  st.battles = st.battles.filter((b) => b.att !== f && b.def !== f)
  for (const g of Object.values(st.gens)) if (g.f === f) g.f = null
  for (const k of Object.keys(st.rel)) if (k.split('|').includes(f)) delete st.rel[k]
  const realFate = factionDef.get(f)!.fate
  log(st, { kind: 'fall', f, text, div: `真实的历史：${realFate}`, mine: f === st.player })
}

// ---------- diplomacy ----------

export function setRel(st: State, a: Fid, b: Fid, s: Rel['s'], why?: string) {
  const prev = relOf(st, a, b).s
  st.rel[relKey(a, b)] = { s, since: st.t, truce: s === 'peace' && prev === 'war' ? st.t + 360 : 0 }
  const kind: LogKind = s === 'war' ? 'war' : 'peace'
  const verb = s === 'war' ? '开战' : s === 'ally' ? '结盟' : '议和'
  log(st, { kind, text: why ?? `${factionLabel(st, a)}与${factionLabel(st, b)}${verb}。`, mine: a === st.player || b === st.player })
  if (s === 'war') {
    for (const x of st.armies) if ((x.f === a && ownerOf(st, x.at) === b) || (x.f === b && ownerOf(st, x.at) === a)) x.siege = 0
  }
  if (s !== 'war') {
    // armies standing in the other's land walk home
    for (const x of st.armies) {
      const o = ownerOf(st, x.at)
      if ((x.f === a && o === b) || (x.f === b && o === a)) {
        if (s === 'peace') sendHome(st, x)
      }
    }
    st.battles = st.battles.filter((bt) => !((bt.att === a && bt.def === b) || (bt.att === b && bt.def === a)))
  }
}

function sendHome(st: State, a: Army) {
  const fs = st.factions[a.f]
  const home = fs.capital ?? ownedBy(st, a.f)[0]?.id
  if (!home || home === a.at) return
  a.passUntil = st.t + 360
  delete a.stance
  delete a.raid
  delete a.seen
  delete a.dashUntil
  const p = findPath(st, a, home)
  if (p?.path.length) {
    a.path = p.path
    a.prog = 0
  }
}

/** Rough strength: men under arms plus what the land could still raise. */
export function power(st: State, f: Fid) {
  return troopsOf(st, f) + st.factions[f].manpower * 0.5 + popOf(st, f) * 0.004
}

// ---------- combat ----------

function battleAt(st: State, at: string) {
  return st.battles.find((b) => b.at === at)
}

function sideArmies(st: State, b: Battle, side: 'att' | 'def') {
  const f = side === 'att' ? b.att : b.def
  const foe = side === 'att' ? b.def : b.att
  if (!f) return []
  return st.armies.filter((a) => a.at === b.at && !a.ready && !slipping(a) && (a.f === f || (allied(st, a.f, f) && (!foe || atWar(st, a.f, foe)))))
}

/** Local militia behind the walls, men. */
export function garrisonOf(st: State, id: string) {
  const s = cs(st, id)
  if (!s.owner) return Math.min(4000, s.pop * 0.004)
  return Math.min(14000, s.pop * 0.008 + 1500) * (0.5 + s.order / 2) * (1 + s.fort * 0.4)
}

function noteCatch(st: State, at: string) {
  const here = st.armies.filter((a) => a.at === at)
  if (!here.some((a) => a.folk) || !here.some((a) => a.raid === -2)) return
  st.flags['n:catch'] = (st.flags['n:catch'] ?? 0) + 1
  const col = here.find((a) => a.raid === -2)!
  const folk = here.find((a) => a.folk)!
  const name = commander(col)?.name ?? factionLabel(st, col.f)
  log(st, { kind: 'battle', f: col.f, at, text: `${name}的轻骑在${at}追上了带着百姓的队伍。`, mine: col.f === st.player || folk.f === st.player })
}

function settleFolk(st: State, a: Army) {
  if (!a.folk) return
  const o = ownerOf(st, a.at)
  if (o !== a.f && !(o && allied(st, a.f, o))) return
  const cell = cs(st, a.at)
  cell.pop += a.folk
  cell.order = Math.min(1, cell.order + 0.1)
  a.food = Math.max(a.food, 60)
  const name = commander(a)?.name ?? factionLabel(st, a.f)
  log(st, { kind: 'event', f: a.f, at: a.at, text: `${name}把${wan(a.folk)}百姓安置在${a.at}。`, mine: a.f === st.player })
  delete a.folk
  st.flags['n:folkok'] = (st.flags['n:folkok'] ?? 0) + 1
}

export function startBattle(st: State, a: Army, def: Fid | null, from: string | null) {
  const ex = battleAt(st, a.at)
  if (ex) return ex
  const b: Battle = { id: st.nextId++, at: a.at, att: a.f, def, from, day: 0, start: st.t, lossA: 0, lossD: 0, factors: [] }
  st.battles.push(b)
  noteCatch(st, a.at)
  return b
}

/** a camp dug in: three weeks, or ten days under a cautious commander */
function entrenched(arms: Army[]) {
  const dug = (a: Army) => (a.dug ?? 0) >= (temperOf(a) === 'cautious' ? 10 : 20)
  const men = arms.reduce((s, a) => s + a.troops, 0)
  return men > 0 && arms.filter(dug).reduce((s, a) => s + a.troops, 0) >= men / 2
}

function sidePower(st: State, b: Battle, side: 'att' | 'def', arms: Army[]) {
  const c = cellById.get(b.at)!
  const e = b.from ? edgeBetween(b.from, b.at) : undefined
  const season = seasonOf(st)
  const factors: Factor[] = []
  let base = 0
  for (const a of arms) base += a.troops * (0.45 + a.org * 0.55) * (1 - a.sick * 0.6) * (a.food <= 0 ? 0.65 : 1)
  if (!arms.length && side === 'def') base = garrisonOf(st, b.at) * 0.8
  const lead = arms.map(commander).filter(Boolean).sort((x, y) => y!.lead - x!.lead)[0]
  let k = 1
  const add = (text: string, m: number) => {
    if (Math.abs(m - 1) < 0.02) return
    k *= m
    factors.push({ side, text, k: m })
  }
  if (lead) add(`${lead.name}统兵`, 1 + (lead.lead - 5) * 0.06)
  if (arms.some((a) => a.folk)) add('百姓拖在军中', 0.6)
  if (b.day < 5 && arms.some((a) => temperOf(a) === 'rash')) add('锐气', 1.08)
  const cav = arms.reduce((s, a) => s + a.cav * a.troops, 0) / Math.max(1, arms.reduce((s, a) => s + a.troops, 0))
  if (c.terrain === 'plain' && cav > 0.15) add('平原上骑兵冲得开', 1 + cav * 0.6)
  if ((c.terrain === 'mountain' || c.terrain === 'plateau') && cav > 0.3) add('山地里骑兵施展不开', 1 - cav * 0.35)
  const hunger = arms.some((a) => a.food <= 0)
  if (hunger) factors.push({ side, text: '断粮，士兵挨饿', k: 0.65 })
  const sick = arms.reduce((s, a) => s + a.sick * a.troops, 0) / Math.max(1, arms.reduce((s, a) => s + a.troops, 0))
  if (sick > 0.08) factors.push({ side, text: `军中疫病，${Math.round(sick * 100)}% 的人病倒`, k: 1 - sick * 0.6 })
  const has = (t: string) => arms.some((a) => hasTrait(a, t))
  const navy = arms.reduce((s, a) => s + a.navy * a.troops, 0) / Math.max(1, arms.reduce((s, a) => s + a.troops, 0))
  if (side === 'def') {
    const s = cs(st, b.at)
    const home = s.owner !== null && s.owner === b.def
    if (home) {
      if (c.terrain === 'hills') add('据守丘陵', 1.12)
      if (c.terrain === 'mountain') add(has('mountain') ? '依山而守，熟悉山地' : '依山而守', has('mountain') ? 1.45 : 1.32)
      if (c.terrain === 'plateau') add('高原难攻', 1.25)
      if (s.fort) add(`城墙（${s.fort} 级）`, 1 + s.fort * 0.15)
      if (has('wall')) add('善于守城', 1.2)
      if (e?.pass) add(`扼守${e.pass}`, 1.45)
    }
    if (entrenched(arms)) add('深沟高垒', 1.35)
    if (arms.some((a) => temperOf(a) === 'cautious')) add('持重', 1.1)
    const river = b.def ? modOf(st, b.def, 'river') : 0
    if (e && e.cross.includes('jiang')) {
      add('长江天险', 1.3 + river)
      if (navy > 0.2) add('水军在江上迎击', 1 + navy * 0.8)
    } else if (e && e.cross.length) add(`背靠${RIVER_NAME[e.cross[0]]}，以逸待劳`, 1.15 + river)
  } else {
    if (e && e.cross.includes('jiang')) add(navy > 0.6 ? '渡江：水军精熟' : '渡江：水军生疏', 0.5 + navy * 0.5)
    else if (e && e.cross.length && !(waterway(st, e) && navy >= 0.2)) add(`强渡${RIVER_NAME[e.cross[0]]}`, 0.8)
    if (has('raid') && b.day < 4) add('出其不意', 1.25)
    if (has('mountain') && c.terrain !== 'plain') add('善走山路', 1.15)
    if (season === 3 && !isSouth(c)) add('寒冬攻城', 0.88)
  }
  if (has('wit')) add('谋士筹划', 1.08)
  if (has('cavalry') && c.terrain === 'plain') add('名将率骑', 1.1)
  return { p: base * k, factors }
}

export interface Report {
  kind: 'battle' | 'capture' | 'retreat' | 'death' | 'info' | 'real' | 'event' | 'fall'
  text: string
  at?: string
  f?: Fid | null
  mine?: boolean
  battle?: { won: boolean; at: string; att: Fid; def: Fid | null; lossA: number; lossD: number; factors: Factor[]; days: number; fire?: boolean }
}

function fight(st: State, b: Battle, out: Report[]) {
  const A = sideArmies(st, b, 'att')
  const D = b.def ? sideArmies(st, b, 'def') : []
  if (!A.length) {
    endBattle(st, b, 'def', out)
    return
  }
  const pa = sidePower(st, b, 'att', A)
  const pd = sidePower(st, b, 'def', D)
  b.factors = [...pa.factors, ...pd.factors]
  b.day++
  const c = cellById.get(b.at)!
  const wet = c.boats.length > 0
  // fire: needs a fire general, boats on both sides, and wind that blows the right way
  const fireSide = A.some((a) => hasTrait(a, 'fire')) ? 'att' : D.some((a) => hasTrait(a, 'fire')) ? 'def' : null
  let fireHit: 'att' | 'def' | null = null
  if (fireSide && wet && !b.fire) {
    const foe = fireSide === 'att' ? D : A
    const foeNavy = foe.reduce((s, a) => s + a.navy * a.troops, 0) / Math.max(1, foe.reduce((s, a) => s + a.troops, 0))
    if (foeNavy > 0.25 || foe.some((a) => a.troops > 40000)) {
      // the fire only goes where the wind blows
      const here = c.at
      const there = b.from ? cellById.get(b.from)!.at : null
      const dir = there ? (fireSide === 'def' ? bearing8(here, there) : bearing8(there, here)) : null
      const toward = (st.wind + 4) % 8
      const ok = dir === null ? rand(st) < 0.3 : Math.min((toward - dir + 8) % 8, (dir - toward + 8) % 8) <= 1
      if (ok && rand(st) < 0.3) {
        fireHit = fireSide === 'att' ? 'def' : 'att'
        b.fire = true
        const m = monthOf(st)
        b.wind = m >= 10 || m <= 2
      }
    }
  }
  // against dug-in camps a battle turns into months of probing and waiting
  const dug = entrenched(D)
  const slow = dug ? 0.25 : 1
  const dmgD = pa.p * 0.016 * slow * (0.9 + rand(st) * 0.2)
  const dmgA = pd.p * 0.016 * slow * (0.9 + rand(st) * 0.2)
  const hurt = (arms: Army[], dmg: number, burned: boolean, steady = 1) => {
    const total = arms.reduce((s, a) => s + a.troops, 0)
    if (!total) return 0
    let lost = 0
    for (const a of arms) {
      const share = a.troops / total
      const l = Math.min(a.troops, dmg * share + (burned ? a.troops * 0.22 : 0))
      a.troops -= l
      lost += l
      const panic = temperOf(a) === 'rash' && a.org < 0.4 ? 1.2 : 1
      a.org = Math.max(0, a.org - ((l / Math.max(1, a.troops + l)) * 3 + 0.02 * slow) * steady * panic - (burned ? 0.45 : 0))
    }
    return lost
  }
  // men behind earthworks don't panic as easily
  b.lossD += D.length ? hurt(D, dmgD, fireHit === 'def', dug ? 0.6 : 1) : 0
  b.lossA += hurt(A, dmgA, fireHit === 'att')
  if (fireHit) {
    const who = fireHit === 'def' ? b.def : b.att
    out.push({ kind: 'event', at: b.at, f: who, text: `${b.at}：${b.wind ? '隆冬时节，' : ''}江上刮起${WIND_NAME[st.wind]}风，火船顺风冲进敌营，烧成一片！`, mine: who === st.player || b.att === st.player || b.def === st.player })
  }
  st.cells[cellIndex.get(b.at)!].dev = Math.min(1, cs(st, b.at).dev + 0.01)
  const orgA = A.reduce((s, a) => s + a.org * a.troops, 0) / Math.max(1, A.reduce((s, a) => s + a.troops, 0))
  const orgD = D.length ? D.reduce((s, a) => s + a.org * a.troops, 0) / Math.max(1, D.reduce((s, a) => s + a.troops, 0)) : 1
  // a commandery with no field army: the walls hold or the attacker wins the field and starts a siege
  if (!D.length) {
    endBattle(st, b, 'att', out)
    return
  }
  if (orgA < 0.18 || A.every((a) => a.troops < 300)) endBattle(st, b, 'def', out)
  else if (orgD < 0.18 || D.every((a) => a.troops < 300)) endBattle(st, b, 'att', out)
  else if (b.day > 50) endBattle(st, b, 'def', out)
}

function retreatTo(st: State, a: Army, from: string) {
  const opts = links(a.at)
    .map((l) => l.to)
    .filter((id) => {
      const o = ownerOf(st, id)
      return id !== from && (o === a.f || (o !== null && allied(st, a.f, o))) && !st.armies.some((x) => x.at === id && atWar(st, x.f, a.f))
    })
    .sort((x, y) => (cs(st, y).owner === a.f ? 1 : 0) - (cs(st, x).owner === a.f ? 1 : 0))
  if (opts.length) return opts[0]
  const any = links(a.at).map((l) => l.to).filter((id) => id !== from && mayEnter(st, a.f, id) && !st.armies.some((x) => x.at === id && atWar(st, x.f, a.f)))
  return any[0] ?? null
}

function hostileCell(st: State, f: Fid, id: string) {
  const o = ownerOf(st, id)
  return o === null || atWar(st, f, o)
}

function chaseOk(st: State, f: Fid, dest: string, zone: Set<string> | null) {
  if (zone) return zone.has(dest)
  return links(dest).some((l) => ownerOf(st, l.to) === f)
}

/** Winners on 进攻 follow a broken enemy one cell; a rash cavalryman may take the next one too. A campaign keeps the chase inside its theatre. */
function pursue(st: State, b: Battle, winners: Army[], fled: { a: Army; to: string }[], mine: boolean) {
  const zones = new Map<Fid, Set<string> | null>()
  const zoneOf = (f: Fid) => {
    if (!zones.has(f)) zones.set(f, theatre(st, f))
    return zones.get(f) ?? null
  }
  for (const w of winners) {
    if (w.raid === -2) continue
    if (w.troops <= 3000 || w.org <= 0.5) continue
    if (w.stance === 'hold' || w.stance === 'pin') continue
    const temper = temperOf(w)
    const prey = fled
      .filter((f) => f.to !== w.at && hostileCell(st, w.f, f.to))
      .sort((x, y) => y.a.troops - x.a.troops)[0]
    if (!prey) continue
    const name = commander(w)?.name
    if (st.t - (st.flags[`chase:${w.id}`] ?? -9999) < 60) continue
    const zone = zoneOf(w.f)
    let dest = prey.to
    if (!chaseOk(st, w.f, dest, zone)) continue
    if (temper === 'rash' && w.cav >= 0.3) {
      const further = retreatTo(st, prey.a, b.at)
      if (further && further !== w.at && hostileCell(st, w.f, further) && chaseOk(st, w.f, further, zone)) dest = further
    }
    if (temper === 'cautious') {
      if (mine && name) {
        const text = `${b.at}城下，${name}持重，没有追击。`
        log(st, { kind: 'battle', f: w.f, at: b.at, text, mine })
      }
      continue
    }
    if (!order(st, w.id, dest)) continue
    st.flags[`chase:${w.id}`] = st.t
    st.flags['n:pursue'] = (st.flags['n:pursue'] ?? 0) + 1
    if (mine && name) {
      const text = `${name}率军追到${dest}。`
      log(st, { kind: 'battle', f: w.f, at: dest, text, mine })
    }
  }
}

function endBattle(st: State, b: Battle, winner: 'att' | 'def', out: Report[]) {
  st.battles = st.battles.filter((x) => x !== b)
  const losers = winner === 'att' ? (b.def ? sideArmies(st, b, 'def') : []) : sideArmies(st, b, 'att')
  const winners = winner === 'att' ? sideArmies(st, b, 'att') : b.def ? sideArmies(st, b, 'def') : []
  const loserF = winner === 'att' ? b.def : b.att
  const winnerF = winner === 'att' ? b.att : b.def
  const fled: { a: Army; to: string }[] = []
  for (const a of losers) {
    const org0 = a.org
    const to = retreatTo(st, a, winner === 'def' ? '' : (b.from ?? ''))
    const rate = to ? (temperOf(a) === 'steady' ? 0.04 : 0.08) : 1
    let lost = a.troops * rate
    if (to && org0 < 0.2 && winners.some((w) => w.cav >= 0.3)) lost += a.troops * 0.1
    a.troops -= lost
    if (winner === 'att') b.lossD += lost
    else b.lossA += lost
    if (a.folk) {
      const half = Math.round(a.folk / 2)
      cs(st, b.at).pop += half
      const who = winnerF ? factionLabel(st, winnerF) : '敌军'
      log(st, { kind: 'battle', f: a.f, at: b.at, text: `百姓在${b.at}失散，一半落到${who}手里，粮草也丢了大半。`, mine: a.f === st.player || winnerF === st.player })
      a.food *= 0.15
      delete a.folk
    }
    let shielded = false
    for (const gid of [...a.gens]) {
      const r = rand(st)
      const g = generalById.get(gid)!
      const lord = factionDef.get(a.f)!.heirs.includes(gid)
      const deathOdds = (to ? 0.008 : 0.08) * (g.lead <= 4 ? 0.3 : 1) * (lord ? 0.25 : 1)
      const guard = gid === st.factions[a.f].ruler
        ? a.gens.filter((id) => id !== gid && TEMPER[id] === 'steady').sort((x, y) => generalById.get(y)!.lead - generalById.get(x)!.lead)[0]
        : undefined
      if (guard) {
        if (!shielded && a.f === st.player) {
          log(st, { kind: 'battle', f: a.f, at: b.at, text: `${generalById.get(guard)!.name}护着主公，杀出了重围。`, mine: true })
          shielded = true
        }
        continue
      }
      const ruling = Object.values(st.factions).some((fs) => fs.alive && fs.ruler === gid)
      if (r < deathOdds) killGeneral(st, gid, 'battle', `${g.name}战死于${b.at}。`)
      else if (!to && !lord && !ruling && !LOYAL.has(gid) && r < deathOdds + 0.3 && winnerF) {
        st.gens[gid].f = winnerF
        a.gens = a.gens.filter((x) => x !== gid)
        log(st, { kind: 'join', f: winnerF, text: `${g.name}在${b.at}兵败被俘，归降了${factionLabel(st, winnerF)}。`, mine: winnerF === st.player || a.f === st.player })
      }
    }
    if (!to) a.gens = []
    if (to) {
      a.at = to
      a.path = []
      a.prog = 0
      a.siege = 0
      a.org = Math.max(a.org, 0.12)
      fled.push({ a, to })
    } else a.troops = 0
  }
  st.armies = st.armies.filter((a) => a.troops >= 200)
  for (const a of winners) a.org = Math.min(1, a.org + 0.1)
  const mine = b.att === st.player || b.def === st.player
  if (fled.length) pursue(st, b, winners, fled, mine)
  for (const a of [...winners, ...losers]) if (a.raid === -2 && a.troops >= 200 && st.armies.includes(a)) rideHome(st, a)
  const days = b.day
  const text =
    b.def === null && !losers.length
      ? `${factionLabel(st, b.att)}兵临${b.at}城下。`
      : `${b.at}之战：${factionLabel(st, winnerF)}击败${factionLabel(st, loserF)}，历时 ${days} 天。`
  if (losers.length || b.def) {
    out.push({
      kind: 'battle',
      at: b.at,
      f: winnerF,
      text,
      mine,
      battle: { won: winnerF === st.player, at: b.at, att: b.att, def: b.def, lossA: Math.round(b.lossA), lossD: Math.round(b.lossD), factors: b.factors, days, fire: b.fire },
    })
    if (losers.length) log(st, { kind: 'battle', f: winnerF, at: b.at, text: `${text}${factionLabel(st, b.att)}损失约 ${wan(b.lossA)}，${factionLabel(st, b.def)}损失约 ${wan(b.lossD)}。${b.fire ? '这一仗用了火攻。' : ''}`, mine })
  }
}

/** Men who would rather die than serve the man who caught them. */
const LOYAL = new Set(['guanyu', 'zhangfei', 'zhaoyun', 'zhugeliang', 'zhouyu', 'lusu', 'xiahoudun', 'xiahouyuan', 'caoren', 'caohong', 'xunyu', 'shenpei', 'jushou', 'tianfeng', 'zhangren', 'pangde'])

export function wan(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(n >= 100000 ? 0 : 1)} 万`
  if (n >= 1000) return `${Math.round(n / 1000)} 千`
  return `${Math.round(n)}`
}

function capture(st: State, id: string, f: Fid, out: Report[], how?: string) {
  const s = cs(st, id)
  const was = s.owner
  s.owner = f
  s.order = 0.3
  s.dev = Math.min(1, s.dev + 0.08)
  s.pop = Math.round(s.pop * 0.95)
  s.fort = Math.max(0, s.fort - 1)
  s.taken = st.t
  for (const d of st.depots.filter((x) => x.at === id && x.f !== f)) burnDepot(st, d, f, out, 'capture')
  const y = yearOf(st)
  const real = realOwners(y)
  const realF = factionOfReal(real.f[cellIndex.get(id)!])
  const div = realF !== f ? `历史上 ${Math.floor(y)} 年这里${realF ? `属于${factionDef.get(realF)!.heirs.map(genName)[0]}一方` : '没有稳定的主人'}。` : undefined
  const text = how ?? `${factionLabel(st, f)}攻占${id}${was ? `（原属${factionLabel(st, was)}）` : ''}。`
  out.push({ kind: 'capture', at: id, f, text, mine: f === st.player || was === st.player })
  log(st, { kind: 'capture', f, at: id, text, div, mine: f === st.player || was === st.player })
  if (was) {
    const wf = st.factions[was]
    if (wf.capital === id) {
      const rest = ownedBy(st, was).sort((a, b) => cs(st, b.id).pop - cs(st, a.id).pop)
      wf.capital = rest[0]?.id ?? null
      wf.grain *= 0.6
      if (wf.capital) log(st, { kind: 'event', f: was, text: `${factionLabel(st, was)}失去都城，退守${wf.capital}。`, mine: was === st.player })
    }
    if (!ownedBy(st, was).length && !armiesOf(st, was).length) collapse(st, was, `${factionLabel(st, was)}灭亡。`)
  }
}

function enemyMen(st: State, a: Army, to: string) {
  return st.armies.filter((x) => x.at === to && !x.ready && x.raid === undefined && atWar(st, x.f, a.f)).reduce((s, x) => s + x.troops, 0)
}

/** A rash commander on 固守 sometimes sallies; a pinning army steps out only against a much weaker foe. */
function obeyStance(st: State, out: Report[]) {
  for (const a of st.armies) {
    if (a.ready || a.path.length || inBattle(st, a) || a.raid !== undefined || a.guard !== undefined) continue
    if (a.stance === 'hold' && temperOf(a) === 'rash') {
      let best: { to: string; men: number } | null = null
      for (const l of links(a.at)) {
        const men = enemyMen(st, a, l.to)
        if (men <= 0 || men >= a.troops * 0.8) continue
        if (!best || men < best.men) best = { to: l.to, men }
      }
      if (!best || rand(st) >= 0.02) continue
      a.stance = 'attack'
      if (!order(st, a.id, best.to)) {
        a.stance = 'hold'
        continue
      }
      const name = commander(a)?.name
      if (name) {
        const text = `${name}按捺不住，擅自出城攻打${best.to}。`
        const mine = a.f === st.player
        log(st, { kind: 'event', f: a.f, at: best.to, text, mine })
        out.push({ kind: 'event', f: a.f, at: best.to, text, mine })
      }
      st.flags['n:sally'] = (st.flags['n:sally'] ?? 0) + 1
    } else if (a.stance === 'pin') {
      let best: string | null = null
      let def = Infinity
      for (const l of links(a.at)) {
        if (!pinOk(st, a, l.to)) continue
        const d = foeAt(st, a, l.to)
        if (d < def) {
          def = d
          best = l.to
        }
      }
      if (best) order(st, a.id, best)
    }
  }
}

// ---------- the day ----------

export function tickDay(st: State): Report[] {
  const out: Report[] = []
  st.t++
  const month = monthOf(st)
  const newMonth = monthOf(st, st.t - 1) !== month

  // raising finishes
  for (const a of st.armies) if (a.ready && st.t >= a.ready) delete a.ready
  obeyStance(st, out)

  // a light column past its 15 days, or one that has lost the trail, turns for home
  for (const a of st.armies) {
    if (a.raid !== -2 || a.ready || inBattle(st, a)) continue
    const due = a.dashUntil !== undefined && st.t > a.dashUntil
    const beside = st.armies.some((x) => x !== a && x.at === a.at && x.folk && atWar(st, a.f, x.f))
    if (beside && !due) continue
    if (due || !a.path.length) {
      const prey = st.armies.filter((x) => x.folk && atWar(st, a.f, x.f) && x.at !== a.at).sort((x, y) => y.folk! - x.folk!)[0]
      const left = (a.dashUntil ?? st.t) - st.t
      const p = !due && prey ? raidPath(st, a, prey.at) : null
      if (p && p.days <= left) a.path = p.path
      else rideHome(st, a)
    }
  }

  // marching
  for (const a of st.armies) {
    if (a.ready || !a.path.length || inBattle(st, a)) continue
    const next = a.path[0]
    const e = edgeBetween(a.at, next)
    if (!e || !mayPass(st, a, next) || !canCross(a, e)) {
      a.path = []
      a.prog = 0
      continue
    }
    a.prog += kmPerDay(st, a, e, next) * marchMul(a)
    if (a.prog < e.km + crossingKm(st, a, e)) continue
    const from = a.at
    a.at = next
    a.path.shift()
    a.prog = 0
    a.siege = 0
    a.dug = 0
    if (a.passUntil !== undefined && !a.path.length) {
      const here = ownerOf(st, a.at)
      if (here === a.f || (here && allied(st, a.f, here))) delete a.passUntil
    }
    if (slipping(a)) {
      raidStep(st, a, out)
      continue
    }
    const foes = st.armies.filter((x) => x.at === next && x !== a && !x.ready && !slipping(x) && atWar(st, x.f, a.f))
    const o = ownerOf(st, next)
    if (foes.length) {
      a.path = []
      const b = battleAt(st, next) ?? startBattle(st, a, foes[0].f, from)
      if (b.def === null) b.def = foes[0].f
    } else if (o !== a.f && (o === null || atWar(st, a.f, o))) {
      a.path = []
    }
    if (!a.path.length) settleFolk(st, a)
  }

  // battles and sieges
  for (const a of st.armies) {
    if (a.ready || a.path.length || inBattle(st, a) || slipping(a)) continue
    const foes = st.armies.filter((x) => x.at === a.at && x !== a && !x.ready && !slipping(x) && atWar(st, x.f, a.f))
    if (foes.length && !battleAt(st, a.at)) {
      const o = ownerOf(st, a.at)
      // whoever stands on someone else's soil is the attacker
      const att = o === a.f ? foes[0] : a
      startBattle(st, att, att === a ? foes[0].f : a.f, null)
    }
  }
  for (const b of [...st.battles]) fight(st, b, out)
  for (const id of new Set(st.armies.map((a) => a.at))) {
    const o = ownerOf(st, id)
    if (battleAt(st, id)) continue
    const here = st.armies.filter((a) => a.at === id && !a.ready && !a.path.length && a.raid === undefined && a.f !== o && (o === null || atWar(st, a.f, o)))
    if (!here.length) continue
    const g = garrisonOf(st, id)
    const men = here.reduce((s, a) => s + a.troops, 0)
    const fort = cs(st, id).fort
    for (const a of here) {
      a.siege += Math.min(0.12, (men / (g * 3 + 1)) * 0.035) / (1 + fort * 0.7)
      a.troops -= a.troops * 0.0015 * (1 + fort * 0.5)
    }
    if (here.some((a) => a.siege >= 1)) {
      const by = here.sort((x, y) => y.troops - x.troops)[0].f
      capture(st, id, by, out)
      for (const a of here) a.siege = 0
    }
  }

  // food, sickness, drill
  for (const a of st.armies) {
    const c = cellById.get(a.at)!
    const s = supplyOf(st, a)
    const fs = st.factions[a.f]
    const big = needsDepot(st, a)
    const dep = big ? depotFor(st, a) : undefined
    const eat = a.folk ? 1.5 : 1
    const freeRide = a.raid === -2 && st.t <= (a.dashUntil ?? 0)
    // same rule as upkeepOf: an open line feeds the army, however far the grain has to travel
    const fed = big ? !!dep && dep.stock > 0 && fs.grain > 0 : s.ok && fs.grain > 0
    if (!freeRide && fed) {
      a.food = Math.min(40, a.food + 2)
      if (dep) dep.stock = Math.max(0, dep.stock - dailyNeed(a) * eat)
    } else if (!freeRide) a.food -= (big && s.ok ? 0.7 : s.ok ? 0.5 : 1) * eat
    const ground = ownerOf(st, a.at)
    if (!a.folk && !a.path.length && ground && (ground === a.f || allied(st, a.f, ground))) a.dug = Math.min(90, (a.dug ?? 0) + 1)
    if (a.food <= 0) {
      a.food = 0
      a.troops *= 0.993
      a.org = Math.max(0, a.org - 0.02)
    } else if (!inBattle(st, a)) a.org = Math.min(1, a.org + 0.012 + modOf(st, a.f, 'order') * 0.1)
    if (a.dashUntil !== undefined && a.raid !== undefined && st.t > a.dashUntil) a.org = Math.max(0, a.org - 0.04)
    const season = seasonOf(st)
    if (a.north && isSouth(c)) {
      a.sick = Math.min(0.5, a.sick + (season === 1 || season === 2 ? 0.006 : 0.0035) * (a.troops > 30000 ? 1.4 : 1))
    } else a.sick = Math.max(0, a.sick - 0.004)
    if (a.sick > 0.02) a.troops -= a.troops * a.sick * 0.004
    if (a.drill && c.boats.length && !a.path.length) {
      // northerners never quite become sailors
      const top = a.north ? 0.7 : 1
      a.navy = Math.min(top, a.navy + 0.0022 * (1 + modOf(st, a.f, 'navy')))
      if (a.navy >= top) a.drill = false
    }
  }
  st.armies = st.armies.filter((a) => a.troops >= 200)

  // policies
  for (const fs of Object.values(st.factions)) {
    if (!fs.alive || !fs.cur) continue
    fs.cur.left--
    if (fs.cur.left <= 0) finishPolicy(st, fs.id, policyById.get(fs.cur.id)!)
  }

  walls(st)
  depots(st, out)
  weather(st)
  if (newMonth) {
    waver(st, out)
    monthly(st, out)
  }
  return out
}

/**
 * Land taken in the last two years whose people haven't settled, with no army of its new master in reach,
 * goes over to whoever comes knocking, as the four commanderies south of the river went over to 刘备 after 赤壁.
 */
export function unsettled(st: State, id: string) {
  const s = cs(st, id)
  const o = s.owner
  if (!o || st.t - s.taken > 720 || s.order >= 0.55 || st.factions[o].capital === id) return false
  const near = [id, ...links(id).map((l) => l.to)]
  return !st.armies.some((a) => a.f === o && near.includes(a.at))
}

function waver(st: State, out: Report[]) {
  for (const c of cells) {
    const o = cs(st, c.id).owner
    if (!o || !unsettled(st, c.id) || battleAt(st, c.id)) continue
    const near = [c.id, ...links(c.id).map((l) => l.to)]
    const knock = st.armies
      .filter((a) => near.includes(a.at) && a.troops >= 2000 && a.raid === undefined && !a.ready && atWar(st, a.f, o))
      .sort((x, y) => y.troops - x.troops)[0]
    if (!knock || rand(st) > 0.25) continue
    const by = knock.f
    capture(st, c.id, by, out, `${c.id}的太守见${factionLabel(st, o)}鞭长莫及，开城归降了${factionLabel(st, by)}。`)
    cs(st, c.id).order = 0.45
  }
}

function monthly(st: State, out: Report[]) {
  const y = yearOf(st)
  for (const fs of Object.values(st.factions)) {
    if (!fs.alive) continue
    const inc = incomeOf(st, fs.id)
    const spend = upkeepOf(st, fs.id)
    fs.income = inc
    fs.spend = spend
    // stores rot and rats eat: about 1.5% a month
    fs.grain = Math.max(0, fs.grain * 0.985 + inc - spend)
    let mp = 0
    for (const s of st.cells) if (s.owner === fs.id) mp += s.pop * 0.0003 * s.order
    fs.manpower = Math.min(popOf(st, fs.id) * 0.015, fs.manpower + mp * (1 + modOf(st, fs.id, 'manpower')))
    // a lord with no land and no army: he finds an ally to shelter him, or his cause dies
    if (!ownedBy(st, fs.id).length && !armiesOf(st, fs.id).length) {
      const others = FACTIONS.filter((o) => o.id !== fs.id && st.factions[o.id].alive && ownedBy(st, o.id).length && !atWar(st, fs.id, o.id))
      const foes = FACTIONS.filter((o) => atWar(st, fs.id, o.id)).map((o) => o.id)
      const host =
        others.find((o) => allied(st, fs.id, o.id)) ??
        others.find((o) => foes.some((x) => atWar(st, o.id, x))) ??
        others.sort((a, b) => factionDef.get(a.id)!.temper - factionDef.get(b.id)!.temper)[0]
      const last = st.flags[`exile:${fs.id}`] ?? -9999
      if (host && st.t - last > 720) {
        st.flags[`exile:${fs.id}`] = st.t
        const at = ownedBy(st, host.id).sort((a, b) => cs(st, b.id).pop - cs(st, a.id).pop)[0].id
        if (!allied(st, fs.id, host.id)) st.rel[relKey(fs.id, host.id)] = { s: 'ally', since: st.t, truce: 0 }
        const a = raise(st, fs.id, at, 4000)
        a.food = 60
        a.gens = idleGenerals(st, fs.id).slice(0, 3).map((g) => g.id)
        fs.grain = Math.max(fs.grain, 15)
        log(st, { kind: 'event', f: fs.id, text: `${factionLabel(st, fs.id)}收拾残部，投靠${factionLabel(st, host.id)}，驻在${at}。`, mine: fs.id === st.player })
      } else if (!host || st.t - last > 360) collapse(st, fs.id, `${factionLabel(st, fs.id)}无处容身，部众散尽。`)
    }
    if (fs.grain <= 0 && spend > inc) {
      // nothing left to eat: men desert
      for (const a of armiesOf(st, fs.id)) a.food = Math.min(a.food, 3)
    }
  }
  for (const s of st.cells) {
    if (!s.owner) continue
    const target = Math.min(0.95, 0.78 + modOf(st, s.owner, 'order') - s.dev * 0.5 - (st.t - s.taken < 360 ? 0.2 : 0))
    s.order += (target - s.order) * 0.12
    const grow = s.order > 0.55 && s.dev < 0.2 ? 0.0012 * (1 + modOf(st, s.owner, 'growth')) : -s.dev * 0.01
    s.pop = Math.max(2000, Math.round(s.pop * (1 + grow)))
    s.dev *= 0.9
  }
  generals(st, y, out)
}

function generals(st: State, y: number, out: Report[]) {
  for (const g of GENERALS) {
    const gs = st.gens[g.id]
    if (gs.dead) continue
    const mine = gs.f === st.player
    // a violent death in history happens here only if his side is no better off than it really was
    const onTrack = (f: Fid | null) => {
      if (!f) return false
      const real = realOwners(y).f.filter((r) => factionOfReal(r) === f).length
      return ownedBy(st, f).length <= real * 1.15 + 1
    }
    const realSide = [...g.serve].reverse().find(([from]) => from <= g.died)?.[1] ?? null
    const end = g.killed && (mine || gs.f !== realSide || !onTrack(gs.f)) ? naturalEnd(g) : g.died
    if (y >= end) {
      const how: GenState['how'] = g.killed && end === g.died ? 'history' : 'natural'
      const where = st.armies.find((a) => a.gens.includes(g.id))?.at
      killGeneral(st, g.id, how, how === 'history' ? `${g.name}死了。${g.line}` : `${g.name}病逝${where ? `于${where}` : ''}，享年 ${Math.round(y - g.born)} 岁。`)
      out.push({ kind: 'death', text: `${g.name}去世。`, f: gs.f, mine })
      continue
    }
    if (g.born + 16 > y) continue
    // joining or switching sides on the real dates
    const step = [...g.serve].reverse().find(([from]) => from <= y)
    if (!step) continue
    const [from, f, how] = step
    if (gs.f === f) continue
    const due = y - from <= 0.6
    let to: Fid | null = null
    if (due && st.factions[f]?.alive) {
      if (how === 'defect' && gs.f && st.factions[gs.f]?.alive) {
        // he only leaves a lord who is clearly losing
        const ratio = power(st, f) / Math.max(1, power(st, gs.f))
        if (ratio < (atWar(st, f, gs.f) ? 1.1 : 1.4)) continue
      }
      to = f
    } else if (!gs.f) {
      // a man without a lord offers himself to whoever holds his home
      const homeOwner = ownerOf(st, g.home)
      const talent = homeOwner ? modOf(st, homeOwner, 'talent') : 0
      if (homeOwner && rand(st) < (talent > 0 ? 0.25 : 0.06)) to = homeOwner
    }
    if (!to || to === gs.f) continue
    const old = gs.f
    // a sitting lord who goes over to someone else: the state ends with him.
    // raising another heir just leaves the same rump (马超 is already the last Ma heir), and after 211 that coalition was gone.
    for (const fs of Object.values(st.factions)) {
      if (!fs.alive || fs.ruler !== g.id || fs.id === to) continue
      collapse(st, fs.id, `${g.name}投奔他人，他原先的势力就此散了。`)
    }
    gs.f = to
    for (const a of st.armies) a.gens = a.gens.filter((x) => x !== g.id)
    // a man who changes sides brings what he knows
    if (old) for (const d of st.depots) if (d.f === old && !d.known.includes(to)) d.known.push(to)
    const div = to !== f ? `历史上${g.name}投奔的是${factionDef.get(f)!.heirs.map(genName)[0]}一方。` : undefined
    const text = old ? `${g.name}离开${factionLabel(st, old)}，投奔${factionLabel(st, to)}。` : `${g.name}出仕，投奔${factionLabel(st, to)}。`
    log(st, { kind: 'join', f: to, text, div, mine: to === st.player || old === st.player })
    if (to === st.player || old === st.player) out.push({ kind: 'event', text, f: to, mine: true })
  }
}

// ---------- weather ----------

export const WIND_NAME = ['北', '东北', '东', '东南', '南', '西南', '西', '西北']
// where the wind comes from, by share of days: the monsoon turns twice a year
const WIND_WINTER = [0.22, 0.1, 0.04, 0.04, 0.03, 0.03, 0.12, 0.42]
const WIND_SUMMER = [0.05, 0.06, 0.15, 0.32, 0.22, 0.1, 0.05, 0.05]
const WIND_MID = [0.15, 0.15, 0.12, 0.12, 0.1, 0.08, 0.1, 0.18]

function weather(st: State) {
  if (rand(st) < 0.7) return
  const m = monthOf(st)
  const t = m >= 11 || m <= 2 ? WIND_WINTER : m >= 5 && m <= 8 ? WIND_SUMMER : WIND_MID
  let r = rand(st)
  for (let i = 0; i < 8; i++) {
    r -= t[i]
    if (r <= 0) {
      st.wind = i
      return
    }
  }
  st.wind = 7
}

/** Compass direction from a to b, in eighths, 0 north. */
export function bearing8(a: [number, number], b: [number, number]) {
  const dx = (b[0] - a[0]) * Math.cos((((a[1] + b[1]) / 2) * Math.PI) / 180)
  const dy = b[1] - a[1]
  return ((Math.round(Math.atan2(dx, dy) / (Math.PI / 4)) % 8) + 8) % 8
}

// ---------- depots ----------

/** 万斛 a day */
export function dailyNeed(a: Army) {
  return (a.troops * RATION) / 30 / 10000
}

/** A big army away from a granary can't live off the carts it brings: it needs a depot behind it. */
export function needsDepot(st: State, a: Army) {
  if (a.troops < 25000 || a.guard !== undefined || a.raid !== undefined) return false
  return !nearGranary(st, a.f, a.at)
}

/** In or next to one of its own granary cities: the army eats straight from the city's stores. */
function nearGranary(st: State, f: Fid, at: string) {
  const sm = supplyMap(st, f)
  const own = (id: string) => ownerOf(st, id) === f && sm.get(id)?.cost === 0
  // once the army is across a big river, the grain has to be stockpiled on its side, as at 乌巢
  return own(at) || links(at).some((l) => own(l.to) && !l.e.cross.length)
}

export function depotFor(st: State, a: Army) {
  return st.depots.find((d) => d.f === a.f && (d.at === a.at || !!edgeBetween(d.at, a.at)))
}

export function depotServes(st: State, d: Depot) {
  return st.armies.filter((a) => a.f === d.f && needsDepot(st, a) && depotFor(st, a) === d)
}

function dropDepot(st: State, d: Depot) {
  st.depots = st.depots.filter((x) => x !== d)
  for (const a of st.armies) if (a.guard === d.id) delete a.guard
}

function guardDepot(st: State, a: Army, d: Depot) {
  const share = [0.15, 0.1, 0.12][factionDef.get(a.f)!.temper]
  const n = Math.round((a.troops * share) / 1000) * 1000
  if (n < 2000 || d.at === a.at) return
  const g = raise(st, a.f, d.at, n)
  Object.assign(g, { cav: a.cav, navy: a.navy, org: a.org, north: a.north, food: a.food, guard: d.id })
  a.troops -= n
  if (a.gens.length >= 2) {
    const weak = [...a.gens].sort((x, y) => generalById.get(x)!.lead - generalById.get(y)!.lead)[0]
    a.gens = a.gens.filter((x) => x !== weak)
    g.gens = [weak]
  }
}

export function burnDepot(st: State, d: Depot, by: Fid | null, out: Report[], how: 'raid' | 'capture') {
  dropDepot(st, d)
  const hit = st.armies.filter((a) => a.f === d.f && a.troops >= 25000 && (a.at === d.at || !!edgeBetween(a.at, d.at)))
  for (const a of hit) {
    a.org = Math.max(0.05, a.org - 0.45)
    a.food = Math.min(a.food, 5)
  }
  // a new depot can't be filled overnight
  st.flags[`depot:${d.f}`] = st.t + 40
  const men = hit.reduce((s, a) => s + a.troops, 0)
  const text = `${by ? factionLabel(st, by) : '乱兵'}${how === 'raid' ? '夜袭' : '攻占'}${d.at}，烧光了${factionLabel(st, d.f)}囤在那里的 ${Math.round(d.stock)} 万斛粮草。${men > 20000 ? `${wan(men)}大军听说粮草没了，军心大乱。` : ''}`
  const mine = by === st.player || d.f === st.player
  log(st, { kind: 'event', f: by, at: d.at, text, mine })
  out.push({ kind: 'event', at: d.at, f: by, text, mine })
}

function depots(st: State, out: Report[]) {
  if (st.t % 5 === 0) {
    for (const a of [...st.armies]) {
      if (a.ready || !needsDepot(st, a) || depotFor(st, a) || (st.flags[`depot:${a.f}`] ?? 0) > st.t) continue
      const sm = supplyMap(st, a.f)
      const spots = [a.at, ...links(a.at).map((l) => l.to)].filter((id) => ownerOf(st, id) === a.f && sm.get(id)?.ok && sm.get(id)!.cost > 0)
      if (!spots.length) continue
      spots.sort((x, y) => sm.get(x)!.cost - sm.get(y)!.cost)
      const d: Depot = { id: st.nextId++, f: a.f, at: spots[0], stock: dailyNeed(a) * 10, known: [], made: st.t }
      st.depots.push(d)
      if (a.f !== st.player) guardDepot(st, a, d)
      log(st, { kind: 'event', f: a.f, at: d.at, text: `${factionLabel(st, a.f)}在${d.at}囤积粮草，供应前线大军。`, mine: a.f === st.player })
    }
  }
  for (const d of [...st.depots]) {
    const o = ownerOf(st, d.at)
    if (o !== d.f) {
      burnDepot(st, d, o, out, 'capture')
      continue
    }
    const served = depotServes(st, d)
    if (!served.length) {
      if (st.t - d.made > 30) dropDepot(st, d)
      continue
    }
    const need = served.reduce((s, a) => s + dailyNeed(a), 0)
    // carts and boats keep coming while the road back home is open
    if (supplyMap(st, d.f).get(d.at)?.ok && st.factions[d.f].grain > 0) d.stock = Math.min(need * 90, d.stock + need * 1.5)
    // enemy scouts near it may find it
    for (const e of FACTIONS) {
      if (d.known.includes(e.id) || !atWar(st, e.id, d.f)) continue
      const near = st.armies.some((x) => x.f === e.id && (x.at === d.at || !!edgeBetween(x.at, d.at)))
      if (near && rand(st) < 1 / 150) {
        d.known.push(e.id)
        log(st, { kind: 'event', f: e.id, at: d.at, text: `${factionLabel(st, e.id)}的斥候发现：${factionLabel(st, d.f)}的粮草囤在${d.at}。`, mine: e.id === st.player || d.f === st.player })
      }
    }
  }
}

// ---------- raids ----------

/** Like findPath, but light troops slip through enemy land instead of stopping at the first town. */
export function raidPath(st: State, a: Army, to: string) {
  const dist = new Map<string, number>([[a.at, 0]])
  const prev = new Map<string, string>()
  const open = new Set([a.at])
  while (open.size) {
    let cur = ''
    let best = Infinity
    for (const id of open)
      if (dist.get(id)! < best) {
        best = dist.get(id)!
        cur = id
      }
    open.delete(cur)
    if (cur === to) break
    for (const { to: nb, e } of links(cur)) {
      if (!mayEnter(st, a.f, nb) || !canCross(a, e)) continue
      const ride = a.raid === -2 ? 2.5 : 1.5
      const d = best + (e.km + crossingKm(st, a, e)) / (kmPerDay(st, a, e, nb) * ride)
      if (d < (dist.get(nb) ?? Infinity)) {
        dist.set(nb, d)
        prev.set(nb, cur)
        open.add(nb)
      }
    }
  }
  if (!dist.has(to) || to === a.at) return null
  const path: string[] = []
  for (let x = to; x !== a.at; x = prev.get(x)!) path.unshift(x)
  return { path, days: dist.get(to)! }
}

export const RAID_MAX = 12000
export function raidBlock(st: State, a: Army, d: Depot) {
  if (!d.known.includes(a.f)) return '还不知道敌人的粮草囤在哪里'
  if (!atWar(st, a.f, d.f)) return '没有在打仗'
  if (a.ready || inBattle(st, a) || a.raid !== undefined) return '这支军队腾不出手'
  if (a.troops > RAID_MAX) return `奇袭要轻装快走，带的人不能超过 ${wan(RAID_MAX)}`
  const p = raidPath(st, a, d.at)
  if (!p) return '到不了'
  if (p.days > 15) return '太远了，半路就会被发现'
  return null
}
export function launchRaid(st: State, armyId: number, depotId: number) {
  const a = st.armies.find((x) => x.id === armyId)
  const d = st.depots.find((x) => x.id === depotId)
  if (!a || !d || raidBlock(st, a, d)) return false
  a.path = raidPath(st, a, d.at)!.path
  a.prog = 0
  a.raid = d.id
  a.seen = false
  return true
}

function rideHome(st: State, a: Army) {
  const home = ownedBy(st, a.f)
    .map((c) => ({ c: c.id, p: raidPath(st, a, c.id) }))
    .filter((x) => x.p)
    .sort((x, y) => x.p!.days - y.p!.days)[0]
  a.raid = -1
  a.path = home?.p?.path ?? []
  if (!a.path.length) {
    delete a.raid
    delete a.dashUntil
  }
}

export function launchDash(st: State, armyId: number, to: string) {
  const a = st.armies.find((x) => x.id === armyId)
  if (!a || a.ready || a.raid !== undefined || inBattle(st, a) || a.folk) return false
  const cavMen = a.troops * a.cav
  if (a.cav < 0.3 && cavMen < 5000) return false
  const n = Math.round(Math.min(cavMen, 6000))
  if (n < 1500 || a.troops - n < 1000) return false
  const ghost: Army = { ...a, raid: -2, cav: 1 }
  const ride = a.at === to ? { path: [] as string[], days: 0 } : raidPath(st, ghost, to)
  if (!ride) return false
  const col = raise(st, a.f, a.at, n)
  col.cav = 1
  col.navy = a.navy
  col.org = a.org
  col.food = a.food
  col.north = a.north
  col.sick = a.sick
  col.raid = -2
  col.dashUntil = st.t + 15
  col.path = ride.path
  col.prog = 0
  const ranked = [...a.gens].sort((x, y) => generalById.get(y)!.lead - generalById.get(x)!.lead)
  const rider = ranked[1] ?? ranked[0]
  if (rider) {
    col.gens = [rider]
    a.gens = a.gens.filter((g) => g !== rider)
  }
  a.troops -= n
  a.cav = Math.max(0, (cavMen - n) / a.troops)
  const name = commander(col)?.name ?? factionLabel(st, a.f)
  log(st, { kind: 'event', f: a.f, at: a.at, text: `${name}率${wan(n)}轻骑日夜兼程。`, mine: a.f === st.player })
  return true
}

function raidStep(st: State, a: Army, out: Report[]) {
  if (a.raid === -1) {
    if (!a.path.length) {
      delete a.raid
      delete a.seen
      delete a.dashUntil
    }
    return
  }
  if (a.raid === -2) return
  const d = st.depots.find((x) => x.id === a.raid)
  if (!d) return rideHome(st, a)
  const o = ownerOf(st, a.at)
  if (o && atWar(st, a.f, o) && !a.seen) {
    const wary = st.armies.some((x) => x.f === o && hasTrait(x, 'wit') && (x.at === a.at || !!edgeBetween(x.at, a.at)))
    if (rand(st) < (wary ? 0.35 : 0.15)) a.seen = true
  }
  if (a.at !== d.at) {
    if (!a.path.length) rideHome(st, a)
    return
  }
  const guards = st.armies.filter((x) => x.f === d.f && x.at === d.at && !x.ready && x.raid === undefined)
  // the camp next door sends riders when the fires go up
  const relief = st.armies.filter((x) => x.f === d.f && x.raid === undefined && !x.ready && !!edgeBetween(x.at, d.at)).reduce((s, x) => s + x.troops * 0.15, 0)
  const gp = guards.reduce((s, x) => s + x.troops * (0.45 + x.org * 0.55), 0) + garrisonOf(st, d.at) * 0.3 + relief
  const lead = commander(a)
  const rp =
    a.troops * (0.45 + a.org * 0.55) * (1 + a.cav * 0.5) * (hasTrait(a, 'raid') ? 1.4 : 1) * (lead ? 1 + (lead.lead - 5) * 0.08 : 1) * (a.seen ? 1 : 1.6)
  const won = rp * (0.75 + rand(st) * 0.5) > gp
  const mine = a.f === st.player || d.f === st.player
  if (won) {
    for (const g of guards) g.troops *= 0.6
    a.troops *= 0.9
    burnDepot(st, d, a.f, out, 'raid')
  } else {
    a.troops *= 0.55
    a.org = 0.2
    const text = `${factionLabel(st, a.f)}奇袭${d.at}的粮囤${a.seen ? '，半路就被发现了，' : '，'}被守军击退。`
    log(st, { kind: 'battle', f: d.f, at: d.at, text, mine })
    out.push({ kind: 'event', at: d.at, f: d.f, text, mine })
  }
  rideHome(st, a)
}

// ---------- the player's hands ----------

export function splitArmy(st: State, armyId: number) {
  const a = st.armies.find((x) => x.id === armyId)
  if (!a || a.ready || a.troops < 4000 || inBattle(st, a)) return null
  const b: Army = {
    id: st.nextId++,
    f: a.f,
    at: a.at,
    path: [],
    prog: 0,
    troops: Math.round(a.troops / 2),
    cav: a.cav,
    navy: a.navy,
    org: a.org,
    food: a.food,
    sick: a.sick,
    north: a.north,
    gens: a.gens.length > 1 ? [a.gens[a.gens.length - 1]] : [],
    drill: a.drill,
    siege: 0,
  }
  // days of food and ratios are shared; civilians and one-off orders stay with the parent
  if (a.passUntil !== undefined) b.passUntil = a.passUntil
  a.troops -= b.troops
  a.gens = a.gens.filter((g) => !b.gens.includes(g))
  st.armies.push(b)
  return b
}

export function mergeHere(st: State, armyId: number) {
  const a = st.armies.find((x) => x.id === armyId)
  if (!a) return 0
  const others = st.armies.filter((x) => x !== a && x.f === a.f && x.at === a.at && !x.ready && !x.path.length)
  for (const o of others) {
    const n = a.troops + o.troops
    if (n <= 0) continue
    a.navy = (a.navy * a.troops + o.navy * o.troops) / n
    a.cav = (a.cav * a.troops + o.cav * o.troops) / n
    a.org = (a.org * a.troops + o.org * o.troops) / n
    a.sick = (a.sick * a.troops + o.sick * o.troops) / n
    a.food = (a.food * a.troops + o.food * o.troops) / n
    if (o.folk) a.folk = (a.folk ?? 0) + o.folk
    a.north = (a.north ? a.troops : 0) + (o.north ? o.troops : 0) >= n / 2
    if (o.dug) a.dug = Math.max(a.dug ?? 0, o.dug)
    a.siege = Math.max(a.siege, o.siege)
    a.drill = a.drill || o.drill
    if (a.guard === undefined && o.guard !== undefined) a.guard = o.guard
    if (a.raid === undefined && o.raid !== undefined) {
      a.raid = o.raid
      a.seen = o.seen
      if (o.dashUntil !== undefined) a.dashUntil = o.dashUntil
    }
    if (a.stance === undefined && o.stance) a.stance = o.stance
    if (o.flee !== undefined) a.flee = a.flee === undefined ? o.flee : Math.min(a.flee, o.flee)
    if (o.passUntil !== undefined) a.passUntil = a.passUntil === undefined ? o.passUntil : Math.max(a.passUntil, o.passUntil)
    a.troops = n
    for (const g of o.gens) if (a.gens.length < 3 && !a.gens.includes(g)) a.gens.push(g)
  }
  st.armies = st.armies.filter((x) => !others.includes(x))
  return others.length
}

export function drillBlock(a: Army) {
  const c = cellById.get(a.at)!
  if (!c.boats.length) return '这里没有能行船的大河'
  if (a.navy >= (a.north ? 0.7 : 1)) return a.north ? '北方兵练到这里就到头了' : '已经是一流水军'
  return null
}

export const FORT_DAYS = 120
export function fortCost(st: State, id: string) {
  return 12 * (cs(st, id).fort + 1)
}
export function fortBlock(st: State, f: Fid, id: string) {
  const s = cs(st, id)
  if (s.owner !== f) return '只能修自己的城'
  if (s.fort >= 3) return '城墙已经修到最高'
  if (st.flags[`fort:${id}`]) return '正在修'
  if (st.factions[f].grain < fortCost(st, id)) return `粮食不够（要 ${fortCost(st, id)} 万斛）`
  return null
}
export function fortify(st: State, f: Fid, id: string) {
  if (fortBlock(st, f, id)) return false
  st.factions[f].grain -= fortCost(st, id)
  st.flags[`fort:${id}`] = st.t + FORT_DAYS
  return true
}
function walls(st: State) {
  for (const k of Object.keys(st.flags)) {
    if (!k.startsWith('fort:') || st.t < st.flags[k]) continue
    const id = k.slice(5)
    delete st.flags[k]
    const s = cs(st, id)
    s.fort = Math.min(3, s.fort + 1)
    log(st, { kind: 'event', f: s.owner, at: id, text: `${id}的城墙修到了 ${s.fort} 级。`, mine: s.owner === st.player })
  }
}

/** Live strength of both sides in a running battle. */
export function battleOdds(st: State, b: Battle) {
  const A = sideArmies(st, b, 'att')
  const D = b.def ? sideArmies(st, b, 'def') : []
  return {
    att: sidePower(st, b, 'att', A).p,
    def: sidePower(st, b, 'def', D).p,
    attMen: A.reduce((s, a) => s + a.troops, 0),
    defMen: D.reduce((s, a) => s + a.troops, 0),
  }
}

export interface Preview {
  days: number
  path: string[]
  why?: string
  /** supply cost when it gets there */
  supply: Supply
  fight?: { us: number; them: number; men: number; foeMen: number; factors: Factor[] }
}

/** What happens if army `a` marches to `to`: how long, how hungry, and the odds of the first fight. */
export function preview(st: State, a: Army, to: string): Preview | null {
  const p = findPath(st, a, to)
  if (!p) return null
  if (!p.path.length) return { days: Infinity, path: [], why: p.why, supply: { cost: Infinity, ok: false, from: null } }
  const end = p.path[p.path.length - 1]
  const supply = supplyMap(st, a.f).get(end) ?? { cost: Infinity, ok: false, from: null }
  const o = ownerOf(st, end)
  const foes = st.armies.filter((x) => x.at === end && !x.ready && atWar(st, x.f, a.f))
  let fight: Preview['fight']
  if (foes.length || (o && atWar(st, a.f, o)) || o === null) {
    const from = p.path.length > 1 ? p.path[p.path.length - 2] : a.at
    const fake: Battle = { id: -1, at: end, att: a.f, def: foes[0]?.f ?? o, from, day: 0, start: st.t, lossA: 0, lossD: 0, factors: [] }
    const ghost = { ...a, at: end }
    const A = sidePower(st, fake, 'att', [ghost])
    const D = sidePower(st, fake, 'def', foes)
    fight = {
      us: A.p,
      them: D.p,
      men: a.troops,
      foeMen: foes.length ? foes.reduce((s, x) => s + x.troops, 0) : Math.round(garrisonOf(st, end)),
      factors: [...A.factors, ...D.factors],
    }
  }
  return { days: p.days, path: p.path, supply, fight }
}

export function cloneState(st: State): State {
  return JSON.parse(JSON.stringify(st))
}

export function unifyShare(st: State, f: Fid) {
  const core = cells.filter((c) => !c.id.endsWith('属国') && !['交州'].includes(c.province))
  return core.filter((c) => ownerOf(st, c.id) === f).length / core.length
}
