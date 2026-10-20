import { eventById, personById } from '../data'
import type { State } from './engine'
import { scenarioById } from './scenarios'
import { factions, generalById, placeById } from './world'

export const SAVE_V = 1
export const WAR_SAVE = 'szd-war-save'
export const ROAM_SAVE = 'szd-roam-save'

const MISSING = Symbol('missing')
const SIDES = new Set<string>([...Object.keys(factions), 'lianjun'])

export interface RoamTrip {
  year: number
  at: string
  km: number
  path: string[]
  met: { id: string; year: number; at: string }[]
  rumors: { id: string; year: number; place: string; at: [number, number]; from: string }[]
  seenEvents: string[]
}

function isRec(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

function num(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v)
}

function sideOk(id: unknown): id is string {
  return typeof id === 'string' && SIDES.has(id)
}

function placeOk(id: unknown): id is string {
  return typeof id === 'string' && placeById.has(id)
}

function generalOk(id: unknown): id is string {
  return typeof id === 'string' && generalById.has(id)
}

function nums(v: unknown) {
  return isRec(v) && Object.values(v).every(num)
}

function armyOk(a: unknown) {
  if (!isRec(a) || !num(a.id) || !sideOk(a.side) || !placeOk(a.at) || !num(a.troops) || !num(a.navy)) return false
  if (typeof a.moved !== 'boolean' || !num(a.sick)) return false
  return Array.isArray(a.generals) && a.generals.every(generalOk)
}

function stateOk(s: unknown, scenario: string): s is State {
  if (!isRec(s) || s.scenario !== scenario || !sideOk(s.player)) return false
  if (!num(s.year) || !num(s.season) || !num(s.turn) || !num(s.nextId)) return false
  if (!isRec(s.owner) || !isRec(s.grain) || !isRec(s.ai) || !isRec(s.flags)) return false
  if (!Array.isArray(s.armies) || !s.armies.every(armyOk)) return false
  if (!Array.isArray(s.recruited) || !s.recruited.every(generalOk)) return false
  for (const [id, side] of Object.entries(s.owner)) if (!placeOk(id) || !(side === null || sideOk(side))) return false
  for (const [id, n] of Object.entries(s.grain)) if (!sideOk(id) || !num(n)) return false
  for (const [id, n] of Object.entries(s.ai)) if (!sideOk(id) || (n !== 0 && n !== 1 && n !== 2)) return false
  for (const v of Object.values(s.flags)) if (typeof v !== 'boolean') return false
  if (s.over !== undefined && (!isRec(s.over) || typeof s.over.won !== 'boolean' || typeof s.over.text !== 'string')) return false
  if (s.calm !== undefined && !nums(s.calm)) return false
  if (s.far !== undefined && !(isRec(s.far) && Object.entries(s.far).every(([id, n]) => sideOk(id) && num(n)))) return false
  return true
}

function rumorOk(r: unknown) {
  if (!isRec(r) || typeof r.id !== 'string' || !personById.has(r.id) || !num(r.year)) return false
  if (typeof r.place !== 'string' || typeof r.from !== 'string' || !Array.isArray(r.at) || r.at.length < 2) return false
  return num(r.at[0]) && num(r.at[1])
}

function roamOk(v: unknown): v is RoamTrip & { v: number } {
  if (!isRec(v) || v.v !== SAVE_V || !num(v.year) || !placeOk(v.at) || !num(v.km)) return false
  if (!Array.isArray(v.path) || !v.path.every(placeOk)) return false
  if (!Array.isArray(v.met) || !v.met.every((m) => isRec(m) && typeof m.id === 'string' && personById.has(m.id) && num(m.year) && placeOk(m.at))) return false
  if (!Array.isArray(v.rumors) || !v.rumors.every(rumorOk)) return false
  return Array.isArray(v.seenEvents) && v.seenEvents.every((id) => typeof id === 'string' && eventById.has(id))
}

function drop(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    /* private mode */
  }
}

function read(key: string): unknown | typeof MISSING {
  let raw: string | null
  try {
    raw = localStorage.getItem(key)
  } catch {
    return MISSING
  }
  if (raw == null) return MISSING
  try {
    return JSON.parse(raw) as unknown
  } catch {
    drop(key)
    return MISSING
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota or private mode */
  }
}

export function savedGame(): { scenario: string; state: State } | null {
  const v = read(WAR_SAVE)
  if (v === MISSING) return null
  if (!isRec(v) || v.v !== SAVE_V || typeof v.scenario !== 'string' || !scenarioById.has(v.scenario) || !stateOk(v.state, v.scenario)) {
    drop(WAR_SAVE)
    return null
  }
  return { scenario: v.scenario, state: v.state }
}

export function savedRoam<T extends RoamTrip>(): T | null {
  const v = read(ROAM_SAVE)
  if (v === MISSING) return null
  if (!roamOk(v)) {
    drop(ROAM_SAVE)
    return null
  }
  const { v: version, ...trip } = v
  return version === SAVE_V ? (trip as T) : null
}

export function saveGame(scenario: string, state: State) {
  write(WAR_SAVE, { v: SAVE_V, scenario, state })
}

export function saveRoam(trip: RoamTrip) {
  write(ROAM_SAVE, { v: SAVE_V, ...trip })
}

export function clearGame() {
  drop(WAR_SAVE)
}

export function clearSaves() {
  drop(WAR_SAVE)
  drop(ROAM_SAVE)
}
