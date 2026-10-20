import { useEffect, useMemo, useRef, useState } from 'react'
import { Marker, type Map as MLMap } from 'maplibre-gl'
import { distanceKm, gazetteer, personById } from '../data'
import { getState, jumpYear, animateYear, setState, useStore } from '../lib/store'
import { flyTo, whenMap } from '../map/mapRef'
import { BORN, HOME, lifePath, shareLine, stops, type Gesture, type LngLat, type Segment, type Stop } from './zhuge'
import { addLifeLayers, cumulative, pointAt, runFlight, showLifePath, showMarches, showRoad, showWalked, sliceTo } from './layers'
import { say, setAmbience, setMuted, startSound } from './sound'
import './life.css'

type Hint =
  | { kind: 'walk' | 'hold'; text: string }
  | { kind: 'place'; text: string }
  | { kind: 'next'; text: string }
  | null

interface Caption {
  key: number
  year: number
  text: string
}

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const t = window.setTimeout(resolve, ms)
    signal.addEventListener('abort', () => (window.clearTimeout(t), resolve()), { once: true })
  })

function pathKm(path: LngLat[]) {
  let km = 0
  for (let i = 1; i < path.length; i++) km += distanceKm(path[i - 1], path[i])
  return km
}

/** Wide views were framed for a laptop; a phone held upright needs to stand further back. */
function wide(zoom: number) {
  return window.innerWidth < 640 ? Math.max(3.6, zoom - 1) : zoom
}

function near(a: LngLat, b: LngLat) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.3
}

function el(cls: string, text?: string) {
  const n = document.createElement('div')
  n.className = cls
  if (text) n.textContent = text
  return n
}

export default function Life() {
  const year = useStore((s) => Math.floor(s.year))
  const hometown = useStore((s) => s.hometown)
  const [phase, setPhase] = useState<'start' | 'story' | 'end'>('start')
  const [stopIdx, setStopIdx] = useState(0)
  const [lines, setLines] = useState<string[]>([])
  const [hint, setHint] = useState<Hint>(null)
  const [captions, setCaptions] = useState<Caption[]>([])
  const [walkKm, setWalkKm] = useState<number | null>(null)
  const [holdP, setHoldP] = useState(0)
  const [gone, setGone] = useState(false)
  const [named, setNamed] = useState(false)
  const [muted, setMute] = useState(false)
  const [chatAt, setChatAt] = useState<number | null>(null)
  const [homeDraft, setHomeDraft] = useState(hometown ?? '')

  const run = useRef<AbortController | null>(null)
  const skip = useRef<AbortController | null>(null)
  const resolveNext = useRef<(() => void) | null>(null)
  const holding = useRef(false)
  const holdApi = useRef<{ press: (e: Event) => void; release: () => void } | null>(null)
  const markers = useRef<{ he?: Marker; goal?: Marker; hold?: Marker; callouts: Marker[] }>({ callouts: [] })
  const heEl = useRef<HTMLDivElement | null>(null)
  const capKey = useRef(0)
  const capClear = useRef(0)

  useEffect(() => {
    setState({ mode: 'life', panel: null, modernity: 0 })
    jumpYear(stops[0].year)
    whenMap().then((m) => {
      addLifeLayers(m)
      m.jumpTo({ center: [116.6, 33.4], zoom: 4.6 })
    })
    return () => {
      run.current?.abort()
      window.clearTimeout(capClear.current)
    }
  }, [])

  const age = Math.max(0, Math.floor(year) - BORN)

  useEffect(() => {
    const n = heEl.current?.querySelector('.life-he-name')
    if (n) n.textContent = stopIdx === stops.length - 1 ? '诸葛亮' : `${named ? '诸葛亮' : '他'} · ${age} 岁`
  }, [age, named, stopIdx])

  useEffect(() => {
    heEl.current?.classList.toggle('gone', gone)
  }, [gone])

  const suggestions = useMemo(() => {
    const q = homeDraft.trim()
    if (!q || q === hometown) return []
    return gazetteer
      .filter((g) => (g.kind === 'modern' || g.kind === 'city') && (g.name.includes(q) || g.alt.some((a) => a.includes(q))))
      .slice(0, 5)
  }, [homeDraft, hometown])

  // ---------- markers ----------

  function placeHe(m: MLMap, at: LngLat) {
    if (!markers.current.he) {
      const n = el('life-he')
      n.append(el('life-he-dot'), el('life-he-name', `他 · ${Math.max(0, Math.floor(getState().year) - BORN)} 岁`))
      heEl.current = n
      markers.current.he = new Marker({ element: n, anchor: 'center' }).setLngLat(at).addTo(m)
    } else markers.current.he.setLngLat(at)
  }

  function clearCallouts() {
    markers.current.callouts.forEach((c) => c.remove())
    markers.current.callouts = []
  }

  function addCallout(m: MLMap, at: LngLat, text: string) {
    const n = el('life-callout', text)
    markers.current.callouts.push(new Marker({ element: n, anchor: 'center' }).setLngLat(at).addTo(m))
  }

  // ---------- narration ----------

  async function speak(seg: Segment, m: MLMap, signal: AbortSignal) {
    if (seg.center) flyTo(seg.center, wide(seg.zoom ?? 5), 2800, signal)
    setLines([])
    for (let i = 0; i < seg.lines.length; i++) {
      if (signal.aborted) return
      const text = seg.lines[i]
      setLines((ls) => [...ls, text])
      for (const c of seg.callouts ?? []) if (c.line === i) addCallout(m, c.at, c.text)
      if (seg.id === 'wuzhangyuan-a' && i === 2) setGone(true)
      if (seg.id === 'yangdu-b' && i === 0) setNamed(true)
      const line = new AbortController()
      skip.current = line
      const both = AbortSignal.any([signal, line.signal])
      await say(`${seg.id}-${i}`, text, both)
      skip.current = null
      await sleep(line.signal.aborted ? 120 : 520, signal)
    }
  }

  // ---------- gestures ----------

  function walk(g: Extract<Gesture, { kind: 'walk' }>, m: MLMap, signal: AbortSignal) {
    if (signal.aborted) return Promise.resolve()
    const cum = cumulative(g.path)
    const km = pathKm(g.path)
    const fromYear = getState().year
    const samples = Array.from({ length: 301 }, (_, i) => i / 300)
    let t = 0
    let dragging = false
    showRoad(m, g.path)
    showWalked(m, null)
    setWalkKm(0)
    const xs = g.path.map((p) => p[0])
    const ys = g.path.map((p) => p[1])
    m.fitBounds(
      [
        [Math.min(...xs), Math.min(...ys)],
        [Math.max(...xs), Math.max(...ys)],
      ],
      { padding: { top: 110, bottom: Math.min(300, window.innerHeight * 0.34), left: 80, right: 80 }, duration: 1600 },
    )
    setHint({ kind: 'walk', text: g.hint })
    m.dragPan.disable()
    const box = m.getCanvasContainer()
    const touchAction = box.style.touchAction
    box.style.touchAction = 'none'

    return new Promise<void>((resolve) => {
      const heScreen = () => m.project(pointAt(g.path, cum, t))
      const down = (e: PointerEvent) => {
        const r = box.getBoundingClientRect()
        const p = heScreen()
        if (Math.hypot(e.clientX - r.left - p.x, e.clientY - r.top - p.y) > 56) return
        dragging = true
        heEl.current?.classList.add('walking')
        e.preventDefault()
      }
      const move = (e: PointerEvent) => {
        if (!dragging) return
        const r = box.getBoundingClientRect()
        const x = e.clientX - r.left
        const y = e.clientY - r.top
        let best = t
        let bestD = 64
        for (const s of samples) {
          if (s < t - 0.02 || s > t + 0.1) continue
          const p = m.project(pointAt(g.path, cum, s))
          const d = Math.hypot(p.x - x, p.y - y)
          if (d < bestD) {
            bestD = d
            best = s
          }
        }
        if (best <= t) return
        t = best
        const at = pointAt(g.path, cum, t)
        placeHe(m, at)
        showWalked(m, sliceTo(g.path, cum, t))
        setWalkKm(Math.round(km * t))
        jumpYear(fromYear + (g.toYear - fromYear) * t)
        if (t > 0.985) finish()
      }
      const up = () => {
        dragging = false
        heEl.current?.classList.remove('walking')
      }
      const finish = () => {
        cleanup()
        placeHe(m, g.path[g.path.length - 1])
        showWalked(m, g.path)
        showRoad(m, null)
        setWalkKm(Math.round(km))
        jumpYear(g.toYear)
        setHint(null)
        resolve()
      }
      const cleanup = () => {
        box.removeEventListener('pointerdown', down)
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
        window.removeEventListener('pointercancel', up)
        box.style.touchAction = touchAction
        m.dragPan.enable()
        heEl.current?.classList.remove('walking')
      }
      box.addEventListener('pointerdown', down)
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
      window.addEventListener('pointercancel', up)
      signal.addEventListener('abort', () => (cleanup(), resolve()), { once: true })
    })
  }

  function hold(g: Extract<Gesture, { kind: 'hold' }>, at: LngLat, m: MLMap, signal: AbortSignal) {
    if (signal.aborted) return Promise.resolve()
    const from = getState().year
    const span = g.toYear - from
    const passed = new Set<number>()
    const marches: { path: LngLat[]; born: number }[] = []
    if (g.view) flyTo(g.view.center, wide(g.view.zoom), 2000, signal)
    setHint({ kind: 'hold', text: g.hint })
    setHoldP(0)
    const n = el('life-hold')
    n.append(el('life-hold-ring'), el('life-hold-core'))
    const mk = new Marker({ element: n, anchor: 'center' }).setLngLat(at).addTo(m)
    markers.current.hold = mk

    return new Promise<void>((resolve) => {
      let raf = 0
      let last = performance.now()
      let y = from
      const press = (e: Event) => {
        e.preventDefault()
        e.stopPropagation()
        holding.current = true
        m.dragPan.disable()
        n.classList.add('on')
      }
      const release = () => {
        if (holding.current) m.dragPan.enable()
        holding.current = false
        n.classList.remove('on')
      }
      const key = (e: KeyboardEvent) => {
        if (e.code !== 'Space' || chatOpen()) return
        e.preventDefault()
        if (e.type === 'keydown') press(e)
        else release()
      }
      const tick = (now: number) => {
        const dt = Math.min(0.1, (now - last) / 1000)
        last = now
        if (holding.current) {
          y = Math.min(g.toYear, y + dt / g.secondsPerYear)
          jumpYear(y)
          setHoldP((y - from) / span)
          g.passing.forEach((p, i) => {
            if (passed.has(i) || y < p.year) return
            passed.add(i)
            const k = ++capKey.current
            setCaptions((cs) => [...cs.slice(-1), { key: k, year: Math.floor(p.year), text: p.text }])
            if (p.march) marches.push({ path: p.march, born: now })
          })
        }
        if (marches.length)
          showMarches(
            m,
            marches.map((mc) => {
              const age = (now - mc.born) / 1000
              const cum = cumulative(mc.path)
              const out = Math.min(1, age / 0.9)
              return { path: sliceTo(mc.path, cum, out), o: age < 1.8 ? 0.9 : Math.max(0.28, 0.9 - (age - 1.8) * 0.8) }
            }),
          )
        if (y >= g.toYear) return finish()
        raf = requestAnimationFrame(tick)
      }
      const finish = () => {
        cleanup()
        setHint(null)
        window.clearTimeout(capClear.current)
        capClear.current = window.setTimeout(() => setCaptions([]), 2600)
        resolve()
      }
      const cleanup = () => {
        cancelAnimationFrame(raf)
        release()
        n.removeEventListener('pointerdown', press)
        window.removeEventListener('pointerup', release)
        window.removeEventListener('pointercancel', release)
        window.removeEventListener('keydown', key)
        window.removeEventListener('keyup', key)
        mk.remove()
        markers.current.hold = undefined
        holdApi.current = null
      }
      holdApi.current = { press, release }
      n.addEventListener('pointerdown', press)
      n.addEventListener('contextmenu', (e) => e.preventDefault())
      window.addEventListener('pointerup', release)
      window.addEventListener('pointercancel', release)
      window.addEventListener('keydown', key)
      window.addEventListener('keyup', key)
      raf = requestAnimationFrame(tick)
      signal.addEventListener('abort', () => (cleanup(), resolve()), { once: true })
    })
  }

  const chatOpen = () => document.querySelector('.life-chat') !== null

  function waitPlace(next: Stop, here: LngLat, m: MLMap, signal: AbortSignal) {
    const [a, b] = [here, next.at]
    m.fitBounds(
      [
        [Math.min(a[0], b[0]), Math.min(a[1], b[1])],
        [Math.max(a[0], b[0]), Math.max(a[1], b[1])],
      ],
      { padding: { top: 140, bottom: Math.min(320, window.innerHeight * 0.36), left: 90, right: 90 }, maxZoom: 6.2, duration: 1800 },
    )
    const n = document.createElement('button')
    n.type = 'button'
    n.className = 'life-goal'
    n.append(el('life-goal-ring'), el('life-goal-name', next.place))
    const mk = new Marker({ element: n, anchor: 'center' }).setLngLat(next.at).addTo(m)
    markers.current.goal = mk
    setHint({ kind: 'place', text: '点一下亮着的地方' })
    return new Promise<void>((resolve) => {
      const go = (e: Event) => {
        e.stopPropagation()
        done()
      }
      const done = () => {
        mk.remove()
        markers.current.goal = undefined
        setHint(null)
        resolve()
      }
      n.addEventListener('click', go)
      signal.addEventListener('abort', done, { once: true })
    })
  }

  function waitNext(signal: AbortSignal) {
    setHint({ kind: 'next', text: '接着听' })
    return new Promise<void>((resolve) => {
      const done = () => {
        resolveNext.current = null
        setHint(null)
        resolve()
      }
      resolveNext.current = done
      signal.addEventListener('abort', done, { once: true })
    })
  }

  // ---------- the story ----------

  async function story(from = 0) {
    window.clearTimeout(capClear.current)
    run.current?.abort()
    const ac = new AbortController()
    run.current = ac
    const { signal } = ac
    const m = await whenMap()
    addLifeLayers(m)
    setPhase('story')
    setGone(false)
    setNamed(from > 0)
    setCaptions([])
    setWalkKm(null)
    clearCallouts()
    showLifePath(m, null)
    showMarches(m, [])
    showWalked(m, null)
    showRoad(m, null)
    let here: LngLat = stops[from].at

    for (let i = from; i < stops.length; i++) {
      if (signal.aborted) return
      const s = stops[i]
      setStopIdx(i)
      setAmbience(s.sound)
      clearCallouts()
      window.clearTimeout(capClear.current)
      setCaptions([])
      if (i > from) setWalkKm(null)
      if (i === from) {
        jumpYear(s.year)
        placeHe(m, s.at)
        flyTo(s.at, s.zoom, 5200, signal)
        await sleep(1600, signal)
      } else {
        placeHe(m, s.at)
        await Promise.all([flyTo(s.at, s.zoom, 2600, signal), animateYear(s.year, 2600)])
      }
      here = s.at
      await speak(s.before, m, signal)
      const flight = s.flight ? runFlight(m) : null
      if (s.then) await speak(s.then, m, signal)
      if (s.gesture?.kind === 'walk') {
        await walk(s.gesture, m, signal)
        here = s.gesture.path[s.gesture.path.length - 1]
      } else if (s.gesture?.kind === 'hold') await hold(s.gesture, s.at, m, signal)
      flight?.stop()
      if (s.after) await speak(s.after, m, signal)
      const next = stops[i + 1]
      if (!next || signal.aborted) break
      if (near(next.at, here)) {
        if (s.gesture?.kind !== 'walk') await waitNext(signal)
      } else await waitPlace(next, here, m, signal)
    }
    if (signal.aborted) return
    const xs = lifePath.map((p) => p[0])
    const ys = lifePath.map((p) => p[1])
    m.fitBounds(
      [
        [Math.min(...xs), Math.min(...ys)],
        [Math.max(...xs), Math.max(...ys)],
      ],
      { padding: { top: 90, bottom: window.innerHeight * 0.44, left: 50, right: 50 }, duration: 2400 },
    )
    const cum = cumulative(lifePath)
    const start = performance.now()
    await new Promise<void>((resolve) => {
      const draw = (now: number) => {
        if (signal.aborted) return resolve()
        const k = Math.min(1, (now - start) / 4200)
        showLifePath(m, sliceTo(lifePath, cum, k * (2 - k)))
        if (k < 1) requestAnimationFrame(draw)
        else resolve()
      }
      requestAnimationFrame(draw)
    })
    markers.current.he?.remove()
    markers.current.he = undefined
    setPhase('end')
  }

  const begin = () => {
    startSound()
    setMuted(false)
    const pick = gazetteer.find((g) => g.name === homeDraft.trim())
    if (pick) setState({ hometown: pick.name })
    const from = import.meta.env.DEV ? Number(new URLSearchParams(window.location.search).get('from')) || 0 : 0
    story(Math.min(stops.length - 1, Math.max(0, from)))
  }

  const restart = () => {
    setLines([])
    story(0)
  }

  const toggleMute = () => {
    setMute((v) => {
      setMuted(!v)
      return !v
    })
  }

  // ---------- ending numbers ----------

  const ending = useMemo(() => {
    const wu = stops[stops.length - 1].at
    const fromHome = Math.round(distanceKm(wu, HOME) / 10) * 10
    const g = hometown ? gazetteer.find((x) => x.name === hometown) : undefined
    let closest: { year: number; place: string; km: number } | null = null
    if (g) {
      const places = [
        ...stops.map((s) => ({ year: Math.floor(s.year), place: s.place, at: s.at })),
        ...(personById.get('zhugeliang')?.locations ?? []).map((l) => ({
          year: l.from,
          place: l.place,
          at: [l.lng, l.lat] as LngLat,
        })),
      ]
      for (const p of places) {
        const km = distanceKm([g.lng, g.lat], p.at)
        if (!closest || km < closest.km) closest = { year: p.year, place: p.place, km }
      }
    }
    return { fromHome, closest, home: g?.name }
  }, [hometown])

  const cur = stops[stopIdx]
  const waiting = phase === 'story' && hint !== null

  return (
    <div className={`life phase-${phase}`}>
      <div className="life-veil" />

      {phase === 'start' && (
        <section className="life-start">
          <p className="life-start-kicker">一个十三岁的男孩</p>
          <p className="life-start-tip">戴上耳机，会更好。</p>
          <label className="life-home">
            <span>你家在哪？可以不说。</span>
            <input
              value={homeDraft}
              placeholder="比如：临沂、荆州、广州"
              onChange={(e) => setHomeDraft(e.target.value)}
            />
            {suggestions.length > 0 && (
              <span className="life-home-list">
                {suggestions.map((g) => (
                  <button key={g.name} type="button" onClick={() => setHomeDraft(g.name)}>
                    {g.name}
                  </button>
                ))}
              </span>
            )}
          </label>
          <button type="button" className="life-begin" onClick={begin}>
            开始
          </button>
        </section>
      )}

      {phase !== 'start' && (
        <header className="life-when">
          <b>公元 {Math.floor(year)} 年</b>
          {!gone && phase === 'story' && (
            <span>
              {stopIdx === 0 && walkKm ? '在往南的路上' : cur.place}
              {stopIdx < stops.length - 1 && ` · 他 ${age} 岁`}
            </span>
          )}
        </header>
      )}

      {phase !== 'start' && (
        <nav className="life-tools">
          <button type="button" onClick={toggleMute}>
            {muted ? '打开声音' : '静音'}
          </button>
          <a href={window.location.pathname}>离开</a>
        </nav>
      )}

      <div className="life-captions" aria-live="polite">
        {captions.map((c) => (
          <p key={c.key}>
            <i>{c.year}</i>
            {c.text}
          </p>
        ))}
      </div>

      {phase === 'story' && (
        <section className="life-say" onClick={() => skip.current?.abort()}>
          {walkKm !== null && <p className="life-km">已经走了 {walkKm} 公里</p>}
          <div className="life-lines">
            {lines.slice(-3).map((l, i, arr) => (
              <p key={`${lines.length - arr.length + i}-${l}`} className={i === arr.length - 1 ? 'now' : ''}>
                {l}
              </p>
            ))}
          </div>
          {hint && (
            <div
              className={`life-hint ${hint.kind}`}
              onPointerDown={hint.kind === 'hold' ? (e) => holdApi.current?.press(e.nativeEvent) : undefined}
              onContextMenu={(e) => e.preventDefault()}
            >
              {hint.kind === 'next' ? (
                <button type="button" onClick={(e) => (e.stopPropagation(), resolveNext.current?.())}>
                  {hint.text}
                </button>
              ) : (
                <span>{hint.text}</span>
              )}
              {hint.kind === 'hold' && holdP > 0 && <em style={{ width: `${Math.round(holdP * 100)}%` }} />}
            </div>
          )}
          {waiting && !gone && (
            <button
              type="button"
              className="life-talk"
              onClick={(e) => {
                e.stopPropagation()
                setChatAt(stopIdx)
              }}
            >
              跟 {age} 岁的他说句话
            </button>
          )}
        </section>
      )}

      {phase === 'end' && (
        <section className="life-end">
          <p>五丈原离阳都，约 {ending.fromHome} 公里。</p>
          {ending.closest && (
            <p>
              {ending.closest.km < 40
                ? `他在你家附近住过：公元 ${ending.closest.year} 年前后，${ending.closest.place}，离你家约 ${Math.max(5, Math.round(ending.closest.km / 5) * 5)} 公里。`
                : `他这一生离你家最近的时候，是公元 ${ending.closest.year} 年在${ending.closest.place}，相距约 ${Math.round(ending.closest.km / 10) * 10} 公里。`}
            </p>
          )}
          <blockquote>{shareLine}</blockquote>
          <div className="life-end-actions">
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(shareLine).catch(() => {})}
            >
              复制这句话
            </button>
            <button type="button" onClick={restart}>
              从头再走一遍
            </button>
          </div>
          <div className="life-meet">
            <span>想见哪一年的他？</span>
            {stops.slice(0, -1).map((s, i) => (
              <button key={s.id} type="button" onClick={() => setChatAt(i)}>
                {Math.floor(s.year) - BORN} 岁 · {s.place}
              </button>
            ))}
          </div>
        </section>
      )}

      {chatAt !== null && <BesideChat stop={stops[chatAt]} onClose={() => setChatAt(null)} />}
    </div>
  )
}

interface Msg {
  role: 'user' | 'assistant'
  content: string
}

function BesideChat({ stop, onClose }: { stop: Stop; onClose: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const ac = useRef<AbortController | null>(null)
  const age = Math.floor(stop.year) - BORN

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
        body: JSON.stringify({
          personId: 'zhugeliang',
          messages: history,
          questions: [],
          fromYear: stop.year,
          fromPlace: stop.place,
          style: 'beside',
          stage: stop.stage,
        }),
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
      setError(msg === 'no_key' || msg === 'lan_blocked' ? '这一版还连不上他。' : '他没听清，再说一次吧。')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="life-chat" onClick={(e) => e.stopPropagation()}>
      <header>
        <div>
          <b>{age} 岁的诸葛亮</b>
          <span>
            公元 {Math.floor(stop.year)} 年 · {stop.place}
          </span>
        </div>
        <button type="button" onClick={onClose} aria-label="回去">
          回去
        </button>
      </header>
      <div className="life-chat-scroll" ref={scroller}>
        {msgs.length === 0 && <p className="life-chat-empty">只有他看得见你。想说什么都行。</p>}
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
        <input
          value={input}
          autoFocus
          placeholder={busy ? '他在想……' : '跟他说'}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={busy || !input.trim()}>
          说
        </button>
      </form>
    </section>
  )
}
