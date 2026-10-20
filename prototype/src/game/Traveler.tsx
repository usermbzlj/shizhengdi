import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Marker, type GeoJSONSource, type Map as MLMap } from 'maplibre-gl'
import { whenMap, flyTo } from '../map/mapRef'
import { animateYear, getState, jumpYear, setState } from '../lib/store'
import { distanceKm, events, eventTime, personById, personLocationAt, persons } from '../data'
import type { Person } from '../data/types'
import { neighbors, placeById, places, routes, routeWords, type LngLat, type RouteKind } from './world'
import { SEASONS } from './engine'
import { saveRoam, savedRoam } from './saves'
import '../life/life.css'
import './game.css'

const TARGETS = ['liubei', 'caocao', 'sunce', 'zhugeliang', 'zhouyu', 'guanyu']
const START = { year: 195.1, at: 'xiangyang' }
const END_YEAR = 221
const SPEED: Record<RouteKind, number> = { road: 32, ford: 26, river: 24, hard: 16, gorge: 10, water: 60 }
const NEAR_KM = 90

interface Met {
  id: string
  year: number
  at: string
}

interface Rumor {
  id: string
  year: number
  place: string
  at: LngLat
  from: string
}

interface Trip {
  year: number
  at: string
  km: number
  path: string[]
  met: Met[]
  rumors: Rumor[]
  seenEvents: string[]
}

const num = (v: unknown) => (typeof v === 'number' ? v : null)
const ageAt = (p: Person, y: number) => {
  const b = num(p.birth)
  return b ? Math.floor(y) - b : null
}
const aliveAt = (p: Person, y: number) => {
  const b = num(p.birth)
  const d = num(p.death)
  return (b === null || y >= b) && (d === null || y < d + 1)
}
const seasonOf = (y: number) => SEASONS[Math.min(3, Math.floor((y % 1) * 4))]

function presentAt(at: string, year: number) {
  const p = placeById.get(at)!
  return persons.filter((x) => {
    if (x.fictional || !aliveAt(x, year)) return false
    const l = personLocationAt(x, year)
    return !!l && distanceKm([l.lng, l.lat], p.at) <= NEAR_KM
  })
}

function nearestPlace(lng: number, lat: number) {
  let best = places[0]
  let d = Infinity
  for (const p of places) {
    const k = distanceKm(p.at, [lng, lat])
    if (k < d) {
      d = k
      best = p
    }
  }
  return { place: best, km: d }
}

const load = () => savedRoam<Trip>()

const fresh = (): Trip => ({ year: START.year, at: START.at, km: 0, path: [START.at], met: [], rumors: [], seenEvents: [] })

export default function Traveler({ resume }: { resume?: boolean }) {
  const [boot] = useState(() => {
    const saved = resume ? load() : null
    return { trip: saved ?? fresh(), fromSave: saved != null }
  })
  const [trip, setTrip] = useState<Trip>(boot.trip)
  const origin = useRef(boot.trip)
  const [intro, setIntro] = useState(!boot.fromSave)
  const [moving, setMoving] = useState(false)
  const [news, setNews] = useState<{ title: string; lines: string[]; kind: 'event' | 'found' | 'rumor' | 'late' } | null>(null)
  const [talk, setTalk] = useState<Person | null>(null)
  const [book, setBook] = useState(false)
  const [els, setEls] = useState<Record<string, HTMLElement>>({})
  const [meEl, setMeEl] = useState<HTMLElement | null>(null)
  const meMarker = useRef<Marker | null>(null)
  const mapRef = useRef<MLMap | null>(null)

  const here = placeById.get(trip.at)!
  const people = useMemo(() => presentAt(trip.at, trip.year), [trip.at, trip.year])
  const metIds = useMemo(() => new Set(trip.met.map((m) => m.id)), [trip.met])
  const next = useMemo(() => neighbors(trip.at), [trip.at])
  const nextIds = useMemo(() => new Set(next.map((n) => n.id)), [next])
  const over = trip.year >= END_YEAR || TARGETS.every((t) => metIds.has(t) || !aliveAt(personById.get(t)!, trip.year))

  useEffect(() => {
    setState({ mode: 'roam', panel: null, layers: { ...getState().layers, territory: true } })
    jumpYear(trip.year)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (trip === origin.current) return
    saveRoam(trip)
  }, [trip])

  useEffect(() => {
    let alive = true
    const markers: Marker[] = []
    whenMap().then((map) => {
      if (!alive) return
      mapRef.current = map
      const add = () => {
        if (!map.getSource('r-routes')) {
          map.addSource('r-routes', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
          map.addSource('r-path', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
          map.addLayer({
            id: 'r-routes',
            type: 'line',
            source: 'r-routes',
            paint: {
              'line-color': ['case', ['get', 'hot'], '#f3e6c4', '#cbbf9f'],
              'line-width': ['case', ['get', 'hot'], 2.6, 1],
              'line-opacity': ['case', ['get', 'hot'], 0.95, 0.28],
              'line-dasharray': [2, 1.6],
            },
          })
          map.addLayer({
            id: 'r-path',
            type: 'line',
            source: 'r-path',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: { 'line-color': '#ffcf7a', 'line-width': 3, 'line-opacity': 0.85 },
          })
        }
        const next: Record<string, HTMLElement> = {}
        for (const p of places) {
          const el = document.createElement('div')
          el.className = 'r-mk'
          next[p.id] = el
          markers.push(new Marker({ element: el, anchor: 'center' }).setLngLat(p.at).addTo(map))
        }
        const me = document.createElement('div')
        me.className = 'r-me-mk'
        meMarker.current = new Marker({ element: me, anchor: 'bottom' }).setLngLat(placeById.get(trip.at)!.at).addTo(map)
        setMeEl(me)
        setEls(next)
        flyTo(placeById.get(trip.at)!.at, window.innerWidth < 640 ? 5.6 : 6.3, 1600)
      }
      if (map.isStyleLoaded()) add()
      else map.once('idle', add)
    })
    return () => {
      alive = false
      markers.forEach((m) => m.remove())
      meMarker.current?.remove()
      const map = mapRef.current
      if (map?.getLayer('r-path')) {
        map.removeLayer('r-path')
        map.removeLayer('r-routes')
        map.removeSource('r-path')
        map.removeSource('r-routes')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map?.getSource('r-routes')) return
    ;(map.getSource('r-routes') as GeoJSONSource).setData({
      type: 'FeatureCollection',
      features: routes.map((r) => ({
        type: 'Feature' as const,
        properties: { hot: !moving && (r.a === trip.at || r.b === trip.at) },
        geometry: { type: 'LineString' as const, coordinates: [placeById.get(r.a)!.at, placeById.get(r.b)!.at] },
      })),
    })
    ;(map.getSource('r-path') as GeoJSONSource).setData({
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: trip.path.map((id) => placeById.get(id)!.at) },
    })
  }, [trip, moving, els])

  const go = async (to: string) => {
    if (moving || over || !nextIds.has(to)) return
    const n = next.find((x) => x.id === to)!
    const a = placeById.get(trip.at)!.at
    const b = placeById.get(to)!.at
    const { km, days, upstream } = travelDays(trip.at, to, n.route.kind)
    const year = Math.min(END_YEAR, trip.year + days / 365)
    setMoving(true)
    const map = mapRef.current
    if (map) {
      const span = Math.max(0.6, Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]))
      map.easeTo({ center: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], zoom: Math.min(map.getZoom(), 7.6 - Math.log2(span + 1)), duration: 900 })
    }
    const ms = Math.min(2600, 700 + days * 40)
    animateYear(year, ms)
    const t0 = performance.now()
    await new Promise<void>((done) => {
      const step = () => {
        const k = Math.min(1, (performance.now() - t0) / ms)
        const e = k * k * (3 - 2 * k)
        meMarker.current?.setLngLat([a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e])
        if (k < 1) requestAnimationFrame(step)
        else done()
      }
      requestAnimationFrame(step)
    })
    mapRef.current?.easeTo({ center: b, duration: 700 })
    arrive({ ...trip, at: to, year, km: trip.km + km, path: [...trip.path, to] }, `${upstream ? '逆水行船' : routeWords[n.route.kind]}${n.route.name ? `（${n.route.name}）` : ''}，走了 ${days} 天`)
    setMoving(false)
  }

  const wait = () => {
    if (moving || over) return
    const year = Math.min(END_YEAR, trip.year + 0.25)
    animateYear(year, 900)
    arrive({ ...trip, year }, '你在这里住了一季')
  }

  const arrive = (t: Trip, how: string) => {
    const p = placeById.get(t.at)!
    const ev = events.find(
      (e) => !t.seenEvents.includes(e.id) && e.importance <= 2 && Math.abs(eventTime(e) - t.year) < 0.35 && distanceKm([e.lng, e.lat], p.at) < 160,
    )
    let next = t
    if (ev) {
      next = { ...t, seenEvents: [...t.seenEvents, ev.id], year: Math.min(END_YEAR, t.year + 0.12) }
      animateYear(next.year, 600)
      setNews({ kind: 'event', title: `你撞上了：${ev.name}`, lines: [ev.summary.split('。').slice(0, 2).join('。') + '。', '路被堵住了，你在这里多耽搁了一个多月。'] })
    } else {
      const unknown = TARGETS.filter(
        (id) => !t.met.some((m) => m.id === id) && aliveAt(personById.get(id)!, t.year) && !!personLocationAt(personById.get(id)!, t.year) && !presentAt(t.at, t.year).some((x) => x.id === id),
      )
      if (unknown.length && Math.random() < 0.45) {
        const id = unknown[Math.floor(Math.random() * unknown.length)]
        const r = rumorOf(id, t.year, `${p.name}的人`)
        if (r) {
          next = { ...t, rumors: [...t.rumors.filter((x) => x.id !== id), r] }
          setNews({ kind: 'rumor', title: `${how}`, lines: [`在${p.name}，你听见有人说：`, `“${personById.get(id)!.name}啊，听说如今在${r.place}。”`] })
        }
      }
      if (next === t) setNews(null)
    }
    for (const id of TARGETS) {
      const x = personById.get(id)!
      if (!next.met.some((m) => m.id === id) && aliveAt(x, t.year - 0.3) && !aliveAt(x, next.year)) {
        setNews({ kind: 'late', title: `${x.name}去世了`, lines: [`公元 ${num(x.death)} 年，${x.name}死了。你没能见到他。`] })
      }
    }
    setTrip(next)
  }

  const meet = (x: Person) => {
    if (metIds.has(x.id)) {
      setTalk(x)
      return
    }
    const loc = personLocationAt(x, trip.year)
    const t: Trip = { ...trip, met: [...trip.met, { id: x.id, year: trip.year, at: trip.at }], rumors: trip.rumors.filter((r) => r.id !== x.id) }
    const unknown = TARGETS.filter((id) => id !== x.id && !t.met.some((m) => m.id === id) && aliveAt(personById.get(id)!, trip.year) && !!personLocationAt(personById.get(id)!, trip.year))
    const id = unknown[Math.floor(Math.random() * unknown.length)]
    const r = id ? rumorOf(id, trip.year, x.name) : null
    if (r) t.rumors = [...t.rumors.filter((y) => y.id !== id), r]
    setTrip(t)
    const age = ageAt(x, trip.year)
    setNews({
      kind: 'found',
      title: TARGETS.includes(x.id) ? `你找到了${x.name}` : `你见到了${x.name}`,
      lines: [
        `${age ? `他今年 ${age} 岁。` : ''}${loc?.role ?? ''}`,
        r ? `临走，他提了一句：“${personById.get(r.id)!.name}？我听说在${r.place}。”` : '',
      ].filter(Boolean),
    })
  }

  const restart = () => {
    const t = fresh()
    jumpYear(t.year)
    meMarker.current?.setLngLat(placeById.get(t.at)!.at)
    flyTo(placeById.get(t.at)!.at, 6.3, 1400)
    setTrip(t)
    setNews(null)
    setIntro(true)
  }

  return (
    <div className="r-root">
      {Object.entries(els).map(([id, el]) =>
        createPortal(
          <button
            className={`r-place${id === trip.at ? ' here' : ''}${nextIds.has(id) && !moving ? ' next' : ''}${placeById.get(id)!.capital ? ' big' : ''}`}
            onClick={() => go(id)}
            tabIndex={nextIds.has(id) ? 0 : -1}
          >
            <i />
            <span>{placeById.get(id)!.name}</span>
          </button>,
          el,
          id,
        ),
      )}
      {meEl && createPortal(<span className={`r-me${moving ? ' walking' : ''}`}>你</span>, meEl)}
      <Rumors rumors={trip.rumors} year={trip.year} />

      <header className="g-hud r-hud">
        <div className="g-when">
          <b>{Math.floor(trip.year)}</b> 年 <b>{seasonOf(trip.year)}</b>
          <small>走了 {Math.round(trip.km)} 公里</small>
        </div>
        <div className="r-targets">
          {TARGETS.map((id) => {
            const x = personById.get(id)!
            const found = metIds.has(id)
            const gone = !found && !aliveAt(x, trip.year)
            return (
              <span key={id} className={found ? 'found' : gone ? 'gone' : ''} title={gone ? '来晚了' : found ? '找到了' : '还没找到'}>
                {x.name}
              </span>
            )
          })}
        </div>
        <span className="g-spacer" />
        <button className="g-btn ghost" onClick={() => setBook(true)}>
          图鉴 {trip.met.length}
        </button>
        <a className="g-btn ghost" href="./">
          离开
        </a>
      </header>

      <section className="g-sheet r-sheet">
        <div className="g-card">
          <div className="g-card-head">
            <h3>{here.name}</h3>
            <span className="g-modern">今天的{here.modern}</span>
          </div>
          {people.length > 0 ? (
            <div className="r-people">
              {people.map((x) => {
                const age = ageAt(x, trip.year)
                const role = personLocationAt(x, trip.year)?.role ?? ''
                return (
                  <button key={x.id} className={`r-person${metIds.has(x.id) ? ' met' : ''}${TARGETS.includes(x.id) ? ' wanted' : ''}`} onClick={() => meet(x)} disabled={moving}>
                    <b>{x.name}</b>
                    <span>
                      {age ? `${age} 岁 · ` : ''}
                      {role.length > 22 ? role.slice(0, 22) + '…' : role}
                    </span>
                    <em>{metIds.has(x.id) ? '再聊聊' : '上前搭话'}</em>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="g-note">这里没有你认识的人。</p>
          )}
          <p className="r-go-label">点地图上亮着的地名，往那儿走</p>
          <div className="r-go">
            {next.map((n) => {
              const { days, upstream } = travelDays(trip.at, n.id, n.route.kind)
              return (
                <button key={n.id} onClick={() => go(n.id)} disabled={moving || over}>
                  {placeById.get(n.id)!.name}
                  <small>
                    {upstream ? '逆水行船' : routeWords[n.route.kind]} · {days} 天
                  </small>
                </button>
              )
            })}
            <button className="wait" onClick={wait} disabled={moving || over}>
              在这里等一季
            </button>
          </div>
        </div>
      </section>

      {news && !intro && (
        <div className="r-news" onClick={() => setNews(null)}>
          <div className={`r-news-card ${news.kind}`} onClick={(e) => e.stopPropagation()}>
            <b>{news.title}</b>
            {news.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
            <button className="g-btn primary" onClick={() => setNews(null)} autoFocus>
              好
            </button>
          </div>
        </div>
      )}

      {talk && <MetChat person={talk} year={trip.year} place={here.name} onClose={() => setTalk(null)} />}

      {book && (
        <div className="g-modal" onClick={() => setBook(false)}>
          <div className="g-report r-book" onClick={(e) => e.stopPropagation()}>
            <h2>你见过的人</h2>
            {trip.met.length === 0 && <p className="g-quiet">还一个都没见到。</p>}
            {trip.met.map((m) => {
              const x = personById.get(m.id)!
              return (
                <p key={m.id}>
                  <b>{x.name}</b>
                  {Math.floor(m.year)} 年，在{placeById.get(m.at)!.name}（今天的{placeById.get(m.at)!.modern}）
                  {ageAt(x, m.year) ? `，那年 ${ageAt(x, m.year)} 岁` : ''}
                </p>
              )
            })}
            <button className="g-btn primary" onClick={() => setBook(false)}>
              合上
            </button>
          </div>
        </div>
      )}

      {intro && (
        <div className="g-modal g-intro-wrap">
          <div className="g-report g-intro">
            <p className="g-kicker">穿越者</p>
            <h2>你醒来的时候，是公元 195 年的春天。</h2>
            <p>你在襄阳城外，身上还穿着校服。</p>
            <p>天下正乱。你想见见书上那几个人——趁他们还在。</p>
            <div className="g-goal-list">
              {TARGETS.map((id) => (
                <p key={id}>{personById.get(id)!.name}</p>
              ))}
              <small>他们会搬家、会打仗、会死。你走路要花时间，时间不等人。</small>
            </div>
            <button className="g-btn primary big" onClick={() => setIntro(false)} autoFocus>
              出发
            </button>
          </div>
        </div>
      )}

      {over && !news && !talk && (
        <div className="g-modal">
          <div className="g-report g-ending">
            <p className="g-kicker">
              公元 {Math.floor(trip.year)} 年 · 走了 {Math.round(trip.km)} 公里
            </p>
            <h2 className={trip.met.filter((m) => TARGETS.includes(m.id)).length >= 4 ? 'win' : ''}>
              你见到了 {trip.met.filter((m) => TARGETS.includes(m.id)).length} / {TARGETS.length} 个人
            </h2>
            {TARGETS.map((id) => {
              const x = personById.get(id)!
              const m = trip.met.find((y) => y.id === id)
              return (
                <p key={id}>
                  <b>{x.name}</b>
                  {m ? `${Math.floor(m.year)} 年在${placeById.get(m.at)!.name}见到。` : `没见到。他死在 ${num(x.death)} 年。`}
                </p>
              )
            })}
            <div className="g-actions">
              <button className="g-btn primary" onClick={restart}>
                再穿越一次
              </button>
              <a className="g-btn ghost" href="./">
                回大厅
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function travelDays(from: string, to: string, kind: RouteKind) {
  const a = placeById.get(from)!.at
  const b = placeById.get(to)!.at
  const km = distanceKm(a, b) * 1.25
  const upstream = kind === 'water' && b[0] < a[0]
  return { km, days: Math.max(2, Math.round(km / (upstream ? 22 : SPEED[kind]))), upstream }
}

function rumorOf(id: string, year: number, from: string): Rumor | null {
  const x = personById.get(id)
  const l = x && personLocationAt(x, year)
  if (!l) return null
  const near = nearestPlace(l.lng, l.lat)
  const place = near.km < 60 && !l.place.includes(near.place.name) ? `${l.place}（${near.place.name}一带）` : l.place
  return { id, year, place, at: [l.lng, l.lat], from }
}

function Rumors({ rumors, year }: { rumors: Rumor[]; year: number }) {
  const [els, setEls] = useState<Record<string, HTMLElement>>({})
  const key = rumors.map((r) => r.id + r.year).join('|')
  useEffect(() => {
    let alive = true
    const ms: Marker[] = []
    whenMap().then((map) => {
      if (!alive) return
      const next: Record<string, HTMLElement> = {}
      for (const r of rumors) {
        const el = document.createElement('div')
        el.className = 'r-rumor-mk'
        next[r.id] = el
        ms.push(new Marker({ element: el, anchor: 'center' }).setLngLat(r.at).addTo(map))
      }
      setEls(next)
    })
    return () => {
      alive = false
      ms.forEach((m) => m.remove())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return (
    <>
      {rumors.map((r) =>
        els[r.id]
          ? createPortal(
              <span className={`r-rumor${year - r.year > 1 ? ' old' : ''}`} title={`${Math.floor(r.year)} 年听${r.from}说的`}>
                <i />
                听说{personById.get(r.id)!.name}在这
                <small>{Math.floor(r.year)} 年的消息</small>
              </span>,
              els[r.id],
              r.id,
            )
          : null,
      )}
    </>
  )
}

interface Msg {
  role: 'user' | 'assistant'
  content: string
}

function MetChat({ person, year, place, onClose }: { person: Person; year: number; place: string; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const ac = useRef<AbortController | null>(null)
  const age = ageAt(person, year)
  const role = personLocationAt(person, year)?.role ?? ''

  useEffect(() => () => ac.current?.abort(), [])
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [msgs])

  async function send() {
    const t = input.trim()
    if (!t || busy) return
    const history: Msg[] = [...msgs, { role: 'user', content: t }]
    setMsgs(history)
    setInput('')
    setBusy(true)
    setError(null)
    ac.current?.abort()
    const ctl = new AbortController()
    ac.current = ctl
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personId: person.id, messages: history, questions: [], fromYear: year, fromPlace: place, style: 'met', stage: role }),
        signal: ctl.signal,
      })
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}))
        throw new Error(typeof j.error === 'string' ? j.error : `http_${res.status}`)
      }
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let text = ''
      setMsgs((m) => [...m, { role: 'assistant', content: '' }])
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        text += dec.decode(value, { stream: true })
        setMsgs((m) => [...m.slice(0, -1), { role: 'assistant', content: text }])
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      const msg = (e as Error).message
      setMsgs((m) => (m.at(-1)?.role === 'assistant' && !m.at(-1)?.content ? m.slice(0, -1) : m))
      setError(msg === 'no_key' || msg === 'lan_blocked' ? '他点点头，没说话。（这一版还接不上对话）' : '他没听清，再说一次吧。')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="g-modal" onClick={onClose}>
      <section className="life-chat r-chat" onClick={(e) => e.stopPropagation()}>
        <header>
          <div>
            <b>
              {age ? `${age} 岁的` : ''}
              {person.name}
            </b>
            <span>
              公元 {Math.floor(year)} 年 · {place}
            </span>
          </div>
          <button type="button" onClick={onClose}>
            告辞
          </button>
        </header>
        <div className="life-chat-scroll" ref={scroller}>
          {msgs.length === 0 && <p className="life-chat-empty">{role}</p>}
          {msgs.map((m, i) => (
            <p key={i} className={m.role}>
              {m.content || '……'}
            </p>
          ))}
          {error && <p className="life-chat-error">{error}</p>}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
        >
          <input value={input} autoFocus placeholder={busy ? '他在想……' : '问问他'} onChange={(e) => setInput(e.target.value)} />
          <button type="submit" disabled={busy || !input.trim()}>
            说
          </button>
        </form>
      </section>
    </div>
  )
}
