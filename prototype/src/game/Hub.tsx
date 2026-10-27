import { useEffect } from 'react'
import { setState } from '../lib/store'
import { flyTo } from '../map/mapRef'
import { savedRoam } from './saves'
import './game.css'

export default function Hub() {
  const roam = savedRoam()

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
