import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { activeFlight, animateYear, getState, setState, stopYearAnimation, useStore } from '../lib/store'
import { flyTo, refreshCameraPadding } from '../map/mapRef'
import { eventById, personById, worldById } from '../data'
import { eventBounds } from '../map/eventArc'
import type { GuideStep } from '../data/types'
import { Icon } from './Icon'

export interface GuideScript {
  id: string
  title: string
  subtitle?: string
  steps: GuideStep[]
  visitor?: string
  audioDir: string
}

function readingSeconds(text: string, speed: number) {
  const chars = text.replace(/\s/g, '').length
  return Math.max(4.5, chars / 5.2 + 1.2) / speed
}

/** Arrive as the event is gathering, then drift through the strike and into the release. */
function stepMotion(step: GuideStep, nextYear: number) {
  const e = step.eventId ? eventById.get(step.eventId) : undefined
  if (!e) {
    const arrive = step.year
    return { arrive, driftTo: Math.min(nextYear - 0.02, arrive + 0.6) }
  }
  const b = eventBounds(e)
  const arrive = b.openAt
  const driftTo = Math.max(arrive + 0.08, Math.min(nextYear - 0.04, b.closeAt))
  return { arrive, driftTo }
}

function seekMs(from: number, to: number) {
  return Math.min(3200, Math.max(700, Math.abs(to - from) * 140))
}

export default function GuidePlayer({
  script,
  onExit,
  onInvite,
}: {
  script: GuideScript | null
  onExit: () => void
  onInvite: (id: string) => void
}) {
  const muted = useStore((s) => s.muted)
  const mode = useStore((s) => s.mode)
  const hold = useStore((s) => s.hold)
  const year = useStore((s) => s.year)
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [ended, setEnded] = useState(false)
  const audio = useRef<HTMLAudioElement | null>(null)
  const active = !!script && mode === 'guide'
  const step = script?.steps[i]
  const currentStep = useRef<string | null>(null)
  const pausedRef = useRef(paused)
  const speedRef = useRef(speed)
  const gotoRef = useRef<(n: number) => void>(() => {})
  const clock = useRef<{ dead: boolean; pause: () => void; resume: () => void; setSpeed: (n: number) => void; setMuted: (m: boolean) => void } | null>(null)
  const linesScript = useRef('')
  const linesBase = useRef<Record<string, boolean> | null>(null)
  const waiting = paused || hold
  currentStep.current = active && step ? step.id : null
  pausedRef.current = waiting
  speedRef.current = speed

  useEffect(() => {
    if (!script) return
    const saved = Number(localStorage.getItem(`szd-guide-${script.id}`) || 0)
    setI(saved > 0 && saved < script.steps.length ? saved : 0)
    setEnded(false)
    setPaused(false)
  }, [script])

  const goto = useCallback(
    (n: number) => {
      if (!script) return
      if (n >= script.steps.length) {
        setEnded(true)
        localStorage.removeItem(`szd-guide-${script.id}`)
        return
      }
      setEnded(false)
      setI(Math.max(0, n))
    },
    [script],
  )
  gotoRef.current = goto

  // Enter a step: fly to a year where this event is still happening, then read.
  useEffect(() => {
    if (!active || !script || !step || ended) return
    localStorage.setItem(`szd-guide-${script.id}`, String(i))
    if (linesScript.current !== script.id) {
      linesScript.current = script.id
      linesBase.current = { ...getState().layers.lines }
    }
    const lines = { ...(linesBase.current ?? {}) }
    for (let k = 0; k <= i; k++) for (const id of script.steps[k].lines ?? []) lines[id] = true
    setState({
      layers: { ...getState().layers, lines },
      panel: step.eventId ? { kind: 'event', id: step.eventId } : null,
    })

    const nextYear = script.steps[i + 1]?.year ?? step.year + 0.6
    const { arrive, driftTo } = stepMotion(step, nextYear)
    const timer = { start: 0, elapsed: 0, total: 0, raf: 0 }
    let advance = 0
    let seekDone = false
    let playing = false
    let owned = activeFlight()
    const glide = (to: number, ms: number, ease?: (k: number) => number) => {
      const pending = animateYear(to, ms, ease)
      owned = activeFlight()
      return pending
    }
    const api = {
      dead: false,
      pause() {},
      resume() {},
      setSpeed(_n: number) {},
      setMuted(_m: boolean) {},
    }
    clock.current = api
    const live = () => !api.dead && currentStep.current === step.id

    const fractionNow = () => {
      const a = audio.current
      if (a?.duration && Number.isFinite(a.duration)) return Math.min(1, a.currentTime / a.duration)
      const elapsed = timer.elapsed + (playing && timer.start ? performance.now() - timer.start : 0)
      return timer.total > 0 ? Math.min(1, elapsed / timer.total) : 0
    }

    const stopAudio = () => {
      window.clearTimeout(advance)
      const a = audio.current
      if (!a) return
      a.onended = null
      a.pause()
      audio.current = null
    }

    const goNext = () => {
      if (live()) gotoRef.current(i + 1)
    }

    const startReading = () => {
      cancelAnimationFrame(timer.raf)
      timer.start = performance.now()
      const loop = (now: number) => {
        if (audio.current || !playing || api.dead) return
        const elapsed = timer.elapsed + (now - timer.start)
        setProgress(Math.min(1, elapsed / timer.total))
        if (elapsed >= timer.total) return goNext()
        timer.raf = requestAnimationFrame(loop)
      }
      timer.raf = requestAnimationFrame(loop)
    }

    const beginAudio = (frac: number) => {
      if (getState().muted || !step.audio) return false
      stopAudio()
      const a = new Audio(`${import.meta.env.BASE_URL}${script.audioDir}/${step.audio}`)
      audio.current = a
      a.playbackRate = speedRef.current
      a.onended = () => {
        if (live()) advance = window.setTimeout(goNext, 700)
      }
      a.ontimeupdate = () => {
        if (a.duration) setProgress(a.currentTime / a.duration)
      }
      const fail = () => {
        if (audio.current !== a) return
        audio.current = null
        startReading()
      }
      a.onerror = fail
      a.addEventListener('loadedmetadata', () => {
        if (!live() || audio.current !== a || !Number.isFinite(a.duration)) return
        if (frac > 0.01) a.currentTime = Math.max(0, Math.min(a.duration - 0.05, frac * a.duration))
        timer.total = (a.duration / speedRef.current) * 1000
        timer.elapsed = frac * timer.total
        timer.start = performance.now()
        if (playing && !pausedRef.current && driftTo - getState().year > 0.02) {
          glide(driftTo, Math.max(400, (1 - frac) * timer.total), (k) => k)
        }
      }, { once: true })
      a.play()
        .then(() => {
          if (pausedRef.current || api.dead) a.pause()
        })
        .catch(fail)
      return true
    }

    const startPlay = () => {
      if (api.dead || pausedRef.current) return
      playing = true
      const frac = timer.total > 0 ? Math.min(0.98, timer.elapsed / timer.total) : 0
      timer.total = readingSeconds(step.text, speedRef.current) * 1000
      timer.elapsed = frac * timer.total
      timer.start = performance.now()
      const remainMs = Math.max(400, (1 - frac) * timer.total)
      if (driftTo - getState().year > 0.02) glide(driftTo, remainMs, (k) => k)
      if (!beginAudio(frac)) startReading()
    }

    api.pause = () => {
      if (api.dead) return
      window.clearTimeout(advance)
      cancelAnimationFrame(timer.raf)
      timer.elapsed = fractionNow() * timer.total
      playing = false
      audio.current?.pause()
      stopYearAnimation()
    }
    api.resume = () => {
      if (api.dead || pausedRef.current) return
      setState({ panel: step.eventId ? { kind: 'event', id: step.eventId } : null })
      flyTo(step.center, step.zoom, 900)
      if (!seekDone) {
        glide(arrive, seekMs(getState().year, arrive)).then((status) => {
          if (api.dead || status === 'cancelled') return
          seekDone = true
          if (!pausedRef.current) startPlay()
        })
        return
      }
      if (audio.current && !getState().muted) {
        playing = true
        audio.current.playbackRate = speedRef.current
        audio.current.play().catch(() => {
          audio.current = null
          startPlay()
        })
        if (driftTo - getState().year > 0.02) {
          const frac = audio.current.duration ? audio.current.currentTime / audio.current.duration : timer.elapsed / timer.total
          glide(driftTo, Math.max(400, (1 - frac) * timer.total), (k) => k)
        }
        return
      }
      startPlay()
    }
    api.setSpeed = (sp: number) => {
      const frac = fractionNow()
      speedRef.current = sp
      const a = audio.current
      if (a) a.playbackRate = sp
      timer.total = a?.duration && Number.isFinite(a.duration) ? (a.duration / sp) * 1000 : readingSeconds(step.text, sp) * 1000
      timer.elapsed = frac * timer.total
      timer.start = performance.now()
      setProgress(frac)
      if (playing && driftTo - getState().year > 0.02) glide(driftTo, Math.max(400, (1 - frac) * timer.total), (k) => k)
    }
    api.setMuted = (m: boolean) => {
      const frac = fractionNow()
      timer.elapsed = frac * timer.total
      timer.start = performance.now()
      if (m) {
        window.clearTimeout(advance)
        stopAudio()
        if (playing) startReading()
      } else if (playing && step.audio) {
        cancelAnimationFrame(timer.raf)
        beginAudio(frac)
      }
    }

    setProgress(0)
    flyTo(step.center, step.zoom, 2400)
    const from = getState().target
    if (Math.abs(from - arrive) < 0.03) {
      seekDone = true
      if (!pausedRef.current) startPlay()
    } else {
      glide(arrive, seekMs(from, arrive)).then((status) => {
        if (api.dead || status === 'cancelled') return
        seekDone = true
        if (!pausedRef.current) startPlay()
      })
    }

    return () => {
      api.dead = true
      window.clearTimeout(advance)
      cancelAnimationFrame(timer.raf)
      stopAudio()
      if (clock.current === api) clock.current = null
      if (activeFlight() === owned) stopYearAnimation()
    }
  }, [active, i, ended, script])

  const prevWaiting = useRef(waiting)
  useEffect(() => {
    if (prevWaiting.current === waiting) return
    prevWaiting.current = waiting
    if (!active || ended) return
    if (waiting) clock.current?.pause()
    else clock.current?.resume()
  }, [waiting, active, ended])

  const prevSpeed = useRef(speed)
  useEffect(() => {
    if (prevSpeed.current === speed) return
    prevSpeed.current = speed
    clock.current?.setSpeed(speed)
  }, [speed])

  const prevMuted = useRef(muted)
  useEffect(() => {
    if (prevMuted.current === muted) return
    prevMuted.current = muted
    clock.current?.setMuted(muted)
  }, [muted])

  if (!script) return null
  const visitor = script.visitor ? personById.get(script.visitor) : undefined
  const world = step?.worldId ? worldById.get(step.worldId) : undefined
  const ev = step?.eventId ? eventById.get(step.eventId) : undefined

  return (
    <AnimatePresence>
      {active && step && (
        <motion.div
          className="guide"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="guide-head">
            <span className="guide-chapter">
              {script.title}
              {script.subtitle && <em> · {script.subtitle}</em>}
            </span>
            <span className="guide-count">
              {hold ? Math.floor(year) : (ev?.year ?? Math.floor(step.year))} 年 · {Math.min(i + 1, script.steps.length)} / {script.steps.length}
            </span>
            <button className="guide-x" onClick={onExit} aria-label="退出">
              <Icon name="close" size={16} />
            </button>
          </div>

          {ended ? (
            <div className="guide-end">
              <p className="guide-title">本章结束</p>
              {visitor ? (
                <>
                  <p className="guide-text">
                    {visitor.name}看着地图上的这一切，忽然问你：“你们那个时代，是什么样子？我想去看看。”
                  </p>
                  <div className="guide-end-actions">
                    <button className="cta" onClick={() => onInvite(visitor.id)}>
                      <Icon name="travel" />
                      邀请{visitor.name}来到今天
                    </button>
                    <button className="ghost" onClick={onExit}>
                      自己探索地图
                    </button>
                  </div>
                </>
              ) : (
                <button className="ghost" onClick={onExit}>
                  自己探索地图
                </button>
              )}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                className="guide-body"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {step.title && <p className="guide-title">{step.title}</p>}
                <p className="guide-text">{step.text}</p>
                {world && (
                  <button
                    className="guide-world"
                    onClick={() => {
                      setState({ hold: true, panel: { kind: 'world', id: world.id } })
                      refreshCameraPadding()
                    }}
                  >
                    <span className="tag tag-world">世界</span>
                    {world.name} · 看局部地图
                  </button>
                )}
                {ev && (
                  <button
                    className="link guide-more"
                    onClick={() => {
                      setState({ hold: true, panel: { kind: 'event', id: ev.id } })
                      refreshCameraPadding()
                    }}
                  >
                    展开「{ev.name}」详情
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {!ended && (
            <div className="guide-controls">
              <button onClick={() => goto(i - 1)} disabled={i === 0} aria-label="上一段">
                <Icon name="prev" />
              </button>
              <button
                className="guide-play"
                onClick={() => {
                  if (waiting) {
                    setPaused(false)
                    if (getState().hold) setState({ hold: false })
                  } else setPaused(true)
                }}
                aria-label={waiting ? '继续' : '暂停'}
              >
                <Icon name={waiting ? 'play' : 'pause'} />
              </button>
              <button onClick={() => goto(i + 1)} aria-label="下一段">
                <Icon name="next" />
              </button>
              <div className="guide-progress">
                <i style={{ transform: `scaleX(${progress})` }} />
              </div>
              <button
                className="guide-speed"
                onClick={() => setSpeed(speed === 1 ? 1.25 : speed === 1.25 ? 0.8 : 1)}
                title="播放速度"
              >
                {speed}×
              </button>
              <button onClick={() => setState({ muted: !muted })} aria-label={muted ? '打开旁白' : '关闭旁白'}>
                <Icon name={muted ? 'mute' : 'sound'} size={16} />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
