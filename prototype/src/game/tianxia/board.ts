import raw from './board.json'

export type Terrain = 'plain' | 'hills' | 'mountain' | 'plateau'
export type Crossing = 'jiang' | 'he' | 'han' | 'huai'

export interface Cell {
  id: string
  province: string
  at: [number, number]
  area: number
  /** people counted in 140 (永和五年), 《后汉书·郡国志》 */
  pop140: number
  /** no census figure survives; the number is an estimate */
  est: boolean
  cities: number | null
  terrain: Terrain
  elev: number
  rugged: number
  seatElev: number
  coast: boolean
  /** rivers that carry boats through this commandery */
  boats: string[]
}

export interface Edge {
  a: string
  b: string
  km: number
  border: number
  /** big rivers between the two seats */
  cross: Crossing[]
  /** rivers that run from one to the other, so grain and troops can go by boat */
  water: string[]
  /** metres climbed above the higher seat on the way */
  climb: number
  pass: string | null
}

interface Board {
  base: string
  cells: Cell[]
  edges: Edge[]
  real: { years: number[]; f: string[][]; s: string[][] }
}

const board = raw as unknown as Board

export const BASE_CELLS = `data/cells/${board.base}.json`
export const cells = board.cells
export const cellIndex = new Map(cells.map((c, i) => [c.id, i]))
export const cellById = new Map(cells.map((c) => [c.id, c]))
export const edges = board.edges

// the river data stops short of the estuary, so the crossing at 京口 is missing
for (const e of edges) {
  if ([e.a, e.b].includes('广陵郡') && [e.a, e.b].includes('吴郡') && !e.cross.includes('jiang')) {
    e.cross.push('jiang')
    if (!e.water.includes('Chang Jiang')) e.water.push('Chang Jiang')
  }
}

const adj = new Map<string, { to: string; e: Edge }[]>()
for (const e of edges) {
  if (!adj.has(e.a)) adj.set(e.a, [])
  if (!adj.has(e.b)) adj.set(e.b, [])
  adj.get(e.a)!.push({ to: e.b, e })
  adj.get(e.b)!.push({ to: e.a, e })
}
export function links(id: string) {
  return adj.get(id) ?? []
}
export function edgeBetween(a: string, b: string) {
  return adj.get(a)?.find((l) => l.to === b)?.e
}

export const RIVER_NAME: Record<Crossing, string> = { jiang: '长江', he: '黄河', han: '汉水', huai: '淮河' }
export const BOAT_NAME: Record<string, string> = {
  'Chang Jiang': '长江',
  Han: '汉水',
  Huai: '淮河',
  Huang: '黄河',
  Xiang: '湘江',
  Gan: '赣江',
  Jialing: '嘉陵江',
  Min: '岷江',
  Wei: '渭水',
  Yuan: '沅水',
}
export const TERRAIN_NAME: Record<Terrain, string> = { plain: '平原', hills: '丘陵', mountain: '山地', plateau: '高原' }

/** North of the 秦岭–淮河 line: dry fields, wheat and millet, horses; south: paddies, rivers, fevers. */
export function isSouth(c: Cell) {
  if (c.province === '交州') return true
  if (c.province === '益州') return c.at[1] < 32.2
  return c.at[1] < 32.3 && c.at[0] > 108
}
export function isFrontier(c: Cell) {
  return ['凉州', '并州', '幽州'].includes(c.province) || c.id.endsWith('属国')
}

/** Index of the real-history keyframe at or before `year`. */
export function realIndex(year: number) {
  const ys = board.real.years
  let i = 0
  while (i < ys.length - 1 && ys[i + 1] <= year + 1e-6) i++
  return i
}
export function realOwners(year: number) {
  const i = realIndex(year)
  return { year: board.real.years[i], f: board.real.f[i], s: board.real.s[i] }
}
