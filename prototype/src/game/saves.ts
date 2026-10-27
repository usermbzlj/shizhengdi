import { eventById, personById } from '../data'
import { placeById } from './world'

export const SAVE_V = 1
export const ROAM_SAVE = 'szd-roam-save'
/** left by the retired season-turn war game; cleared with the rest */
const OLD_WAR_SAVE = 'szd-war-save'

const MISSING = Symbol('missing')

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

function placeOk(id: unknown): id is string {
  return typeof id === 'string' && placeById.has(id)
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

export function drop(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    /* private mode */
  }
}

export function read(key: string): unknown | typeof MISSING {
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
export { MISSING }

export function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota or private mode */
  }
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

export function saveRoam(trip: RoamTrip) {
  write(ROAM_SAVE, { v: SAVE_V, ...trip })
}

const extraSaves = new Set<string>()
/** Other modes register their keys so the error page can clear them too. */
export function registerSave(key: string) {
  extraSaves.add(key)
}

export function clearSaves() {
  drop(OLD_WAR_SAVE)
  drop(ROAM_SAVE)
  for (const k of extraSaves) drop(k)
}
