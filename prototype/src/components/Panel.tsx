import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Map as MapLibre, Marker } from 'maplibre-gl'
import { activeFlight, animateYear, getState, jumpYear, setState, stopYearAnimation, useStore, type Panel as PanelT } from '../lib/store'
import { eventBounds } from '../map/eventArc'
import { iconSvg } from '../map/icons'
import { flyTo } from '../map/mapRef'
import {
  cityById,
  cityNameAt,
  distanceKm,
  eventById,
  events,
  eventTime,
  briefById,
  factionColor,
  factionName,
  factionShort,
  keyframes,
  lineById,
  personById,
  personLocationAt,
  worldById,
} from '../data'
import type { City, EventBrief, HistEvent, Person, StoryLine, WorldEvent } from '../data/types'
import { featureAt, loadJSON } from '../lib/geo'
import { mixAt, shownIndex } from '../map/territory'
import { Icon } from './Icon'
import { portraits } from '../data/portraits'
import { sceneByEventId } from '../data/scenes'

const KIND_LABEL: Record<string, string> = {
  battle: '战役',
  political: '政局',
  capital: '都城',
  founding: '立国',
  uprising: '起义',
  diplomacy: '外交',
  institution: '制度',
  law: '法律',
  economy: '经济',
  science: '科技',
  culture: '文化',
  society: '社会',
}

export default function Panel({ onInvite, onPlayLine, onScene }: { onInvite: (id: string) => void; onPlayLine: (id: string) => void; onScene: (id: string) => void }) {
  const panel = useStore((s) => s.panel)
  const mode = useStore((s) => s.mode)
  const hold = useStore(s => s.hold)
  const show = panel && (mode === 'explore' || mode === 'guide' && hold) && panelExists(panel)
  const key = panel ? `${panel.kind}-${'id' in panel ? panel.id : panel.name}` : 'none'

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setState({ panel: null, hold: false })
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.aside
          key={key}
          className="panel"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 16 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <button className="panel-close" onClick={() => setState({ panel: null, hold: false })} aria-label={mode === 'guide' ? '关闭详情，继续讲述' : '关闭'}>
            <Icon name="close" />
          </button>
          <div className="panel-scroll">
            <PanelBody panel={panel} onInvite={onInvite} onPlayLine={onPlayLine} onScene={onScene} />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function panelExists(p: NonNullable<PanelT>) {
  switch (p.kind) {
    case 'event':
      return eventById.has(p.id)
    case 'world':
      return worldById.has(p.id)
    case 'city':
      return cityById.has(p.id)
    case 'person':
      return personById.has(p.id)
    case 'line':
      return lineById.has(p.id)
    case 'place':
      return true
  }
}

function PanelBody({ panel, onInvite, onPlayLine, onScene }: { panel: NonNullable<PanelT>; onInvite: (id: string) => void; onPlayLine: (id: string) => void; onScene: (id: string) => void }) {
  switch (panel.kind) {
    case 'event': {
      const e = eventById.get(panel.id)
      return e ? <EventBody e={e} onScene={onScene} /> : null
    }
    case 'world': {
      const w = worldById.get(panel.id)
      return w ? <WorldBody w={w} /> : null
    }
    case 'city': {
      const c = cityById.get(panel.id)
      return c ? <CityBody c={c} /> : null
    }
    case 'person': {
      const p = personById.get(panel.id)
      return p ? <PersonBody p={p} onInvite={onInvite} /> : null
    }
    case 'line': {
      const l = lineById.get(panel.id)
      return l ? <LineBody l={l} onPlay={onPlayLine} /> : null
    }
    case 'place':
      return <PlaceBody name={panel.name} lng={panel.lng} lat={panel.lat} />
  }
}

const GROUP: Record<string, 'war' | 'polity' | 'civic' | 'culture'> = {
  battle: 'war',
  uprising: 'polity',
  political: 'polity',
  founding: 'polity',
  capital: 'polity',
  diplomacy: 'polity',
  institution: 'civic',
  law: 'civic',
  economy: 'civic',
  society: 'civic',
  science: 'culture',
  culture: 'culture',
}

function dateText(e: HistEvent) {
  return `${e.year} 年${e.month ? ` ${e.month} 月` : ''}${e.endYear && e.endYear !== e.year ? ` — ${e.endYear} 年` : ''}`
}

let replayTimer = 0
let replayFlight = 0

/** Replay the telling: the approach, the event itself, then the result. */
function replay(e: HistEvent) {
  const { openAt, closeAt } = eventBounds(e)
  const years = Math.max(0.8, closeAt - openAt)
  jumpYear(openAt)
  window.clearTimeout(replayTimer)
  replayTimer = window.setTimeout(() => {
    void animateYear(closeAt, Math.min(8000, Math.max(4200, years * 2800)))
    replayFlight = activeFlight()
  }, 50)
}

function EventBody({ e, onScene }: { e: HistEvent; onScene: (id: string) => void }) {
  useEffect(() => {
    flyTo([e.lng, e.lat], e.routes?.length ? 5.4 : 6, 1800)
    if (getState().mode === 'explore') replay(e)
    return () => {
      window.clearTimeout(replayTimer)
      if (replayFlight && activeFlight() === replayFlight) stopYearAnimation()
      replayFlight = 0
    }
  }, [e])
  const group = GROUP[e.kind] ?? 'polity'
  return (
    <article className={`card ec ec-${group} ev-${e.kind}`}>
      <header className="ec-hero">
        <span className="ec-icon" dangerouslySetInnerHTML={{ __html: iconSvg(e.kind, 26) }} />
        <div className="ec-hero-text">
          <span className="ec-kicker">
            {KIND_LABEL[e.kind] ?? '事件'} · {dateText(e)}
          </span>
          <h2>{e.name}</h2>
          <Verdict brief={briefById.get(e.id)} />
          <span className="ec-place">
            <Icon name="pin" size={13} /> {e.place}
            {e.placeModern && <em> · 今{e.placeModern}</em>}
          </span>
        </div>
      </header>
      {sceneByEventId.has(e.id) && <button className="cta" onClick={() => onScene(sceneByEventId.get(e.id)!.id)}><Icon name="play" />走进这个故事 · 5 段</button>}
      {group === 'war' && <WarBody e={e} />}
      {group === 'polity' && <PolityBody e={e} />}
      {group === 'civic' && <CivicBody e={e} />}
      {group === 'culture' && <CultureBody e={e} />}
      {e.note && (
        <section className="ec-fiction">
          <h5>{group === 'war' || group === 'polity' ? '演义与史实' : '说明'}</h5>
          <p>{e.note}</p>
        </section>
      )}
      <Sources list={e.sources} />
    </article>
  )
}

function Party({ ids, win }: { ids: string[]; win: string[] }) {
  const won = win.length > 0 && ids.every((id) => win.includes(id))
  const lost = win.length > 0 && ids.every((id) => !win.includes(id))
  return (
    <span className="ec-party">
      {ids.map((id) => (
        <span key={id} className="ec-side" style={{ '--c': factionColor(id) } as React.CSSProperties}>
          {factionShort(id)}
        </span>
      ))}
      {won && <span className="ev-tag win">胜</span>}
      {lost && <span className="ev-tag loss">败</span>}
    </span>
  )
}

function Verdict({ brief }: { brief?: EventBrief }) {
  if (!brief) return null
  const win = brief.win ?? []
  return (
    <div className="ec-verdict">
      {brief.a?.length && brief.b?.length ? (
        <div className="ec-sides">
          <Party ids={brief.a} win={win} />
          <span className="ec-vs">对</span>
          <Party ids={brief.b} win={win} />
        </div>
      ) : null}
      <p className="ec-verdict-line">{brief.line}</p>
    </div>
  )
}

function WarBody({ e }: { e: HistEvent }) {
  return (
    <>
      {e.routes && e.routes.length > 0 && (
        <ul className="ec-routes">
          {e.routes.map((r) => (
            <li key={r.label} style={{ '--c': factionColor(r.side) } as React.CSSProperties}>
              <i />
              {r.label}
            </li>
          ))}
        </ul>
      )}
      <button className="ec-replay" onClick={() => replay(e)}>
        <Icon name="play" size={14} /> 在地图上重播这场战役
      </button>
      <section className="ec-block">
        <h5>经过</h5>
        <p className="lead">{e.summary}</p>
      </section>
      {e.geography && (
        <section className="ec-terrain">
          <h5>地形如何左右战局</h5>
          <p>{e.geography}</p>
        </section>
      )}
      {e.outcome && (
        <section className="ec-outcome">
          <h5>结果</h5>
          <p>{e.outcome}</p>
        </section>
      )}
    </>
  )
}

function PolityBody({ e }: { e: HistEvent }) {
  return (
    <>
      {e.participants.length > 0 && (
        <div className="ec-actors">
          <span className="ec-label">相关势力</span>
          {e.participants.map((p) => (
            <span key={p} className="chip" style={{ '--c': factionColor(p) } as React.CSSProperties}>
              {factionName(p)}
            </span>
          ))}
        </div>
      )}
      <p className="lead ec-seal-lead">{e.summary}</p>
      {e.outcome && (
        <section className="ec-change">
          <h5>它改变了什么</h5>
          <p>{e.outcome}</p>
        </section>
      )}
      {e.geography && (
        <section className="note note-geo">
          <h5>为什么在这里</h5>
          <p>{e.geography}</p>
        </section>
      )}
      {e.routes && e.routes.length > 0 && (
        <button className="ec-replay" onClick={() => replay(e)}>
          <Icon name="play" size={14} /> 在地图上重播
        </button>
      )}
    </>
  )
}

function CivicBody({ e }: { e: HistEvent }) {
  return (
    <>
      <p className="lead">{e.summary}</p>
      {e.thenVsNow && (
        <section className="ec-compare">
          <div className="ec-compare-head">
            <span>那时</span>
            <span className="ec-compare-arrow" aria-hidden>
              ⟶
            </span>
            <span>今天</span>
          </div>
          <p>{e.thenVsNow}</p>
        </section>
      )}
      <PeopleChips names={e.people} />
    </>
  )
}

function CultureBody({ e }: { e: HistEvent }) {
  return (
    <>
      <PeopleChips names={e.people} title="与之相关的人" />
      <section className="ec-achieve">
        <h5>{e.kind === 'science' ? '这项发明 / 发现' : '这件作品 / 这股风气'}</h5>
        <p>{e.summary}</p>
      </section>
      {e.thenVsNow && (
        <section className="note note-now">
          <h5>今天的回响</h5>
          <p>{e.thenVsNow}</p>
        </section>
      )}
    </>
  )
}

function PeopleChips({ names, title = '相关人物' }: { names?: string[]; title?: string }) {
  if (!names?.length) return null
  const byName = new Map([...personById.values()].map((p) => [p.name, p]))
  return (
    <div className="ec-actors">
      <span className="ec-label">{title}</span>
      {names.map((n) => {
        const p = byName.get(n)
        return p ? (
          <button key={n} className="chip chip-person" onClick={() => setState({ panel: { kind: 'person', id: p.id } })}>
            {n}
          </button>
        ) : (
          <span key={n} className="chip chip-plain">
            {n}
          </span>
        )
      })}
    </div>
  )
}

function WorldBody({ w }: { w: WorldEvent }) {
  return (
    <article className="card">
      <div className="card-kicker">
        <span className="tag tag-world">世界</span>
        <span>
          {w.year}
          {w.endYear && w.endYear !== w.year ? ` — ${w.endYear}` : ''} 年 · {w.region}
        </span>
      </div>
      <h2>{w.name}</h2>
      <MiniMap w={w} />
      <p className="lead">{w.summary}</p>
      <section className="note note-now">
        <h5>同一时刻的中国</h5>
        <p>{w.chinaLink}</p>
      </section>
      <Sources list={w.sources} />
    </article>
  )
}

function MiniMap({ w }: { w: WorldEvent }) {
  const ref = useRef<HTMLDivElement>(null)
  const theme = useStore((s) => s.theme)
  useEffect(() => {
    const dark = theme === 'dark'
    const m = new MapLibre({
      container: ref.current!,
      interactive: false,
      attributionControl: false,
      style: {
        version: 8,
        sources: { land: { type: 'geojson', data: `${import.meta.env.BASE_URL}data/world-land.geojson` } },
        layers: [
          { id: 'bg', type: 'background', paint: { 'background-color': dark ? '#0d1318' : '#dce5ea' } },
          { id: 'land', type: 'fill', source: 'land', paint: { 'fill-color': dark ? '#232a31' : '#f1ece2' } },
          { id: 'edge', type: 'line', source: 'land', paint: { 'line-color': dark ? '#3a434d' : '#bfb6a4', 'line-width': 0.7 } },
        ],
      },
      bounds: w.bbox,
      fitBoundsOptions: { padding: 12 },
    })
    for (const f of w.features) new Marker({ element: mini(f.name, f.lng === w.lng && f.lat === w.lat) }).setLngLat([f.lng, f.lat]).addTo(m)
    if (!w.features.some((f) => f.lng === w.lng && f.lat === w.lat)) new Marker({ element: mini(w.place, true) }).setLngLat([w.lng, w.lat]).addTo(m)
    return () => m.remove()
  }, [w, theme])
  return <div ref={ref} className="minimap" />
}

function mini(name: string, main: boolean) {
  const n = document.createElement('div')
  n.className = `mini-mk${main ? ' main' : ''}`
  n.innerHTML = `<i></i><span></span>`
  n.querySelector('span')!.textContent = name
  return n
}

function CityBody({ c }: { c: City }) {
  const year = useStore((s) => s.year)
  const nm = cityNameAt(c, year)
  const [tab, setTab] = useState<'now' | 'life'>('now')
  const uniq = c.names.filter((n, i, a) => a.findIndex((x) => x.name === n.name && x.from === n.from) === i)
  useEffect(() => {
    flyTo([c.lng, c.lat], 6.4, 1600)
  }, [c])
  return (
    <article className="card">
      <div className="card-kicker">
        <span className="tag tag-city">城市</span>
        <span>今{c.modern}</span>
      </div>
      <h2>
        {nm?.name ?? c.modern}
        {nm?.capitalOf && <small className="capital-of">{nm.capitalOf}都城</small>}
      </h2>
      <div className="namestrip">
        {uniq.map((n) => (
          <button
            key={`${n.name}-${n.from}`}
            className={`ns${nm && nm.name === n.name && nm.from === n.from ? ' on' : ''}`}
            title={n.note}
            onClick={() => {
              const target = Math.max(150, Math.min(300, (Math.max(n.from, 150) + Math.min(n.to, 300)) / 2))
              if (n.to >= 150 && n.from <= 300) animateYear(target, 900)
            }}
          >
            <b>{n.name}</b>
            <span>
              {fmtY(n.from)}—{n.to >= 2026 ? '今' : fmtY(n.to)}
            </span>
          </button>
        ))}
      </div>
      <div className="tabs">
        <button className={tab === 'now' ? 'on' : ''} onClick={() => setTab('now')}>
          三国时的它
        </button>
        <button className={tab === 'life' ? 'on' : ''} onClick={() => setTab('life')}>
          这座城的一生
        </button>
      </div>
      {tab === 'now' ? (
        <>
          <p className="lead">{c.threeKingdoms}</p>
          <section className="note note-geo">
            <h5>为什么在这里</h5>
            <p>{c.whyHere}</p>
          </section>
          <section className="note note-now">
            <h5>今天的它</h5>
            <p>{c.today}</p>
          </section>
        </>
      ) : (
        <>
          <ol className="life">
            {c.timeline.map((t, i) => (
              <li key={i}>
                <span className="life-y">{fmtY(t.year)}</span>
                <div>
                  <b>{t.title}</b>
                  <p>{t.text}</p>
                </div>
              </li>
            ))}
          </ol>
          {c.people.length > 0 && (
            <section className="note">
              <h5>与它有关的人</h5>
              <ul className="people">
                {c.people.map((p) => (
                  <li key={p.name}>
                    <b>{p.name}</b> {p.text}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
      <Sources list={c.sources} />
    </article>
  )
}

function fmtY(y: number) {
  return y < 0 ? `前${-y}` : String(y)
}

function PersonBody({ p, onInvite }: { p: Person; onInvite: (id: string) => void }) {
  const year = useStore((s) => s.year)
  const loc = personLocationAt(p, year)
  return (
    <article className="card">
      <div className="card-kicker">
        <span className="tag tag-person">{p.fictional ? '虚构人物 · 依史实设计' : p.category}</span>
        <span>
          {p.birth ?? '?'}—{p.death ?? '?'}
        </span>
      </div>
      <h2>
        {p.name}
        {p.courtesy && <small className="courtesy">字{p.courtesy}</small>}
      </h2>
      {portraits[p.id] && <><img className="person-portrait" src={portraits[p.id].src} alt={`${p.name}人物意象插画`} /><p className="muted">人物意象 · 插画，不代表真实容貌</p></>}
      {loc && (
        <p className="card-place">
          <Icon name="pin" size={14} /> 此时在{loc.place} · {loc.role}
        </p>
      )}
      <p className="lead">{p.identity}</p>
      {loc ? (
        <button className="cta" onClick={() => onInvite(p.id)}>
          <Icon name="travel" />
          邀请{p.name}来到今天
        </button>
      ) : (
        <p className="muted">这一年他不在地图上。拖动时间轴到他生活的年代，就能邀请他。</p>
      )}
      <section className="note">
        <h5>他可能会问你</h5>
        <ul className="qs">
          {p.questions.slice(0, 3).map((q) => (
            <li key={q.q}>
              <span className="q-domain">{q.domain}</span>
              {q.q}
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}

function LineBody({ l, onPlay }: { l: StoryLine; onPlay: (id: string) => void }) {
  useEffect(() => {
    const layers = getState().layers
    setState({ layers: { ...layers, lines: { ...layers.lines, [l.id]: true } } })
  }, [l])
  return (
    <article className="card">
      <div className="card-kicker">
        <span className="tag tag-line" style={{ '--c': l.color } as React.CSSProperties}>
          一条线的故事
        </span>
      </div>
      <h2>{l.name}</h2>
      <p className="lead">{l.summary}</p>
      <button className="cta" onClick={() => onPlay(l.id)}>
        <Icon name="play" />
        看这条线的故事 · {l.story.length} 段
      </button>
    </article>
  )
}

function PlaceBody({ name, lng, lat }: { name: string; lng: number; lat: number }) {
  const place = usePlaceInfo([lng, lat])
  return (
    <article className="card">
      <div className="card-kicker">
        <span className="tag tag-city">地点</span>
      </div>
      <h2>{name}</h2>
      <PlaceInfo info={place.info} error={place.error} />
    </article>
  )
}

export interface PlaceInfoT {
  commandery?: string
  province?: string
  faction?: string
  strength?: string
  nearby: HistEvent[]
}

export function usePlaceInfo(pt: [number, number] | null): { info: PlaceInfoT | null; error: boolean } {
  const year = useStore((s) => s.year)
  const iy = Math.floor(year)
  const { index, next, mix } = mixAt(year)
  const ky = keyframes.length ? keyframes[shownIndex(index, next, mix)].id : ''
  const [info, setInfo] = useState<PlaceInfoT | null>(null)
  const [error, setError] = useState(false)
  const key = pt ? `${pt[0]},${pt[1]}` : ''
  useEffect(() => {
    if (!pt || !ky) {
      setInfo(null)
      setError(false)
      return
    }
    let alive = true
    setError(false)
    Promise.all([loadJSON(`data/territory/${ky}.json`), loadJSON(`data/cells/${ky}.json`)])
      .then(([terr, cells]) => {
        if (!alive) return
        const fills = { ...terr, features: terr.features.filter((f) => f.properties?.k !== 'line') }
        const t = featureAt<{ f: string; s: string }>(fills, pt)
        const c = featureAt<{ name: string; province: string }>(cells, pt)
        setInfo({ faction: t?.f, strength: t?.s, commandery: c?.name, province: c?.province, nearby: [] })
      })
      .catch(() => {
        if (alive) setError(true)
      })
    return () => {
      alive = false
    }
  }, [key, ky])
  if (!info || !pt) return { info, error }
  return { info: { ...info, nearby: nearbyEvents(pt, iy) }, error }
}

function nearbyEvents(pt: [number, number], year: number) {
  return events
    .filter((e) => Math.abs(e.year - year) <= 6 && distanceKm(pt, [e.lng, e.lat]) < 160)
    .sort((a, b) => Math.abs(a.year - year) - Math.abs(b.year - year))
    .slice(0, 3)
}

const STRENGTH_TEXT: Record<string, string> = { core: '', weak: '（控制薄弱）', contested: '（多方争夺）' }

export function PlaceInfo({ info, error }: { info: PlaceInfoT | null; error?: boolean }) {
  if (error) return <p className="muted">这里的归属暂时查不到。</p>
  if (!info) return <p className="muted">正在查看……</p>
  return (
    <div className="placeinfo">
      <p>
        {info.commandery ? (
          <>
            此时属于<b>{info.province}</b>
            <b>{info.commandery}</b>
          </>
        ) : (
          '此时这里不在中原王朝的郡县之内'
        )}
        {info.faction && (
          <>
            ，由
            <b style={{ color: factionColor(info.faction) }}>{factionName(info.faction)}</b>
            控制{STRENGTH_TEXT[info.strength ?? 'core']}
          </>
        )}
        。
      </p>
      {info.nearby.length > 0 && (
        <ul className="nearby">
          {info.nearby.map((e) => (
            <li key={e.id}>
              <button
                onClick={() => {
                  setState({ panel: { kind: 'event', id: e.id } })
                  animateYear(eventTime(e), 900)
                }}
              >
                <span>{e.year}</span>
                {e.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Sources({ list }: { list: string[] }) {
  if (!list?.length) return null
  return <p className="sources">资料：{list.join('；')}</p>
}
