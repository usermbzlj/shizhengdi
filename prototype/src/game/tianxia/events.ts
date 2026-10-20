import { events as histEvents } from '../../data'
import { cellById, cells } from './board'
import type { Fid } from './roster'
import {
  allied,
  armiesOf,
  atWar,
  collapse,
  cs,
  depotServes,
  killGeneral,
  fleeArmy,
  log,
  monthOf,
  ownedBy,
  ownerOf,
  power,
  raise,
  rand,
  relOf,
  setCarry,
  setRel,
  wan,
  yearOf,
  type Pending,
  type Report,
  type State,
} from './sim'

interface Ev {
  id: string
  /** checked once a month */
  when: (st: State) => boolean
  /** the player has a say */
  ask?: (st: State) => Pending | null
  /** what happens when nobody (or the AI) decides; also the "history" choice */
  auto: (st: State, out: Report[]) => void
  choose?: (st: State, choice: string, out: Report[]) => void
}

const alive = (st: State, f: Fid) => st.factions[f]?.alive
const y = (st: State) => yearOf(st)
const armyIn = (st: State, f: Fid, ids: string[]) => armiesOf(st, f).filter((a) => ids.includes(a.at)).reduce((s, a) => s + a.troops, 0)
function defect(st: State, ids: string[], to: Fid) {
  for (const id of ids) {
    const g = st.gens[id]
    if (!g || g.dead) continue
    g.f = to
    for (const a of st.armies) a.gens = a.gens.filter((x) => x !== id)
  }
}
function hand(st: State, ids: string[], to: Fid) {
  const was = new Map(ids.map((id) => [id, ownerOf(st, id)]))
  for (const id of ids) {
    const s = cs(st, id)
    s.owner = to
    s.taken = st.t
    s.order = Math.min(s.order, 0.5)
  }
  const carry: number[] = []
  for (const a of [...st.armies]) {
    if (!ids.includes(a.at) || a.f === to || allied(st, a.f, to)) continue
    if (a.f === was.get(a.at)) continue
    if (!fleeArmy(st, a) || a.troops <= 0) continue
    if (st.factions[a.f].ruler === 'liubei' && a.gens.includes('liubei')) carry.push(a.id)
  }
  st.armies = st.armies.filter((a) => a.troops > 0)
  for (const id of carry) {
    if (!st.armies.some((a) => a.id === id)) continue
    if (st.player === 'liubei') {
      st.flags.carryArmy = id
      st.pending.push({
        id: 'liucong',
        title: '百姓要跟你走',
        text: '曹操的大军就要到了。城里的百姓拖家带口，求你带他们一起走。',
        choices: [
          { id: 'carry', label: '携民同行', hint: '走得慢，追兵可能赶上' },
          { id: 'light', label: '轻装疾走' },
        ],
      })
      break
    }
    setCarry(st, id, true)
  }
}
/** 许攸 brings no victory, only a secret: where the grain is. What to do with it is up to 曹. */
function xuyouDefects(st: State, out: Report[]) {
  defect(st, ['xuyou'], 'cao')
  const ds = st.depots.filter((d) => d.f === 'yuan')
  for (const d of ds) if (!d.known.includes('cao')) d.known.push('cao')
  const d = [...ds].sort((a, b) => b.stock - a.stock)[0]
  if (!d) return
  const guard = st.armies.filter((a) => a.f === 'yuan' && a.at === d.at).reduce((s, a) => s + a.troops, 0)
  const text = `许攸连夜投奔曹操，说：袁军的粮草都囤在${d.at}，守军${guard ? `只有${wan(guard)}人` : '很少'}。`
  const mine = st.player === 'cao' || st.player === 'yuan'
  log(st, { kind: 'join', f: 'cao', at: d.at, text, mine })
  out.push({ kind: 'event', at: d.at, f: 'cao', text, mine })
}

const EVENTS: Ev[] = [
  {
    id: 'xuyou',
    when: (st) =>
      alive(st, 'cao') && alive(st, 'yuan') && atWar(st, 'cao', 'yuan') && y(st) >= 200.4 && y(st) < 201.6 && st.gens.xuyou?.f === 'yuan' && !st.gens.xuyou.dead &&
      st.depots.some((d) => d.f === 'yuan' && depotServes(st, d).reduce((s, a) => s + a.troops, 0) > 30000),
    ask: (st) =>
      st.player === 'yuan'
        ? {
            id: 'xuyou',
            title: '许攸的家人',
            text: '留守邺城的审配抓了许攸犯法的家人。许攸在营中大骂，扬言要走。他知道全军的粮草囤在哪里。',
            choices: [
              { id: 'pardon', label: '放了许攸的家人，好言安抚' },
              { id: 'law', label: '依法处置，不必管他' },
            ],
          }
        : null,
    auto: xuyouDefects,
    choose: (st, c, out) => {
      if (c === 'law') xuyouDefects(st, out)
      else log(st, { kind: 'event', text: '许攸被安抚住了，没有投奔曹操。', div: '历史上许攸因家人被抓而投奔曹操，说出了乌巢屯粮的位置。', mine: true })
    },
  },
  {
    id: 'sunce',
    when: (st) => alive(st, 'sun') && st.factions.sun.ruler === 'sunce' && y(st) >= 200.25,
    ask: (st) =>
      st.player === 'sun'
        ? {
            id: 'sunce',
            title: '丹徒山中',
            text: '孙策喜欢一个人骑快马打猎。手下劝他：许贡的门客一直想报仇，出门最好带上护卫。',
            choices: [
              { id: 'guard', label: '带足护卫' },
              { id: 'alone', label: '一个人追鹿，谁追得上我' },
            ],
          }
        : null,
    auto: (st) => {
      if (!st.gens.sunce.dead) killGeneral(st, 'sunce', 'history', '孙策在丹徒打猎时被许贡的门客刺伤，不久死去，年仅二十六岁。临终把江东交给十九岁的弟弟孙权。')
    },
    choose: (st, c, out) => {
      if (c === 'alone') EVENTS.find((e) => e.id === 'sunce')!.auto(st, out)
      else log(st, { kind: 'event', text: '刺客没能找到下手的机会。', div: '历史上孙策在 200 年遇刺身亡，江东由孙权继承。', mine: true })
    },
  },
  {
    id: 'liucong',
    when: (st) => alive(st, 'liubiao') && alive(st, 'cao') && st.factions.liubiao.ruler === 'liucong' && power(st, 'cao') > power(st, 'liubiao') * 2.5 && ownedBy(st, 'cao').some((c) => ['南阳郡', '汝南', '颍川'].includes(c.id)),
    ask: (st) =>
      st.player === 'liubiao'
        ? {
            id: 'liucong',
            title: '降，还是守',
            text: '刘表刚死，你是新的荆州之主。蒯越、韩嵩、傅巽和荆州的大族都劝你：曹公大军压境，挡不住的，不如投降保住全家富贵。',
            choices: [
              { id: 'fight', label: '不降，守住荆州' },
              { id: 'yield', label: '投降曹操', hint: '游戏会在这里结束' },
            ],
          }
        : st.player === 'cao'
          ? {
              id: 'liucong',
              title: '刘琮请降',
              text: '刘表的儿子刘琮派人送来降书和符节。荆州的水军、钱粮都可以兵不血刃拿到手。',
              choices: [
                { id: 'take', label: '接受投降' },
                { id: 'refuse', label: '不，用刀剑拿下' },
              ],
            }
          : null,
    auto: (st, out) => {
      const land = ownedBy(st, 'liubiao').map((c) => c.id)
      const east = land.filter((id) => id === '江夏')
      const rest = land.filter((id) => id !== '江夏')
      if (east.length && alive(st, 'liubei')) {
        hand(st, east, 'liubei')
        // 刘琦's own men at 夏口, the core of 刘备's army at 赤壁
        Object.assign(raise(st, 'liubei', '江夏', 10000), { navy: 0.5, food: 40, north: false })
      } else hand(st, east, 'cao')
      hand(st, rest, 'cao')
      defect(st, ['caimao', 'wenpin', 'huangzhong'], 'cao')
      collapse(st, 'liubiao', '刘琮举荆州投降曹操。只有刘琦守着江夏，投靠了刘备。')
      out.push({ kind: 'event', text: '刘琮投降，荆州归曹。', mine: true })
    },
    choose: (st, c, out) => {
      if (c === 'carry' || c === 'light') {
        const id = st.flags.carryArmy
        if (c === 'carry' && id) setCarry(st, id, true)
        else log(st, { kind: 'event', text: '你丢下百姓，轻装先走。', div: '历史上刘备不肯丢下百姓。他说：“夫济大事必以人为本。”十几万人跟着他，一天只走十几里，在当阳长坂被曹操的骑兵追上。', mine: true })
        return
      }
      if (st.player === 'liubiao') {
        if (c === 'yield') EVENTS.find((e) => e.id === 'liucong')!.auto(st, out)
        else {
          defect(st, ['caimao'], 'cao')
          for (const x of ownedBy(st, 'liubiao')) cs(st, x.id).order = Math.max(0.25, cs(st, x.id).order - 0.15)
          log(st, { kind: 'event', text: '你决定抵抗。蔡瑁带着一部分水军投奔了曹操，荆州人心浮动。', div: '历史上刘琮在曹军抵达之前就投降了。', mine: true })
        }
        return
      }
      if (c === 'take') EVENTS.find((e) => e.id === 'liucong')!.auto(st, out)
      else log(st, { kind: 'event', text: '你拒绝了刘琮的投降。', div: '历史上曹操接受了刘琮的投降，兵不血刃得到荆州。', mine: true })
    },
  },
  {
    id: 'alliance208',
    when: (st) => alive(st, 'sun') && alive(st, 'cao') && alive(st, 'liubei') && y(st) >= 208.6 && y(st) < 210 && !atWar(st, 'sun', 'cao') && ownedBy(st, 'cao').some((c) => ['南郡', '江夏'].includes(c.id)),
    ask: (st) =>
      st.player === 'sun'
        ? {
            id: 'alliance208',
            title: '降，还是战',
            text: '曹操写信来说：“今治水军八十万众，方与将军会猎于吴。”张昭等人都劝你投降。鲁肃悄悄对你说：我们都可以降曹，唯独将军不可以。周瑜说：曹军远来疲惫，不习水战，又是冬天，必生疾病。',
            choices: [
              { id: 'fight', label: '与刘备联手，迎战曹操', hint: '拔刀砍下桌角' },
              { id: 'yield', label: '遣使称臣，保住江东' },
            ],
          }
        : null,
    auto: (st) => {
      setRel(st, 'sun', 'cao', 'war', '孙权决意抗曹，与刘备结盟。周瑜、程普率三万水军西上。')
      setRel(st, 'sun', 'liubei', 'ally')
    },
    choose: (st, c, out) => {
      if (c === 'fight') EVENTS.find((e) => e.id === 'alliance208')!.auto(st, out)
      else {
        setRel(st, 'sun', 'cao', 'peace', '孙权向曹操称臣。')
        st.rel['cao|sun'] = { s: 'peace', since: st.t, truce: st.t + 720 }
        log(st, { kind: 'event', text: '江东称臣。', div: '历史上孙权采纳鲁肃、周瑜的意见决心抗曹，才有了赤壁之战。', mine: true })
      }
    },
  },
  {
    id: 'borrow',
    when: (st) => alive(st, 'sun') && alive(st, 'liubei') && allied(st, 'sun', 'liubei') && ownerOf(st, '南郡') === 'sun' && ownedBy(st, 'liubei').length <= 5 && y(st) >= 209.8 && y(st) < 213,
    ask: (st) =>
      st.player === 'sun'
        ? {
            id: 'borrow',
            title: '借荆州',
            text: '刘备亲自来京口，说自己地方太小，安置不下部众，想“借”南郡。鲁肃劝你借给他，让他在西边替你挡住曹操；周瑜却劝你把刘备软禁起来。',
            choices: [
              { id: 'lend', label: '借给他' },
              { id: 'keep', label: '不借' },
            ],
          }
        : null,
    auto: (st) => {
      hand(st, ['南郡'], 'liubei')
      log(st, { kind: 'event', text: '孙权把南郡借给刘备。曹操听说后，正在写字，笔都掉到了地上。' })
    },
    choose: (st, c, out) => {
      if (c === 'lend') EVENTS.find((e) => e.id === 'borrow')!.auto(st, out)
      else log(st, { kind: 'event', text: '你没有借出南郡。', div: '历史上孙权在 210 年听从鲁肃，把南郡借给了刘备，这就是“借荆州”。', mine: true })
    },
  },
  {
    id: 'rushu',
    when: (st) => alive(st, 'liuzhang') && alive(st, 'liubei') && alive(st, 'zhanglu') && atWar(st, 'liuzhang', 'zhanglu') && y(st) >= 211 && relOf(st, 'liubei', 'liuzhang').s === 'peace' && ownedBy(st, 'liubei').length > 0,
    ask: (st) =>
      st.player === 'liubei'
        ? {
            id: 'rushu',
            title: '入蜀',
            text: '法正从益州来，说刘璋怕张鲁打过来，想请你带兵入川帮他守汉中方向。法正私下又说：刘璋暗弱，益州迟早是你的。',
            choices: [
              { id: 'go', label: '带兵入蜀', hint: '和刘璋结盟，军队可以进入益州' },
              { id: 'no', label: '不去' },
            ],
          }
        : st.player === 'liuzhang'
          ? {
              id: 'rushu',
              title: '请刘备入川',
              text: '张松、法正劝你请刘备入川对付张鲁。黄权、王累却拼命劝阻。黄权说：客人安如泰山，主人就危如累卵。',
              choices: [
                { id: 'invite', label: '请刘备来' },
                { id: 'no', label: '不请' },
              ],
            }
          : null,
    auto: (st) => {
      setRel(st, 'liubei', 'liuzhang', 'ally', '刘璋请刘备入蜀抵御张鲁，刘备率军沿江而上。')
      st.flags.rushuAt = st.t
    },
    choose: (st, c, out) => {
      if (c === 'go' || c === 'invite') EVENTS.find((e) => e.id === 'rushu')!.auto(st, out)
      else log(st, { kind: 'event', text: '刘备没有入蜀。', div: '历史上 211 年刘备应刘璋之邀入蜀，三年后夺取了益州。', mine: true })
    },
  },
  {
    id: 'rushuTurn',
    when: (st) => st.player !== 'liubei' && alive(st, 'liubei') && alive(st, 'liuzhang') && allied(st, 'liubei', 'liuzhang') && st.flags.rushuAt !== undefined && st.t - st.flags.rushuAt > 450,
    auto: (st) => {
      setRel(st, 'liubei', 'liuzhang', 'war', '刘备在葭萌关翻脸，回师南下攻打刘璋。')
    },
  },
  {
    id: 'baiyi',
    when: (st) =>
      alive(st, 'sun') && alive(st, 'liubei') && !atWar(st, 'sun', 'liubei') && ownerOf(st, '南郡') === 'liubei' && y(st) >= 214 &&
      armiesOf(st, 'liubei').filter((a) => a.at === '南郡').reduce((s, a) => s + a.troops, 0) < 12000 && armyIn(st, 'sun', ['江夏', '长沙', '庐江', '九江郡', '豫章']) > 15000,
    ask: (st) =>
      st.player === 'sun'
        ? {
            id: 'baiyi',
            title: '白衣渡江',
            text: '吕蒙说：关羽的主力都在北边，江陵空虚。让士兵扮成商人，摇着船过去，一夜就能拿下。可这样做，孙刘联盟就完了。',
            choices: [
              { id: 'strike', label: '袭取荆州' },
              { id: 'keep', label: '守住盟约' },
            ],
          }
        : null,
    auto: (st) => {
      setRel(st, 'sun', 'liubei', 'war', '吕蒙白衣渡江，偷袭荆州。')
      const near = armiesOf(st, 'sun').filter((a) => ['江夏', '长沙', '庐江', '九江郡', '豫章'].includes(a.at)).sort((a, b) => b.troops - a.troops)[0]
      if (near) {
        near.at = '南郡'
        near.path = []
        near.org = 1
      }
    },
    choose: (st, c, out) => {
      if (c === 'strike') EVENTS.find((e) => e.id === 'baiyi')!.auto(st, out)
      else {
        st.flags.baiyiNo = st.t
        log(st, { kind: 'event', text: '你守住了盟约。', div: '历史上孙权在 219 年派吕蒙袭取荆州，关羽败走麦城。', mine: true })
      }
    },
  },
  {
    id: 'plague217',
    when: (st) => y(st) >= 217 && y(st) < 218,
    auto: (st, out) => {
      for (const c of cells) {
        if (['司隶', '豫州', '兖州', '冀州', '徐州', '青州'].includes(c.province)) {
          const s = cs(st, c.id)
          s.pop = Math.round(s.pop * 0.95)
        }
      }
      const text = '建安二十二年，中原大疫，“家家有僵尸之痛，室室有号泣之哀”。建安七子中的五人死于这一年。'
      log(st, { kind: 'event', text })
      out.push({ kind: 'event', text, mine: true })
    },
  },
]

// ---------- disasters ----------

function shuffle<T>(st: State, xs: T[]) {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(rand(st) * (i + 1))
    const t = xs[i]
    xs[i] = xs[j]
    xs[j] = t
  }
  return xs
}

function disasters(st: State, out: Report[]) {
  const month = monthOf(st)
  if (month === 5 && rand(st) < 0.12) {
    const pool = cells.filter((c) => ['兖州', '豫州', '冀州', '司隶', '徐州'].includes(c.province) && cs(st, c.id).owner)
    const hit = shuffle(st, pool).slice(0, 3)
    for (const c of hit) cs(st, c.id).order = Math.max(0.2, cs(st, c.id).order - 0.15)
    if (hit.length) {
      const text = `${hit.map((c) => c.id).join('、')}一带闹蝗灾，庄稼被吃光，民心动荡。`
      log(st, { kind: 'event', text })
      if (hit.some((c) => cs(st, c.id).owner === st.player)) out.push({ kind: 'event', text, mine: true })
    }
  }
  if (month === 8) {
    for (const b of st.battles) {
      const c = cellById.get(b.at)!
      if (!c.boats.some((x) => ['Han', 'Huai', 'Huang'].includes(x)) || rand(st) > 0.3) continue
      const arms = st.armies.filter((a) => a.at === b.at)
      const dry = arms.filter((a) => a.navy < 0.3)
      for (const a of dry) {
        a.troops *= 0.7
        a.org = Math.max(0, a.org - 0.4)
      }
      const text = `秋雨连下十几天，${b.at}一带河水暴涨，没有船的军队被大水淹没。`
      log(st, { kind: 'event', text, at: b.at, mine: arms.some((a) => a.f === st.player) })
      out.push({ kind: 'event', text, at: b.at, mine: arms.some((a) => a.f === st.player) })
    }
  }
}

// ---------- the real history, month by month ----------

function ghosts(st: State, out: Report[]) {
  const year = Math.floor(yearOf(st) + 1e-6)
  const month = monthOf(st)
  for (const e of histEvents) {
    if (e.year !== year || e.importance < 2) continue
    const m = e.month ?? 12
    if (m !== month) continue
    const text = `${e.name}：${e.summary.split('。')[0]}。`
    log(st, { kind: 'real', text, at: e.place })
    out.push({ kind: 'real', text })
  }
}

export function monthlyEvents(st: State, out: Report[]) {
  for (const ev of EVENTS) {
    if (st.flags[`ev:${ev.id}`] !== undefined) continue
    if (!ev.when(st)) continue
    st.flags[`ev:${ev.id}`] = st.t
    const p = ev.ask?.(st)
    if (p) st.pending.push(p)
    else ev.auto(st, out)
  }
  disasters(st, out)
  ghosts(st, out)
}

export function resolvePending(st: State, id: string, choice: string, out: Report[]) {
  const p = st.pending.find((x) => x.id === id)
  if (!p) return
  st.pending = st.pending.filter((x) => x !== p)
  const ev = EVENTS.find((e) => e.id === id)
  if (ev?.choose) ev.choose(st, choice, out)
}