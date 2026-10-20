import { act, endSeason, preview, seasonName, troopsText, type State } from '../src/game/engine'
import { scenarios } from '../src/game/scenarios'

const sum = (s: State, side: string) => s.armies.filter((a) => a.side === side).reduce((t, a) => t + a.troops, 0)

function run(id: string, player: string, lv: 0 | 1 = 1) {
  const sc = scenarios.find((x) => x.id === id)!
  const s = sc.build(player)
  s.ai[player] = lv
  const sides = Object.keys(s.ai)
  for (let t = 0; t < Math.min(sc.turns, 16); t++) {
    const r = endSeason(s)
    sc.script?.(s, r)
    const owned = sides.map((x) => `${x}:${Object.values(s.owner).filter((o) => o === x).length}城/${troopsText(sum(s, x))}/粮${Math.round(s.grain[x] ?? 0)}`)
    console.log(seasonName(s), owned.join('  '), r.filter((x) => x.kind === 'battle').map((x) => x.title).join('；'))
  }
}

run('sandbox', 'liu', 0)
for (const sc of scenarios) {
  console.log('\n==', sc.title, sc.picks[0].side)
  run(sc.id, sc.picks[0].side)
}

console.log('\n== 赤壁：联军先合兵再火攻')
{
  const sc = scenarios.find((x) => x.id === 'chibi')!
  const s = sc.build('lianjun')
  const liu = s.armies.find((a) => a.at === 'xiakou' && a.side === 'lianjun')!
  console.log(act(s, { army: liu.id, to: 'chibi', troops: liu.troops, generals: liu.generals }).map((r) => r.title))
  const main = s.armies.find((a) => a.at === 'chibi' && a.side === 'lianjun')!
  const pv = preview(s, { army: main.id, to: 'wulin', troops: main.troops, generals: main.generals })
  if (pv.ok && pv.kind === 'attack') {
    console.log('odds', pv.odds.toFixed(2), pv.battle.factors.map((f) => `${f.who}:${f.text}×${f.mult.toFixed(2)}`).join(' | '))
  } else console.log(pv)
}

console.log('\n== 官渡：曹操直扑乌巢')
{
  const sc = scenarios.find((x) => x.id === 'guandu')!
  const s = sc.build('cao')
  const a = s.armies.find((x) => x.at === 'guandu' && x.side === 'cao')!
  const pv = preview(s, { army: a.id, to: 'wuchao', troops: 10, generals: ['caocao', 'zhangliao'] })
  if (pv.ok && pv.kind === 'attack') console.log('odds', pv.odds.toFixed(2))
  else console.log(pv)
  const pv2 = preview(s, { army: a.id, to: 'wuchao', troops: 10, generals: ['xuhuang'] })
  if (pv2.ok && pv2.kind === 'attack') console.log('odds without raider', pv2.odds.toFixed(2))
  console.log(act(s, { army: a.id, to: 'wuchao', troops: 10, generals: ['caocao', 'zhangliao'] }).map((r) => r.title + ' ' + r.lines.join('')))
  for (let t = 0; t < 5; t++) {
    const r = endSeason(s)
    console.log(seasonName(s), `曹${troopsText(sum(s, 'cao'))} 袁${troopsText(sum(s, 'yuan'))} 袁粮${Math.round(s.grain.yuan)}`, r.filter((x) => x.kind === 'battle').map((x) => x.title).join('；'), s.owner.xu)
  }
}
