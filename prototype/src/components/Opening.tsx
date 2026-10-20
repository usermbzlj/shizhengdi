import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { getState, jumpYear, setState, useStore } from '../lib/store'
import { flyTo, whenMap } from '../map/mapRef'
import { gazetteer } from '../data'
import { Icon } from './Icon'

const START_YEAR = 184
/** Inside the Yellow Turban rising (184.1–184.7), so the first view shows the event, not its gathering ring. */
const ARRIVE_YEAR = 184.2
const MILESTONES = [
  { year: 1949, text: '铁路与城市的灯火' },
  { year: 1368, text: '明长城' },
  { year: 610, text: '隋唐大运河' },
  { year: 184, text: '东汉 · 中平元年' },
]

/** “倒带进入”: from today's earth back to 184 AD. */
export default function Opening({ onDone }: { onDone: (choice: 'guide' | 'explore' | 'stories') => void }) {
  const mode = useStore((s) => s.mode)
  const hometown = useStore((s) => s.hometown)
  const [counter, setCounter] = useState<number | null>(null)
  const [phase, setPhase] = useState<'fly' | 'rewind' | 'arrive'>('fly')
  const cancelled = useRef(false)
  const short = useRef(localStorage.getItem('szd-opened') === '1')

  useEffect(() => {
    if (mode !== 'opening') return
    cancelled.current = false
    let raf = 0
    ;(async () => {
      setState({ modernity: 1, panel: null })
      jumpYear(START_YEAR)
      const m = await whenMap()
      if (!m.loaded()) {
        await Promise.race([
          new Promise<void>((resolve) => {
            if (m.loaded()) resolve()
            else m.once('load', () => resolve())
          }),
          wait(4000),
        ])
      }
      if (cancelled.current) return
      const home = gazetteer.find((g) => g.name === getState().hometown)
      const aimed = home && Number.isFinite(home.lng) && Number.isFinite(home.lat) ? home : undefined
      if (short.current) m.jumpTo({ center: [108, 33], zoom: 3.2 })
      await wait(short.current ? 200 : 600)
      if (cancelled.current) return
      await flyTo(aimed ? [aimed.lng, aimed.lat] : [110, 33], aimed ? 4.2 : 3.9, short.current ? 1400 : 3600)
      if (cancelled.current) return
      setPhase('rewind')
      const dur = short.current ? 2600 : 5200
      const start = performance.now()
      await new Promise<void>((resolve) => {
        const step = (now: number) => {
          if (cancelled.current) return resolve()
          const t = Math.min(1, Math.max(0, (now - start) / dur))
          // time accelerates backwards: slow near today, fast through the middle ages, easing into 184
          const e = t < 0.85 ? Math.pow(t / 0.85, 1.6) * 0.97 : 0.97 + (1 - Math.pow(1 - (t - 0.85) / 0.15, 2)) * 0.03
          const y = Math.round(2026 - (2026 - START_YEAR) * e)
          setCounter(y)
          setState({ modernity: Math.max(0, 1 - e * 1.06) })
          if (t < 1) raf = requestAnimationFrame(step)
          else resolve()
        }
        raf = requestAnimationFrame(step)
      })
      if (cancelled.current) return
      setState({ modernity: 0 })
      jumpYear(ARRIVE_YEAR)
      setPhase('arrive')
      flyTo([112, 32.5], 4.6, 2200)
      localStorage.setItem('szd-opened', '1')
    })()
    return () => {
      cancelled.current = true
      cancelAnimationFrame(raf)
    }
  }, [mode])

  const skip = () => {
    cancelled.current = true
    setState({ modernity: 0 })
    jumpYear(ARRIVE_YEAR)
    setPhase('arrive')
    flyTo([112, 32.5], 4.6, 1200)
    localStorage.setItem('szd-opened', '1')
  }

  const milestone = counter !== null ? MILESTONES.find((m) => counter >= m.year - 60 && counter <= m.year + 40) : null

  return (
    <AnimatePresence>
      {mode === 'opening' && (
        <motion.div className="opening" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          {phase === 'fly' && (
            <motion.div className="op-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1.2 }}>
              <p className="op-kicker">2026 · 今天</p>
              <p className="op-line">{hometown ? `这是你的家乡，${hometown}。` : '这是今天的中国。'}</p>
            </motion.div>
          )}
          {phase === 'rewind' && counter !== null && (
            <div className="op-rewind">
              <p className="op-kicker">时间倒流</p>
              <p className="op-counter">{counter}</p>
              <AnimatePresence mode="wait">
                {milestone && (
                  <motion.p
                    key={milestone.year}
                    className="op-milestone"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {milestone.year > START_YEAR ? `${milestone.text} 消失` : milestone.text}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )}
          {phase === 'arrive' && (
            <motion.div
              className="op-arrive"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            >
              <p className="op-kicker">公元 184 年 · 东汉中平元年</p>
              <h1>一个统一了近四百年的王朝，即将走向分裂</h1>
              <p className="op-sub">接下来的一百年，是中国历史上最激烈的群雄角逐。拖动下方的时间轴，看疆域如何变化；或者跟着历史，从头走一遍。</p>
              <div className="op-actions">
                <button className="cta" onClick={() => onDone('stories')}><Icon name="book" />从一场故事开始</button>
                <button className="cta" onClick={() => onDone('guide')}>
                  <Icon name="play" />
                  跟着历史走
                </button>
                <button className="ghost" onClick={() => onDone('explore')}>
                  自己探索地图
                </button>
              </div>
            </motion.div>
          )}
          {phase !== 'arrive' && (
            <button className="op-skip" onClick={skip}>
              跳过 <Icon name="skip" size={14} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
