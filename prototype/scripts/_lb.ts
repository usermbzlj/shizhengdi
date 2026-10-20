import { decide, step } from '../src/game/tianxia/run'
import { dateText, garrisonOf, newGame, ownerOf, unsettled, yearOf } from '../src/game/tianxia/sim'

const st = newGame('208', 'gongsun', { kind: 'year', year: 211 }, 1 * 7919)
let last = ''
while (!st.over && yearOf(st) < 209.3) {
  step(st)
  while (st.pending.length) decide(st, st.pending[0].id, st.pending[0].choices[0].id)
  const y = yearOf(st)
  if (y < 208.62 || y > 209.15) continue
  const liu = st.armies.filter((a) => a.f === 'liubei' && a.troops >= 1000)
  const line = liu.map((a) => `${a.at} ${Math.round(a.troops)} [${a.gens.join('/')}] →${a.path.at(-1) ?? '-'} 民${a.folk ?? 0}`).join(' | ')
  if (line === last) continue
  last = line
  console.log(dateText(st), line, '长沙', ownerOf(st, '长沙'), '守' + Math.round(garrisonOf(st, '长沙')), unsettled(st, '长沙') ? '未附' : '已附')
}
