import { useEffect, useRef } from 'react'
import { Map as MapLibre, type Map as MLMap, type GeoJSONSource, type FilterSpecification } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import './worker'
import { applyPalette, buildStyle } from './style'
import { setMap } from './mapRef'
import { TerritoryController, mixAt, shownIndex } from './territory'
import { MarkerPool, el, type MarkerItem } from './markers'
import { getState, subscribe, type AppState } from '../lib/store'
import { openExplore } from '../lib/nav'
import {
  cities,
  cityNameAt,
  eventById,
  events,
  factionColor,
  factionName,
  gazetteer,
  keyframes,
  passes,
  periphery,
  personById,
  personPositionAt,
  persons,
} from '../data'
import { loadJSON } from '../lib/geo'
import { declutter } from './declutter'
import type { Person } from '../data/types'
import { activeTracks, renderTracks, type ActiveTrack } from './dynamics'
import { arcAmount, arcPhase, eventBounds } from './eventArc'
import { iconSvg } from './icons'
import { smoothstep } from '../lib/time'
import { portraits } from '../data/portraits'

export default function MapView() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initial = getState()
    const map = new MapLibre({
      container: container.current!,
      style: buildStyle(initial.theme),
      center: [104, 22],
      zoom: 1.3,
      minZoom: 1,
      maxZoom: 9,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
      renderWorldCopies: false,
      fadeDuration: 0,
    })
    map.touchZoomRotate.disableRotation()
    map.keyboard.disableRotation()
    if (import.meta.env.DEV) (window as unknown as { __rawMap: MLMap }).__rawMap = map
    map.on('error', (e) => {
      console.error('[map]', e.error?.message ?? e)
      if (import.meta.env.DEV) {
        const w = window as unknown as { __errs?: string[] }
        ;(w.__errs ??= []).push(String(e.error?.message ?? e))
      }
    })

    let ctrl: TerritoryController | null = null
    let pools: Record<string, MarkerPool> = {}
    let raf = 0
    let prev: Partial<AppState> = {}
    let lastPeripheryYear = NaN
    let lastProvinceKey = ''
    let lastLinesKey: string | null = null
    let lastYear = -Infinity
    let hideRoutes = false
    let zoomBucket = ''

    let globe = false
    const onZoom = () => {
      const z = map.getZoom()
      const b = z < 4.2 ? 'z-low' : z < 5.6 ? 'z-mid' : 'z-high'
      if (b !== zoomBucket) {
        if (zoomBucket) container.current?.classList.remove(zoomBucket)
        container.current?.classList.add(b)
        zoomBucket = b
        schedule()
      }
      // once the map curls into a globe, only the territories stay
      const g = z < GLOBE_ZOOM
      if (g !== globe && ctrl) {
        globe = g
        container.current?.classList.toggle('z-globe', g)
        for (const id of GLOBE_HIDDEN) setVisible(map, id, !g && layerWanted(id, getState()))
      }
    }

    const render = () => {
      raf = 0
      if (!ctrl) return
      const s = getState()
      const year = s.year
      const sceneView = s.mode === 'scene'

      if (s.theme !== prev.theme) applyTheme(map, s.theme, ctrl)

      const modern = s.modernity
      const board = s.mode === 'game'
      ctrl.setVisible(!board && (sceneView || s.layers.territory))
      ctrl.update(year, 1 - modern)
      setOpacity(map, 'modern-rail', 'line-opacity', 0.75 * Math.min(1, Math.max(0, (modern - 0.55) / 0.45)))
      setOpacity(map, 'modern-heritage', 'line-opacity', 0.85 * Math.min(1, Math.max(0, (modern - 0.12) / 0.3)))
      setOpacity(map, 'modern-lights', 'circle-opacity', 0.9 * Math.min(1, Math.max(0, (modern - 0.35) / 0.5)))
      setOpacity(map, 'periphery-fill', 'fill-opacity', 0.05 * (1 - modern))
      setOpacity(map, 'periphery-line', 'line-opacity', 0.35 * (1 - modern))
      setVisible(map, 'rivers', (sceneView || s.layers.rivers) && !globe)

      const iy = Math.floor(year)
      if (iy !== lastPeripheryYear) {
        lastPeripheryYear = iy
        map.setFilter('periphery-fill', periodFilter(iy))
        map.setFilter('periphery-line', periodFilter(iy))
      }

      const { index, next, mix } = mixAt(year)
      const provKey = !sceneView && s.layers.provinces ? (keyframes[shownIndex(index, next, mix)]?.id ?? '') : ''
      if (provKey !== lastProvinceKey) {
        lastProvinceKey = provKey
        setVisible(map, 'provinces-line', !!provKey && !globe)
        if (provKey)
          loadJSON(`data/provinces/${provKey}.json`)
            .then((d) => {
              if (lastProvinceKey !== provKey) return
              const src = map.getSource('provinces') as GeoJSONSource | undefined
              src?.setData(d)
            })
            .catch(() => {})
      }

      const activeLines = sceneView ? [] : Object.entries(s.layers.lines)
        .filter(([, v]) => v)
        .map(([k]) => k)
      const linesKey = activeLines.join('|')
      if (linesKey !== lastLinesKey) {
        lastLinesKey = linesKey
        const lf: FilterSpecification = ['in', ['get', 'id'], ['literal', activeLines]]
        map.setFilter('lines-glow', lf)
        map.setFilter('lines-core', lf)
      }

      const showHistory = modern < 0.5 && !board
      const density = eventDensity(s)
      const step = year - lastYear
      const forward = step > 0 && step < 0.25
      lastYear = year
      const roam = s.mode === 'roam'
      const evMarks = showHistory && !roam ? eventMarkers(year, s, forward, density) : []
      const visibleEvents = new Set(evMarks.map((m) => m.id.slice(3)))
      let active = showHistory && !roam && s.mode !== 'scene' ? activeTracks(year) : []
      if (density !== 'all') active = active.filter((a) => !!a.track.eventId && visibleEvents.has(a.track.eventId))
      const eventId = s.panel?.kind === 'event' ? s.panel.id : ''
      const marching = !!eventId && active.some((a) => a.track.eventId === eventId && a.progress < 0.995)
      if (s.panel !== prev.panel || marching !== hideRoutes) {
        hideRoutes = marching
        updateRoutes(map, s, marching)
      }
      renderTracks(map, active, 1 - modern)

      pools.labels.sync(showHistory && s.layers.territory ? factionLabels(year) : [])
      pools.capitals.sync(showHistory && !roam && s.mode !== 'life' ? capitalMarkers(year) : [])
      pools.cities.sync(showHistory && !roam && s.mode !== 'guide' && s.mode !== 'life' ? cityMarkers(year) : [])
      pools.events.sync(evMarks)
      pools.tracks.sync(showHistory ? trackLabels(active) : [])
      pools.people.sync(board ? [] : peopleMarks(year, s, map.getZoom()))
      pools.passes.sync(showHistory && s.layers.passes ? passMarkers() : [])
      pools.home.sync(board || roam ? [] : homeMarker(s))
      prev = s
      scheduleDeclutter()
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render)
    }

    let declutterTimer = 0
    let lastDeclutter = 0
    const runDeclutter = () => {
      declutterTimer = 0
      lastDeclutter = performance.now()
      if (container.current) declutter(container.current)
    }
    // throttled: at most every 120 ms while things move, plus a trailing run once they settle
    const scheduleDeclutter = () => {
      if (declutterTimer) return
      const wait = Math.max(0, 120 - (performance.now() - lastDeclutter))
      declutterTimer = window.setTimeout(runDeclutter, wait)
    }
    map.on('move', scheduleDeclutter)
    map.on('moveend', () => setTimeout(runDeclutter, 60))

    map.on('load', () => {
      try {
        init()
      } catch (e) {
        console.error('[map init]', e)
        if (import.meta.env.DEV) ((window as unknown as { __errs?: string[] }).__errs ??= []).push(String((e as Error).stack ?? e))
      }
    })
    const init = () => {
      addArrowImage(map)
      lastPaint.clear()
      ctrl = new TerritoryController(map, initial.theme)
      pools = {
        labels: new MarkerPool(map, 'mk-faction'),
        capitals: new MarkerPool(map, 'mk-capital'),
        cities: new MarkerPool(map, 'mk-city'),
        events: new MarkerPool(map, 'mk-event'),
        tracks: new MarkerPool(map, 'mk-track'),
        people: new MarkerPool(map, 'mk-person'),
        passes: new MarkerPool(map, 'mk-pass'),
        home: new MarkerPool(map, 'mk-home'),
      }
      onZoom()
      setMap(map)
      render()
    }
    map.on('zoom', onZoom)
    const unsub = subscribe(schedule)

    return () => {
      unsub()
      cancelAnimationFrame(raf)
      window.clearTimeout(declutterTimer)
      Object.values(pools).forEach((p) => p.clear())
      ctrl?.destroy()
      setMap(null)
      map.remove()
    }
  }, [])

  return <div ref={container} className="map" />
}

/** Below this the map starts curving into a globe (projection blends from 3.6 down). */
const GLOBE_ZOOM = 3.5
const GLOBE_HIDDEN = [
  'rivers',
  'lakes',
  'periphery-fill',
  'periphery-line',
  'provinces-line',
  'lines-glow',
  'lines-core',
  'routes-line',
  'routes-head',
  'anim-glow',
  'anim-line',
  'anim-head',
]

/** Whether a globe-hidden layer should be visible again once zoomed back in. */
function layerWanted(id: string, s: AppState) {
  if (id === 'rivers') return s.mode === 'scene' || s.layers.rivers
  if (id === 'provinces-line') return s.mode !== 'scene' && s.layers.provinces
  if (s.mode === 'scene' && (id.startsWith('lines-') || id.startsWith('routes-') || id.startsWith('anim-'))) return false
  return true
}

function periodFilter(year: number): FilterSpecification {
  return ['all', ['<=', ['get', 'from'], year], ['>=', ['get', 'to'], year]]
}

const lastPaint = new Map<string, number>()
function setOpacity(map: MLMap, layer: string, prop: string, v: number) {
  const k = `${layer}:${prop}`
  const r = Math.round(v * 1000) / 1000
  if (lastPaint.get(k) === r) return
  lastPaint.set(k, r)
  map.setPaintProperty(layer, prop as 'fill-opacity', r)
}

function setVisible(map: MLMap, layer: string, v: boolean) {
  const want = v ? 'visible' : 'none'
  if (map.getLayoutProperty(layer, 'visibility') !== want) map.setLayoutProperty(layer, 'visibility', want)
}

function applyTheme(map: MLMap, theme: 'dark' | 'light', ctrl: TerritoryController) {
  applyPalette(map, theme)
  ctrl.setTheme(theme)
  document.documentElement.dataset.theme = theme
}

/**
 * Arrowhead as a real signed-distance field (MapLibre's encoding: alpha 0.75 at the edge, 1/8 per px),
 * drawn at 2x so it stays sharp at any icon-size and can carry a halo.
 */
function addArrowImage(map: MLMap) {
  const ratio = 2
  const size = 32 * ratio
  const radius = 8 * ratio
  const pts = [
    [0.2, 0.2],
    [0.85, 0.5],
    [0.2, 0.8],
    [0.38, 0.5],
  ].map(([x, y]) => [x * size, y * size])
  const data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = x + 0.5
      const py = y + 0.5
      let d = Infinity
      let inside = false
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const [ax, ay] = pts[j]
        const [bx, by] = pts[i]
        const dx = bx - ax
        const dy = by - ay
        const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
        d = Math.min(d, Math.hypot(px - ax - t * dx, py - ay - t * dy))
        if (ay > py !== by > py && px < ((bx - ax) * (py - ay)) / (by - ay) + ax) inside = !inside
      }
      const o = (y * size + x) * 4
      data[o] = data[o + 1] = data[o + 2] = 255
      data[o + 3] = Math.max(0, Math.min(255, Math.round(255 * (0.75 - (inside ? -d : d) / radius))))
    }
  }
  map.addImage('arrow', { width: size, height: size, data }, { sdf: true, pixelRatio: ratio })
}

function updateRoutes(map: MLMap, s: AppState, hideAnimated = false) {
  const src = map.getSource('routes') as GeoJSONSource | undefined
  if (!src) return
  const ev = !hideAnimated && s.panel?.kind === 'event' ? eventById.get(s.panel.id) : undefined
  const features: GeoJSON.Feature[] = (ev?.routes ?? []).map((r) => ({
    type: 'Feature',
    properties: { color: factionColor(r.side), label: r.label },
    geometry: { type: 'LineString', coordinates: r.points },
  }))
  src.setData({ type: 'FeatureCollection', features })
}

/* ---------- marker builders ---------- */

function factionLabels(year: number): MarkerItem[] {
  if (!keyframes.length) return []
  const { index, next, mix } = mixAt(year)
  const out: MarkerItem[] = []
  // one label per faction: it glides to where the faction's land now lies, or fades if the faction comes or goes
  type Label = (typeof keyframes)[number]['labels'][number]
  const pairs = new Map<string, { a?: Label; b?: Label }>()
  for (const l of keyframes[index].labels) pairs.set(l.faction, { a: l })
  if (next !== index) for (const l of keyframes[next].labels) pairs.set(l.faction, { ...pairs.get(l.faction), b: l })
  for (const [faction, { a, b }] of pairs) {
    const o = a && b ? 1 : a ? 1 - mix : mix
    if (o <= 0.02) continue
    const lngLat: [number, number] =
      a && b ? [a.lng + (b.lng - a.lng) * mix, a.lat + (b.lat - a.lat) * mix] : a ? [a.lng, a.lat] : [b!.lng, b!.lat]
    const size = (a && b ? (mix < 0.5 ? a.size : b.size) : (a ?? b)!.size) as number
    out.push({
      id: `fl-${faction}`,
      lngLat,
      opacity: o,
      // a name on its way out gives way to nothing, so a renaming (魏 -> 晋) cross-fades in place
      p: a && !b ? undefined : size === 3 ? 80 : size === 2 ? 70 : 40,
      render: () => {
        const n = el('div', 'fl', factionName(faction))
        n.style.setProperty('--c', factionColor(faction))
        return n
      },
      update: (n) => {
        const cls = `fl fl-${size}`
        if (n.dataset.cls !== cls) {
          n.dataset.cls = cls
          n.classList.remove('fl-1', 'fl-2', 'fl-3')
          n.classList.add(`fl-${size}`)
        }
      },
    })
  }
  const y = Math.floor(year)
  for (const p of periphery) {
    if (y < p.from || y > p.to) continue
    out.push({
      id: `per-${p.id}`,
      lngLat: [p.lng, p.lat],
      p: p.strength === 'strong' ? 30 : 22,
      render: () => el('div', `fl fl-per fl-per-${p.strength}`, p.name),
    })
  }
  return out
}

function capitalMarkers(year: number): MarkerItem[] {
  if (!keyframes.length) return []
  const { index, next, mix } = mixAt(year)
  const k = keyframes[shownIndex(index, next, mix)]
  const seen = new Set<string>()
  return k.capitals
    .filter((c) => {
      const key = `${c.lng.toFixed(2)},${c.lat.toFixed(2)}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((c) => ({
      id: `cap-${c.lng.toFixed(2)}-${c.lat.toFixed(2)}`,
      lngLat: [c.lng, c.lat] as [number, number],
      z: 5,
      p: 100,
      render: () => {
        const n = el('div', 'cap')
        n.append(el('span', 'cap-dot'), el('span', 'cap-name'))
        n.addEventListener('click', (e) => {
          e.stopPropagation()
          const city = nearestCity(c.lng, c.lat)
          if (city) openExplore({ panel: { kind: 'city', id: city } })
        })
        return n
      },
      update: (n) => {
        n.style.setProperty('--c', factionColor(c.faction))
        const name = n.querySelector('.cap-name')!
        if (name.textContent !== c.city) name.textContent = c.city
      },
    }))
}

function nearestCity(lng: number, lat: number) {
  let best: string | null = null
  let bd = 0.35
  for (const c of cities) {
    const d = Math.hypot(c.lng - lng, c.lat - lat)
    if (d < bd) {
      bd = d
      best = c.id
    }
  }
  return best
}

function cityMarkers(year: number): MarkerItem[] {
  const capitalSpots = new Set<string>()
  if (keyframes.length) {
    const { index, next, mix } = mixAt(year)
    for (const c of keyframes[shownIndex(index, next, mix)].capitals) capitalSpots.add(`${c.lng.toFixed(1)},${c.lat.toFixed(1)}`)
  }
  const out: MarkerItem[] = []
  for (const c of cities) {
    if (capitalSpots.has(`${c.lng.toFixed(1)},${c.lat.toFixed(1)}`)) continue
    const nm = cityNameAt(c, year)
    if (!nm) continue
    out.push({
      id: `city-${c.id}`,
      lngLat: [c.lng, c.lat],
      p: 50,
      render: () => {
        const n = el('div', 'city')
        n.append(el('span', 'city-dot'), el('span', 'city-name'))
        n.addEventListener('click', (e) => {
          e.stopPropagation()
          openExplore({ panel: { kind: 'city', id: c.id } })
        })
        return n
      },
      update: (n) => {
        const name = n.querySelector('.city-name')!
        if (name.textContent !== nm.name) name.textContent = nm.name
      },
    })
  }
  if (keyframes.length) {
    const { index, next, mix } = mixAt(year)
    for (const g of keyframes[shownIndex(index, next, mix)].seats) {
      if (capitalSpots.has(`${g.lng.toFixed(1)},${g.lat.toFixed(1)}`)) continue
      out.push({
        id: `seat-${g.lng.toFixed(2)},${g.lat.toFixed(2)}`,
        lngLat: [g.lng, g.lat],
        p: 20,
        render: () => {
          const n = el('div', 'seat')
          n.append(el('span', 'seat-dot'), el('span', 'seat-name', g.name))
          return n
        },
        update: (n) => {
          const name = n.querySelector('.seat-name')!
          if (name.textContent !== g.name) name.textContent = g.name
        },
      })
    }
  }
  return out
}

const MINOR_KINDS = new Set(['institution', 'law', 'economy', 'science', 'culture', 'society'])

/** The name only. The arc itself is the pin: it gathers, strikes, then lets go. */
function paintEventLabel(label: HTMLElement, e: (typeof events)[number]) {
  label.replaceChildren()
  const title = el('span', 'ev-title')
  title.append(el('b', '', e.name), el('i', '', String(e.year)))
  label.append(title)
}

/** all = the whole field; now = only what is happening; one = the event the story is standing on. */
function eventDensity(s: AppState): 'all' | 'now' | 'one' {
  if (s.mode === 'guide' || s.mode === 'life') return 'one'
  if (s.layers.events) return 'all'
  return 'now'
}

function eventMarkers(year: number, s: AppState, forward: boolean, density: 'all' | 'now' | 'one'): MarkerItem[] {
  const out: MarkerItem[] = []
  const selected = s.panel?.kind === 'event' ? s.panel.id : null
  for (const e of events) {
    if (density === 'one' && e.id !== selected) continue
    if (e.importance === 3 && e.id !== selected) continue
    const b = eventBounds(e)
    const on = e.id === selected
    let phase = arcPhase(year, b)
    if (phase === 'before') {
      if (!on) continue
      phase = 'opening'
    } else if (year > b.lingerEnd) {
      if (!on) continue
      phase = 'past'
    }
    if (density === 'now' && !on && (phase === 'past' || e.importance !== 1)) continue
    const tail = b.lingerEnd - b.closeAt
    const o = on || phase !== 'past' ? 1 : Math.max(0.35, 1 - smoothstep((year - b.closeAt) / tail) * 0.65)
    const telling = phase === 'opening' || phase === 'live' || phase === 'closing'
    const minor = MINOR_KINDS.has(e.kind)
    out.push({
      id: `ev-${e.id}`,
      lngLat: [e.lng, e.lat],
      opacity: o,
      z: on ? 20 : phase === 'live' ? 12 : phase === 'closing' ? 11 : 9,
      p: on ? 200 : telling ? (minor ? 110 : 140) : minor ? 14 : e.importance === 1 ? 58 : 40,
      render: () => {
        const n = el('div', `ev ev-${e.kind}${minor ? ' ev-minor' : ''}`)
        const pin = el('span', 'ev-pin')
        pin.innerHTML = iconSvg(e.kind, 15)
        const burst = el('span', 'ev-burst')
        const ring = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        ring.setAttribute('class', 'ev-ring')
        ring.setAttribute('viewBox', '0 0 100 100')
        for (const cls of ['ev-ring-paper', 'ev-ring-ink']) {
          const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
          c.setAttribute('class', cls)
          c.setAttribute('cx', '50')
          c.setAttribute('cy', '50')
          c.setAttribute('r', '46')
          ring.append(c)
        }
        const label = el('span', 'ev-label')
        label.dataset.box = ''
        n.append(burst, ring, pin, label)
        n.addEventListener('click', (ev) => {
          ev.stopPropagation()
          openExplore({ panel: { kind: 'event', id: e.id } })
        })
        burst.addEventListener('animationend', (ev) => {
          if (ev.pseudoElement === '::after' || !ev.pseudoElement) n.classList.remove('ripple')
        })
        return n
      },
      update: (n) => {
        if (phase === 'live' && n.dataset.phase !== 'live' && forward) ripple(n)
        else if (phase !== 'live') n.classList.remove('ripple')
        if (n.dataset.told !== 'name') {
          n.dataset.told = 'name'
          const label = n.querySelector('.ev-label')
          if (label) paintEventLabel(label as HTMLElement, e)
        }
        paintArc(n, phase, arcAmount(year, b, phase))
        n.dataset.phase = phase
        n.classList.toggle('sel', on)
      },
    })
  }
  return out
}

/**
 * The ring and the disc follow the year.
 * Opening eases in: the circle stays wide, then lands.
 * Closing eases out: the circle leaves at once, then thins away.
 */
function paintArc(n: HTMLElement, phase: string, amount: number) {
  let ring = 32
  let ringO = 0
  let pin = 1
  let fill = 1
  let dash = 100
  if (phase === 'opening' || phase === 'before') {
    const closeT = Math.max(0, (amount - 0.55) / 0.45)
    const u = closeT * closeT
    ring = 172 - 140 * u
    ringO = 0.96
    pin = u < 0.4 ? u * 0.2 : 0.08 + 0.92 * ((u - 0.4) / 0.6)
    fill = pin
  } else if (phase === 'closing') {
    const u = Math.min(1, amount / 0.42)
    const e = 1 - (1 - u) * (1 - u)
    ring = 40 + 160 * e
    ringO = 0.92 - 0.22 * e
    pin = 1
    fill = Math.max(0, 1 - e)
    dash = 100 - 62 * e
  }
  n.style.setProperty('--ring', `${ring.toFixed(1)}px`)
  n.style.setProperty('--ring-o', ringO.toFixed(3))
  n.style.setProperty('--pin', pin.toFixed(3))
  n.style.setProperty('--fill', fill.toFixed(3))
  const circ = Math.PI * ring * 0.92
  const draw = (dash / 100) * circ
  for (const c of n.querySelectorAll('.ev-ring circle')) c.setAttribute('stroke-dasharray', `${draw.toFixed(1)} ${circ.toFixed(1)}`)
}

/** One ripple from the pin; restarting it if it is already running. */
function ripple(n: HTMLElement) {
  n.classList.remove('ripple')
  void n.offsetWidth
  n.classList.add('ripple')
}

/** Labels riding on animated marches and migrations ("曹军南下", "迁都长安"). */
function trackLabels(active: ActiveTrack[]): MarkerItem[] {
  return active
    .filter((a) => a.labelOpacity > 0.02 && a.track.label)
    .map((a) => ({
      id: `tr-${a.track.id}`,
      lngLat: a.head,
      opacity: a.labelOpacity,
      p: a.progress < 1 ? 92 : 45,
      z: 11,
      render: () => {
        const n = el('div', `trk trk-${a.track.kind}`)
        n.style.setProperty('--c', a.track.color)
        const chip = el('span', 'trk-chip')
        chip.dataset.box = ''
        if (a.track.kind !== 'march') chip.innerHTML = iconSvg(a.track.kind === 'capital' ? 'capital' : 'migration', 12)
        chip.append(el('span', '', a.track.label))
        n.append(chip)
        return n
      },
    }))
}

function personFace(p: Person, big = false) {
  const face = el('span', `pp-face${big ? ' big' : ''}`)
  const portrait = portraits[p.id]
  if (portrait) {
    const img = document.createElement('img')
    img.src = portrait.src
    img.alt = `${p.name}人物意象插画`
    face.append(img)
  } else face.textContent = p.name.slice(-1)
  return face
}

function fillPeople(n: HTMLElement, ps: Person[]) {
  const single = ps.length === 1
  const sig = ps.map((p) => p.id).join('+')
  n.classList.toggle('pp-fic', single && !!ps[0].fictional)
  n.classList.toggle('pp-group', !single)
  if (n.dataset.sig === sig) return
  const wasOpen = n.classList.contains('open')
  n.dataset.sig = sig
  n.classList.remove('open')
  n.replaceChildren()
  const faces = el('button', 'pp-faces')
  faces.dataset.box = ''
  for (const p of ps.slice(0, 3)) faces.append(personFace(p))
  const label = single ? ps[0].name : `${ps[0].name} 等 ${ps.length} 人`
  n.append(faces, el('span', 'pp-name', label))
  faces.addEventListener('click', (ev) => {
    ev.stopPropagation()
    if (ps.length === 1) openExplore({ panel: { kind: 'person', id: ps[0].id } })
    else n.classList.toggle('open')
  })
  if (!single) {
    const list = el('div', 'pp-list')
    for (const p of ps) {
      const b = el('button', 'pp-item')
      b.append(personFace(p), el('span', '', p.name))
      b.addEventListener('click', (ev) => {
        ev.stopPropagation()
        n.classList.remove('open')
        openExplore({ panel: { kind: 'person', id: p.id } })
      })
      list.append(b)
    }
    n.append(list)
    if (wasOpen) n.classList.add('open')
  }
}

function peopleMarks(year: number, s: AppState, zoom: number): MarkerItem[] {
  if (s.mode === 'chat') return visitorMarker(s)
  if (s.modernity >= 0.5 || s.mode !== 'explore') return []
  if (s.layers.people || zoom >= 5.6) return personMarkers(year, s, 'all')
  if (s.panel?.kind === 'person') return personMarkers(year, s, 'selected')
  return []
}

/** The visitor stands on the reader's hometown once the journey has arrived. */
function visitorMarker(s: AppState): MarkerItem[] {
  if (!s.chatPerson) return []
  const p = personById.get(s.chatPerson)
  if (!p) return []
  const g = s.hometown ? gazetteer.find((x) => x.name === s.hometown) : undefined
  const loc = personPositionAt(p, s.year) ?? p.locations[0]
  const lngLat: [number, number] =
    g && Number.isFinite(g.lng) && Number.isFinite(g.lat) ? [g.lng, g.lat] : loc ? [loc.lng, loc.lat] : [112, 32]
  return [
    {
      id: `visit-${p.id}`,
      lngLat,
      anchor: 'bottom',
      z: 60,
      p: 300,
      render: () => {
        const n = el('div', 'pp visit-pin')
        n.append(personFace(p, true), el('span', 'pp-name', p.name))
        return n
      },
    },
  ]
}

function personMarkers(year: number, s: AppState, scope: 'all' | 'selected'): MarkerItem[] {
  const selected = s.panel?.kind === 'person' ? s.panel.id : null
  // people in the same city share one marker: a stack of faces that opens into a list
  const groups = new Map<string, { lng: number; lat: number; ps: Person[]; moving: boolean }>()
  for (const p of persons) {
    if (scope === 'selected' && p.id !== selected) continue
    const loc = personPositionAt(p, year)
    if (!loc) continue
    const key = loc.moving ? `move-${p.id}` : `${loc.lng.toFixed(1)},${loc.lat.toFixed(1)}`
    const g = groups.get(key) ?? { lng: loc.lng, lat: loc.lat, ps: [], moving: loc.moving }
    g.ps.push(p)
    groups.set(key, g)
  }
  const out: MarkerItem[] = []
  for (const [key, g] of groups) {
    const hasSel = g.ps.some((p) => p.id === selected)
    const movingAlone = g.moving && g.ps.length === 1
    out.push({
      // a traveler keeps one id so the marker glides; a city group keeps its id when someone joins
      id: movingAlone ? `p-${g.ps[0].id}` : `pg-${key}`,
      lngLat: [g.lng, g.lat],
      anchor: 'bottom',
      z: hasSel ? 30 : 8,
      p: hasSel ? 190 : 75,
      render: () => {
        const n = el('div', 'pp')
        fillPeople(n, g.ps)
        return n
      },
      update: (n) => {
        fillPeople(n, g.ps)
        n.classList.toggle('sel', hasSel)
      },
    })
  }
  return out
}

function passMarkers(): MarkerItem[] {
  return passes.map((p) => ({
    id: `pass-${p.id}`,
    lngLat: [p.lng, p.lat] as [number, number],
    p: 35,
    render: () => {
      const n = el('div', 'pass')
      n.title = p.note
      n.append(el('span', 'pass-mark'), el('span', 'pass-name', p.name))
      return n
    },
  }))
}

function homeMarker(s: AppState): MarkerItem[] {
  if (!s.hometown) return []
  const g = gazetteer.find((x) => x.name === s.hometown)
  if (!g || !Number.isFinite(g.lng) || !Number.isFinite(g.lat)) return []
  return [
    {
      id: `home-${g.name}`,
      lngLat: [g.lng, g.lat],
      anchor: 'bottom',
      z: 40,
      render: () => {
        const n = el('div', 'home')
        n.append(el('span', 'home-pin'), el('span', 'home-label', s.mode === 'life' ? '你家' : '家乡'))
        n.addEventListener('click', (ev) => {
          ev.stopPropagation()
          if (getState().mode === 'life') return
          openExplore({ panel: { kind: 'place', name: g.name, lng: g.lng, lat: g.lat } })
        })
        return n
      },
    },
  ]
}
