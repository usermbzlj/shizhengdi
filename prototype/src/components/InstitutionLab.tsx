import { useEffect, useState } from 'react'
import './institution-lab.css'

type Stage = 'beginning' | 'later'
type Basis = 'ability' | 'local' | 'family'
type Actor = 'person' | 'assessor' | 'court' | 'appeal'

interface ReadingSelection { stage: Stage; basis: Basis; actor: Actor }
const readingKey = 'szd.institution-lab.reading.v1'
const defaultReading: ReadingSelection = { stage: 'beginning', basis: 'ability', actor: 'assessor' }

function restoreReading(): ReadingSelection {
  try {
    const raw: unknown = JSON.parse(sessionStorage.getItem(readingKey) ?? 'null')
    if (!raw || typeof raw !== 'object') return defaultReading
    const saved = raw as Record<string, unknown>
    return {
      stage: saved.stage === 'beginning' || saved.stage === 'later' ? saved.stage : defaultReading.stage,
      basis: saved.basis === 'ability' || saved.basis === 'local' || saved.basis === 'family' ? saved.basis : defaultReading.basis,
      actor: saved.actor === 'person' || saved.actor === 'assessor' || saved.actor === 'court' || saved.actor === 'appeal' ? saved.actor : defaultReading.actor,
    }
  } catch {
    return defaultReading
  }
}

const bases: { id: Basis; title: string; caption: string; mark: string }[] = [
  { id: 'ability', title: '才能与德行', caption: '看这个人做了什么', mark: '01' },
  { id: 'local', title: '地方评价', caption: '谁真正了解这个人', mark: '02' },
  { id: 'family', title: '家世影响', caption: '名字背后的门第', mark: '03' },
]

const observations: Record<Stage, Record<Basis, {
  heading: string; text: string; annotation: string; margin: string
}>> = {
  beginning: {
    ability: {
      heading: '先问，这个人是否值得任用',
      text: '九品是人物的品评等第，朝廷据此选人。卫瓘后来回顾，创制之初仍有乡里评议的余风，褒贬能够起到劝勉作用。',
      annotation: '这是西晋人对早期制度的回顾，不是保存下来的220年考核细则。',
      margin: '人物品评 ≠ 官职位次',
    },
    local: {
      heading: '离开乡里之后，谁还了解他',
      text: '战乱使士人流移，过去熟悉一个人的乡里关系也被打散。九品之制试图提供选用依据；地方评价如何进入朝廷，成了制度的重要问题。',
      annotation: '卫瓘用“人士流移，考详无地”说明这一背景。中正组织的成熟形态，不能全部倒写成220年的完整法令。',
      margin: '评价的依据，从哪里来',
    },
    family: {
      heading: '不能把后来的结果放进开头',
      text: '陈群提出九品官人法，并不等于220年的每一次评价已经只看家世。我们知道创制节点，却不能据后期批评，为初建时编出一份门第排名。',
      annotation: '《陈群传》记建法，没有留下全部创制条文。后来的门第化，应放到下一个历史阶段观察。',
      margin: '区分创制与变化',
    },
  },
  later: {
    ability: {
      heading: '等第整齐，才能却未必被看见',
      text: '刘毅批评，有人并不细察才能，而依党利和好恶定高下。他还指出：官职各有不同需要，把人只分成九等，未必能用到合适的位置。',
      annotation: '这是刘毅在西晋的批评，提醒我们检查品评怎样实行；不是每个人的实际遭遇都能由一句话概括。',
      margin: '同一把尺，能量所有人吗',
    },
    local: {
      heading: '熟悉，可能成为偏好',
      text: '了解地方人物，有助于判断；亲近、流言和私情也可能改变判断。刘毅担忧，中正所知与不知，都可能让品评失去公平。',
      annotation: '评价权集中之后，还需要问：理由是否充分，受委屈的人能否提出异议。',
      margin: '谁来检查评价的理由',
    },
    family: {
      heading: '家世，逐渐压进了评价',
      text: '卫瓘说，制度后来逐渐“计资定品”；刘毅也指出，高等第偏向有势力的家族。人物的家世和地位，可能遮住了他本人的才能。',
      annotation: '这些是西晋人的批评和回顾。“上品无寒门”不能读成所有年代、所有品评都绝无例外。',
      margin: '家世并不是才能本身',
    },
  },
}

const actorNotes: Record<Stage, Record<Actor, { heading: string; text: string; question: string }>> = {
  beginning: {
    person: {
      heading: '一个人，先被怎样认识',
      text: '受评的士人并不直接决定自己的等第。他的言行与能力，经过别人了解、判断，才进入选用的依据。',
      question: '经历复杂的人，能被一行评语说清吗？',
    },
    assessor: {
      heading: '中正：掌握品评的那只手',
      text: '中正负责品评人物、分列等第。这里显示的是制度关系，没有虚构某位真实人物在220年得到的品级。',
      question: '评价者凭什么了解受评的人？',
    },
    court: {
      heading: '品评之后，还有选用',
      text: '人物等第进入朝廷选官的参考。品评等级与官职品级有联系，却不是同一个概念，也不是看到几品就自动授予几品官。',
      question: '评价人才与安排职位，是同一件事吗？',
    },
    appeal: {
      heading: '初建时，我们仍有不知道的地方',
      text: '现有核查材料没有提供一套完整的220年申诉程序。这里提出观察问题，不把后期批评改装成早期已经存在的制度条文。',
      question: '如果判断错了，谁能让它重新被看见？',
    },
  },
  later: {
    person: {
      heading: '等第，影响一个人的去路',
      text: '刘毅担心，品评偏向有势力的家族，守正而不善交游的人反而受困。评价的差别，可能影响进入仕途的机会。',
      question: '一个人的家世，应该代替他的所作所为吗？',
    },
    assessor: {
      heading: '评价权，也需要被约束',
      text: '刘毅批评中正能决定高下，却缺乏足够考核和约束。只把职位取名“中正”，并不能保证每次判断都公正。',
      question: '谁来评价评价者？',
    },
    court: {
      heading: '朝廷能否看见失真的评价',
      text: '中正的品评进入选用过程。如果依据已经偏斜，后面的选官也可能受影响。卫瓘、刘毅提出改制，但这些建议没有成为全面废止九品的结果。',
      question: '收到一份评语，是否就能相信它？',
    },
    appeal: {
      heading: '异议，能不能到达上面',
      text: '刘毅指出，限制申诉会堵住受委屈者的声音，放大评价者的权势。这条虚线表示史料提出的问题，不是一条已经考定的正式申诉流程。',
      question: '理由不能被检查，错误怎样被纠正？',
    },
  },
}

const sources = {
  chen: { title: '《三国志·陈群传》', url: 'https://zh.wikisource.org/wiki/三國志_(四庫全書本)/魏志/卷22' },
  wei: { title: '《晋书·卫瓘传》', url: 'https://zh.wikisource.org/wiki/晉書/卷036' },
  liu: { title: '《晋书·刘毅传》', url: 'https://zh.wikisource.org/wiki/晉書_(四庫全書本)/卷045' },
}

/** A clickable research desk; no simulated historical grades or invented personnel list. */
export default function InstitutionLab() {
  const [selection, setSelection] = useState<ReadingSelection>(restoreReading)
  const { stage, basis, actor } = selection
  const setStage = (value: Stage) => setSelection((current) => ({ ...current, stage: value }))
  const setBasis = (value: Basis) => setSelection((current) => ({ ...current, basis: value }))
  const setActor = (value: Actor) => setSelection((current) => ({ ...current, actor: value }))
  const [showEvidence, setShowEvidence] = useState(false)
  useEffect(() => {
    try {
      sessionStorage.setItem(readingKey, JSON.stringify(selection))
    } catch {
      // Storage can be unavailable; the research desk still works in memory.
    }
  }, [selection])
  const observation = observations[stage][basis]
  const actorNote = actorNotes[stage][actor]
  const selectedBasis = bases.find((item) => item.id === basis)!
  const isBeginning = stage === 'beginning'

  return (
    <section className="institution-lab" aria-label="九品中正互动研究台" data-stage={stage} data-basis={basis}>
      <header className="il-heading">
        <div>
          <p className="il-eyebrow">九品中正 · 文书研究台</p>
          <h2>谁来决定，<span>谁被看见。</span></h2>
          <p className="il-intro">不只看人才被分成几等，也看那把尺子握在谁的手里。</p>
        </div>
        <div className="il-stage-switch" role="group" aria-label="选择历史阶段">
          <button type="button" aria-pressed={isBeginning} onClick={() => setStage('beginning')}>
            <span>220年</span><small>初建</small>
          </button>
          <button type="button" aria-pressed={!isBeginning} onClick={() => setStage('later')}>
            <span>魏晋后期</span><small>转变</small>
          </button>
        </div>
      </header>

      <div className="il-desk">
        <aside className="il-lenses" aria-label="选择评价观察层">
          <p className="il-section-label">选一层，读这份评价</p>
          {bases.map((item) => (
            <button key={item.id} type="button" className="il-lens" aria-pressed={basis === item.id} onClick={() => setBasis(item.id)}>
              <span className="il-lens-mark" aria-hidden="true">{item.mark}</span>
              <span><strong>{item.title}</strong><small>{item.caption}</small></span>
              <span className="il-lens-dot" aria-hidden="true" />
            </button>
          ))}
          <p className="il-lens-foot">选一种评价依据，<br />观察人物怎样被认识。</p>
        </aside>

        <article className="il-document" aria-label="当前观察文书">
          <div className="il-document-edge" aria-hidden="true" />
          <div className="il-document-meta">
            <span>{isBeginning ? '创制 · 220年' : '回望 · 西晋人的批评'}</span>
            <span>制度关系示意</span>
          </div>
          <div className="il-document-title">
            <span className="il-seal" aria-hidden="true">品评</span>
            <div><p>人物品评与选用</p><h3>{selectedBasis.title}</h3></div>
          </div>
          <div className="il-layer-rule" aria-hidden="true"><span /><span /><span /></div>
          <div className="il-observation" aria-live="polite" aria-atomic="true">
            <p className="il-section-label">这层告诉我们</p>
            <h4>{observation.heading}</h4>
            <p className="il-document-body">{observation.text}</p>
            <p className="il-margin-note"><span aria-hidden="true">↳</span>{observation.margin}</p>
            <p className="il-document-note">{observation.annotation}</p>
          </div>
          <div className="il-record-line">
            <span>品评的依据</span><span>评价的人</span><span>选用的结果</span>
          </div>
          <p className="il-document-foot">制度关系示意 · 完整依据可在史料中查阅</p>
        </article>

        <section className="il-power" aria-label="谁评价谁">
          <div className="il-power-title"><p className="il-section-label">谁评价谁</p><span>点选关系</span></div>
          <div className="il-chain">
            <button type="button" className="il-actor" aria-pressed={actor === 'person'} onClick={() => setActor('person')}>
              <span className="il-actor-index" aria-hidden="true">一</span><strong>受评士人</strong><small>被了解、被品评</small>
            </button>
            <div className={`il-chain-link ${actor === 'assessor' || actor === 'person' ? 'is-active' : ''}`} aria-hidden="true"><span>品评</span><i /></div>
            <button type="button" className="il-actor" aria-pressed={actor === 'assessor'} onClick={() => setActor('assessor')}>
              <span className="il-actor-index" aria-hidden="true">二</span><strong>中正</strong><small>判断与分列等第</small>
            </button>
            <div className={`il-chain-link ${actor === 'court' ? 'is-active' : ''}`} aria-hidden="true"><span>选用参考</span><i /></div>
            <button type="button" className="il-actor" aria-pressed={actor === 'court'} onClick={() => setActor('court')}>
              <span className="il-actor-index" aria-hidden="true">三</span><strong>朝廷选官</strong><small>考量与任用</small>
            </button>
          </div>
          <button type="button" className="il-appeal" aria-pressed={actor === 'appeal'} onClick={() => setActor('appeal')}>
            <span className="il-appeal-path" aria-hidden="true" /><span>异议，能否被听见</span><span aria-hidden="true">↗</span>
          </button>
          <div className="il-actor-reading" aria-live="polite" aria-atomic="true">
            <h4>{actorNote.heading}</h4><p>{actorNote.text}</p><blockquote>{actorNote.question}</blockquote>
          </div>
        </section>
      </div>

      <footer className="il-evidence-bar">
        <p><span className="il-evidence-dot" aria-hidden="true" />{isBeginning ? '初建与后期变化，分开阅读' : '当前阅读西晋的回顾与批评'}</p>
        <button type="button" aria-expanded={showEvidence} aria-controls="institution-lab-evidence" onClick={() => setShowEvidence(!showEvidence)}>
          {showEvidence ? '收起史料与边界' : '打开史料与边界'}<span aria-hidden="true">{showEvidence ? '−' : '+'}</span>
        </button>
      </footer>
      {showEvidence && (
        <div className="il-evidence-panel" id="institution-lab-evidence">
          <div><h4>依据从哪里来</h4><p>陈群传确认创制节点；卫瓘传保存背景与后期变化的回顾；刘毅传提出偏私、约束与申诉的问题。</p><nav aria-label="九品制度原始史料">{Object.values(sources).map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}<span aria-hidden="true">↗</span></a>)}</nav></div>
          <div><h4>图示到哪里为止</h4><p>这是一幅教学关系图，没有真实人物的品级，也没有编造220年的完整考核或申诉程序。后期批评用于观察制度的变化，不证明早期每次选官已经只看门第。</p></div>
        </div>
      )}
    </section>
  )
}
