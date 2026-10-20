import { useEffect } from 'react'
import { setState } from '../lib/store'
import { flyTo } from '../map/mapRef'
import { savedGame, savedRoam } from './saves'
import { scenarioById, scenarios } from './scenarios'
import { sideOf } from './sides'
import './game.css'

export default function Hub() {
  const war = savedGame()
  const roam = savedRoam()
  const moments = scenarios.filter((s) => s.id !== 'sandbox')
  const sandbox = scenarioById.get('sandbox')!

  useEffect(() => {
    setState({ mode: 'game', panel: null, year: 208, target: 208 })
    const small = window.innerWidth < 640
    flyTo([111.5, 31.2], small ? 3.9 : 4.6, 2400)
  }, [])

  return (
    <div className="hub">
      <div className="hub-scroll">
        <header className="hub-head">
          <p>公元 184 — 280</p>
          <h1>这一回，你来。</h1>
        </header>

        <section className="hub-group">
          <h2>关键时刻</h2>
          <p className="hub-sub">真实的地形，真实的兵力。你坐到那个人的位置上。</p>
          <div className="hub-cards">
            {moments.map((sc) => (
              <article key={sc.id} className="hub-card">
                <span className="hub-when">{sc.when}</span>
                <h3>{sc.title}</h3>
                <p>{sc.hook}</p>
                <div className="hub-picks">
                  {sc.picks.map((p) => (
                    <a key={p.side} href={`?play=${sc.id}&side=${p.side}`} style={{ ['--c' as string]: sideOf(p.side).color }} title={p.blurb}>
                      当{p.who}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="hub-group">
          <h2>乱世沙盘</h2>
          <p className="hub-sub">{sandbox.when}，{sandbox.hook}</p>
          <div className="hub-cards wide">
            {sandbox.picks.map((p) => (
              <a key={p.side} className="hub-lord" href={`?play=sandbox&side=${p.side}`} style={{ ['--c' as string]: sideOf(p.side).color }}>
                <b>{p.who}</b>
                <span>{p.blurb}</span>
              </a>
            ))}
          </div>
          {war && (
            <a className="hub-resume" href={`?play=${war.scenario}&side=${war.state.player}&resume=1`}>
              接着上次：{sideOf(war.state.player).name}，{war.state.year} 年
            </a>
          )}
        </section>

        <section className="hub-group two">
          <article className="hub-card tall">
            <span className="hub-when">195 年起</span>
            <h3>穿越者</h3>
            <p>你醒在汉末的襄阳城外。去找刘备、曹操、诸葛亮……走路要时间，他们不会等你。</p>
            <div className="hub-picks">
              <a href="?roam" style={{ ['--c' as string]: '#ffcf7a' }}>
                出发
              </a>
              {roam && roam.year > 195.2 && (
                <a href="?roam&resume=1" style={{ ['--c' as string]: '#ffcf7a' }}>
                  接着走（{Math.floor(roam.year)} 年）
                </a>
              )}
            </div>
          </article>
          <article className="hub-card tall">
            <span className="hub-when">181 — 234</span>
            <h3>一个十三岁的男孩</h3>
            <p>跟着他从山东走到五丈原。拖着他走路，按住让时间流过去。</p>
            <div className="hub-picks">
              <a href="?life" style={{ ['--c' as string]: '#c8b8ff' }}>
                跟他走
              </a>
            </div>
          </article>
        </section>

        <footer className="hub-foot">
          <a href="?atlas">地图资料馆</a>
          <span>九十六年里每一年的疆域、事件和人物</span>
        </footer>
      </div>
    </div>
  )
}
