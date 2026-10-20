import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Marker, type GeoJSONSource, type Map as MLMap } from 'maplibre-gl'
import { whenMap } from '../map/mapRef'
import { setState } from '../lib/store'
import {
  act,
  armyAt,
  cloneState,
  DRILL,
  drill,
  endSeason,
  incomeOf,
  militia,
  preview,
  RECRUIT,
  recruit,
  seasonName,
  SEASONS,
  spendOf,
  troopsText,
  type Battle,
  type Report,
  type State,
} from './engine'
import { goalsMet, historyThisSeason, scenarioById, type Scenario } from './scenarios'
import { sideOf } from './sides'
import { generalById, neighbors, placeById, routeBetween, routes, routeWords, traitWords, type Place } from './world'

import { clearGame, saveGame, savedGame } from './saves'
import './game.css'

/** 挨得太近的城，标签往两边让一让（像素） */
const NUDGE: Record<string, [number, number]> = {
  jiangling: [-14, -8],
  gongan: [12, 16],
  wulin: [-14, -6],
  chibi: [14, 10],
  liyang: [-10, -6],
  baima: [8, 8],
}

const routeColor: Record<string, string> = {
  road: '#d9ceb4',
  hard: '#c9935e',
  gorge: '#e27455',
  ford: '#8cc4e4',
  river: '#5fb0ee',
  water: '#5fb0ee',
}

export default function Strategy({ scenarioId, side, resume }: { scenarioId: string; side: string; resume?: boolean }) {
  const sc = scenarioById.get(scenarioId)!
  const [boot] = useState(() => {
    const saved = resume ? savedGame() : null
    const fromSave = saved?.scenario === scenarioId
    return { state: fromSave && saved ? saved.state : sc.build(side), fromSave: !!fromSave }
  })
  const [st, setSt] = useState<State>(boot.state)
  const origin = useRef(boot.state)
  const [sel, setSel] = useState<string | null>(null)
  const [aim, setAim] = useState(false)
  const [to, setTo] = useState<string | null>(null)
  const [troops, setTroops] = useState(0)
  const [gens, setGens] = useState<string[]>([])
  const [battle, setBattle] = useState<{ b: Battle; extra: Report[] } | null>(null)
  const [season, setSeason] = useState<{ reports: Report[]; was: { year: number; season: number } } | null>(null)
  const [intro, setIntro] = useState(!boot.fromSave)
  const [goalsOpen, setGoalsOpen] = useState(false)
  const [trait, setTrait] = useState<string | null>(null)
  const [moves, setMoves] = useState<{ from: string; to: string; side: string; mine: boolean }[]>([])
  const [els, setEls] = useState<Record<string, HTMLElement>>({})
  const mapRef = useRef<MLMap | null>(null)

  const me = st.player
  const area = useMemo(() => Object.keys(st.owner), [st.owner])
  const areaSet = useMemo(() => new Set(area), [area])

  useEffect(() => {
    setState({ mode: 'game', panel: null, year: st.year, target: st.year })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setState({ year: st.year + st.season * 0.25, target: st.year + st.season * 0.25 })
    if (st === origin.current || sc.id !== 'sandbox' || st.over) return
    saveGame(sc.id, st)
  }, [st, sc.id])

  // board layers and place markers
  useEffect(() => {
    let alive = true
    const markers: Marker[] = []
    whenMap().then((map) => {
      if (!alive) return
      mapRef.current = map
      const add = () => {
        if (!map.getSource('g-routes')) {
          map.addSource('g-routes', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
          map.addSource('g-halo', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
          map.addSource('g-moves', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
          map.addLayer({
            id: 'g-halo',
            type: 'circle',
            source: 'g-halo',
            paint: {
              'circle-color': ['get', 'color'],
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 16, 6, 30, 8, 54],
              'circle-blur': 0.85,
              'circle-opacity': 0.42,
            },
          })
          for (const kind of ['road', 'hard', 'gorge', 'ford', 'river', 'water'] as const) {
            map.addLayer({
              id: `g-route-${kind}`,
              type: 'line',
              source: 'g-routes',
              filter: ['==', ['get', 'kind'], kind],
              layout: { 'line-cap': kind === 'road' || kind === 'water' ? 'round' : 'butt' },
              paint: {
                'line-color': routeColor[kind],
                'line-width': ['case', ['get', 'hot'], kind === 'river' ? 5 : 3.6, kind === 'river' ? 3 : kind === 'water' ? 2.4 : 1.6],
                'line-opacity': ['case', ['get', 'hot'], 1, kind === 'road' ? 0.32 : 0.62],
                ...(kind === 'hard' ? { 'line-dasharray': [3, 2] } : {}),
                ...(kind === 'gorge' ? { 'line-dasharray': [1, 2] } : {}),
                ...(kind === 'ford' ? { 'line-dasharray': [2, 1.5] } : {}),
                ...(kind === 'river' ? { 'line-dasharray': [1.2, 1] } : {}),
              },
            })
          }
          map.addLayer({
            id: 'g-moves',
            type: 'line',
            source: 'g-moves',
            layout: { 'line-cap': 'round' },
            paint: { 'line-color': ['get', 'color'], 'line-width': 3, 'line-opacity': 0.9, 'line-dasharray': [2, 1.4] },
          })
        }
        const next: Record<string, HTMLElement> = {}
        for (const id of area) {
          const p = placeById.get(id)!
          const el = document.createElement('div')
          el.className = 'g-mk'
          next[id] = el
          markers.push(new Marker({ element: el, anchor: 'center', offset: NUDGE[id] ?? [0, 0] }).setLngLat(p.at).addTo(map))
        }
        setEls(next)
        const pts = area.map((id) => placeById.get(id)!.at)
        const lng = pts.map((p) => p[0])
        const lat = pts.map((p) => p[1])
        const small = window.innerWidth < 640
        map.fitBounds(
          [
            [Math.min(...lng), Math.min(...lat)],
            [Math.max(...lng), Math.max(...lat)],
          ],
          { padding: { top: small ? 90 : 96, bottom: small ? 170 : 120, left: small ? 28 : 60, right: small ? 28 : 60 }, duration: 1600, maxZoom: 7.2 },
        )
      }
      if (map.isStyleLoaded()) add()
      else map.once('idle', add)
    })
    return () => {
      alive = false
      markers.forEach((m) => m.remove())
      const map = mapRef.current
      if (map?.getLayer('g-moves')) {
        for (const id of ['g-moves', 'g-halo', ...['road', 'hard', 'gorge', 'ford', 'river', 'water'].map((k) => `g-route-${k}`)]) map.removeLayer(id)
        for (const id of ['g-routes', 'g-halo', 'g-moves']) map.removeSource(id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sc.id])

  const selArmy = sel ? armyAt(st, sel, me) : undefined
  const targets = useMemo(() => (aim && sel ? neighbors(sel).filter((n) => areaSet.has(n.id)) : []), [aim, sel, areaSet])
  const targetIds = useMemo(() => new Set(targets.map((t) => t.id)), [targets])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.getSource('g-routes')) return
    const feats = routes
      .filter((r) => areaSet.has(r.a) && areaSet.has(r.b))
      .map((r) => ({
        type: 'Feature' as const,
        properties: { kind: r.kind, hot: !!sel && aim && (r.a === sel || r.b === sel) },
        geometry: { type: 'LineString' as const, coordinates: [placeById.get(r.a)!.at, placeById.get(r.b)!.at] },
      }))
    ;(map.getSource('g-routes') as GeoJSONSource).setData({ type: 'FeatureCollection', features: feats })
    ;(map.getSource('g-halo') as GeoJSONSource).setData({
      type: 'FeatureCollection',
      features: area
        .filter((id) => st.owner[id])
        .map((id) => ({ type: 'Feature' as const, properties: { color: sideOf(st.owner[id]!).color }, geometry: { type: 'Point' as const, coordinates: placeById.get(id)!.at } })),
    })
    ;(map.getSource('g-moves') as GeoJSONSource).setData({
      type: 'FeatureCollection',
      features: moves.map((m) => ({
        type: 'Feature' as const,
        properties: { color: sideOf(m.side).color },
        geometry: { type: 'LineString' as const, coordinates: [placeById.get(m.from)!.at, placeById.get(m.to)!.at] },
      })),
    })
  }, [st, sel, aim, moves, area, areaSet, els])

  const pick = (id: string) => {
    if (st.over || season || battle) return
    if (aim && targetIds.has(id)) {
      setTo(id)
      setTroops(selArmy ? Math.round(selArmy.troops * 10) / 10 : 0)
      setGens(selArmy?.generals ?? [])
      return
    }
    setAim(false)
    setTo(null)
    setSel(id === sel ? null : id)
  }

  const order = selArmy && to ? { army: selArmy.id, to, troops: Math.min(troops, selArmy.troops), generals: troops >= selArmy.troops - 0.01 ? selArmy.generals : gens } : null
  const pv = order ? preview(st, order) : null

  const commit = () => {
    if (!order || !pv?.ok) return
    const next = cloneState(st)
    const rs = act(next, order)
    setSt(next)
    setMoves((m) => [...m, { from: sel!, to: order.to, side: me, mine: true }])
    setAim(false)
    setTo(null)
    const b = rs.find((r) => r.battle)
    if (b?.battle) setBattle({ b: b.battle, extra: rs.filter((r) => r !== b) })
    else if (rs.some((r) => r.kind === 'info' || r.kind === 'capture')) setSeason({ reports: rs, was: { year: next.year, season: -1 } })
    setSel(next.owner[order.to] === me ? order.to : sel)
    check(next)
  }

  const doRecruit = () => {
    if (!sel) return
    const next = cloneState(st)
    if (recruit(next, me, sel)) setSt(next)
  }
  const doDrill = () => {
    if (!selArmy) return
    const next = cloneState(st)
    const a = next.armies.find((x) => x.id === selArmy.id)!
    if (drill(next, a)) setSt(next)
  }

  const check = (s: State) => {
    if (s.over) return
    const lost = sc.lost(s)
    if (lost) s.over = { won: false, text: lost }
    else if (goalsMet(sc, s)) s.over = { won: true, text: '你做到了。' }
    else if (s.turn >= sc.turns) s.over = { won: false, text: '时间到了，目标还没完成。' }
    if (s.over) {
      if (sc.id === 'sandbox') clearGame()
      setSt({ ...s })
    }
  }

  const finishSeason = () => {
    const was = { year: st.year, season: st.season }
    const next = cloneState(st)
    const rs = endSeason(next)
    sc.script?.(next, rs)
    setMoves(
      rs
        .filter((r) => r.from && r.to && r.side !== me)
        .map((r) => ({ from: r.from!, to: r.to!, side: r.side, mine: false })),
    )
    setSt(next)
    setSel(null)
    setAim(false)
    setTo(null)
    setSeason({ reports: rs, was })
    check(next)
  }

  const grain = Math.round(st.grain[me] ?? 0)
  const inc = incomeOf(st, me)
  const out = spendOf(st, me)
  const goals = sc.goals(me)
  const selPlace = sel ? placeById.get(sel) : undefined
  const owner = sel ? st.owner[sel] : null
  const enemyHere = sel ? st.armies.find((a) => a.at === sel && a.side !== me) : undefined

  return (
    <div className="g-root">
      {Object.entries(els).map(([id, el]) =>
        createPortal(
          <PlaceNode
            p={placeById.get(id)!}
            s={st}
            me={me}
            sel={sel === id}
            target={targetIds.has(id) ? (to === id ? 'chosen' : 'open') : null}
            onPick={() => pick(id)}
          />,
          el,
          id,
        ),
      )}

      <header className="g-hud">
        <div className="g-when">
          <b>{st.year}</b> 年 <b>{SEASONS[st.season]}</b>
          <small>
            {sc.title} · 第 {st.turn + 1}/{sc.turns} 季
          </small>
        </div>
        <div className="g-me" style={{ ['--c' as string]: sideOf(me).color }}>
          <i>{sideOf(me).short}</i>
          {sideOf(me).name}
        </div>
        <div className={`g-grain${inc - out < 0 ? ' low' : ''}`} title="每一季：秋天收成最好，冬天最少">
          粮 <b>{grain}</b>
          <small>
            这季 +{Math.round(inc)} / −{Math.round(out)}
          </small>
        </div>
        <span className="g-spacer" />
        <button className="g-btn ghost" onClick={() => setGoalsOpen((v) => !v)}>
          目标
        </button>
        <a className="g-btn ghost" href="./">
          离开
        </a>
      </header>

      {goalsOpen && (
        <div className="g-goals">
          {goals.map((g) => (
            <p key={g.text} className={g.done(st) ? 'done' : ''}>
              {g.text}
            </p>
          ))}
        </div>
      )}

      <section className="g-sheet">
        {!selPlace && !st.over && <p className="g-tip">{aim ? '点一座亮起来的城' : '点一座你的城（带你颜色的），看看那里的兵'}</p>}

        {selPlace && !to && (
          <div className="g-card">
            <div className="g-card-head">
              <h3>{selPlace.name}</h3>
              <span className="g-modern">今天的{selPlace.modern}</span>
              {owner && (
                <span className="g-owner" style={{ ['--c' as string]: sideOf(owner).color }}>
                  {sideOf(owner).name}
                </span>
              )}
              <button className="g-x" onClick={() => setSel(null)} aria-label="关闭">
                ×
              </button>
            </div>
            <div className="g-tags">
              {selPlace.port && <span>港口</span>}
              {selPlace.pass && <span>关隘</span>}
              {selPlace.wall && <span>城墙</span>}
              {selPlace.mountain && <span>山地</span>}
              {selPlace.zone === 'south' && <span>湿热</span>}
              <span>产粮 {selPlace.grain}</span>
              <span>守兵 {troopsText(militia(selPlace.id))}</span>
            </div>
            {selPlace.note && <p className="g-note">{selPlace.note}</p>}

            {selArmy && (
              <div className="g-army">
                <div className="g-army-row">
                  <b>{troopsText(selArmy.troops)}</b> 人<span>水军 {Math.round(selArmy.navy * 10)} 成</span>
                  {selArmy.sick > 0 && <span className="bad">闹疫病</span>}
                  {selArmy.moved && <span>这季已行动</span>}
                </div>
                <div className="g-gens">
                  {selArmy.generals.length === 0 && <span className="g-none">没有大将</span>}
                  {selArmy.generals.map((g) => (
                    <GeneralChip key={g} id={g} open={trait === g} onToggle={() => setTrait(trait === g ? null : g)} />
                  ))}
                </div>
                <div className="g-actions">
                  <button className="g-btn primary" disabled={selArmy.moved || st.over != null} onClick={() => setAim(!aim)}>
                    {aim ? '取消' : '出兵'}
                  </button>
                  <button className="g-btn" disabled={st.recruited.includes(sel!) || grain < RECRUIT.cost} onClick={doRecruit}>
                    招兵 <small>+{Math.max(2, Math.min(RECRUIT.troops, selPlace.grain * 2))}千 · {RECRUIT.cost} 粮</small>
                  </button>
                  {selPlace.port && (
                    <button className="g-btn" disabled={selArmy.moved || selArmy.navy >= 1 || grain < DRILL.cost} onClick={doDrill}>
                      练水军 <small>+{DRILL.gain * 10} 成 · {DRILL.cost} 粮</small>
                    </button>
                  )}
                </div>
              </div>
            )}
            {!selArmy && owner === me && (
              <div className="g-actions">
                <button className="g-btn" disabled={st.recruited.includes(sel!) || grain < RECRUIT.cost} onClick={doRecruit}>
                  招兵 <small>{RECRUIT.cost} 粮</small>
                </button>
              </div>
            )}
            {enemyHere && (
              <div className="g-army enemy">
                <div className="g-army-row">
                  <b>{troopsText(enemyHere.troops)}</b> 人<span>水军 {Math.round(enemyHere.navy * 10)} 成</span>
                  {enemyHere.sick > 0 && <span className="bad">闹疫病</span>}
                </div>
                <div className="g-gens">
                  {enemyHere.generals.map((g) => (
                    <GeneralChip key={g} id={g} open={trait === g} onToggle={() => setTrait(trait === g ? null : g)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {selArmy && to && (
          <div className="g-card g-order">
            <div className="g-card-head">
              <h3>
                {selPlace!.name} → {placeById.get(to)!.name}
              </h3>
              <span className="g-modern">{routeLabel(sel!, to)}</span>
              <button className="g-x" onClick={() => setTo(null)} aria-label="返回">
                ×
              </button>
            </div>
            <label className="g-slider">
              <span>
                带 <b>{troopsText(Math.min(troops, selArmy.troops))}</b> 人
                {troops < selArmy.troops - 0.01 && <small>，留下 {troopsText(selArmy.troops - troops)}</small>}
              </span>
              <input type="range" min={1} max={Math.max(1, Math.round(selArmy.troops))} step={1} value={Math.round(Math.min(troops, selArmy.troops))} onChange={(e) => setTroops(Math.min(selArmy.troops, +e.target.value))} />
            </label>
            {selArmy.generals.length > 0 && troops < selArmy.troops - 0.01 && (
              <div className="g-gens pick">
                <small>谁带队：</small>
                {selArmy.generals.map((g) => (
                  <button key={g} className={`g-gen${gens.includes(g) ? ' on' : ''}`} onClick={() => setGens(gens.includes(g) ? gens.filter((x) => x !== g) : [...gens, g])}>
                    {generalById.get(g)!.name}
                  </button>
                ))}
              </div>
            )}
            {pv && !pv.ok && <p className="g-warn">{pv.reason}</p>}
            {pv?.ok && pv.kind === 'attack' && <Odds b={pv.battle} odds={pv.odds} me={me} />}
            {pv?.ok && pv.lines.length > 0 && (
              <ul className="g-lines">
                {pv.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            )}
            <div className="g-actions">
              <button className="g-btn primary" disabled={!pv?.ok} onClick={commit}>
                {pv?.ok && pv.kind === 'attack' ? '进攻' : pv?.ok && pv.kind === 'take' ? '拿下' : '出发'}
              </button>
              <button className="g-btn" onClick={() => setTo(null)}>
                再想想
              </button>
            </div>
          </div>
        )}
      </section>

      {!st.over && (
        <button className="g-end" onClick={finishSeason} disabled={!!battle || !!season}>
          结束这一季
          <small>
            下一季：{SEASONS[(st.season + 1) % 4]}
            {st.season === 1 ? ' · 秋收' : ''}
          </small>
        </button>
      )}

      {battle && <BattleReport b={battle.b} me={me} extra={battle.extra} onClose={() => setBattle(null)} />}
      {season && !battle && <SeasonSheet data={season} me={me} st={st} onClose={() => setSeason(null)} />}
      {intro && <Intro sc={sc} me={me} onGo={() => setIntro(false)} />}
      {st.over && !season && !battle && <Ending sc={sc} st={st} />}
    </div>
  )
}

function routeLabel(a: string, b: string) {
  const r = routeBetween(a, b)
  if (!r) return ''
  return `${routeWords[r.kind]}${r.name ? ` · ${r.name}` : ''}`
}

function PlaceNode({ p, s, me, sel, target, onPick }: { p: Place; s: State; me: string; sel: boolean; target: 'open' | 'chosen' | null; onPick: () => void }) {
  const owner = s.owner[p.id]
  const army = s.armies.filter((a) => a.at === p.id)
  const main = army[0]
  const c = owner ? sideOf(owner).color : '#8a8a8a'
  const cls = ['g-node', owner === me ? 'mine' : owner ? 'other' : 'empty', sel ? 'sel' : '', target ? `aim ${target}` : '', p.capital ? 'big' : '', main?.moved && main.side === me ? 'moved' : '']
  return (
    <button className={cls.filter(Boolean).join(' ')} style={{ ['--c' as string]: c }} onClick={(e) => (e.stopPropagation(), onPick())}>
      <span className="g-flag">{owner ? sideOf(owner).short : ''}</span>
      <span className="g-name">{p.name}</span>
      {main && (
        <span className="g-troops" style={{ ['--a' as string]: sideOf(main.side).color }}>
          {troopsText(main.troops)}
          {main.generals[0] ? ` · ${generalById.get(main.generals[0])?.name}` : ''}
        </span>
      )}
    </button>
  )
}

function GeneralChip({ id, open, onToggle }: { id: string; open: boolean; onToggle: () => void }) {
  const g = generalById.get(id)
  if (!g) return null
  return (
    <span className="g-gen-wrap">
      <button className={`g-gen${open ? ' on' : ''}`} onClick={onToggle}>
        {g.name}
        {g.traits.map((t) => (
          <i key={t}>{traitWords[t].name}</i>
        ))}
      </button>
      {open && (
        <span className="g-gen-pop">
          <b>{g.name}</b>
          <span>{g.line}</span>
          {g.traits.map((t) => (
            <span key={t}>
              <em>{traitWords[t].name}</em> {traitWords[t].text}
            </span>
          ))}
          {g.traits.length === 0 && <span>没有特别的本事，但是稳。</span>}
        </span>
      )}
    </span>
  )
}

function verdict(odds: number) {
  if (odds >= 1.3) return { text: '胜算很大', cls: 'good' }
  if (odds >= 1.08) return { text: '有胜算', cls: 'ok' }
  if (odds >= 0.92) return { text: '五五开，看运气', cls: 'even' }
  if (odds >= 0.7) return { text: '多半打不过', cls: 'bad' }
  return { text: '打不过', cls: 'bad' }
}

function pctText(m: number) {
  const d = Math.round((m - 1) * 100)
  return d === 0 ? '±0' : d > 0 ? `+${d}%` : `−${-d}%`
}

function Factors({ b, me }: { b: Battle; me: string }) {
  const meAtt = b.att === me
  const shown = b.factors.filter((f) => Math.abs(f.mult - 1) >= 0.03)
  const mine = shown.filter((f) => (f.who === 'att') === meAtt && !f.text.endsWith('领兵') && !f.text.endsWith('守在这里') && !f.text.startsWith('没有大将') && !f.text.startsWith('守军没有大将'))
  const theirs = shown.filter((f) => (f.who === 'att') !== meAtt && !f.text.endsWith('领兵') && !f.text.endsWith('守在这里') && !f.text.startsWith('没有大将') && !f.text.startsWith('守军没有大将'))
  const row = (f: { text: string; mult: number }, us: boolean) => {
    const good = us ? f.mult >= 1 : f.mult < 1
    return (
      <li key={f.text} className={good ? 'up' : 'down'}>
        <span>{f.text}</span>
        <em>
          {us ? '我方' : '对方'} {pctText(f.mult)}
        </em>
      </li>
    )
  }
  return (
    <ul className="g-factors">
      {mine.map((f) => row(f, true))}
      {theirs.map((f) => row(f, false))}
    </ul>
  )
}

function Bars({ b, me }: { b: Battle; me: string }) {
  const us = b.att === me ? b.attPower : b.defPower
  const them = b.att === me ? b.defPower : b.attPower
  const max = Math.max(us, them, 1)
  return (
    <div className="g-bars">
      <div>
        <span>我方战力</span>
        <i style={{ width: `${(us / max) * 100}%`, ['--c' as string]: sideOf(me).color }} />
        <b>{Math.round(us)}</b>
      </div>
      <div>
        <span>对方战力</span>
        <i style={{ width: `${(them / max) * 100}%`, ['--c' as string]: sideOf(b.att === me ? b.def : b.att).color }} />
        <b>{Math.round(them)}</b>
      </div>
    </div>
  )
}

function Odds({ b, odds, me }: { b: Battle; odds: number; me: string }) {
  const v = verdict(odds)
  return (
    <div className="g-odds">
      <p className={`g-verdict ${v.cls}`}>{v.text}</p>
      <Bars b={b} me={me} />
      <p className="g-fine">
        你带 {troopsText(b.attTroops)}，对面 {troopsText(b.defTroops)}（含城里的守兵）。
      </p>
      <Factors b={b} me={me} />
    </div>
  )
}

function BattleReport({ b, me, extra, onClose }: { b: Battle; me: string; extra: Report[]; onClose: () => void }) {
  const meAtt = b.att === me
  const won = meAtt ? b.won : !b.won
  const to = placeById.get(b.to)!
  return (
    <div className="g-modal" onClick={onClose}>
      <div className="g-report" onClick={(e) => e.stopPropagation()}>
        <p className="g-kicker">{meAtt ? `进攻${to.name}` : `${sideOf(b.att).name}来打${to.name}`}</p>
        <h2 className={won ? 'win' : 'lose'}>{won ? (meAtt ? `拿下了${to.name}` : `守住了${to.name}`) : meAtt ? `没能拿下${to.name}` : `${to.name}丢了`}</h2>
        <Bars b={b} me={me} />
        <Factors b={b} me={me} />
        <p className="g-loss">
          我方折损 {troopsText(meAtt ? b.attLost : b.defLost)}，对方折损 {troopsText(meAtt ? b.defLost : b.attLost)}。{b.note ?? ''}
        </p>
        {extra.map((r) => (
          <div key={r.title} className="g-extra">
            <b>{r.title}</b>
            {r.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        ))}
        <button className="g-btn primary" onClick={onClose} autoFocus>
          知道了
        </button>
      </div>
    </div>
  )
}

function SeasonSheet({ data, me, st, onClose }: { data: { reports: Report[]; was: { year: number; season: number } }; me: string; st: State; onClose: () => void }) {
  const mine = data.reports.filter((r) => r.kind !== 'battle' || r.battle?.att === me || r.battle?.def === me)
  const others = data.reports.filter((r) => !mine.includes(r))
  const hist = data.was.season >= 0 ? historyThisSeason(data.was.year, data.was.season) : []
  return (
    <div className="g-modal" onClick={onClose}>
      <div className="g-report g-season" onClick={(e) => e.stopPropagation()}>
        {data.was.season >= 0 && <p className="g-kicker">{seasonName(data.was)}过去了</p>}
        {data.was.season >= 0 && <h2>现在是 {seasonName(st)}</h2>}
        {mine.length === 0 && others.length === 0 && <p className="g-quiet">这一季没打仗。</p>}
        {mine.map((r, i) =>
          r.battle ? (
            <div key={i} className={`g-line ${(r.battle.att === me ? r.battle.won : !r.battle.won) ? 'win' : 'lose'}`}>
              <b>{r.title}</b>
              <span>
                {r.battle.att === me ? '你' : sideOf(r.battle.att).name}来攻，战力 {Math.round(r.battle.attPower)} 对 {Math.round(r.battle.defPower)}
                {r.battle.factors.find((f) => f.text.startsWith('火攻')) ? ' · 火攻' : ''}
                {r.battle.factors.find((f) => f.text.startsWith('横渡')) ? ' · 渡江' : ''}
              </span>
            </div>
          ) : (
            <div key={i} className="g-line">
              <b>{r.title}</b>
              {r.lines.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          ),
        )}
        {others.length > 0 && (
          <p className="g-others">
            别处：
            {others
              .slice(0, 6)
              .map((r) => r.title)
              .join('；')}
            {others.length > 6 ? '……' : ''}
          </p>
        )}
        {hist.length > 0 && (
          <div className="g-hist">
            <p className="g-kicker">真实的历史上，这一季</p>
            {hist.slice(0, 2).map((h) => (
              <p key={h.id}>
                <b>{h.name}</b>
                {h.text}
              </p>
            ))}
          </div>
        )}
        <button className="g-btn primary" onClick={onClose} autoFocus>
          继续
        </button>
      </div>
    </div>
  )
}

function Intro({ sc, me, onGo }: { sc: Scenario; me: string; onGo: () => void }) {
  const pickInfo = sc.picks.find((p) => p.side === me)
  return (
    <div className="g-modal g-intro-wrap">
      <div className="g-report g-intro">
        <p className="g-kicker">
          {sc.when} · 你是{pickInfo?.who ?? sideOf(me).name}
        </p>
        <h2>{sc.title}</h2>
        {sc.intro(me).map((l) => (
          <p key={l}>{l}</p>
        ))}
        <div className="g-goal-list">
          {sc.goals(me).map((g) => (
            <p key={g.text}>{g.text}</p>
          ))}
          <small>
            一共 {sc.turns} 季。每一季，每支军队可以动一次。
          </small>
        </div>
        <div className="g-howto">
          <span>点你的城</span>
          <span>点“出兵”</span>
          <span>点一座亮起来的城</span>
          <span>看清胜算再动手</span>
        </div>
        <button className="g-btn primary big" onClick={onGo} autoFocus>
          开始
        </button>
      </div>
    </div>
  )
}

function Ending({ sc, st }: { sc: Scenario; st: State }) {
  const won = st.over!.won
  return (
    <div className="g-modal">
      <div className="g-report g-ending">
        <p className="g-kicker">{seasonName(st)}</p>
        <h2 className={won ? 'win' : 'lose'}>{won ? '你赢了' : '这一局输了'}</h2>
        <p>{st.over!.text}</p>
        <div className="g-hist">
          <p className="g-kicker">真实的历史</p>
          {sc.history.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
        <div className="g-actions">
          <a className="g-btn primary" href={`?play=${sc.id}&side=${st.player}`}>
            再来一局
          </a>
          {sc.picks
            .filter((p) => p.side !== st.player)
            .slice(0, 1)
            .map((p) => (
              <a key={p.side} className="g-btn" href={`?play=${sc.id}&side=${p.side}`}>
                换成{p.who}
              </a>
            ))}
          <a className="g-btn ghost" href="./">
            回大厅
          </a>
        </div>
      </div>
    </div>
  )
}
