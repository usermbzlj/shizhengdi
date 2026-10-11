import type { GeoJSONSource, Map as MLMap } from 'maplibre-gl'
import { events, factionColor } from '../data'
import { ENDING_ROUTE, eventBounds } from './eventArc'
import movesRaw from '../data/moves.json'
import type { LngLat } from '../data/types'
import { clamp, smoothstep } from '../lib/time'

export interface Move {
  id: string
  kind: 'capital' | 'migration'
  faction: string
  year: number
  duration: number
  label: string
  note: string
  points: LngLat[]
}

export const moves = movesRaw as unknown as Move[]

/** One animated path: drawn from 0 → 1 between start and start+duration, then held and faded. */
export interface Track {
  id: string
  kind: 'march' | 'capital' | 'migration'
  color: string
  label: string
  start: number
  duration: number
  hold: number
  path: LngLat[]
  lengths: number[]
  eventId?: string
}

function chaikin(pts: LngLat[], n = 3): LngLat[] {
  let p = pts
  for (let k = 0; k < n && p.length > 2; k++) {
    const out: LngLat[] = [p[0]]
    for (let i = 0; i < p.length - 1; i++) {
      const [a, b] = [p[i], p[i + 1]]
      out.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]])
      out.push([0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]])
    }
    out.push(p[p.length - 1])
    p = out
  }
  return p
}

/** Two-point moves become a gentle arc so they read as a journey, not a ruler line. */
function arc(a: LngLat, b: LngLat, bend = 0.12, steps = 28): LngLat[] {
  const mx = (a[0] + b[0]) / 2
  const my = (a[1] + b[1]) / 2
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const c: LngLat = [mx - dy * bend, my + dx * bend]
  const out: LngLat[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    out.push([(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]])
  }
  return out
}

function cumulative(path: LngLat[]) {
  const out = [0]
  for (let i = 1; i < path.length; i++) {
    const kx = Math.cos((path[i][1] * Math.PI) / 180)
    out.push(out[i - 1] + Math.hypot((path[i][0] - path[i - 1][0]) * kx, path[i][1] - path[i - 1][1]))
  }
  return out
}

/**
 * How much a path turns back on itself (1 = a pure out-and-back). Arcs and smoothing would turn such a
 * path into a loop, so a retreat along the road just taken is drawn straight.
 */
function reversal(points: LngLat[]) {
  const [a, b] = [points[0], points[points.length - 1]]
  const end = Math.hypot(b[0] - a[0], b[1] - a[1])
  let path = 0
  for (let i = 1; i < points.length; i++) path += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
  return path > 0 ? 1 - end / path : 0
}

function shape(points: LngLat[]) {
  if (reversal(points) > 0.35) return points
  return points.length === 2 ? arc(points[0], points[1]) : chaikin(points)
}

/**
 * A battle reads as a story: forces are already moving when the pin appears, they arrive as it breaks
 * out, and retreats, flights and the night raid play while the result is on the map.
 * A campaign moves along its route during the campaign; what follows comes at the end.
 */
function routeTiming(t: number, liveEnd: number, span: number, kind: string, label: string) {
  const after = kind === 'battle' && ENDING_ROUTE.test(label)
  if (span >= 0.6) {
    if (after) return { start: Math.max(t, liveEnd - 0.35), duration: Math.min(0.55, Math.max(0.28, span * 0.18)), hold: 0.55 }
    return { start: t - 0.22, duration: Math.max(0.5, span * 0.85), hold: 0.35 }
  }
  if (kind !== 'battle') return { start: t - 0.15, duration: Math.max(0.45, liveEnd - t + 0.15), hold: 0.45 }
  return after ? { start: liveEnd, duration: 0.4, hold: 0.55 } : { start: t - 0.42, duration: 0.42, hold: 0.35 }
}

/** A court journey already drawn by moves.json should not be drawn again from the event. */
function coveredByMove(t: number, span: number, side: string, label: string) {
  const a0 = t - 0.4
  const a1 = t + Math.max(span, 0.4) + 0.6
  const head = label.slice(0, 2)
  return moves.some((m) => {
    if (m.faction !== side || m.label.slice(0, 2) !== head) return false
    const b0 = m.year
    const b1 = m.year + m.duration
    return b1 >= a0 && b0 <= a1
  })
}

export const tracks: Track[] = (() => {
  const out: Track[] = []
  for (const e of events) {
    if (!e.routes?.length) continue
    const b = eventBounds(e)
    e.routes.forEach((r, i) => {
      if (r.points.length < 2) return
      if (e.kind !== 'battle' && coveredByMove(b.t, b.span, r.side, r.label)) return
      const path = shape(r.points)
      out.push({
        id: `${e.id}-${i}`,
        kind: 'march',
        color: factionColor(r.side),
        label: r.label,
        ...routeTiming(b.t, b.end, b.span, e.kind, r.label),
        path,
        lengths: cumulative(path),
        eventId: e.id,
      })
    })
  }
  for (const m of moves) {
    const path = shape(m.points)
    out.push({
      id: m.id,
      kind: m.kind,
      color: factionColor(m.faction),
      label: m.label,
      start: m.year,
      duration: m.duration,
      hold: 1,
      path,
      lengths: cumulative(path),
    })
  }
  return out
})()

export interface ActiveTrack {
  track: Track
  progress: number
  /** the drawn line */
  opacity: number
  /** the arrowhead: gone shortly after arrival */
  headOpacity: number
  /** the riding label: comes in once the march is under way, leaves with the arrowhead */
  labelOpacity: number
  head: LngLat
  bearing: number
}

export function activeTracks(year: number): ActiveTrack[] {
  const out: ActiveTrack[] = []
  for (const tr of tracks) {
    const end = tr.start + tr.duration
    if (year <= tr.start || year >= end + tr.hold) continue
    const raw = clamp((year - tr.start) / tr.duration, 0, 1)
    const progress = smoothstep(raw)
    const fadeIn = smoothstep(raw / 0.15)
    const fadeOut = 1 - smoothstep((year - end) / tr.hold)
    const arrived = smoothstep((year - end) / Math.min(0.2, tr.hold))
    const { head, bearing } = pointAt(tr, progress)
    out.push({
      track: tr,
      progress,
      opacity: fadeIn * fadeOut,
      headOpacity: fadeIn * (1 - arrived),
      labelOpacity: smoothstep(raw / 0.3) * (1 - arrived),
      head,
      bearing,
    })
  }
  return out
}

function pointAt(tr: Track, f: number) {
  const total = tr.lengths[tr.lengths.length - 1]
  const target = total * f
  let i = 1
  while (i < tr.lengths.length - 1 && tr.lengths[i] < target) i++
  const a = tr.path[i - 1]
  const b = tr.path[i]
  const seg = tr.lengths[i] - tr.lengths[i - 1] || 1
  const k = clamp((target - tr.lengths[i - 1]) / seg, 0, 1)
  const head: LngLat = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]
  const kx = Math.cos((head[1] * Math.PI) / 180)
  const bearing = (Math.atan2((b[0] - a[0]) * kx, b[1] - a[1]) * 180) / Math.PI
  return { head, bearing, index: i }
}

function partial(tr: Track, f: number): LngLat[] {
  if (f >= 1) return tr.path
  const { head, index } = pointAt(tr, f)
  return [...tr.path.slice(0, index), head]
}

/** Push the current frame of all animated paths into the map sources. */
export function renderTracks(map: MLMap, active: ActiveTrack[], dim: number) {
  const lines: GeoJSON.Feature[] = []
  const heads: GeoJSON.Feature[] = []
  for (const a of active) {
    const o = a.opacity * dim
    if (o <= 0.01) continue
    const props = { color: a.track.color, o, kind: a.track.kind }
    if (a.progress > 0.005) {
      lines.push({ type: 'Feature', properties: props, geometry: { type: 'LineString', coordinates: partial(a.track, a.progress) } })
    }
    const ho = a.headOpacity * dim
    if (ho > 0.01) {
      heads.push({
        type: 'Feature',
        properties: { ...props, o: ho, bearing: a.bearing },
        geometry: { type: 'Point', coordinates: a.head },
      })
    }
  }
  ;(map.getSource('anim-line') as GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: lines })
  ;(map.getSource('anim-head') as GeoJSONSource | undefined)?.setData({ type: 'FeatureCollection', features: heads })
}
