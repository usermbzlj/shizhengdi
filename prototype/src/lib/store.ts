import { useSyncExternalStore } from 'react'

export type Panel =
  | { kind: 'event'; id: string }
  | { kind: 'world'; id: string }
  | { kind: 'city'; id: string }
  | { kind: 'person'; id: string }
  | { kind: 'line'; id: string }
  | { kind: 'place'; name: string; lng: number; lat: number }
  | null

export type Mode = 'opening' | 'explore' | 'guide' | 'scene' | 'travel' | 'chat'

export interface LayerState {
  territory: boolean
  provinces: boolean
  events: boolean
  people: boolean
  rivers: boolean
  passes: boolean
  lines: Record<string, boolean>
}

export interface AppState {
  /** The year the map is showing (follows `target`, see lib/playback). */
  year: number
  /** The timeline cursor: where the user dragged, or where a guided step is heading. */
  target: number
  mode: Mode
  panel: Panel
  hometown: string | null
  layers: LayerState
  theme: 'dark' | 'light'
  muted: boolean
  /** Guide keeps its place, but the clock waits. Set when the timeline is touched mid-story. */
  hold: boolean
  chatPerson: string | null
  // 0..1 progress of the "today" overlay (modern cities, railways) used by opening / travel transitions
  modernity: number
}

const saved = (() => {
  try {
    return JSON.parse(localStorage.getItem('szd-prefs') || '{}') as Partial<AppState>
  } catch {
    return {}
  }
})()

let state: AppState = {
  year: 184,
  target: 184,
  mode: 'opening',
  panel: null,
  hometown: saved.hometown ?? null,
  layers: {
    territory: true,
    provinces: false,
    events: false,
    people: false,
    rivers: true,
    passes: false,
    lines: {},
  },
  theme: saved.theme ?? 'light',
  muted: saved.muted ?? true,
  hold: false,
  chatPerson: null,
  modernity: 0,
}

const listeners = new Set<() => void>()

export function getState() {
  return state
}

export function setState(patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) {
  const p = typeof patch === 'function' ? patch(state) : patch
  state = { ...state, ...p }
  if ('hometown' in p || 'theme' in p || 'muted' in p) {
    localStorage.setItem(
      'szd-prefs',
      JSON.stringify({ hometown: state.hometown, theme: state.theme, muted: state.muted }),
    )
  }
  listeners.forEach((l) => l())
}

export function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useStore<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state))
}

let yearAnim = 0
let flightId = 0
let flight: { id: number; resolve: (result: 'done' | 'cancelled') => void } | null = null

function cancelFlight() {
  cancelAnimationFrame(yearAnim)
  yearAnim = 0
  const current = flight
  flight = null
  current?.resolve('cancelled')
}

/** Id of the latest year animation. A caller can avoid cancelling a newer one on cleanup. */
export function activeFlight() {
  return flightId
}

/** Move the timeline cursor with an ease-in-out curve; the map follows via playback. */
export function animateYear(to: number, duration = 1200, ease: (t: number) => number = easeInOut) {
  const id = ++flightId
  cancelFlight()
  const from = state.target
  const start = performance.now()
  const ms = Math.max(1, duration)
  return new Promise<'done' | 'cancelled'>((resolve) => {
    flight = { id, resolve }
    const step = (now: number) => {
      if (flight?.id !== id) return
      const t = Math.min(1, Math.max(0, (now - start) / ms))
      const y = from + (to - from) * ease(t)
      setState({ year: y, target: y })
      if (t < 1) yearAnim = requestAnimationFrame(step)
      else {
        flight = null
        resolve('done')
      }
    }
    yearAnim = requestAnimationFrame(step)
  })
}

/** Put both the cursor and the map at a year immediately (opening, returning from a trip). */
export function jumpYear(y: number) {
  cancelFlight()
  setState({ year: y, target: y })
}

export function stopYearAnimation() {
  cancelFlight()
}

export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
