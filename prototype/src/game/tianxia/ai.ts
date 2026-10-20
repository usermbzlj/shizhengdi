import { cellById, cellIndex, cells, isSouth, links, realOwners } from './board'
import { POLICIES } from './policies'
import { FACTIONS, factionDef, factionOfReal, generalById, type Fid } from './roster'
import { activeIntents, inertia, soonIntents, theatre } from './intents'
import {
  allied,
  armiesOf,
  atWar,
  commander,
  cs,
  depotServes,
  factionLabel,
  findPath,
  garrisonOf,
  launchDash,
  launchRaid,
  raidPath,
  RAID_MAX,
  raidBlock,
  raise,
  rand,
  idleGenerals,
  inBattle,
  LEVY,
  log,
  order,
  ownedBy,
  ownerOf,
  policyBlock,
  popOf,
  power,
  recruit,
  relOf,
  setRel,
  startPolicy,
  temperOf,
  troopsOf,
  unsettled,
  upkeepOf,
  yearOf,
  type Army,
  type State,
} from './sim'

function idle(st: State, a: Army) {
  return !a.ready && !a.path.length && !inBattle(st, a) && a.guard === undefined && a.raid === undefined
}

const isRaider = (a: Army) => a.gens.some((g) => generalById.get(g)!.traits.includes('raid'))

/** A known enemy granary feeding a big army is worth more than a pitched battle. */
function raids(st: State, f: Fid, enemies: Fid[]) {
  if (st.t - (st.flags[`raid:${f}`] ?? -999) < 45) return
  for (const d of st.depots) {
    if (!d.known.includes(f) || !enemies.includes(d.f)) continue
    const fed = depotServes(st, d).reduce((s, a) => s + a.troops, 0)
    if (fed < 20000) continue
    const guard = st.armies.filter((x) => x.f === d.f && x.at === d.at).reduce((s, a) => s + a.troops, 0) + garrisonOf(st, d.at) * 0.3
    const riders = armiesOf(st, f)
      .filter((a) => idle(st, a) && a.troops >= 3000 && (isRaider(a) || a.cav >= 0.3))
      .sort((x, y) => Number(isRaider(y)) - Number(isRaider(x)))
    for (const a of riders) {
      let r = a
      if (a.troops > RAID_MAX) {
        // pick out a light column under the best raider
        const n = Math.min(8000, Math.round(a.troops / 4000) * 1000)
        r = raise(st, f, a.at, n)
        Object.assign(r, { cav: Math.min(0.8, a.cav * 1.6), navy: a.navy, org: a.org, north: a.north, food: 20 })
        a.troops -= n
        const best = a.gens.filter((g) => generalById.get(g)!.traits.includes('raid')).sort((x, y) => generalById.get(y)!.lead - generalById.get(x)!.lead)[0]
        if (best) {
          a.gens = a.gens.filter((g) => g !== best)
          r.gens = [best]
        }
      }
      const strength = r.troops * 2.2 * (isRaider(r) ? 1.4 : 1)
      if (strength < guard * 1.2 || raidBlock(st, r, d)) {
        if (r !== a) {
          a.troops += r.troops
          a.gens.push(...r.gens)
          st.armies = st.armies.filter((x) => x !== r)
        }
        continue
      }
      launchRaid(st, r.id, d.id)
      st.flags[`raid:${f}`] = st.t
      return
    }
  }
}

function neighbours(st: State, f: Fid) {
  const out = new Set<Fid>()
  for (const c of ownedBy(st, f))
    for (const l of links(c.id)) {
      const o = ownerOf(st, l.to)
      if (o && o !== f) out.add(o)
    }
  return out
}

function totalPop(st: State) {
  return st.cells.reduce((s, c) => s + (c.owner ? c.pop : 0), 0)
}

// ---------- diplomacy ----------

export function aiWantsPeace(st: State, f: Fid, with_: Fid) {
  const r = relOf(st, f, with_)
  const mine = power(st, f)
  const theirs = power(st, with_)
  const long = st.t - r.since > 540
  return mine < theirs * 0.75 || (long && mine < theirs * 1.3) || ownedBy(st, f).length <= 1
}

export function aiWantsAlliance(st: State, f: Fid, with_: Fid) {
  if (atWar(st, f, with_)) return false
  const big = FACTIONS.map((d) => d.id).filter((x) => x !== f && x !== with_ && st.factions[x].alive)
  const threat = big.some((x) => {
    const p = power(st, x)
    const near = neighbours(st, x)
    return p > Math.max(power(st, f), power(st, with_)) * 0.9 && (near.has(f) || atWar(st, x, f)) && (near.has(with_) || atWar(st, x, with_))
  })
  const plan = with_ === 'liubei' && f === 'sun' && st.factions.liubei.done.longzhong !== undefined
  return threat || plan
}

function diplomacy(st: State, f: Fid) {
  const others = FACTIONS.map((d) => d.id).filter((x) => x !== f && st.factions[x].alive)
  const plans = activeIntents(st, f)
  const aimsAt = (who: Fid, foe: Fid) => activeIntents(st, who).some(({ it }) => it.war === foe || it.take.some((id) => ownerOf(st, id) === foe))
  const after = (o: Fid) => aimsAt(f, o)
  // the wars history started, if the world still looks like it did
  for (const { it } of plans) {
    if (!it.war || !st.factions[it.war]?.alive || atWar(st, f, it.war) || relOf(st, f, it.war).truce > st.t) continue
    const broke = allied(st, f, it.war)
    setRel(st, f, it.war, 'war', `${factionLabel(st, f)}${broke ? '撕毁盟约，' : ''}向${factionLabel(st, it.war)}开战。`)
  }
  // peace
  for (const o of others) {
    if (!atWar(st, f, o)) continue
    // neither side walks away while a campaign still has something to take
    if ((after(o) || aimsAt(o, f)) && ownedBy(st, f).length > 1) continue
    if (!aiWantsPeace(st, f, o)) continue
    if (o === st.player) {
      if ((st.flags[`offer:${f}`] ?? -999) > st.t - 150) continue
      st.flags[`offer:${f}`] = st.t
      st.pending.push({
        id: `peace:${f}`,
        title: `${factionLabel(st, f)}遣使求和`,
        text: `使者说，两家打了这么久，百姓苦不堪言。愿意罢兵，一年之内互不侵犯。`,
        choices: [
          { id: 'yes', label: '答应', hint: '一年内不能再打他' },
          { id: 'no', label: '拒绝，接着打' },
        ],
        data: { f },
      })
    } else if (aiWantsPeace(st, o, f) || st.t - relOf(st, f, o).since > 900) setRel(st, f, o, 'peace')
  }
  // alliance against a giant
  const all = totalPop(st)
  for (const o of others) {
    if (relOf(st, f, o).s !== 'peace' || o === st.player) continue
    const giant = others.find((x) => x !== o && popOf(st, x) > all * 0.38)
    if (giant && aiWantsAlliance(st, f, o) && aiWantsAlliance(st, o, f)) {
      setRel(st, f, o, 'ally', `${factionLabel(st, f)}与${factionLabel(st, o)}结盟，共抗${factionLabel(st, giant)}。`)
      break
    }
  }
  // new wars
  const calm = st.t < (st.flags.calm ?? 0)
  const d = factionDef.get(f)!
  // a side busy with history's campaign doesn't go looking for another war
  if (calm || d.temper === 0 || plans.length) return
  if ((st.flags[`war:${f}`] ?? -999) > st.t - 360) return
  if (others.filter((o) => atWar(st, f, o)).length >= (d.temper === 2 ? 2 : 1)) return
  const mine = power(st, f)
  const near = [...neighbours(st, f)].filter((o) => relOf(st, f, o).s === 'peace' && relOf(st, f, o).truce <= st.t)
  const prey = near.sort((a, b) => power(st, a) - power(st, b))[0]
  if (!prey) return
  const need = d.temper === 2 ? 1.6 : 2.2
  if (mine < power(st, prey) * need) return
  if (prey === st.player && st.t < (st.flags.calm ?? 0) + 180) return
  st.flags[`war:${f}`] = st.t
  setRel(st, f, prey, 'war', `${factionLabel(st, f)}向${factionLabel(st, prey)}宣战。`)
}

// ---------- war ----------

const ATTACK_AT: Record<number, number> = { 0: 2.3, 1: 1.7, 2: 1.35 }

/**
 * History's campaigns: gather where they really gathered, strike where they really struck,
 * and be as stubborn about it as they were. Returns the commanderies these campaigns are after.
 */
function campaigns(st: State, f: Fid, free: Army[], zone: Set<string> | null) {
  const claimed = new Map<string, number>()
  const take = (a: Army) => free.splice(free.indexOf(a), 1)
  const total = troopsOf(st, f)
  const stray = (a: Army) => !!zone && !zone.has(a.at)
  for (const { it, p } of activeIntents(st, f)) {
    const want = total * it.share
    const goal = it.take.find((id) => {
      const o = ownerOf(st, id)
      return o !== f && (o === null || atWar(st, f, o))
    })
    // everything taken early: sit on the gains until the next move is due, as 曹操 sat in 江陵
    const hold = it.kind === 'hold' ? it.stage : !goal && it.take.length ? it.take.at(-1) : undefined
    if (hold) {
      const at = hold
      const o = ownerOf(st, at)
      if (o !== f && !(o && allied(st, f, o))) continue
      let here = armiesOf(st, f).filter((a) => a.at === at || a.path.at(-1) === at).reduce((s, a) => s + a.troops, 0)
      for (const a of free.filter((x) => x.at === at)) {
        a.stance = 'hold'
        take(a)
      }
      const pool = free.map((a) => ({ a, p: findPath(st, a, at) })).filter((x) => x.p && x.p.path.length && (x.p.days < 60 || stray(x.a))).sort((x, y) => x.p!.days - y.p!.days)
      for (const { a } of pool) {
        if (here >= want) break
        if (a.at === st.factions[f].capital && pool.length > 1 && armiesOf(st, f).filter((x) => x.at === a.at).length === 1) continue
        if (order(st, a.id, at)) {
          a.stance = 'hold'
          take(a)
          here += a.troops
        }
      }
      continue
    }
    if (!goal) continue
    claimed.set(goal, p)
    // those already under its walls stay and finish the siege
    for (const a of free.filter((x) => x.at === goal)) {
      a.stance = 'attack'
      take(a)
    }
    const near = links(goal).map((l) => l.to).filter((id) => ownerOf(st, id) === f)
    const muster =
      it.stage && ownerOf(st, it.stage) === f && !near.some((id) => armiesOf(st, f).some((a) => a.at === id && a.troops > want * 0.5))
        ? it.stage
        : near.sort((x, y) => troopsAt(st, f, y) - troopsAt(st, f, x))[0]
    if (!muster) continue
    const foes = st.armies.filter((a) => a.at === goal && atWar(st, a.f, f)).reduce((s, a) => s + a.troops, 0)
    // a town that only just changed hands may open its gates to whoever turns up
    const def = foes + garrisonOf(st, goal) * (unsettled(st, goal) ? 0.25 : 1)
    // the real commanders pressed on at odds a careful AI would never take
    const ready = free.filter((a) => a.at === muster)
    const thr = Math.max(0.9, ATTACK_AT[factionDef.get(f)!.temper] * (1 - 0.4 * p)) * leadMul(ready)
    const here = ready.reduce((s, a) => s + a.troops, 0)
    const adjacent = links(muster).some((l) => l.to === goal)
    if (adjacent && here >= def * thr) {
      for (const a of ready) if (order(st, a.id, goal)) {
        a.stance = 'attack'
        take(a)
      }
      continue
    }
    for (const a of ready) take(a)
    let coming = here + armiesOf(st, f).filter((a) => a.path.at(-1) === muster).reduce((s, a) => s + a.troops, 0)
    const pool = free.map((a) => ({ a, p: findPath(st, a, muster) })).filter((x) => x.p && x.p.path.length && (x.p.days < 75 || stray(x.a))).sort((x, y) => x.p!.days - y.p!.days)
    for (const { a } of pool) {
      if (coming >= Math.max(want, def * thr * 1.2)) break
      if (a.at === st.factions[f].capital && armiesOf(st, f).filter((x) => x.at === a.at).length === 1 && pool.length > 1) continue
      if (order(st, a.id, muster)) {
        take(a)
        coming += a.troops
      }
    }
  }
  return claimed
}

function troopsAt(st: State, f: Fid, id: string) {
  return armiesOf(st, f).filter((a) => a.at === id).reduce((s, a) => s + a.troops, 0)
}

function temperMul(a: Army) {
  const t = temperOf(a)
  if (t === 'rash') return 0.75
  if (t === 'proud') return 0.85
  if (t === 'cautious') return 1.3
  return 1
}

function leadMul(armies: Army[]) {
  let best: Army | null = null
  let lead = -1
  for (const a of armies) {
    const c = commander(a)
    if (c && c.lead > lead) {
      lead = c.lead
      best = a
    }
  }
  return best ? temperMul(best) : 1
}

function openGoal(st: State, f: Fid, take: string[]) {
  return take.find((id) => {
    const o = ownerOf(st, id)
    return o !== f && (o === null || atWar(st, f, o))
  })
}

/**
 * Spare a column under the second general.
 * 0.45, not 0.3: a Jingnan garrison is about a third of Liu Bei's host, so 0.3 never qualifies.
 */
function detach(st: State, f: Fid, enemies: Fid[]) {
  if (st.t < (st.flags.calm ?? 0)) return
  if (st.t - (st.flags[`split:${f}`] ?? -9999) < 30) return
  const goals = new Set<string>()
  const later = new Set<string>()
  for (const { it } of activeIntents(st, f)) {
    if (it.kind === 'hold') continue
    const goal = openGoal(st, f, it.take)
    if (!goal) continue
    goals.add(goal)
    for (const id of it.take) if (id !== goal) later.add(id)
  }
  const upcoming = new Set(soonIntents(st, f, 0.4).flatMap((it) => it.take))
  // about three months out, a column may start on this side's own next campaign
  const ripe = new Set(soonIntents(st, f, 0.25).flatMap((it) => it.take))
  const soon = realOwners(yearOf(st) + 1.5)
  let best: { a: Army; to: string; rank: number } | null = null
  for (const a of armiesOf(st, f)) {
    if (!idle(st, a) || a.gens.length < 2 || a.troops <= 15000) continue
    for (const l of links(a.at)) {
      const id = l.to
      const o = ownerOf(st, id)
      if (!o || !enemies.includes(o)) continue
      if (goals.has(id) || (upcoming.has(id) && !ripe.has(id))) continue
      const heir = factionOfReal(soon.f[cellIndex.get(id)!])
      if (heir && heir !== f && allied(st, f, heir)) continue
      if (inertia(st, id) >= 0.55) continue
      const unset = unsettled(st, id)
      // a column takes unsettled ground or the next counties of this side's own campaign, not every weak border
      if (!unset && !later.has(id) && !ripe.has(id)) continue
      const def = st.armies.filter((x) => x.at === id && atWar(st, x.f, f)).reduce((s, x) => s + x.troops, 0) + garrisonOf(st, id)
      if (!unset && def >= a.troops * 0.45) continue
      const rank = (unset ? 0 : 1) + def / a.troops
      if (!best || rank < best.rank) best = { a, to: id, rank }
    }
  }
  if (!best) return
  const a = best.a
  const n = Math.max(3000, Math.round(a.troops / 3))
  if (a.troops - n < 3000) return
  const ranked = [...a.gens].sort((x, y) => generalById.get(y)!.lead - generalById.get(x)!.lead)
  const second = ranked[1]
  if (!second) return
  const r = raise(st, f, a.at, n)
  Object.assign(r, { cav: a.cav, navy: a.navy, org: a.org, north: a.north, food: a.food, sick: a.sick, stance: 'attack' as const })
  a.troops -= n
  a.gens = a.gens.filter((g) => g !== second)
  r.gens = [second]
  if (!order(st, r.id, best.to)) {
    a.troops += r.troops
    a.gens.push(second)
    st.armies = st.armies.filter((x) => x !== r)
    return
  }
  st.flags[`split:${f}`] = st.t
  st.flags['n:detach'] = (st.flags['n:detach'] ?? 0) + 1
  const name = generalById.get(second)!.name
  log(st, { kind: 'event', f, at: best.to, text: `${name}分兵略地，攻向${best.to}。`, mine: f === st.player || ownerOf(st, best.to) === st.player })
}

/** Only to run down an army that is travelling with civilians. */
function lightHorse(st: State, f: Fid) {
  if (st.armies.some((a) => a.f === f && a.raid === -2)) return
  const prey = st.armies.filter((a) => a.folk && atWar(st, f, a.f) && a.path.length)
  if (!prey.length) return
  const riders = armiesOf(st, f).filter((a) => !a.ready && a.raid === undefined && !inBattle(st, a) && !a.folk && a.troops >= 4000 && (a.cav >= 0.3 || a.troops * a.cav >= 5000))
  for (const p of prey) {
    if (st.flags[`dashed:${p.id}`]) continue
    const dest = p.path.at(-1)!
    const left = findPath(st, p, dest)
    const leftDays = left && Number.isFinite(left.days) && left.days > 0 ? left.days : 999
    let best: { id: number; days: number } | null = null
    for (const a of riders) {
      const ghost: Army = { ...a, raid: -2, cav: 1 }
      const ride = a.at === p.at ? { days: 0 } : raidPath(st, ghost, p.at)
      if (!ride || ride.days > 15 || ride.days >= leftDays) continue
      if (!best || ride.days < best.days) best = { id: a.id, days: ride.days }
    }
    if (best && launchDash(st, best.id, p.at)) {
      st.flags[`dashed:${p.id}`] = st.t
      return
    }
  }
}

function military(st: State, f: Fid) {
  const fs = st.factions[f]
  const d = factionDef.get(f)!
  const arms = armiesOf(st, f)
  const calm = st.t < (st.flags.calm ?? 0)

  // merge armies standing together
  for (const a of arms) {
    if (!idle(st, a) || a.troops <= 0) continue
    const b = arms.find((x) => x !== a && x.at === a.at && idle(st, x) && x.troops > 0)
    if (!b) continue
    const total = a.troops + b.troops
    a.cav = (a.cav * a.troops + b.cav * b.troops) / total
    a.navy = (a.navy * a.troops + b.navy * b.troops) / total
    a.org = (a.org * a.troops + b.org * b.troops) / total
    a.sick = (a.sick * a.troops + b.sick * b.troops) / total
    a.food = (a.food * a.troops + b.food * b.troops) / total
    if (b.folk) a.folk = (a.folk ?? 0) + b.folk
    a.troops = total
    a.gens = [...a.gens, ...b.gens].sort((x, y) => generalById.get(y)!.lead - generalById.get(x)!.lead).slice(0, 3)
    b.troops = 0
  }
  st.armies = st.armies.filter((a) => a.troops > 0)
  const mine = armiesOf(st, f)

  // generals without an army take the biggest leaderless one
  for (const g of idleGenerals(st, f).sort((x, y) => y.lead - x.lead)) {
    const a = mine.filter((x) => x.gens.length < 2).sort((x, y) => y.troops - x.troops)[0]
    if (a) a.gens.push(g.id)
  }

  const enemies = FACTIONS.map((x) => x.id).filter((x) => atWar(st, f, x))
  // idle armies are reassigned each cycle; an army in battle keeps its order so a 固守 doesn't vanish mid-fight and chase
  if (enemies.length) for (const a of mine) {
    if (inBattle(st, a) || a.path.length || a.raid !== undefined || a.ready) continue
    delete a.stance
  }
  if (enemies.length) lightHorse(st, f)
  if (enemies.length) raids(st, f, enemies)
  if (enemies.length) {
    // an army under enemy walls stays until the city falls
    const besieging = (a: Army) => {
      const o = ownerOf(st, a.at)
      return o !== f && (o === null || atWar(st, f, o))
    }
    const own = ownedBy(st, f)
    // northerners rotting with fever in the south go home to recover, as 曹操 did after 赤壁
    for (const a of mine) {
      if (!a.north || a.sick < 0.25 || !isSouth(cellById.get(a.at)!) || inBattle(st, a) || a.raid !== undefined) continue
      const home = own
        .filter((c) => !isSouth(c))
        .map((c) => ({ c, p: findPath(st, a, c.id) }))
        .filter((x) => x.p && x.p.path.length)
        .sort((x, y) => x.p!.days - y.p!.days)[0]
      if (home) {
        delete a.stance
        order(st, a.id, home.c.id)
      }
    }
    const free = mine.filter((a) => idle(st, a) && a.org > 0.55 && a.food > 5 && !besieging(a))

    const defend = (cells: typeof own) => {
      for (const c of cells) {
        const threat = links(c.id).reduce((s, l) => s + st.armies.filter((a) => a.at === l.to && atWar(st, a.f, f)).reduce((x, a) => x + a.troops, 0), 0)
        if (threat < 8000) continue
        const here = mine.filter((a) => a.at === c.id || a.path.at(-1) === c.id).reduce((s, a) => s + a.troops, 0)
        if (here + garrisonOf(st, c.id) > threat * 0.9) {
          // enough to hold: those standing here stay
          if (here < threat * 1.3) for (const a of free.filter((x) => x.at === c.id)) {
            a.stance = 'hold'
            free.splice(free.indexOf(a), 1)
          }
          continue
        }
        const pool = free
          .filter((a) => a.at !== c.id)
          .map((a) => ({ a, p: findPath(st, a, c.id) }))
          .filter((x) => x.p && x.p.days < 30)
          .sort((x, y) => x.p!.days - y.p!.days)
        const help = pool.find((x) => temperOf(x.a) !== 'proud')
        if (pool[0] && temperOf(pool[0].a) === 'proud' && !help) {
          const g = commander(pool[0].a)
          const key = `pride:${pool[0].a.id}:${c.id}`
          if (g && st.t - (st.flags[key] ?? -9999) >= 180) {
            st.flags[key] = st.t
            log(st, { kind: 'event', f, at: c.id, text: `${g.name}不肯回援${c.id}。`, mine: f === st.player })
          }
        }
        // a small column marching into a big enemy only feeds him
        if (help && here + help.a.troops + garrisonOf(st, c.id) > threat * 0.6) {
          order(st, help.a.id, c.id)
          help.a.stance = 'hold'
          free.splice(free.indexOf(help.a), 1)
        }
      }
    }
    // the capital before anything history asks for; the rest of the land after
    defend(own.filter((c) => c.id === fs.capital))
    detach(st, f, enemies)
    const zone = theatre(st, f)
    const claimed = campaigns(st, f, free, zone)
    const soon = realOwners(yearOf(st) + 1.5)
    // what the next campaign will want is left alone until it begins
    const upcoming = new Set(soonIntents(st, f, 0.4).flatMap((it) => it.take))
    // targets: enemy commanderies next to ours
    const seen = new Set<string>()
    const targets: { id: string; score: number; def: number }[] = []
    for (const c of own)
      for (const l of links(c.id)) {
        if (seen.has(l.to)) continue
        seen.add(l.to)
        const o = ownerOf(st, l.to)
        if (!o || !enemies.includes(o)) continue
        // a campaign already has it in hand
        if (claimed.has(l.to) || upcoming.has(l.to)) continue
        if (calm) continue
        // land history is about to give a friend is left to the friend
        const heir = factionOfReal(soon.f[cellIndex.get(l.to)!])
        if (heir && heir !== f && allied(st, f, heir)) continue
        const foes = st.armies.filter((a) => a.at === l.to && atWar(st, a.f, f)).reduce((s, a) => s + a.troops, 0)
        const def = foes + garrisonOf(st, l.to)
        const value = cs(st, l.to).pop / 100000 + (st.factions[o].capital === l.to ? 2 : 0)
        const hold = inertia(st, l.to)
        targets.push({ id: l.to, score: (value / Math.max(1, def / 10000)) * (0.8 + rand(st) * 0.4) * (1 - 0.7 * hold), def: def * (1 + 0.8 * hold) })
      }
    // landless lords and guests also look for neutral or enemy land around them
    if (!own.length)
      for (const a of mine)
        for (const l of links(a.at)) {
          const o = ownerOf(st, l.to)
          if ((o === null || enemies.includes(o)) && !seen.has(l.to)) {
            seen.add(l.to)
            targets.push({ id: l.to, score: 3, def: garrisonOf(st, l.to) })
          }
        }
    targets.sort((a, b) => b.score - a.score)
    const thr = ATTACK_AT[d.temper]
    for (const t of targets.slice(0, 3)) {
      const near = free
        .map((a) => ({ a, p: findPath(st, a, t.id) }))
        .filter((x) => x.p && x.p.path.length && x.p.days < 60)
        .sort((x, y) => x.p!.days - y.p!.days)
      const bar = t.def * thr * leadMul(near.map((x) => x.a))
      let sum = 0
      const go: Army[] = []
      for (const { a } of near) {
        // don't strip the capital bare
        if (a.at === fs.capital && mine.filter((x) => x.at === fs.capital).length === 1 && near.length > 1) continue
        go.push(a)
        sum += a.troops
        if (sum > bar * 1.3) break
      }
      if (sum < bar) continue
      for (const a of go) {
        if (order(st, a.id, t.id)) a.stance = 'attack'
        free.splice(free.indexOf(a), 1)
      }
    }

    defend(own.filter((c) => c.id !== fs.capital).sort((x, y) => cs(st, y.id).pop - cs(st, x.id).pop))

    // no order means hold friendly ground; only a march onto enemy ground is an attack
    for (const a of mine) {
      if (a.stance || a.ready || a.raid !== undefined || inBattle(st, a)) continue
      const dest = a.path.at(-1)
      const where = dest ?? a.at
      const o = ownerOf(st, where)
      a.stance = o === f || (o !== null && allied(st, f, o)) ? 'hold' : 'attack'
    }
    // ships for a river war
    const riverWar = own.some((c) => links(c.id).some((l) => l.e.cross.includes('jiang') && enemies.includes(ownerOf(st, l.to)!)))
    for (const a of free) if (riverWar && cellById.get(a.at)!.boats.length && a.navy < 0.6) a.drill = true
  }

  // raising troops
  const troops = troopsOf(st, f)
  const cap = popOf(st, f) * (enemies.length ? 0.024 : 0.012)
  for (let i = 0; i < 2; i++) {
    if (fs.manpower < LEVY || troops > cap || fs.grain < upkeepOf(st, f) * 4 + 5) break
    const front = ownedBy(st, f)
      .filter((c) => links(c.id).some((l) => enemies.includes(ownerOf(st, l.to)!)))
      .sort((a, b) => cs(st, b.id).pop - cs(st, a.id).pop)
    const at = front[i]?.id ?? fs.capital
    if (!at || !recruit(st, f, at)) break
  }

  // statecraft, at a human pace; thrones follow the real order of things
  if (!fs.cur && st.t - (st.flags[`pol:${f}`] ?? -999) > 240) {
    const hanGone = !st.factions.cao.alive || st.factions.cao.title === 2
    const ok = (x: (typeof POLICIES)[number]) => {
      if (policyBlock(st, f, x) || fs.grain < x.cost * 4 + 10) return false
      if (x.title === 2) return f === 'cao' ? fs.ruler !== 'caocao' : hanGone
      if (x.title === 1) return f === 'cao' || hanGone || st.factions.cao.title >= 1
      const real = x.history?.years[f]
      return real === undefined || yearOf(st) >= real - 3
    }
    const mineFirst = [...POLICIES].sort((a, b) => (b.who.includes(f) ? 1 : 0) - (a.who.includes(f) ? 1 : 0))
    const p = mineFirst.find(ok)
    if (p && startPolicy(st, f, p.id)) st.flags[`pol:${f}`] = st.t
  }
}

export function aiDay(st: State) {
  FACTIONS.forEach((d, i) => {
    const f = d.id
    if (f === st.player || !st.factions[f].alive) return
    if ((st.t + i) % 5 === 0) military(st, f)
    if ((st.t + i * 3) % 30 === 0) diplomacy(st, f)
  })
}

// ---------- the player's envoys ----------

export function playerDeclare(st: State, f: Fid) {
  const r = relOf(st, st.player, f)
  if (r.s === 'war') return '已经在打仗了'
  if (r.truce > st.t) return `刚刚议和，${Math.ceil((r.truce - st.t) / 30)} 个月内不能开战`
  const broke = r.s === 'ally'
  setRel(st, st.player, f, 'war', `${factionLabel(st, st.player)}${broke ? '撕毁盟约，' : ''}向${factionLabel(st, f)}宣战。`)
  if (broke) for (const c of ownedBy(st, st.player)) cs(st, c.id).order = Math.max(0.2, cs(st, c.id).order - 0.08)
  return null
}

export function playerPeace(st: State, f: Fid) {
  if (!atWar(st, st.player, f)) return '没有在打仗'
  if (!aiWantsPeace(st, f, st.player)) {
    log(st, { kind: 'event', text: `${factionLabel(st, f)}拒绝议和。`, mine: true })
    return `${factionLabel(st, f)}觉得自己占上风，不肯议和`
  }
  setRel(st, st.player, f, 'peace')
  return null
}

export function playerAlly(st: State, f: Fid) {
  const r = relOf(st, st.player, f)
  if (r.s === 'ally') return '已经是盟友'
  if (r.s === 'war') return '先要议和'
  if (!aiWantsAlliance(st, f, st.player)) return `${factionLabel(st, f)}觉得没有结盟的必要：你们没有共同的强敌`
  setRel(st, st.player, f, 'ally')
  return null
}

export function bordering(st: State, a: Fid, b: Fid) {
  return neighbours(st, a).has(b) || cells.some((c) => ownerOf(st, c.id) === b && armiesOf(st, a).some((x) => x.at === c.id)) || allied(st, a, b)
}
