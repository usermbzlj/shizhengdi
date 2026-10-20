import { aiDay } from './ai'
import { monthlyEvents, resolvePending } from './events'
import { genName, monthOf, setRel, tickDay, unifyShare, yearOf, type Report, type State } from './sim'
import type { Fid } from './roster'

export function step(st: State): Report[] {
  if (st.over || st.pending.length) return []
  const out = tickDay(st)
  aiDay(st)
  if (monthOf(st, st.t - 1) !== monthOf(st)) monthlyEvents(st, out)
  checkEnd(st)
  return out
}

export function decide(st: State, id: string, choice: string): Report[] {
  const out: Report[] = []
  if (id.startsWith('peace:')) {
    const f = id.slice(6) as Fid
    st.pending = st.pending.filter((p) => p.id !== id)
    if (choice === 'yes') setRel(st, st.player, f, 'peace')
    return out
  }
  resolvePending(st, id, choice, out)
  if (id === 'liucong' && choice === 'yield' && st.player === 'liubiao') {
    st.over = { why: 'annexed', text: '你把荆州交给了曹操。', t: st.t }
  }
  checkEnd(st)
  return out
}

export function checkEnd(st: State) {
  if (st.over) return
  const me = st.factions[st.player]
  const y = yearOf(st)
  if (!me.alive) {
    st.over = { why: 'annexed', text: '你的势力已经不复存在。', t: st.t }
    return
  }
  const e = st.end
  if (e.kind === 'year' && y >= e.year) st.over = { why: 'year', text: `${e.year} 年到了。`, t: st.t }
  else if (e.kind === 'death' && st.gens[e.who]?.dead) st.over = { why: 'death', text: `${genName(e.who)}去世了。`, t: st.t }
  else if (unifyShare(st, st.player) >= 0.85) st.over = { why: 'unify', text: '天下归于一统。', t: st.t }
  else if (y >= 280.5) st.over = { why: 'year', text: '280 年到了。', t: st.t }
}
