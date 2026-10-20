// Dev only: does history grow out of the rules? Run many seeds without any script deciding the outcome.
// npx rolldown scripts/tianxia-verify.ts --platform node --format esm -o $env:TEMP\tv.mjs; node $env:TEMP\tv.mjs wuchao 20
import { writeFileSync } from 'node:fs'
import { activeIntents } from '../src/game/tianxia/intents'
import type { Fid } from '../src/game/tianxia/roster'
import { step, decide } from '../src/game/tianxia/run'
import { dateText, monthOf, newGame, ownedBy, troopsOf, wan, yearOf, type LogEntry, type State } from '../src/game/tianxia/sim'

const [mode = 'wuchao', runs = '20'] = process.argv.slice(2)
const out: string[] = []

function play(st: State, until: number, watch: (st: State, e: LogEntry) => void, daily?: (st: State) => void) {
  let lastT = -1
  while (!st.over && yearOf(st) < until) {
    step(st)
    while (st.pending.length) decide(st, st.pending[0].id, st.pending[0].choices[0].id)
    if (st.t !== lastT) {
      for (const e of st.log) if (e.t === st.t) watch(st, e)
      lastT = st.t
    }
    daily?.(st)
  }
}

const brief = (st: State, f: 'cao' | 'yuan' | 'sun' | 'liubei') => (st.factions[f].alive ? `${ownedBy(st, f).length}郡/${wan(troopsOf(st, f))}` : '亡')

/** where the two biggest columns of a side stand */
const mainAt = (st: State, f: string) =>
  st.armies
    .filter((a) => a.f === f)
    .sort((a, b) => b.troops - a.troops)
    .slice(0, 2)
    .map((a) => `${a.at}${wan(a.troops)}${a.path.length ? '→' + a.path.at(-1) : ''}`)
    .join(' ') || '无'

const plansOf = (st: State, f: Fid) => activeIntents(st, f).map(({ it, p }) => `${it.id}(${p.toFixed(2)})`).join(',')

/** take a snapshot once, the first day past each of these years */
function snaps(years: number[], take: (st: State, y: number) => void) {
  const done = new Set<number>()
  return (st: State) => {
    for (const y of years)
      if (!done.has(y) && yearOf(st) >= y) {
        done.add(y)
        take(st, y)
      }
  }
}

if (mode === 'wuchao') {
  let depots = 0
  let known = 0
  let raids = 0
  let burned = 0
  let yuanBroken = 0
  let guandu = 0
  let pursuits = 0
  let sallies = 0
  let splits = 0
  for (let seed = 1; seed <= Number(runs); seed++) {
    const st = newGame('200', 'gongsun', { kind: 'year', year: 204 }, seed * 7919)
    const notes: string[] = []
    let sawDepot = false
    let sawKnown = false
    let sawRaid = false
    let sawBurn = false
    const raidIds = new Set<number>()
    const shape: string[] = []
    let firstClash = ''
    const snap = snaps([200.35, 200.6, 200.85, 201.5, 202.3], (s, y) => shape.push(`${y} 袁[${mainAt(s, 'yuan')}] 曹[${mainAt(s, 'cao')}] 计划 ${plansOf(s, 'yuan')} ${plansOf(s, 'cao')}`))
    play(
      st,
      201.6,
      (s, e) => {
        const t = e.text
        if (!firstClash && e.kind === 'battle' && t.includes('袁') && t.includes('曹')) {
          firstClash = `${dateText(s, e.t)} @${e.at} ${t.slice(0, 50)}`
          if (/东郡|陈留|河南|颍川|魏郡/.test(e.at ?? t)) guandu++
        }
        if (t.includes('囤积粮草') && t.startsWith('袁')) sawDepot = true
        if ((t.includes('许攸连夜') || t.includes('斥候发现')) && t.includes('袁')) sawKnown = true
        if (t.includes('烧光了袁')) sawBurn = true
        if (/囤积|许攸|斥候|烧光|奇袭/.test(t)) notes.push(`${dateText(s, e.t)} ${t}`)
      },
      (s) => {
        snap(s)
        for (const a of s.armies)
          if (a.f === 'cao' && a.raid !== undefined && a.raid > 0 && !raidIds.has(a.id)) {
            raidIds.add(a.id)
            sawRaid = true
            notes.push(`${dateText(s)} 曹军奇袭出发：${wan(a.troops)}，${a.gens.join('/') || '无将'}，从${a.at}`)
          }
      },
    )
    const at201 = `曹 ${brief(st, 'cao')} 袁 ${brief(st, 'yuan')}`
    play(st, 203, () => {}, snap)
    const broken = !st.factions.yuan.alive || ownedBy(st, 'yuan').length < 20
    depots += +sawDepot
    known += +sawKnown
    raids += +sawRaid
    burned += +sawBurn
    yuanBroken += +broken
    pursuits += st.flags['n:pursue'] ?? 0
    sallies += st.flags['n:sally'] ?? 0
    splits += st.flags['n:detach'] ?? 0
    out.push(`seed ${seed}: 201.6 ${at201} | 203 曹 ${brief(st, 'cao')} 袁 ${brief(st, 'yuan')}${broken ? ' 袁衰' : ''}`)
    out.push(`    首战 ${firstClash || '无'}`)
    for (const n of shape) out.push(`    ${n}`)
    for (const n of notes.slice(0, 12)) out.push(`    ${n}`)
  }
  out.unshift(`乌巢 ${runs} 局：首战在官渡一线 ${guandu}，袁军屯粮 ${depots}，曹知粮囤 ${known}，曹出奇袭 ${raids}，袁粮被烧 ${burned}，203 年袁氏衰落 ${yuanBroken}，追击 ${pursuits}，擅自出战 ${sallies}，分兵 ${splits}`)
}

if (mode === 'chibi') {
  let fires = 0
  let caoBack = 0
  let winterFire = 0
  let liubeiSouth = 0
  let liubeiDead = 0
  let pursuits = 0
  let sallies = 0
  let splits = 0
  let carried = 0
  let caught = 0
  let arrived = 0
  let xiakou = 0
  for (let seed = 1; seed <= Number(runs); seed++) {
    const st = newGame('208', 'gongsun', { kind: 'year', year: 211 }, seed * 7919)
    const notes: string[] = []
    let fire = false
    let ff = ''
    let sick = 0
    let sawXia = false
    const shape: string[] = []
    const snap = snaps([208.8, 208.95, 209.2], (s, y) => shape.push(`${y} 曹[${mainAt(s, 'cao')}] 孙[${mainAt(s, 'sun')}] 刘[${mainAt(s, 'liubei')}]`))
    play(
      st,
      209.75,
      (s, e) => {
        const y = yearOf(s, e.t)
        const winter208 = Math.floor(y + 1e-6) === 208 && monthOf(s, e.t) >= 10
        if (e.text.includes('火攻')) {
          if (!fire) {
            ff = `${dateText(s, e.t)}@${e.at}`
            if (winter208 && /江夏|南郡|庐江/.test(e.at ?? '')) winterFire++
          }
          fire = true
          notes.push(`${dateText(s, e.t)} ${e.text}`)
        } else if (e.kind === 'battle' && /江夏|南郡|长沙|庐江|九江|豫章|武陵/.test(e.text) && /曹/.test(e.text)) notes.push(`${dateText(s, e.t)} ${e.text}`)
        else if (e.kind === 'capture' && /曹|孙|刘备/.test(e.text) && /江夏|南郡|长沙|武陵|零陵|桂阳|豫章|吴郡|丹阳/.test(e.text)) notes.push(`${dateText(s, e.t)} ${e.text}`)
        else if (e.text.includes('百姓') || e.text.includes('轻骑')) notes.push(`${dateText(s, e.t)} ${e.text}`)
      },
      (s) => {
        snap(s)
        for (const a of s.armies) if (a.f === 'cao') sick = Math.max(sick, a.sick)
        if (s.armies.some((a) => a.gens.includes('liubei') && a.at === '江夏')) sawXia = true
      },
    )
    const jingnan = ['武陵', '长沙', '桂阳', '零陵'].filter((id) => ownedBy(st, 'liubei').some((c) => c.id === id))
    if (jingnan.length >= 2) liubeiSouth++
    if (!st.factions.liubei.alive || st.gens.liubei?.dead) liubeiDead++
    const south = ['长沙', '武陵', '零陵', '桂阳', '江夏', '豫章', '吴郡', '丹阳', '会稽'].filter((id) => st.cells.length && ownedBy(st, 'cao').some((c) => c.id === id))
    const held = south.length <= 1
    fires += +fire
    caoBack += +held
    pursuits += st.flags['n:pursue'] ?? 0
    sallies += st.flags['n:sally'] ?? 0
    splits += st.flags['n:detach'] ?? 0
    carried += st.flags['n:carry'] ? 1 : 0
    caught += st.flags['n:catch'] ? 1 : 0
    arrived += st.flags['n:folkok'] ? 1 : 0
    xiakou += sawXia ? 1 : 0
    out.push(`seed ${seed}: 209.75 曹 ${brief(st, 'cao')} 孙 ${brief(st, 'sun')} 刘备 ${brief(st, 'liubei')} | 曹在江南 ${south.join('、') || '无'} | 刘备荆南 ${jingnan.join('、') || '无'} | 曹军最重疫病 ${Math.round(sick * 100)}% | 首次火攻 ${ff || '无'}`)
    for (const n of shape) out.push(`    ${n}`)
    for (const n of notes.slice(0, 10)) out.push(`    ${n}`)
  }
  out.unshift(`赤壁 ${runs} 局：发生火攻 ${fires}（其中 208 年冬在江夏/南郡/庐江 ${winterFire}），曹军止步江北 ${caoBack}，刘备取荆南两郡以上 ${liubeiSouth}，刘备死或亡国 ${liubeiDead}，追击 ${pursuits}，擅自出战 ${sallies}，分兵 ${splits}，携民 ${carried}，长坂追上 ${caught}，百姓到达 ${arrived}，刘备抵江夏 ${xiakou}`)
}

if (mode === 'trace') {
  const [, startArg = '200', f = 'yuan', until = '200.6', seed = '1'] = process.argv.slice(2)
  const start = startArg === 'wuchao' ? '200' : startArg === 'chibi' ? '208' : startArg
  const st = newGame(start, 'gongsun', { kind: 'year', year: 230 }, Number(seed) * 7919)
  const last = new Map<number, string>()
  play(
    st,
    Number(until),
    (s, e) => {
      if (e.kind === 'battle' || e.kind === 'capture' || e.text.includes('囤积') || e.text.includes('宣战') || e.text.includes('开战')) out.push(`${dateText(s, e.t)} ${e.text}`)
    },
    (s) => {
      for (const a of s.armies) {
        if (a.f !== f || a.troops < 20000) continue
        const k = `${a.at}→${a.path.at(-1) ?? '-'}`
        if (last.get(a.id) === k) continue
        last.set(a.id, k)
        out.push(`${dateText(s)} #${a.id} ${wan(a.troops)} 在${a.at} 去${a.path.at(-1) ?? '-'} ${plansOf(s, f as Fid)}`)
      }
    },
  )
}

writeFileSync(process.env.TEMP + '/tv.txt', out.join('\n'), 'utf8')
console.log('ok')
