// Dev only: run 天下 headless and print what happens year by year.
// npx rolldown scripts/tianxia-sim.ts --platform node --format esm -o $env:TEMP\tx.mjs; node $env:TEMP\tx.mjs 200 shixie 215
import { writeFileSync } from 'node:fs'
import { FACTIONS } from '../src/game/tianxia/roster'
import { step, decide } from '../src/game/tianxia/run'
import { dateText, factionLabel, newGame, ownedBy, troopsOf, wan, yearOf, type Fid } from '../src/game/tianxia/sim'

const [startId = '200', player = 'shixie', until = '212', seed = '7'] = process.argv.slice(2)
const st = newGame(startId, player as Fid, { kind: 'year', year: Number(until) }, Number(seed))
const lines: string[] = []
const snap = () => {
  lines.push(`== ${dateText(st)}`)
  for (const d of FACTIONS) {
    const fs = st.factions[d.id]
    if (!fs.alive) continue
    lines.push(`  ${factionLabel(st, d.id)}: ${ownedBy(st, d.id).length} 郡, 兵 ${wan(troopsOf(st, d.id))}, 粮 ${Math.round(fs.grain)} (+${fs.income.toFixed(0)} -${fs.spend.toFixed(0)}), 丁 ${wan(fs.manpower)}, 国策 ${Object.keys(fs.done).join(',')}${fs.cur ? ` [${fs.cur.id}]` : ''}`)
  }
}
snap()
let lastLog = 0
let lastYear = Math.floor(yearOf(st))
while (!st.over) {
  step(st)
  while (st.pending.length) {
    const p = st.pending[0]
    lines.push(`  ? ${p.title} -> ${p.choices[0].label}`)
    decide(st, p.id, p.choices[0].id)
  }
  for (; lastLog < st.log.length; lastLog++) {
    const e = st.log[lastLog]
    if (e.kind === 'real') continue
    lines.push(`  ${dateText(st, e.t)} [${e.kind}] ${e.text}${e.div ? `  // ${e.div}` : ''}`)
  }
  if (Math.floor(yearOf(st)) !== lastYear) {
    lastYear = Math.floor(yearOf(st))
    snap()
  }
}
snap()
lines.push(`END ${st.over?.why} ${st.over?.text}`)
writeFileSync(process.env.TEMP + '/tx.txt', lines.join('\n'), 'utf8')
console.log('ok', lines.length)
