import { useEffect, useMemo, useRef, useState } from 'react'
import { animateYear, getState, setState, stopYearAnimation, useStore } from '../lib/store'
import { YEAR_MAX, YEAR_MIN, clamp, dynastyName, eraReadings, ratioToYear, yearToRatio } from '../lib/time'
import { briefById, eventTime, events, factionColor, keyframes, worldEvents } from '../data'
import { arcPhase, eventBounds } from '../map/eventArc'
import { mixAt, shownIndex } from '../map/territory'
import { iconSvg } from '../map/icons'
import './timeline-refined.css'

interface TimelineItem {
  id: string
  year: number
  time: number
  name: string
  kind: 'event' | 'world'
  icon: string
  summary?: string
}

interface EventCluster {
  id: string
  x: number
  items: TimelineItem[]
}

function clusterItems(items: TimelineItem[], width: number, lane: string): EventCluster[] {
  const columns = Math.max(1, Math.floor(width / 48))
  const groups = new Map<number, TimelineItem[]>()
  for (const item of items) {
    const column = Math.min(columns - 1, Math.max(0, Math.floor(yearToRatio(item.time) * columns)))
    groups.set(column, [...(groups.get(column) ?? []), item])
  }
  return [...groups].sort(([a], [b]) => a - b).map(([column, group]) => ({
    id: `${lane}-${column}`,
    x: ((column + 0.5) / columns) * width,
    items: group.sort((a, b) => a.time - b.time),
  }))
}

const BANDS = [
  { from: 150, to: 184, label: '东汉', color: 'var(--han)' },
  { from: 184, to: 220, label: '东汉末 · 群雄并起', color: 'var(--han)' },
  { from: 220, to: 280, label: '三国', tri: true },
  { from: 280, to: 300, label: '西晋', color: 'var(--jin)' },
]

const TICKS = [160, 184, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 300]

const STATE_COLOR: Record<string, string> = { 魏: 'wei', 蜀: 'shu', 吴: 'wu', 晋: 'jin', 汉: 'han' }

/** The line under the year: the beat of the story now on the map, otherwise the current chapter. */
function situationAt(year: number) {
  if (!keyframes.length) return ''
  const { index, next, mix } = mixAt(year)
  const kf = keyframes[shownIndex(index, next, mix)]
  let best: { name: string; phase: string; dist: number } | null = null
  for (const e of events) {
    if (e.importance !== 1) continue
    const b = eventBounds(e)
    if (year < b.openAt || year > b.closeAt) continue
    const phase = arcPhase(year, b)
    if (phase === 'before' || phase === 'past') continue
    const dist = Math.abs(year - b.t)
    const live = phase === 'live'
    if (!best || (live && best.phase !== 'live') || (phase === best.phase && dist < best.dist)) best = { name: e.name, phase, dist }
  }
  if (best) return best.name
  return year - kf.year < 2.5 ? kf.label : ''
}

export default function Timeline({ onToday, cue }: { onToday: () => void; cue?: string | null }) {
  const year = useStore((s) => s.target)
  const shown = useStore((s) => s.year)
  const mode = useStore((s) => s.mode)
  const panel = useStore((s) => s.panel)
  const track = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const [openCluster, setOpenCluster] = useState<(EventCluster & { left: number }) | null>(null)
  const popover = useRef<HTMLDivElement>(null)
  const clusterTrigger = useRef<HTMLButtonElement | null>(null)
  const drag = useRef({ active: false, lastX: 0, lastT: 0, v: 0 })
  const locked = mode === 'opening' || mode === 'travel' || mode === 'chat'

  const keyEvents = useMemo(() => events.filter((e) => e.importance === 1), [])
  const snapTargets = useMemo(() => keyEvents.map((e) => eventTime(e)).sort((a, b) => a - b), [keyEvents])

  const [width, setWidth] = useState(1000)
  const historyClusters = useMemo(() => clusterItems(keyEvents.map((e) => ({
    id: e.id, year: e.year, time: eventTime(e), name: e.name, kind: 'event', icon: e.kind, summary: briefById.get(e.id)?.line,
  })), width, 'history'), [keyEvents, width])
  const worldClusters = useMemo(() => clusterItems(worldEvents.map((w) => ({
    id: w.id, year: w.year, time: w.year + 0.5, name: w.name, kind: 'world', icon: 'world',
  })), width, 'world'), [width])

  useEffect(() => {
    setOpenCluster(null)
  }, [width, locked])

  useEffect(() => {
    if (!openCluster) return
    popover.current?.querySelector<HTMLButtonElement>('[data-choice]')?.focus()
    const outside = (e: PointerEvent) => {
      if (!popover.current?.contains(e.target as Node) && !clusterTrigger.current?.contains(e.target as Node)) setOpenCluster(null)
    }
    window.addEventListener('pointerdown', outside)
    return () => window.removeEventListener('pointerdown', outside)
  }, [openCluster])
  useEffect(() => {
    document.documentElement.classList.toggle('scrubbing', dragging)
    return () => document.documentElement.classList.remove('scrubbing')
  }, [dragging])
  useEffect(() => {
    const el = track.current
    if (!el) return
    const ro = new ResizeObserver(() => setWidth(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const yearFromX = (clientX: number) => {
    const r = track.current!.getBoundingClientRect()
    return ratioToYear((clientX - r.left) / r.width)
  }

  const onDown = (e: React.PointerEvent) => {
    if (locked) return
    setOpenCluster(null)
    stopYearAnimation()
    try {
      track.current?.setPointerCapture(e.pointerId)
    } catch {
      // synthetic or already-released pointers cannot be captured; dragging still works via move events
    }
    drag.current = { active: true, lastX: e.clientX, lastT: performance.now(), v: 0 }
    setDragging(true)
    if (getState().mode === 'guide') setState({ hold: true, panel: null })
    const y = yearFromX(e.clientX)
    setState({ year: y, target: y })
    const up = () => {
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      onUp()
    }
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  const onMove = (e: React.PointerEvent) => {
    const r = track.current!.getBoundingClientRect()
    if (!drag.current.active) return
    const now = performance.now()
    const dt = Math.max(1, now - drag.current.lastT)
    const inst = (e.clientX - drag.current.lastX) / dt
    drag.current.v = drag.current.v * 0.6 + inst * 0.4
    drag.current.lastX = e.clientX
    drag.current.lastT = now
    const y = ratioToYear((e.clientX - r.left) / r.width)
    setState({ year: y, target: y })
  }

  const onUp = () => {
    if (!drag.current.active) return
    drag.current.active = false
    setDragging(false)
    const r = track.current!.getBoundingClientRect()
    const v = drag.current.v // px per ms
    const cur = getState().target
    let targetRatio = yearToRatio(cur) + (v * 220) / r.width
    targetRatio = clamp(targetRatio, 0, 1)
    let target = ratioToYear(targetRatio)
    let best = target
    let bestPx = Infinity
    let secondPx = Infinity
    for (const t of snapTargets) {
      const px = Math.abs(yearToRatio(t) - targetRatio) * r.width
      if (px < bestPx) {
        secondPx = bestPx
        bestPx = px
        best = t
      } else if (px < secondPx) secondPx = px
    }
    if (bestPx <= Math.min(10, secondPx * 0.45)) target = best
    if (Math.abs(target - cur) > 0.01) animateYear(target, Math.abs(v) > 0.2 ? 700 : 420, easeOut)
  }

    const onKey = (e: React.KeyboardEvent) => {
      if (locked) return
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const dir = e.key === 'ArrowLeft' ? -1 : 1
        const cur = getState().target
        const next = e.shiftKey ? nextEvent(cur, dir, snapTargets) : clamp(Math.round(cur) + dir, YEAR_MIN, YEAR_MAX)
        if (getState().mode === 'guide') setState({ hold: true, panel: null })
        animateYear(next, 380, easeOut)
      } else if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault()
        if (getState().mode === 'guide') setState({ hold: true, panel: null })
        animateYear(e.key === 'Home' ? YEAR_MIN : YEAR_MAX, 380, easeOut)
      }
    }

  const selectedId = panel?.kind === 'event' || panel?.kind === 'world' ? panel.id : null
  const pct = (y: number) => `${yearToRatio(y) * 100}%`

  const selectItem = (item: TimelineItem) => {
    if (locked) return
    setOpenCluster(null)
    clusterTrigger.current?.focus()
    if (getState().mode === 'guide') {
      setState({ hold: true, panel: { kind: item.kind, id: item.id } })
    } else {
      setState({ panel: { kind: item.kind, id: item.id } })
      animateYear(item.time, 650)
    }
  }

  const clusterButton = (cluster: EventCluster, lane: string) => {
    const first = cluster.items[0]
    const many = cluster.items.length > 1
    const range = `${first.year}${cluster.items.at(-1)!.year !== first.year ? `—${cluster.items.at(-1)!.year}` : ''} 年`
    return (
      <button key={cluster.id} type="button" disabled={locked}
        className={`tl-cluster tl-cluster-${lane}${cluster.items.some((item) => item.id === selectedId) ? ' sel' : ''}`}
        style={{ left: cluster.x }}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          clusterTrigger.current = e.currentTarget
          if (!many) return selectItem(first)
          const left = Math.max(16, Math.min(window.innerWidth - 376, (track.current?.getBoundingClientRect().left ?? 0) + cluster.x - 180))
          setOpenCluster(openCluster?.id === cluster.id ? null : { ...cluster, left })
        }}
        title={many ? `${range} · ${cluster.items.length} 件${lane === 'world' ? '世界' : '历史'}事件` : `${first.year} 年 · ${first.name}`}
        aria-label={many ? `${range}，展开 ${cluster.items.length} 件${lane === 'world' ? '世界' : '历史'}事件` : `${first.year} 年 ${first.name}`}
        aria-expanded={many ? openCluster?.id === cluster.id : undefined}
        aria-controls={many && openCluster?.id === cluster.id ? 'timeline-events' : undefined}>
        <span className="tl-cluster-icon" dangerouslySetInnerHTML={{ __html: iconSvg(first.icon, 14) }} />
        {many && <span className="tl-cluster-count">{cluster.items.length}</span>}
      </button>
    )
  }

  return (
    <div className={`timeline${dragging ? ' dragging' : ''}${locked ? ' locked' : ''}`}>
      <div className="tl-main">
        <div className="tl-bands">
          {BANDS.map((b) => (
            <div key={b.from} className="tl-band" style={{ left: pct(b.from), width: `calc(${pct(b.to)} - ${pct(b.from)})` }}>
              {b.tri ? (
                <div className="tl-tri">
                  <i style={{ background: factionColor('wei') }} />
                  <i style={{ background: factionColor('shu') }} />
                  <i style={{ background: factionColor('wu') }} />
                </div>
              ) : (
                <div className="tl-band-fill" style={{ background: b.color }} />
              )}
              <span className="tl-band-label">{b.label}</span>
            </div>
          ))}
          <div className="tl-band tl-band-jin" style={{ left: pct(265), width: `calc(${pct(280)} - ${pct(265)})` }}>
            <div className="tl-band-fill" style={{ background: 'var(--jin)' }} />
          </div>
        </div>

        <div
          ref={track}
          className="tl-track"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <div className="tl-scrub" role="slider" tabIndex={locked ? -1 : 0}
            aria-label="历史年份，左右键调整一年，Shift 加左右键跳到事件" aria-valuemin={YEAR_MIN} aria-valuemax={YEAR_MAX}
            aria-valuenow={Math.floor(year)} aria-valuetext={`${Math.floor(year)} 年，${dynastyName(year)}`} aria-disabled={locked}
            onKeyDown={onKey} />
          <div className="tl-rail" />
          {TICKS.map((t) => (
            <div key={t} className={`tl-tick${t % 50 === 0 || t === 184 || t === 220 || t === 280 ? ' major' : ''}`} style={{ left: pct(t) }}>
              <span>{t}</span>
            </div>
          ))}
          <span className="tl-lane-label tl-lane-history" aria-hidden>历史</span>
          {historyClusters.map((cluster) => clusterButton(cluster, 'history'))}
          <span className="tl-lane-label tl-lane-world" aria-hidden>世界</span>
          {worldClusters.map((cluster) => clusterButton(cluster, 'world'))}
          {Math.abs(shown - year) > 0.03 && (
            <div className="tl-ghost" style={{ left: pct(shown) }} title="地图正在播放到这里">
              <div className="tl-ghost-line" />
              <span className="tl-ghost-label">{Math.floor(shown)}</span>
            </div>
          )}
          <div className="tl-head" style={{ left: pct(year) }}>
            <Readout year={year} shift={readoutShift(yearToRatio(year) * width, width)} cue={cue} />
            <div className="tl-head-line" />
            <div className="tl-head-knob" />
          </div>
        </div>
      </div>

      <div className="tl-gap" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <button className={`tl-today${mode === 'chat' || mode === 'travel' ? ' on' : ''}`} onClick={onToday} disabled={locked}>
        <span className="tl-today-dot" />
        今天
      </button>
      {openCluster && (
        <div ref={popover} id="timeline-events" className="tl-event-list" role="dialog" aria-label="选择时间轴事件"
          style={{ left: openCluster.left }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault()
              e.stopPropagation()
              setOpenCluster(null)
              clusterTrigger.current?.focus()
              return
            }
            if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return
            e.preventDefault()
            const choices = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[data-choice]'))
            const i = choices.indexOf(document.activeElement as HTMLButtonElement)
            const next = e.key === 'Home' ? 0 : e.key === 'End' ? choices.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + choices.length) % choices.length
            choices[next]?.focus()
          }}>
          <div className="tl-list-head">
            <span>{openCluster.items[0].kind === 'world' ? '同时代的世界' : '这一段历史'} · {openCluster.items.length} 件事件</span>
            <button type="button" aria-label="关闭事件列表" onClick={() => {
              setOpenCluster(null)
              clusterTrigger.current?.focus()
            }}>×</button>
          </div>
          <div className="tl-list-items">
            {openCluster.items.map((item) => (
              <button key={item.id} type="button" data-choice onClick={() => selectItem(item)}>
                <span className="tl-list-year">{item.year}</span>
                <span><b>{item.name}</b>{item.summary && <small>{item.summary}</small>}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function readoutShift(headX: number, width: number) {
  const half = 116
  if (headX < half) return half - headX
  if (headX > width - half) return width - half - headX
  return 0
}

function Readout({ year, shift, cue }: { year: number; shift: number; cue?: string | null }) {
  const y = Math.floor(year)
  const eras = eraReadings(year)
  const situation = situationAt(year)
  return (
    <div className="tl-readout" style={{ '--shift': `${shift}px` } as React.CSSProperties}>
      <div className="tl-yearline">
        <span className="tl-dyn">{dynastyName(year)}</span>
        <span className="tl-year">{y}</span>
        <span className="tl-ad">年</span>
      </div>
      <div className="tl-meta">
        {eras.map((e) => (
          <span key={e.state}>
            <i style={{ background: factionColor(STATE_COLOR[e.state]) }} />
            {e.state} · {e.label}
          </span>
        ))}
        {situation && <em>{situation}</em>}
      </div>
      {cue && <div className="tl-cue">{cue}</div>}
    </div>
  )
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

function nextEvent(cur: number, dir: number, targets: number[]) {
  if (dir > 0) return targets.find((t) => t > cur + 0.05) ?? cur
  for (let i = targets.length - 1; i >= 0; i--) if (targets[i] < cur - 0.05) return targets[i]
  return cur
}
