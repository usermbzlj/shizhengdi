import { readFileSync } from 'node:fs'
const events = JSON.parse(readFileSync(new URL('../src/data/events.json', import.meta.url), 'utf8'))
const briefs = JSON.parse(readFileSync(new URL('../src/data/briefs.json', import.meta.url), 'utf8'))
const ENDING = /退|逃|撤|败|反击|夜袭/
const DANGLING = /[下的与在和把将向从后]$/
const stripDate = (s) => s.replace(/^[^。]{0,18}?年[^，。]{0,10}[，]/, '')
function shorten(s, max = 22) {
  const sentence = s.split('。')[0]?.trim() ?? ''
  const text = sentence || s.trim()
  if (text.length <= max) return text
  const cuts = []
  let depth = 0
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === '\u201c' || c === '\u300c') depth++
    else if (c === '\u201d' || c === '\u300d') depth = Math.max(0, depth - 1)
    else if (depth === 0 && (c === '\uff0c' || c === '\uff1b' || c === '\u3001') && i >= 8) cuts.push(i)
  }
  const finished = (i) => !DANGLING.test(text.slice(0, i))
  const within = cuts.filter((i) => i <= max && finished(i))
  if (within.length) return text.slice(0, within[within.length - 1])
  const later = cuts.find((i) => i > max && i <= max + 18 && finished(i))
  if (later) return text.slice(0, later)
  const fallback = cuts.filter((i) => i <= max)
  if (fallback.length) return text.slice(0, fallback[fallback.length - 1])
  return text.slice(0, max)
}
for (const e of events.filter((e) => e.importance === 1)) {
  const incoming = (e.routes || []).map((r) => r.label).filter((l) => l && !ENDING.test(l))
  const open = incoming.length ? incoming.slice(0, 2).join('\uff0c') : shorten(stripDate(e.summary))
  const close = briefs[e.id]?.line || shorten(e.outcome || '', 28)
  console.log(`${e.name}\n  \u8d77 ${open}\n  \u7ec8 ${close}`)
}
