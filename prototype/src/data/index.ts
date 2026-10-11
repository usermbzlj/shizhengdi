import factionsRaw from './factions.json'
import keyframesRaw from './keyframes.json'
import eventsRaw from './events.json'
import worldRaw from './world.json'
import citiesRaw from './cities.json'
import personsRaw from './persons.json'
import chaptersRaw from './chapters.json'
import linesRaw from './lines.json'
import gazetteerRaw from './gazetteer.json'
import passesRaw from './passes.json'
import peripheryRaw from './periphery.json'
import briefsRaw from './briefs.json'
import type { Chapter, City, EventBrief, Faction, Gazetteer, HistEvent, Keyframe, PeripheryLabel, Person, StoryLine, WorldEvent } from './types'

// JSON imports are typed structurally by TS; the generated files follow these shapes.
const as = <T,>(v: unknown) => v as T

export const factions = as<Faction[]>(factionsRaw)
export const keyframes = as<Keyframe[]>(keyframesRaw).slice().sort((a, b) => a.year - b.year)
export const events = as<HistEvent[]>(eventsRaw).slice().sort((a, b) => eventTime(a) - eventTime(b))
export const worldEvents = as<WorldEvent[]>(worldRaw)
export const cities = as<City[]>(citiesRaw)
export const persons = as<Person[]>(personsRaw)
export const chapters = as<Chapter[]>(chaptersRaw)
export const storyLines = as<StoryLine[]>(linesRaw)
export const gazetteer = as<Gazetteer[]>(gazetteerRaw)
export const periphery = as<PeripheryLabel[]>(peripheryRaw)
export const passes = as<{ id: string; name: string; lng: number; lat: number; type: string; note: string }[]>(passesRaw)

export const factionById = new Map(factions.map((f) => [f.id, f]))
export const eventById = new Map(events.map((e) => [e.id, e]))
export const worldById = new Map(worldEvents.map((e) => [e.id, e]))
export const cityById = new Map(cities.map((c) => [c.id, c]))
export const personById = new Map(persons.map((p) => [p.id, p]))
export const lineById = new Map(storyLines.map((l) => [l.id, l]))
export const briefById = new Map(Object.entries(briefsRaw as Record<string, EventBrief>))

const FACTION_SHORT: Record<string, string> = {
  han: '汉廷',
  huangjin: '黄巾',
  heishan: '黑山',
  dong: '董卓',
  yuanshao: '袁绍',
  yuanshu: '袁术',
  cao: '曹操',
  wei: '魏',
  liubei: '刘备',
  shu: '蜀',
  sun: '孙氏',
  wu: '吴',
  jin: '晋',
  liubiao: '刘表',
  liuzhang: '刘璋',
  zhanglu: '张鲁',
  gongsunzan: '公孙瓒',
  taoqian: '陶谦',
  lvbu: '吕布',
  zhangxiu: '张绣',
  liang: '凉州军',
  gongsun_liaodong: '公孙渊',
  shixie: '士燮',
  qiang: '羌',
  di: '氐',
  wuhuan: '乌桓',
  xianbei: '鲜卑',
  xiongnu: '匈奴',
  goguryeo: '高句丽',
  nanzhong: '南中',
  liuyao: '刘繇',
}

export function factionShort(id: string) {
  return FACTION_SHORT[id] ?? factionName(id)
}

export function eventTime(e: { year: number; month?: number | null }) {
  return e.year + ((e.month ?? 6) - 0.5) / 12
}

export function factionColor(id: string) {
  return factionById.get(id)?.color ?? '#8a8478'
}

export function factionName(id: string) {
  return factionById.get(id)?.name ?? id
}

export function cityNameAt(city: City, year: number) {
  const y = Math.floor(year)
  const hit = city.names.find((n) => y >= n.from && y <= n.to)
  return hit ?? null
}

export function personLocationAt(p: Person, year: number) {
  const y = Math.floor(year)
  return p.locations.find((l) => y >= l.from && y <= l.to) ?? null
}

/** Where to draw a person: near the end of a stay they travel smoothly toward the next place. */
export function personPositionAt(p: Person, year: number): { lng: number; lat: number; moving: boolean } | null {
  const y = Math.floor(year)
  const i = p.locations.findIndex((l) => y >= l.from && y <= l.to)
  if (i < 0) return null
  const cur = p.locations[i]
  const next = p.locations[i + 1]
  // stays are closed on both ends, so a move often shares its boundary year (to === next.from)
  const leave = cur.to + 1
  const travel = 0.45
  const departs = next && next.from <= leave && (next.lng !== cur.lng || next.lat !== cur.lat)
  if (departs && year > leave - travel) {
    const k = Math.min(1, (year - (leave - travel)) / travel)
    const e = k * k * (3 - 2 * k)
    return { lng: cur.lng + (next.lng - cur.lng) * e, lat: cur.lat + (next.lat - cur.lat) * e, moving: true }
  }
  return { lng: cur.lng, lat: cur.lat, moving: false }
}

/** Index of the last keyframe at or before `year`. */
export function keyframeIndex(year: number) {
  let i = 0
  while (i < keyframes.length - 1 && keyframes[i + 1].year <= year) i++
  return i
}

export function distanceKm(a: [number, number], b: [number, number]) {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b[1] - a[1])
  const dLng = toRad(b[0] - a[0])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}
