import { useEffect, useId, useState } from 'react';
import './battle-lab.css';

type SceneId = 'chibi' | 'yinping';
type RecordTab = 'read' | 'source';
type LabProps = { sceneId: SceneId; onLocate?: (point: [number, number], zoom: number) => void };
type Observation = {
  id: string; name: string; x: number; y: number; point: [number, number]; zoom: number;
  terrain: string; action: string; boundary: string;
};

const CHIBI_POINTS: Observation[] = [
  { id: 'jiangling', name: '江陵', x: 197, y: 260, point: [112.19, 30.35], zoom: 6,
    terrain: '沿江的荆州重镇。长江在这里既是屏障，也是通向下游的运输通道。',
    action: '曹操进入荆州并接收水军，南下者已不只是站在岸上。战后仍留曹仁守江陵。',
    boundary: '这是沿江关系的观察点，不是曹军船队实际停泊点。' },
  { id: 'water', name: '江面', x: 435, y: 382, point: [113.15, 30.09], zoom: 5.8,
    terrain: '陆上行军来到江上，船只、航道与作战经验都进入决策。河流会阻隔，也会运送军队。',
    action: '周瑜把水战能力、远途疲劳与军队状态放进判断。史书记下曹军已有疾病。',
    boundary: '地图不能还原当年的水位、古河岸或舰队阵型。江面图形用来解释作战环境。' },
  { id: 'chibi', name: '赤壁一带', x: 608, y: 450, point: [113.627, 29.874], zoom: 6.3,
    terrain: '故事定位在今湖北赤壁一带。江面、两岸营地与船舰相互关联，使火攻产生连锁影响。',
    action: '黄盖诈降，让火船接近；船舰首尾相接与强风使火势蔓延。它发生在联盟与作战准备之后。',
    boundary: '战场存在地望讨论。示意点、火船和船队不能当作精确考古复原。' },
  { id: 'xiakou', name: '夏口', x: 800, y: 175, point: [114.3, 30.56], zoom: 5.8,
    terrain: '沿江看夏口与赤壁：地点串起了集结、迎敌和退进的方向，而不是一条直线上的军力数字。',
    action: '孙权决定抵抗，周瑜、程普率军，与刘备合力迎战。不同目标的两方面对共同的对手。',
    boundary: '联盟图解释各方关系，不表示孙权本人在此指挥或两军精确驻地。' },
];

const YINPING_POINTS: Observation[] = [
  { id: 'jiange', name: '剑阁', x: 748, y: 235, point: [105.57, 32.2], zoom: 6.2,
    terrain: '山地把正面通道收束在关口。进攻者难以展开，防守者可以集中力量。',
    action: '姜维退守剑阁，钟会正面进攻未能攻下。沿大路推进也有受阻与补给压力。',
    boundary: '守住主路，不等于所有通向腹地的方向都已封闭。正面箭头止于关口。' },
  { id: 'yinping', name: '阴平', x: 392, y: 77, point: [104.68, 32.94], zoom: 5.8,
    terrain: '阴平在剑阁以西。绕行需要离开便于大军通行的常规道路，进入难走的山地。',
    action: '邓艾选择阴平小路，凿山通道、搭建桥阁，转运粮食几乎耗尽。隐蔽与补给困难同时出现。',
    boundary: '山路不是地图上的直线。古里程不直接换算成现代公路距离。' },
  { id: 'jiangyou', name: '古江油', x: 420, y: 235, point: [104.75, 32.2], zoom: 6.1,
    terrain: '在今平武江油关一带，位于山地通道的出口。它不是今天江油市区的位置。',
    action: '邓艾抵达江油，守将马邈投降。越过险路后，军队才进入下一阶段，仍需要继续前进与作战。',
    boundary: '以古今同名的区别理解地点。节点是地区定位，不主张精确复原古城墙。' },
  { id: 'mianzhu', name: '古绵竹', x: 280, y: 444, point: [104.4, 31.22], zoom: 6,
    terrain: '古绵竹在今德阳黄许地区，处在通向成都的北部通道上，不是现代绵竹市中心。',
    action: '诸葛瞻在绵竹迎战，邓艾击败守军。绕过剑阁并不等于兵不血刃地直达成都。',
    boundary: '古城地望据黄许考古遗址说明。示意路径不是每一天的行军轨迹。' },
  { id: 'chengdu', name: '成都', x: 148, y: 563, point: [104.07, 30.66], zoom: 6,
    terrain: '剑阁的侧后已经受到威胁。把北面的关口与成都放在同一幅图上，才能看出两条进攻方向。',
    action: '刘禅请降，蜀汉在263年灭亡。这是魏灭蜀；吴仍存在，晋尚未代魏。',
    boundary: '成都的结果涉及路线、补给、防守和政治选择，不能简化成山险失效或单人天才。' },
];

const CAUSES = [
  { id: 'alliance', title: '联盟', number: '01', text: '孙权与刘备合力迎战。先有共同抵抗的选择，才有后来的作战部署。' },
  { id: 'water', title: '水战适应', number: '02', text: '船只不等于江上作战能力。作战经验与军队适应影响了优势能否兑现。' },
  { id: 'illness', title: '军队状态', number: '03', text: '本传记下曹军已有疾病。它是战局的一部分，史料没有给出可计算的疫病损失比例。' },
  { id: 'fire', title: '火攻条件', number: '04', text: '诈降让火船接近，船舰相接让火势扩散，强风放大破坏。条件相连，而非一阵风单独决定。' },
] as const;
const STAGES = [
  { title: '正面对峙', text: '先看剑阁：钟会受到姜维防守的阻挡。', point: 'jiange' },
  { title: '险路绕行', text: '从阴平到古江油，隐蔽、险阻与补给困难一起增加。', point: 'yinping' },
  { title: '腹地交战', text: '江油降后，仍要在古绵竹突破新的抵抗。', point: 'mianzhu' },
  { title: '成都请降', text: '侧后威胁进入成都。蜀汉灭亡，吴仍存在。', point: 'chengdu' },
];

export function BattleLab(props: LabProps) {
  return props.sceneId === 'chibi' ? <ChibiLab key="chibi" {...props} /> : <YinpingLab key="yinping" {...props} />;
}

export default BattleLab;

function sessionChoice<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try { const value = sessionStorage.getItem(`szd-lab-${key}`); return allowed.includes(value as T) ? value as T : fallback; }
  catch { return fallback; }
}

function saveSession(values: Record<string, string | number>) {
  try { for (const [key, value] of Object.entries(values)) sessionStorage.setItem(`szd-lab-${key}`, String(value)); }
  catch { /* Observation works even when browser storage is unavailable. */ }
}

function sessionStage() {
  try { const value = Number(sessionStorage.getItem('szd-lab-yinping-stage')); return Number.isInteger(value) && value >= 0 && value < STAGES.length ? value : 0; }
  catch { return 0; }
}

function ChibiLab({ onLocate }: LabProps) {
  const [view, setView] = useState<'river' | 'formation' | 'fire'>(() => sessionChoice('chibi-view', ['river', 'formation', 'fire'], 'river'));
  const [selected, setSelected] = useState(() => sessionChoice('chibi-point', CHIBI_POINTS.map(p => p.id), 'water'));
  const [cause, setCause] = useState<(typeof CAUSES)[number]['id']>(() => sessionChoice('chibi-cause', CAUSES.map(c => c.id), 'water'));
  const [recordTab, setRecordTab] = useState<RecordTab>('read');
  const point = CHIBI_POINTS.find(p => p.id === selected)!;
  const causeInfo = CAUSES.find(c => c.id === cause)!;
  const uid = useId().replace(/:/g, '');
  useEffect(() => { saveSession({ 'chibi-view': view, 'chibi-point': selected, 'chibi-cause': cause }); }, [view, selected, cause]);
  const changeView = (v: typeof view) => { setView(v); setCause(v === 'formation' ? 'alliance' : v === 'fire' ? 'fire' : 'water'); };
  const selectPoint = (id: string) => { setSelected(id); setRecordTab('read'); };
  return <section className="battle-lab battle-lab--chibi" aria-label="赤壁战役研究台">
    <div className="battle-lab-workspace">
      <div className="battle-lab-toolbar"><div><span className="battle-lab-overline">208年冬 / 长江中游</span><h2>把战局拆开看</h2></div><div className="battle-lab-switch" role="group" aria-label="赤壁观察视角">{([{ id: 'river', label: '江面' }, { id: 'formation', label: '对阵' }, { id: 'fire', label: '火攻' }] as const).map(v => <button key={v.id} type="button" aria-pressed={view === v.id} onClick={() => changeView(v.id)}>{v.label}</button>)}</div></div>
      <div className={`battle-lab-map battle-lab-map--${view}`}>
        <svg viewBox="0 0 1000 640" preserveAspectRatio="none" className="battle-lab-atlas" role="img" aria-label={`长江中游关系示意，当前观察${view === 'river' ? '江面与作战环境' : view === 'formation' ? '南下与联盟' : '火攻的多个条件'}`}>
          <AtlasDefs uid={uid} />
          <rect width="1000" height="640" fill={`url(#${uid}-paper)`} />
          <path d="M0 30Q160 75 270 25T510 58T750 23T1000 50M-20 80Q145 125 285 72T510 100T750 77T1020 94M-20 130Q110 160 210 138T450 168T660 123T990 150" className="battle-lab-contour" />
          <path d="M35 120 70 72 112 140M92 129 130 76 181 161M275 119 322 71 379 159M881 418 923 377 970 441M15 502 53 461 104 534M153 571 196 511 244 583" className="battle-lab-relief" />
          <path d="M-35 211C96 194 98 246 197 260S394 390 524 421S636 483 695 405S765 214 800 175S885 218 1035 233" className="battle-lab-river-bank" />
          <path d="M-35 211C96 194 98 246 197 260S394 390 524 421S636 483 695 405S765 214 800 175S885 218 1035 233" className="battle-lab-river" />
          <path d="M-35 211C96 194 98 246 197 260S394 390 524 421S636 483 695 405S765 214 800 175S885 218 1035 233" className="battle-lab-river-thread" />
          <g className="battle-lab-water-marks"><path d="M265 286q19-8 36 7M337 333q23-7 39 9M493 402q22-4 42 9M699 372q14-9 19-24M763 239q7-17 15-27" /></g>
          {(view === 'formation' || cause === 'alliance') && <g className="battle-lab-reveal"><path d="M197 260C316 308 437 412 569 432" className="battle-lab-army battle-lab-army--red" markerEnd={`url(#${uid}-red-arrow)`} /><path d="M800 175C741 263 733 357 647 411" className="battle-lab-army battle-lab-army--green" markerEnd={`url(#${uid}-green-arrow)`} /></g>}
          {view === 'river' && <g className="battle-lab-reveal"><Boat x={336} y={329} rotate={30} /><Boat x={520} y={422} rotate={17} /><Boat x={759} y={258} rotate={-64} /></g>}
          {view === 'fire' && <g className="battle-lab-reveal"><path d="M474 411Q501 418 530 429" className="battle-lab-connection" /><Boat x={473} y={411} rotate={19} /><Boat x={511} y={423} rotate={19} /><Boat x={549} y={436} rotate={19} /><Boat x={658} y={386} rotate={-40} fire /><path d="M645 401Q621 425 582 433" className="battle-lab-fire-path" markerEnd={`url(#${uid}-red-arrow)`} /><g className="battle-lab-fire-glow"><ellipse cx="529" cy="426" rx="73" ry="42" /></g></g>}
          {CHIBI_POINTS.map(p => <g key={p.id}><circle cx={p.x} cy={p.y} r={selected === p.id ? 28 : 10} className={selected === p.id ? 'battle-lab-selected-ring' : 'battle-lab-pin-dot'} /><circle cx={p.x} cy={p.y} r="4" className="battle-lab-pin-core" /></g>)}
        </svg>
        <span className="battle-lab-region battle-lab-region--north">荆州</span><span className="battle-lab-region battle-lab-region--east">江东一侧</span><span className="battle-lab-river-name">长江</span>
        {view === 'formation' && <><span className="battle-lab-force battle-lab-force--cao">曹操一方<span>沿江东下</span></span><span className="battle-lab-force battle-lab-force--allies">孙刘联军<span>共同迎战</span></span></>}
        {view === 'fire' && <span className="battle-lab-map-callout">诈降接近 <i>→</i> 船舰相接 <i>→</i> 强风助燃</span>}
        {cause === 'illness' && <span className="battle-lab-map-callout">史书记下曹军已有疾病<br />没有可计算的损失比例</span>}
        <ObservationPins points={CHIBI_POINTS} selected={selected} onSelect={selectPoint} />
        <Compass /><span className="battle-lab-scale-note">方位与行动关系示意 · 不表示兵力或实际舰位</span>
      </div>
      <div className="battle-lab-cause-title"><span>四个相连的条件</span><small>点选一个，追问它怎样影响战局</small></div>
      <div className="battle-lab-cause-grid">{CAUSES.map(c => <button key={c.id} type="button" aria-pressed={cause === c.id} onClick={() => { setCause(c.id); if (c.id === 'fire') setView('fire'); else if (c.id === 'alliance') setView('formation'); else setView('river'); }}><span>{c.number}</span><strong>{c.title}</strong><i aria-hidden="true">↗</i></button>)}</div>
      <div className="battle-lab-cause-reading" aria-live="polite"><strong>{causeInfo.title}</strong><p>{causeInfo.text}</p></div>
    </div>
    <ObservationRail point={point} points={CHIBI_POINTS} selected={selected} onSelect={selectPoint} onLocate={onLocate} sceneId="chibi" tab={recordTab} onTab={setRecordTab} />
  </section>;
}

function YinpingLab({ onLocate }: LabProps) {
  const [route, setRoute] = useState<'both' | 'front' | 'detour'>(() => sessionChoice('yinping-route', ['both', 'front', 'detour'], 'both'));
  const [stage, setStage] = useState(sessionStage);
  const [selected, setSelected] = useState(() => sessionChoice('yinping-point', YINPING_POINTS.map(p => p.id), 'jiange'));
  const [recordTab, setRecordTab] = useState<RecordTab>('read');
  const point = YINPING_POINTS.find(p => p.id === selected)!;
  const uid = useId().replace(/:/g, '');
  useEffect(() => { saveSession({ 'yinping-route': route, 'yinping-stage': stage, 'yinping-point': selected }); }, [route, stage, selected]);
  const selectPoint = (id: string) => { setSelected(id); setRecordTab('read'); };
  const selectStage = (i: number) => { setStage(i); selectPoint(STAGES[i].point); };
  const detourPaths = ['M392 77C462 112 540 144 506 181S452 221 420 235', 'M420 235C437 296 421 348 368 378S307 418 280 444', 'M280 444C239 479 192 524 148 563'];
  return <section className="battle-lab battle-lab--yinping" aria-label="阴平路线研究台">
    <div className="battle-lab-workspace">
      <div className="battle-lab-toolbar"><div><span className="battle-lab-overline">263年 / 剑阁与成都之间</span><h2>一条防线，两种进路</h2></div><div className="battle-lab-switch" role="group" aria-label="比较进军方向">{([{ id: 'both', label: '对照' }, { id: 'front', label: '正面' }, { id: 'detour', label: '绕行' }] as const).map(r => <button key={r.id} type="button" aria-pressed={route === r.id} onClick={() => setRoute(r.id)}>{r.label}</button>)}</div></div>
      <div className="battle-lab-map battle-lab-map--mountains">
        <svg viewBox="0 0 1000 640" preserveAspectRatio="none" className="battle-lab-atlas" role="img" aria-label={`阴平、剑阁、古江油、古绵竹与成都相对方位，当前阶段：${STAGES[stage].title}`}>
          <AtlasDefs uid={uid} />
          <rect width="1000" height="640" fill={`url(#${uid}-paper)`} />
          <path d="M70 640C60 480 140 378 223 341S401 346 452 389S555 468 555 640Z" className="battle-lab-plain" />
          <path d="M30 86Q219 6 370 48T666 29T1010 94M-20 119Q177 27 367 86T662 60T1040 129M-20 164Q161 87 362 125T655 100T1040 179M-30 203Q203 134 373 168T672 151T1040 236M-30 246Q163 203 372 209T645 215T1020 291M-30 300Q149 261 300 249T563 269T1050 351M-30 340Q129 313 265 296T455 317T991 406" className="battle-lab-contour" />
          <g className="battle-lab-relief"><path d="M193 177 229 102 280 191M261 144 306 50 366 178M321 231 374 136 419 227M443 151 482 72 533 168M543 214 586 133 640 231M650 181 700 72 754 189M818 166 861 94 915 184M724 319 768 234 821 322M529 303 567 237 616 311M34 267 76 194 125 281" /><path d="M219 123 229 102 244 125M295 76 306 50 320 77M365 154 374 136 383 155M476 84 482 72 490 86M687 99 700 72 715 103" /></g>
          <path d="M426 211C452 302 392 361 324 423S210 505 152 590" className="battle-lab-small-river" />
          <g className={route === 'detour' ? 'battle-lab-route-muted' : ''}><path d="M862 69C839 133 795 182 748 219" className="battle-lab-army battle-lab-army--red" markerEnd={`url(#${uid}-red-arrow)`} /><path d="M724 245L759 218M729 254L768 225" className="battle-lab-defense" /><path d="M723 266C646 327 508 421 159 562" className="battle-lab-road-context" /></g>
          <g className={route === 'front' ? 'battle-lab-route-muted' : ''}>{detourPaths.map((d, i) => <g key={d}><path d={d} className="battle-lab-route-ground" /><path d={d} className={stage > i ? 'battle-lab-detour battle-lab-detour--reached' : 'battle-lab-detour battle-lab-detour--future'} markerEnd={stage > i ? `url(#${uid}-green-arrow)` : undefined} /></g>)}</g>
          {YINPING_POINTS.map(p => <g key={p.id}><circle cx={p.x} cy={p.y} r={selected === p.id ? 28 : 10} className={selected === p.id ? 'battle-lab-selected-ring' : 'battle-lab-pin-dot'} /><circle cx={p.x} cy={p.y} r="4" className="battle-lab-pin-core" /></g>)}
        </svg>
        <span className="battle-lab-region battle-lab-region--minshan">岷山一带</span><span className="battle-lab-region battle-lab-region--basin">成都平原</span>
        {route !== 'detour' && <span className="battle-lab-force battle-lab-force--zhonghui">钟会正面<span>在剑阁受阻</span></span>}
        {route !== 'front' && <span className="battle-lab-force battle-lab-force--dengai">邓艾绕行<span>险路与补给危机</span></span>}
        <ObservationPins points={YINPING_POINTS} selected={selected} onSelect={selectPoint} />
        <Compass /><span className="battle-lab-scale-note">地点相对方位 · 路线表示行动先后，不按里程比例</span>
      </div>
      <div className="battle-lab-route-key"><span><i className="battle-lab-key-front" />正面进攻</span><span><i className="battle-lab-key-reached" />本阶段已展开的绕行</span><span><i className="battle-lab-key-future" />后续方向</span></div>
      <nav className="battle-lab-stages" aria-label="阴平行动阶段">{STAGES.map((s, i) => <button key={s.title} type="button" aria-current={stage === i ? 'step' : undefined} onClick={() => selectStage(i)}><span>0{i + 1}</span><strong>{s.title}</strong></button>)}</nav>
      <div className="battle-lab-stage-reading" aria-live="polite"><span>第 {stage + 1} 个观察阶段</span><p>{STAGES[stage].text}</p><small>阶段是阅读顺序，不是复原的每日行军记录。</small></div>
    </div>
    <ObservationRail point={point} points={YINPING_POINTS} selected={selected} onSelect={selectPoint} onLocate={onLocate} sceneId="yinping" tab={recordTab} onTab={setRecordTab} />
  </section>;
}

function ObservationPins({ points, selected, onSelect }: { points: Observation[]; selected: string; onSelect: (id: string) => void }) {
  return <div className="battle-lab-pins">{points.map(p => <button key={p.id} type="button" className={`battle-lab-map-pin${selected === p.id ? ' battle-lab-map-pin--selected' : ''}`} style={{ left: `${p.x / 10}%`, top: `${p.y / 6.4}%` }} aria-pressed={selected === p.id} aria-label={`观察${p.name}`} onClick={() => onSelect(p.id)}><span className="battle-lab-pin-target" aria-hidden="true" /><span className="battle-lab-pin-name">{p.name}</span></button>)}</div>;
}

function ObservationRail({ point, points, selected, onSelect, onLocate, sceneId, tab, onTab }: { point: Observation; points: Observation[]; selected: string; onSelect: (id: string) => void; onLocate?: LabProps['onLocate']; sceneId: SceneId; tab: RecordTab; onTab: (tab: RecordTab) => void }) {
  return <aside className="battle-lab-rail" aria-label="观察记录">
    <div className="battle-lab-rail-heading"><span className="battle-lab-overline">观察记录 / {String(points.findIndex(p => p.id === selected) + 1).padStart(2, '0')}</span><h3>{point.name}</h3><div className="battle-lab-rail-tabs" role="group" aria-label="记录内容"><button type="button" aria-pressed={tab === 'read'} onClick={() => onTab('read')}>读地点</button><button type="button" aria-pressed={tab === 'source'} onClick={() => onTab('source')}>看史料</button></div></div>
    {tab === 'read' ? <div className="battle-lab-record" aria-live="polite"><div><span>地形与位置</span><p>{point.terrain}</p></div><div><span>行动与代价</span><p>{point.action}</p></div><div className="battle-lab-boundary"><span>读图的边界</span><p>{point.boundary}</p></div>{onLocate && <button className="battle-lab-locate" type="button" onClick={() => onLocate(point.point, point.zoom)}>在时空地图定位 <span aria-hidden="true">↗</span></button>}</div> : <Evidence sceneId={sceneId} />}
    <div className="battle-lab-index"><span className="battle-lab-overline">继续观察</span><div role="group" aria-label="研究地点">{points.map(p => <button key={p.id} type="button" aria-pressed={selected === p.id} onClick={() => onSelect(p.id)}>{p.name}<span aria-hidden="true">↗</span></button>)}</div></div>
  </aside>;
}

function Evidence({ sceneId }: { sceneId: SceneId }) {
  return <div className="battle-lab-evidence">{sceneId === 'chibi' ? <>
    <div><span className="battle-lab-source-tier">本传记载</span><h4>火攻有前提</h4><p>《周瑜传》记载孙刘合力迎战、曹军已有疾病、黄盖诈降与火攻。强风见本传。</p><a href="https://zh.wikisource.org/wiki/三國志/卷54" target="_blank" rel="noreferrer">读《三国志》卷五十四 ↗</a></div>
    <div><span className="battle-lab-source-tier">裴注所引材料</span><h4>风向的说法</h4><p>裴松之注引《江表传》进一步说是东南风，须与本传层次分开。“借东风”是后来小说的讲法。</p></div>
    <div className="battle-lab-boundary"><span>教学表达</span><p>这幅画面组织关系与因果，没有精确舰位、兵力比或胜率模型。</p></div>
  </> : <>
    <div><span className="battle-lab-source-tier">本传记载</span><h4>绕行有代价</h4><p>修路、桥阁、转运困难、江油降与绵竹战，依据《邓艾传》。险路成功，不等于补给问题不存在。</p><a href="https://zh.wikisource.org/wiki/三國志_(四庫全書本)/魏志/卷28" target="_blank" rel="noreferrer">读《三国志》卷二十八 ↗</a></div>
    <div><span className="battle-lab-source-tier">地望与考古</span><h4>古绵竹不是今绵竹市</h4><p>故城遗址位于今德阳黄许地区。古江油则在今平武江油关一带，不能照搬现代同名市区。</p><a href="https://www.mztoday.gov.cn/show/80018.html" target="_blank" rel="noreferrer">看古绵竹遗址说明 ↗</a></div>
    <div className="battle-lab-boundary"><span>教学表达</span><p>阶段与连接线解释空间关系、行动先后；不是逐日行军复原，不把古里程换成精确距离。</p></div>
  </>}</div>;
}

function AtlasDefs({ uid }: { uid: string }) {
  return <defs><pattern id={`${uid}-paper`} width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" className="battle-lab-paper-fill" /><path d="M50 0H0V50" className="battle-lab-grid-line" /><circle cx="13" cy="29" r=".65" className="battle-lab-grain" /><circle cx="38" cy="8" r=".45" className="battle-lab-grain" /></pattern><marker id={`${uid}-red-arrow`} viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto"><path d="M2 2 10 6 2 10" fill="none" className="battle-lab-red-arrow" /></marker><marker id={`${uid}-green-arrow`} viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto"><path d="M2 2 10 6 2 10" fill="none" className="battle-lab-green-arrow" /></marker></defs>;
}

function Boat({ x, y, rotate = 0, fire = false }: { x: number; y: number; rotate?: number; fire?: boolean }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate})`} className={fire ? 'battle-lab-boat battle-lab-boat--fire' : 'battle-lab-boat'}><path d="M-17-5H17L11 7H-10Z" /><path d="M-9-5V-17L6-10V-5M-4-5V-20" className="battle-lab-boat-sail" />{fire && <path d="M-7-10C-12-18-2-19-4-28C7-24 12-17 4-10Z" className="battle-lab-flame" />}</g>;
}

function Compass() { return <div className="battle-lab-compass" aria-hidden="true"><span>北</span><svg viewBox="0 0 20 40"><path d="M10 1 17 28 10 23 3 28Z" /><path d="M10 1V36" /></svg></div>; }
