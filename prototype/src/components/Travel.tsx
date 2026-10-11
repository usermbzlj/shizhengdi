import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { getState, jumpYear, setState, useStore } from '../lib/store'
import { flyTo, getMap } from '../map/mapRef'
import { gazetteer, personById, personLocationAt } from '../data'
import type { Person } from '../data/types'
import { Icon } from './Icon'
import { portraits } from '../data/portraits'

interface Msg {
  role: 'user' | 'assistant'
  content: string
  hidden?: boolean
}

interface Trip {
  personId: string
  fromYear: number
  fromPlace: string
  fromCenter: [number, number]
  fromZoom: number
}

const DONE_Q = '〔问毕〕'
const FAREWELL = '〔告别〕'

let tripToken = 0
let motionRaf = 0
let motionTimer = 0

/** Stop a journey that is still flying, so a later callback cannot overwrite the mode. */
export function abortTravel() {
  tripToken += 1
  cancelAnimationFrame(motionRaf)
  window.clearTimeout(motionTimer)
  return tripToken
}

function imeEnter(e: { keyCode: number; nativeEvent: { isComposing: boolean } }) {
  return e.nativeEvent.isComposing || e.keyCode === 229
}

function pickQuestions(p: Person): string[] {
  const qs = p.questions.slice()
  const out: string[] = []
  const civic = qs.find((q) => /法|制度/.test(q.domain))
  if (civic) out.push(civic.q)
  for (const q of qs) {
    if (out.length >= 3) break
    if (out.includes(q.q)) continue
    const domains = out.map((x) => qs.find((y) => y.q === x)?.domain)
    if (domains.includes(q.domain) && qs.length > 4) continue
    out.push(q.q)
  }
  for (const q of qs) if (out.length < 3 && !out.includes(q.q)) out.push(q.q)
  // keep the person's own order so questions flow naturally
  return qs.map((q) => q.q).filter((q) => out.includes(q))
}

export function useTravel() {
  const [trip, setTrip] = useState<Trip | null>(null)

  const invite = async (personId: string) => {
    const p = personById.get(personId)
    if (!p) return
    const my = abortTravel()
    const s = getState()
    const loc = personLocationAt(p, s.year) ?? p.locations[0]
    const m = getMap()
    const t: Trip = {
      personId,
      fromYear: s.year,
      fromPlace: loc?.place ?? '',
      fromCenter: m ? (m.getCenter().toArray() as [number, number]) : [112, 32],
      fromZoom: m?.getZoom() ?? 4.5,
    }
    setTrip(t)
    setState({ mode: 'travel', panel: null, chatPerson: null })
    if (loc && tripToken === my) await flyTo([loc.lng, loc.lat], 6.4, 1400)
    if (tripToken !== my) return
    const home = gazetteer.find((g) => g.name === getState().hometown)
    const dest: [number, number] =
      home && Number.isFinite(home.lng) && Number.isFinite(home.lat)
        ? [home.lng, home.lat]
        : loc
          ? [loc.lng, loc.lat]
          : [112, 32]
    const start = performance.now()
    const dur = 4200
    await new Promise<void>((resolve) => {
      const step = (now: number) => {
        if (tripToken !== my) return resolve()
        const k = Math.min(1, Math.max(0, (now - start) / dur))
        setState({ modernity: Math.pow(k, 1.8) })
        if (k < 1) motionRaf = requestAnimationFrame(step)
        else resolve()
      }
      motionRaf = requestAnimationFrame(step)
      motionTimer = window.setTimeout(() => {
        if (tripToken !== my) return
        flyTo(dest, 3.9, 1600).then(() => {
          if (tripToken === my) flyTo(dest, 6.6, 1800)
        })
      }, 900)
    })
    if (tripToken !== my || getState().mode !== 'travel') return
    setState({ mode: 'chat', chatPerson: personId })
  }

  const sendBack = async () => {
    if (!trip) return
    const back = trip
    const token = abortTravel()
    setState({ mode: 'travel', chatPerson: null })
    const start = performance.now()
    const dur = 2600
    flyTo(back.fromCenter, back.fromZoom, 2400)
    await new Promise<void>((resolve) => {
      const step = (now: number) => {
        if (tripToken !== token) return resolve()
        const k = Math.min(1, Math.max(0, (now - start) / dur))
        setState({ modernity: 1 - k * k })
        if (k < 1) motionRaf = requestAnimationFrame(step)
        else resolve()
      }
      motionRaf = requestAnimationFrame(step)
    })
    if (tripToken !== token) return
    setState({ modernity: 0, mode: 'explore', panel: { kind: 'person', id: back.personId } })
    jumpYear(back.fromYear)
    setTrip(null)
  }

  return { trip, invite, sendBack }
}

export function TravelOverlay({ trip }: { trip: Trip | null }) {
  const mode = useStore((s) => s.mode)
  const modernity = useStore((s) => s.modernity)
  const p = trip ? personById.get(trip.personId) : null
  const shownYear = trip ? Math.round(trip.fromYear + (2026 - trip.fromYear) * modernity) : 0
  return (
    <AnimatePresence>
      {mode === 'travel' && p && (
        <motion.div className="travel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <p className="op-kicker">{modernity < 0.98 ? `${p.name}正在穿越时空` : '抵达'}</p>
          <p className="op-counter">{shownYear}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Chat({ trip, onBack }: { trip: Trip | null; onBack: () => void }) {
  const mode = useStore((s) => s.mode)
  const hometown = useStore((s) => s.hometown)
  const p = trip ? personById.get(trip.personId) : null
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [answered, setAnswered] = useState(0)
  const [done, setDone] = useState(false)
  const questions = useRef<string[]>([])
  const scroller = useRef<HTMLDivElement>(null)
  const req = useRef(0)

  useEffect(() => {
    if (mode !== 'chat' || !p || !trip) return
    const ac = new AbortController()
    const id = ++req.current
    questions.current = pickQuestions(p)
    setAnswered(0)
    setDone(false)
    setError(null)
    const first: Msg = {
      role: 'user',
      hidden: true,
      content: '（你刚刚落地，一位初中生走上前来向你问好。请先用两三句话介绍自己、说说眼前让你最吃惊的景象，然后提出第一个问题。）',
    }
    setMsgs([first])
    send([first], ac.signal, id)
    return () => {
      ac.abort()
      req.current += 1
    }
  }, [mode, trip?.personId])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
  }, [msgs])

  async function send(history: Msg[], signal?: AbortSignal, id = ++req.current) {
    if (!p || !trip) return
    const mine = id
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personId: p.id,
          messages: history.map(({ role, content }) => ({ role, content })),
          questions: questions.current,
          fromYear: trip.fromYear,
          fromPlace: trip.fromPlace,
          hometown: hometown ?? undefined,
        }),
        signal,
      })
      if (req.current !== mine) return
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error === 'no_key' ? 'no_key' : `http_${res.status}`)
      }
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let text = ''
      setMsgs((m) => [...m, { role: 'assistant', content: '' }])
      for (;;) {
        const { done: end, value } = await reader.read()
        if (end || req.current !== mine) break
        text += dec.decode(value, { stream: true })
        if (req.current === mine) setMsgs((m) => [...m.slice(0, -1), { role: 'assistant', content: text }])
      }
      if (req.current !== mine) return
      const q = (text.match(/〔问毕〕/g) ?? []).length
      if (q) setAnswered((a) => Math.min(questions.current.length, a + q))
      if (text.includes(FAREWELL)) setDone(true)
    } catch (e) {
      if ((e as Error).name === 'AbortError' || req.current !== mine) return
      const msg = (e as Error).message
      setError(
        msg === 'no_key' ? '他还没能开口。这台机器上还没配好对谈。' : '路断了，稍后再试一次。',
      )
    } finally {
      if (req.current === mine) setBusy(false)
    }
  }

  const submit = () => {
    const t = input.trim()
    if (!t || busy || done) return
    const next = [...msgs, { role: 'user' as const, content: t }]
    setMsgs(next)
    setInput('')
    send(next)
  }

  const show = mode === 'chat' && p
  const total = questions.current.length || 3
  const visible = msgs.filter((m) => !m.hidden)
  const lastAsk = [...visible].reverse().find((m) => m.role === 'assistant')
  const earlier = visible.filter((m) => m !== lastAsk && m.role === 'user')
  const askText = lastAsk?.content.replaceAll(DONE_Q, '').replaceAll(FAREWELL, '').trim() ?? ''

  return (
    <AnimatePresence>
      {show && (
        <motion.section
          className="chat visit"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <header className="chat-head">
            <span className="pp-face big">{portraits[p.id] ? <img src={portraits[p.id].src} alt={`${p.name}人物意象插画`} /> : p.name.slice(-1)}</span>
            <div>
              <h3>{p.name}</h3>
              <p className="muted">
                来自公元 {Math.floor(trip!.fromYear)} 年的{trip!.fromPlace}
              </p>
            </div>
            <span className="visit-step">
              第 {Math.min(total, answered + (done ? 0 : 1))} 问 / {total}
            </span>
          </header>
          <div className="chat-scroll" ref={scroller}>
            {earlier.length > 0 && <p className="visit-past">你已经讲过 {earlier.length} 句。</p>}
            <p className="visit-q">{askText || (busy ? `${p.name}正在看这个时代……` : '')}</p>
            {error && (
              <div className="visit-error">
                <p>{error}</p>
                {error.includes('没配好') && <p className="visit-fine">在 prototype 目录的 .env 写入 DEEPSEEK_API_KEY 后，重启开发服务器。</p>}
              </div>
            )}
          </div>
          {done ? (
            <div className="chat-done">
              <p>
                {p.name}在这个时代留下了一枚印记：你讲明白了 {answered} 个问题。
              </p>
              <button className="cta" onClick={onBack}>
                送{p.name}回到公元 {Math.floor(trip!.fromYear)} 年
              </button>
            </div>
          ) : (
            <form
              className="chat-input"
              onSubmit={(e) => {
                e.preventDefault()
                submit()
              }}
            >
              <textarea
                value={input}
                placeholder={busy ? `${p.name}正在说……` : `只回答他这一问`}
                rows={2}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !imeEnter(e)) {
                    e.preventDefault()
                    submit()
                  }
                }}
              />
              <button type="submit" disabled={busy || !input.trim()} aria-label="发送">
                <Icon name="send" />
              </button>
              <button type="button" className="link chat-leave" onClick={onBack}>
                送他回去
              </button>
            </form>
          )}
        </motion.section>
      )}
    </AnimatePresence>
  )
}
