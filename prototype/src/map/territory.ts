import type { Map as MLMap, GeoJSONSource, ExpressionSpecification } from 'maplibre-gl'
import { factions, keyframes, keyframeIndex } from '../data'
import transitionsRaw from '../data/transitions.json'
import { clamp, smoothstep } from '../lib/time'
import { loadJSON } from '../lib/geo'

export interface TransitionInfo {
  from: string
  to: string
  /** how long the spread should take on screen when the map is not catching up */
  seconds: number
  area: number
}

export const transitions = transitionsRaw as TransitionInfo[]

/** Changing pieces start somewhere in [0, 0.72] of the window (scripts/build_transitions.py) and settle over the rest. */
const SETTLE = 0.28

/** How long before the next keyframe the change unfolds (in years). */
function fadeWindow(gap: number) {
  return Math.min(gap * 0.6, 1.4)
}

/** The transition that applies at `year` (index of its first keyframe) and the linear progress through its window. */
export function windowAt(year: number) {
  const n = keyframes.length
  if (n < 2) return { i: 0, p: 0, a: 0, b: 0 }
  const i = Math.min(keyframeIndex(year), n - 2)
  const b = keyframes[i + 1].year
  const a = b - fadeWindow(b - keyframes[i].year)
  return { i, p: clamp((year - a) / (b - a), 0, 1), a, b }
}

/** Year windows in which borders move, with their on-screen durations (used by playback). */
export function transitionWindows() {
  return transitions.map((t, i) => {
    const b = keyframes[i + 1].year
    return { a: b - fadeWindow(b - keyframes[i].year), b, seconds: t.seconds }
  })
}

export interface TerritoryMix {
  index: number
  next: number
  mix: number
}

/** Eased progress between two keyframes, for things that follow the borders (labels, capitals). */
export function mixAt(year: number): TerritoryMix {
  if (!keyframes.length) return { index: 0, next: 0, mix: 0 }
  if (keyframes.length < 2) return { index: 0, next: 0, mix: 0 }
  const { i, p } = windowAt(year)
  return { index: i, next: i + 1, mix: smoothstep(p) }
}

// ---- transition data: a small cache around the current year ----

const cache = new Map<number, GeoJSON.FeatureCollection>()
const pending = new Map<number, Promise<void>>()
const retryAt = new Map<number, number>()
const loaded = new Set<() => void>()
const KEEP = 8

function notifyLoaded() {
  for (const f of [...loaded]) {
    try {
      f()
    } catch (e) {
      console.error('[territory]', e)
    }
  }
}

function fetchTransition(i: number) {
  if (i < 0 || i >= transitions.length || cache.has(i) || pending.has(i)) return
  if ((retryAt.get(i) ?? 0) > performance.now()) return
  const p = loadJSON(`data/transitions/${transitions[i].from}.json`, { keep: false })
    .then((d) => {
      cache.set(i, d as GeoJSON.FeatureCollection)
      retryAt.delete(i)
      notifyLoaded()
    })
    .catch(() => {
      retryAt.set(i, performance.now() + 5000)
    })
    .finally(() => pending.delete(i))
  pending.set(i, p)
}

function trim(around: number) {
  if (cache.size <= KEEP) return
  const far = [...cache.keys()].sort((x, y) => Math.abs(y - around) - Math.abs(x - around))
  for (const k of far.slice(0, cache.size - KEEP)) cache.delete(k)
}

/** Discrete labels switch once the new border has mostly settled, not at the halfway point. */
export const LABEL_AT = 0.82

export function shownIndex(index: number, next: number, mix: number) {
  return mix > LABEL_AT ? next : index
}

/** False while the map is inside a border change whose data has not arrived yet. */
export function territoryReady(year: number) {
  const { i, p } = windowAt(year)
  if (p <= 0 || p >= 1) return true
  fetchTransition(i)
  return cache.has(i)
}

/** Run a source update and resolve once its tiles have been rebuilt, so paint changes land on the new data. */
function whenDrawn(map: MLMap, id: string, change: () => Promise<unknown>) {
  return new Promise<void>((resolve) => {
    let changed = false
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      map.off('sourcedata', onData)
      resolve()
    }
    const check = () => {
      if (changed && map.isSourceLoaded(id)) finish()
    }
    const onData = (e: { sourceId?: string }) => {
      if (e.sourceId !== id || !changed) return
      check()
    }
    const timer = window.setTimeout(finish, 2000)
    map.on('sourcedata', onData)
    change()
      .then(() => {
        changed = true
        requestAnimationFrame(check)
      })
      .catch(finish)
  })
}

// ---- paint ----

const colorOf = (prop: string): ExpressionSpecification =>
  ['match', ['get', prop], ...factions.flatMap((f) => [f.id, f.color]), '#8a8478'] as unknown as ExpressionSpecification

const strengthOf = (prop: string): ExpressionSpecification => ['match', ['get', prop], 'core', 1, 'weak', 0.78, 'contested', 0.62, 0]

/** Per-piece progress: 0 until the front reaches it, then an eased rise to 1. */
function local(m: number): ExpressionSpecification {
  return [
    'let',
    'x',
    ['min', 1, ['max', 0, ['/', ['-', m, ['get', 't']], SETTLE]]],
    ['*', ['*', ['var', 'x'], ['var', 'x']], ['-', 3, ['*', 2, ['var', 'x']]]],
  ]
}

const COLOR_A: ExpressionSpecification = ['case', ['==', ['get', 'fa'], ''], colorOf('fb'), colorOf('fa')]
const COLOR_B: ExpressionSpecification = ['case', ['==', ['get', 'fb'], ''], colorOf('fa'), colorOf('fb')]
const OPACITY_A: ExpressionSpecification = ['case', ['==', ['get', 'fa'], ''], 0, strengthOf('sa')]
const OPACITY_B: ExpressionSpecification = ['case', ['==', ['get', 'fb'], ''], 0, strengthOf('sb')]

export class TerritoryController {
  private map: MLMap
  /** transition whose pieces are on screen */
  private shown = -1
  /** transition handed to the source but not drawn yet */
  private loading = -1
  private job = 0
  private visible = true
  private opacity = { fill: 0.26, wash: 0.68, edge: 0.85 }
  private staticKey = ''
  private dynKey = ''
  private last: [number, number] | null = null
  private onLoad = () => {
    if (this.last) this.update(...this.last)
  }

  constructor(map: MLMap, theme: 'dark' | 'light') {
    this.map = map
    this.setTheme(theme)
    map.setPaintProperty('terr-fill', 'fill-color', colorOf('fa'))
    for (const id of ['terr-wash', 'terr-wash-dyn', 'terr-edge', 'terr-edge-dyn']) map.setPaintProperty(id, 'line-color', colorOf('f'))
    // data arriving while the timeline rests must still reach the map
    loaded.add(this.onLoad)
  }

  destroy() {
    loaded.delete(this.onLoad)
  }

  setTheme(theme: 'dark' | 'light') {
    this.opacity = theme === 'dark' ? { fill: 0.16, wash: 0.62, edge: 0.75 } : { fill: 0.26, wash: 0.68, edge: 0.85 }
    this.staticKey = this.dynKey = ''
  }

  setVisible(v: boolean) {
    this.visible = v
  }

  update(year: number, dim = 1) {
    if (keyframes.length < 2) return
    this.last = [year, dim]
    const { i, p } = windowAt(year)
    for (const k of [i, i + 1, i - 1, i + 2]) fetchTransition(k)
    trim(i)
    // outside a window the neighbouring transition shows exactly the same state, so either will do
    let show = -1
    let m = p
    if (cache.has(i)) show = i
    else if (p <= 0 && cache.has(i - 1)) [show, m] = [i - 1, 1]
    else if (p >= 1 && cache.has(i + 1)) [show, m] = [i + 1, 0]
    if (show < 0) {
      let best = -1
      let bestD = Infinity
      for (const k of cache.keys()) {
        const d = Math.abs(k - i)
        if (d < bestD) {
          bestD = d
          best = k
        }
      }
      if (best < 0) return
      show = best
      m = best <= i ? 1 : 0
    }
    const src = this.map.getSource('terr') as GeoJSONSource | undefined
    const data = cache.get(show)
    if (!src || !data) return
    if (show === this.shown && this.loading !== -1 && this.loading !== show) {
      const job = ++this.job
      this.loading = show
      whenDrawn(this.map, 'terr', () => src.setData(data)).then(() => {
        if (this.job !== job) return
        this.loading = -1
        this.dynKey = ''
        if (this.last) this.update(...this.last)
      })
      return
    }
    if (show === this.shown && this.loading === show) return
    if (show !== this.shown && show !== this.loading) {
      const job = ++this.job
      this.loading = show
      whenDrawn(this.map, 'terr', () => src.setData(data)).then(() => {
        if (this.job !== job) return
        this.loading = -1
        this.shown = show
        this.dynKey = ''
        if (this.last) this.update(...this.last)
      })
    }
    if (show !== this.shown) {
      // Until the new pieces are on screen, hold the old ones at the keyframe both transitions share;
      // painting old pieces with the new progress would flash the previous era's borders.
      if (this.shown < 0) return
      m = this.shown < show ? 1 : 0
    }
    this.paint(m, this.visible ? dim : 0)
  }

  private paint(m: number, v: number) {
    const o = this.opacity
    const map = this.map
    const sk = `${Math.round(v * 200)}|${o.fill}`
    if (sk !== this.staticKey) {
      this.staticKey = sk
      map.setPaintProperty('terr-fill', 'fill-opacity', ['*', o.fill * v, strengthOf('sa')])
      map.setPaintProperty('terr-wash', 'line-opacity', o.wash * v)
      map.setPaintProperty('terr-edge', 'line-opacity', o.edge * v)
    }
    const dk = `${Math.round(m * 600)}|${sk}`
    if (dk === this.dynKey) return
    this.dynKey = dk
    const x = local(Math.round(m * 600) / 600)
    const along: ExpressionSpecification = ['case', ['==', ['get', 'm'], 'a'], ['-', 1, x], x]
    map.setPaintProperty('terr-fill-dyn', 'fill-color', ['interpolate-lab', ['linear'], x, 0, COLOR_A, 1, COLOR_B])
    map.setPaintProperty('terr-fill-dyn', 'fill-opacity', ['*', o.fill * v, ['interpolate', ['linear'], x, 0, OPACITY_A, 1, OPACITY_B]])
    map.setPaintProperty('terr-wash-dyn', 'line-opacity', ['*', o.wash * v, along])
    map.setPaintProperty('terr-edge-dyn', 'line-opacity', ['*', o.edge * v, along])
  }
}
