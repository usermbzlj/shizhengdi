import { eventTime } from '../data'
import type { EventBrief, HistEvent } from '../data/types'

/** Route labels that belong to the ending: retreat, flight, counter-attack, the night raid. */
export const ENDING_ROUTE = /退|逃|撤|败|反击|夜袭/

export type ArcPhase = 'opening' | 'live' | 'closing' | 'past'

export interface EventBounds {
  t: number
  /** when the event itself is underway */
  end: number
  span: number
  /** the telling starts: who is moving, what is breaking out */
  openAt: number
  /** the telling ends: the result has been on the map long enough to read */
  closeAt: number
  /** a quiet mark may linger after the ending */
  lingerEnd: number
}

const LEAD = 0.42
const POINT_LIVE = 0.55
const CLOSE = 0.9

export function eventBounds(e: { year: number; month?: number | null; endYear?: number | null; kind: string }): EventBounds {
  const t = eventTime(e)
  const span = e.endYear && e.endYear > e.year ? e.endYear - e.year : 0
  // a century-long process is marked at its start, not held open for the whole span
  const end = span > 0 && span <= 4 ? e.endYear! + 0.4 : t + POINT_LIVE
  const closeAt = end + CLOSE
  const linger = e.kind === 'battle' ? 2.2 : 1.1
  return { t, end, span, openAt: t - LEAD, closeAt, lingerEnd: closeAt + linger }
}

/** Where this year sits in the telling. `before` means the story has not started. */
export function arcPhase(year: number, b: EventBounds): ArcPhase | 'before' {
  if (year < b.openAt) return 'before'
  if (year < b.t) return 'opening'
  if (year <= b.end) return 'live'
  if (year <= b.closeAt) return 'closing'
  return 'past'
}

/** 0 at the start of this phase, 1 at the end. The pin is drawn from this, not from a clock. */
export function arcAmount(year: number, b: EventBounds, phase: ArcPhase | 'before'): number {
  if (phase === 'opening' || phase === 'before') return unit(year, b.openAt, b.t)
  if (phase === 'live') return unit(year, b.t, b.end)
  if (phase === 'closing') return unit(year, b.end, b.closeAt)
  return 1
}

function unit(year: number, a: number, b: number) {
  if (b <= a) return 1
  return Math.min(1, Math.max(0, (year - a) / (b - a)))
}

/** How it starts: the armies that are still coming, otherwise the first clause of the account. */
export function openingLine(e: HistEvent): string {
  const incoming = (e.routes ?? []).map((r) => r.label).filter((label) => label && !ENDING_ROUTE.test(label))
  if (incoming.length) return incoming.slice(0, 2).join('，')
  return shorten(stripDate(e.summary))
}

/** How it ends: the one-line result, otherwise the first clause of the outcome. */
export function closingLine(e: HistEvent, brief?: EventBrief): string {
  if (brief?.line) return brief.line
  const outcome = e.outcome?.trim()
  if (outcome) return shorten(outcome, 28)
  return e.name
}

function stripDate(s: string) {
  return s.replace(/^[^。]{0,18}?年[^，。]{0,10}[，]/, '')
}

/** A cut that stops on these leaves the clause unfinished (…下、…后、…的). */
const DANGLING = /[下的与在和把将向从后]$/

/** One map line. Break on a comma outside quotes, and don't slice through a quotation. */
function shorten(s: string, max = 22) {
  const sentence = s.split('。')[0]?.trim() ?? ''
  const text = sentence || s.trim()
  if (text.length <= max) return text
  const cuts: number[] = []
  let depth = 0
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === '“' || c === '「') depth++
    else if (c === '”' || c === '」') depth = Math.max(0, depth - 1)
    else if (depth === 0 && (c === '，' || c === '；' || c === '、') && i >= 8) cuts.push(i)
  }
  const finished = (i: number) => !DANGLING.test(text.slice(0, i))
  const within = cuts.filter((i) => i <= max && finished(i))
  if (within.length) return text.slice(0, within[within.length - 1])
  const later = cuts.find((i) => i > max && i <= max + 18 && finished(i))
  if (later) return text.slice(0, later)
  const fallback = cuts.filter((i) => i <= max)
  if (fallback.length) return text.slice(0, fallback[fallback.length - 1])
  const open = text.indexOf('“')
  const close = text.indexOf('”', open + 1)
  if (open >= 0 && close > open && close + 1 <= max + 10) return text.slice(0, close + 1)
  if (open >= 8 && open <= max) return text.slice(0, open)
  return text.slice(0, max)
}
