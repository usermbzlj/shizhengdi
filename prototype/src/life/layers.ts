import type { GeoJSONSource, Map as MLMap } from 'maplibre-gl'
import type { LngLat } from './zhuge'

const EMPTY = { type: 'FeatureCollection' as const, features: [] }

function line(coords: LngLat[], props: Record<string, unknown> = {}) {
  return { type: 'Feature' as const, properties: props, geometry: { type: 'LineString' as const, coordinates: coords } }
}

export function addLifeLayers(map: MLMap) {
  if (map.getSource('life-road')) return
  for (const id of ['life-road', 'life-walked', 'life-marches', 'life-path', 'life-flight'])
    map.addSource(id, { type: 'geojson', data: EMPTY })
  map.addLayer({
    id: 'life-road',
    type: 'line',
    source: 'life-road',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': '#e8c77a', 'line-width': 2, 'line-opacity': 0.55, 'line-dasharray': [1.5, 2.5] },
  })
  map.addLayer({
    id: 'life-walked',
    type: 'line',
    source: 'life-walked',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': '#f3d48c', 'line-width': 3.2, 'line-opacity': 0.95, 'line-blur': 0.4 },
  })
  map.addLayer({
    id: 'life-marches',
    type: 'line',
    source: 'life-marches',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': '#e9a07a',
      'line-width': 2.4,
      'line-opacity': ['coalesce', ['get', 'o'], 0.8],
      'line-dasharray': [2, 1.6],
    },
  })
  map.addLayer({
    id: 'life-path-glow',
    type: 'line',
    source: 'life-path',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': '#e8c77a', 'line-width': 10, 'line-opacity': 0.18, 'line-blur': 6 },
  })
  map.addLayer({
    id: 'life-path',
    type: 'line',
    source: 'life-path',
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': '#f3d48c', 'line-width': 2.4, 'line-opacity': 0.95 },
  })
  map.addLayer({
    id: 'life-flight',
    type: 'circle',
    source: 'life-flight',
    paint: {
      'circle-radius': 1.8,
      'circle-color': '#ebe6dc',
      'circle-opacity': ['get', 'o'],
      'circle-blur': 0.3,
    },
  })
}

function set(map: MLMap, id: string, data: unknown) {
  ;(map.getSource(id) as GeoJSONSource | undefined)?.setData(data as GeoJSON.GeoJSON)
}

export function showRoad(map: MLMap, path: LngLat[] | null) {
  set(map, 'life-road', path ? line(path) : EMPTY)
}

export function showWalked(map: MLMap, path: LngLat[] | null) {
  set(map, 'life-walked', path && path.length > 1 ? line(path) : EMPTY)
}

export function showMarches(map: MLMap, marches: { path: LngLat[]; o: number }[]) {
  set(map, 'life-marches', { type: 'FeatureCollection', features: marches.map((m) => line(m.path, { o: m.o })) })
}

export function showLifePath(map: MLMap, path: LngLat[] | null) {
  set(map, 'life-path', path ? line(path) : EMPTY)
}

/** Polyline helpers in plain degrees; good enough at these scales. */
export function cumulative(path: LngLat[]) {
  const out = [0]
  for (let i = 1; i < path.length; i++) {
    const [a, b] = [path[i - 1], path[i]]
    out.push(out[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]))
  }
  return out
}

export function pointAt(path: LngLat[], cum: number[], t: number): LngLat {
  const d = Math.max(0, Math.min(1, t)) * cum[cum.length - 1]
  let i = 1
  while (i < cum.length - 1 && cum[i] < d) i++
  const seg = cum[i] - cum[i - 1] || 1
  const k = (d - cum[i - 1]) / seg
  const [a, b] = [path[i - 1], path[i]]
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]
}

export function sliceTo(path: LngLat[], cum: number[], t: number): LngLat[] {
  const d = Math.max(0, Math.min(1, t)) * cum[cum.length - 1]
  const out: LngLat[] = [path[0]]
  for (let i = 1; i < path.length && cum[i] <= d; i++) out.push(path[i])
  out.push(pointAt(path, cum, t))
  return out
}

/** People leaving 徐州 for the south: dots drifting along a few loose streams. */
export function runFlight(map: MLMap) {
  const streams: LngLat[][] = [
    [[117.9, 35.1], [117.6, 34.2], [117.9, 33.2], [118.6, 32.3], [119.3, 31.6]],
    [[118.5, 35.3], [118.6, 34.3], [118.9, 33.3], [119.4, 32.4], [120.1, 31.5]],
    [[117.2, 34.6], [116.9, 33.6], [116.8, 32.6], [117.2, 31.6], [117.9, 30.9]],
    [[118.2, 34.7], [117.9, 33.7], [118.2, 32.8], [118.7, 31.9]],
  ]
  const cums = streams.map(cumulative)
  const dots = Array.from({ length: 140 }, (_, i) => ({
    s: i % streams.length,
    t: Math.random(),
    v: 0.018 + Math.random() * 0.02,
    j: [(Math.random() - 0.5) * 0.35, (Math.random() - 0.5) * 0.35] as LngLat,
  }))
  let raf = 0
  let last = performance.now()
  let fade = 0
  let stopping = false
  const tick = (now: number) => {
    const dt = Math.min(0.1, (now - last) / 1000)
    last = now
    fade = Math.max(0, Math.min(1, fade + (stopping ? -dt : dt) * 0.8))
    const features = dots.map((d) => {
      d.t += d.v * dt
      if (d.t > 1) d.t -= 1
      const [x, y] = pointAt(streams[d.s], cums[d.s], d.t)
      const edge = Math.min(1, d.t * 6, (1 - d.t) * 4)
      return {
        type: 'Feature' as const,
        properties: { o: 0.75 * edge * fade },
        geometry: { type: 'Point' as const, coordinates: [x + d.j[0], y + d.j[1]] },
      }
    })
    set(map, 'life-flight', { type: 'FeatureCollection', features })
    if (stopping && fade <= 0) {
      set(map, 'life-flight', EMPTY)
      return
    }
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  return {
    stop() {
      stopping = true
    },
    kill() {
      cancelAnimationFrame(raf)
      set(map, 'life-flight', EMPTY)
    },
  }
}
