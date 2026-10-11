import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { scenes, sceneById, type SceneDefinition } from "../data/scenes";
import { portraits } from "../data/portraits";
import { personById, personLocationAt } from "../data";
import { jumpYear, setState, useStore } from "../lib/store";
import { flyTo, whenMap } from "../map/mapRef";
import { Icon } from "./Icon";
import { SceneDiagram } from "./SceneDiagrams";
import SceneNarration from "./SceneNarration";
import "./scene-experience.css";

const ACCENTS: Record<string, string> = {
  chibi: "#a45543",
  jiupin: "#486f88",
  yinping: "#5b7760",
};
const DARK_ACCENTS: Record<string, string> = {
  chibi: "#dea08c",
  jiupin: "#9dc1d6",
  yinping: "#a4c4a6",
};
const sceneStyle = (id: string) =>
  ({
    "--scene-accent-light": ACCENTS[id] ?? "#99764b",
    "--scene-accent-dark": DARK_ACCENTS[id] ?? "#d4ba83",
  }) as CSSProperties;

function savedStep(id: string, length: number) {
  try {
    return Math.max(
      0,
      Math.min(
        length - 1,
        Math.trunc(Number(localStorage.getItem(`szd-scene-${id}`)) || 0),
      ),
    );
  } catch {
    return 0;
  }
}

export function SceneHub({
  onSelect,
  onClose,
}: {
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const controls = [
        ...(dialog.current?.querySelectorAll<HTMLElement>("button,a[href]") ??
          []),
      ];
      const first = controls[0],
        last = controls.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      const target =
        previous?.isConnected && previous !== document.body
          ? previous
          : (document.querySelector<HTMLButtonElement>(".studio-library") ??
            document.querySelector<HTMLButtonElement>(".stories-btn"));
      target?.focus();
    };
  }, [onClose]);
  return (
    <div className="scene-hub-backdrop">
      <motion.div
        ref={dialog}
        className="scene-hub"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scene-hub-title"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          className="scene-icon-btn scene-hub-close"
          onClick={onClose}
          aria-label="关闭精选故事"
        >
          <Icon name="close" />
        </button>
        <header className="scene-hub-heading">
          <span className="scene-eyebrow">时空地图 / 三国前后</span>
          <h1 id="scene-hub-title">走进历史发生的地方</h1>
          <p>一条江、一套制度、一条山路。把地图读懂，把历史看近。</p>
        </header>
        <div className="scene-covers">
          {scenes.map((scene, index) => {
            const portrait = portraits[scene.portraitId];
            const resume = savedStep(scene.id, scene.steps.length);
            return (
              <button
                key={scene.id}
                className="scene-cover"
                style={sceneStyle(scene.id)}
                onClick={() => onSelect(scene.id)}
              >
                <div className="scene-cover-art">
                  <img
                    src={portrait.src}
                    alt={`${portrait.name}人物意象插画`}
                    loading="lazy"
                  />
                  <span className="scene-cover-number">0{index + 1}</span>
                  <span className="scene-cover-date">
                    {scene.steps[0].yearLabel}
                  </span>
                </div>
                <div className="scene-cover-copy">
                  <span className="scene-eyebrow">{scene.kicker}</span>
                  <h2>{scene.title}</h2>
                  <p>{scene.question}</p>
                  <span className="scene-cover-link">
                    {resume > 0 ? `继续第 ${resume + 1} 幕` : "进入故事"}
                    <Icon name="next" size={16} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        <p className="scene-hub-note">
          每个故事 5 幕 · 故事现场、研究台与地图，自由切换
        </p>
      </motion.div>
    </div>
  );
}

export default function SceneExperience({
  id,
  onExit,
  onLibrary,
  onSelect,
  onInvite,
}: {
  id: string;
  onExit: () => void;
  onLibrary: () => void;
  onSelect: (id: string) => void;
  onInvite: (id: string) => void;
}) {
  const scene = sceneById.get(id)!;
  const [index, setIndex] = useState(() => savedStep(id, scene.steps.length));
  const [tab, setTab] = useState<"story" | "people" | "sources">("story");
  const [expanded, setExpanded] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const focusHeading = useRef(false);
  const reduce = useReducedMotion();
  const theme = useStore((s) => s.theme);
  const step = scene.steps[index];
  const portrait = portraits[scene.portraitId];
  const nextScene =
    scenes[(scenes.findIndex((s) => s.id === id) + 1) % scenes.length];
  const locate = () => flyTo(step.center, step.zoom, reduce ? 0 : 1250);
  useEffect(() => {
    jumpYear(step.year);
    void flyTo(step.center, step.zoom, reduce ? 0 : 1250);
    scroll.current?.scrollTo({ top: 0 });
    try {
      localStorage.setItem(`szd-scene-${id}`, String(index));
    } catch {
      /* Reading remains available. */
    }
  }, [id, index, step, reduce]);
  useEffect(() => {
    let raf = 0;
    const resize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        void flyTo(step.center, step.zoom, 0);
      });
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [step]);
  useEffect(() => {
    scroll.current?.scrollTo({ top: 0 });
  }, [tab]);
  const go = (n: number) => {
    if (n === index && tab === "story") {
      heading.current?.focus({ preventScroll: true });
      return;
    }
    focusHeading.current = true;
    setIndex(n);
    setTab("story");
  };
  return (
    <section
      className={`scene-experience${expanded ? " reading-expanded" : ""}`}
      style={sceneStyle(id)}
      aria-label={`${scene.title}场景`}
    >
      <header className="scene-header">
        <button className="scene-back" onClick={onLibrary}>
          <Icon name="prev" size={16} />
          <span>精选故事</span>
        </button>
        <span className="scene-header-brand">
          时空地图 <i>/</i> {scene.title}
        </span>
        <div className="scene-header-tools">
          <SceneNarration
            key={`${id}:${step.id}`}
            sceneId={id}
            stepId={step.id}
          />
          <button
            className="scene-icon-btn"
            onClick={() =>
              setState({ theme: theme === "light" ? "dark" : "light" })
            }
            aria-label={theme === "light" ? "切换深色" : "切换浅色"}
          >
            <Icon name={theme === "light" ? "moon" : "sun"} />
          </button>
          <button className="scene-exit" onClick={onExit}>
            自由探索
            <Icon name="travel" size={16} />
          </button>
        </div>
      </header>
      <SceneMap scene={scene} index={index} />
      <div className="scene-map-heading">
        <span className="scene-eyebrow">{scene.kicker}</span>
        <h2>{scene.title}</h2>
        <p>{step.yearLabel}</p>
      </div>
      <div className="scene-map-tools">
        <button className="scene-locate" onClick={locate}>
          <Icon name="pin" size={16} />
          回到故事地点
        </button>
        <span>路线、位置为教学示意</span>
      </div>
      <aside className="scene-reading" aria-label="故事阅读">
        <button
          className="scene-mobile-expand"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? "收起，看看地图" : "展开阅读"}
          <span aria-hidden>⌃</span>
        </button>
        <div className="scene-reading-hero">
          <img src={portrait.src} alt={`${portrait.name}人物意象插画`} />
          <div className="scene-hero-copy">
            <span className="scene-eyebrow">{step.yearLabel}</span>
            <h1>{scene.title}</h1>
            <p>{scene.question}</p>
            <span className="scene-portrait-caption">
              {portrait.name} · {portrait.caption}
            </span>
          </div>
        </div>
        <div
          className="scene-tabs"
          role="tablist"
          aria-label="故事内容"
          onKeyDown={(e) => {
            const tabs = ["story", "people", "sources"] as const;
            const current = tabs.indexOf(tab);
            const next =
              e.key === "ArrowRight"
                ? (current + 1) % 3
                : e.key === "ArrowLeft"
                  ? (current + 2) % 3
                  : e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? 2
                      : -1;
            if (next < 0) return;
            e.preventDefault();
            setTab(tabs[next]);
            e.currentTarget
              .querySelectorAll<HTMLButtonElement>("button")
              [next]?.focus();
          }}
        >
          {(["story", "people", "sources"] as const).map((t) => (
            <button
              key={t}
              id={`scene-tab-${t}`}
              role="tab"
              tabIndex={tab === t ? 0 : -1}
              aria-selected={tab === t}
              aria-controls={`scene-content-${t}`}
              onClick={() => setTab(t)}
            >
              {t === "story" ? "故事" : t === "people" ? "人物" : "史料与说明"}
            </button>
          ))}
        </div>
        <div
          className="scene-reading-scroll"
          ref={scroll}
          id={`scene-content-${tab}`}
          role="tabpanel"
          aria-labelledby={`scene-tab-${tab}`}
        >
          {tab === "story" && (
            <>
              <nav className="scene-step-nav" aria-label="故事段落">
                {scene.steps.map((s, i) => (
                  <button
                    key={s.id}
                    className={
                      i === index ? "current" : i < index ? "past" : ""
                    }
                    onClick={() => go(i)}
                    aria-current={i === index ? "step" : undefined}
                    aria-label={`第${i + 1}段：${s.title}`}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                  </button>
                ))}
              </nav>
              <AnimatePresence mode="wait">
                <motion.article
                  key={step.id}
                  className="scene-step"
                  initial={{ opacity: 0, y: reduce ? 0 : 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.18 }}
                  onAnimationComplete={(definition) => {
                    if (
                      typeof definition === "object" &&
                      "opacity" in definition &&
                      definition.opacity === 1 &&
                      focusHeading.current
                    ) {
                      heading.current?.focus({ preventScroll: true });
                      focusHeading.current = false;
                    }
                  }}
                >
                  <span className="scene-step-kicker">
                    第 {index + 1} 段 / {scene.steps.length} <i>·</i>{" "}
                    {step.evidence.label}
                  </span>
                  <h2 tabIndex={-1} ref={heading}>
                    {step.title}
                  </h2>
                  <p className="scene-step-text">{step.text}</p>
                  <SceneDiagram
                    key={`${id}-${index}`}
                    sceneId={id}
                    stepIndex={index}
                  />
                  <div className="scene-evidence">
                    <span>读地图</span>
                    <p>{step.evidence.text}</p>
                  </div>
                </motion.article>
              </AnimatePresence>
            </>
          )}
          {tab === "people" && (
            <div className="scene-people">
              <h2>历史里的选择者</h2>
              <p className="scene-section-intro">把人物放回他们的处境。</p>
              {scene.people.map((p) => (
                <article key={p.id} className="scene-person">
                  {portraits[p.id] && (
                    <img
                      src={portraits[p.id].src}
                      alt={`${p.name}人物意象插画`}
                      loading="lazy"
                    />
                  )}
                  <div>
                    <h3>{p.name}</h3>
                    <p>{p.role}</p>
                    {personById.has(p.id) &&
                      personLocationAt(personById.get(p.id)!, step.year) && (
                        <button onClick={() => onInvite(p.id)}>
                          邀请他来到今天
                          <Icon name="travel" size={14} />
                        </button>
                      )}
                  </div>
                </article>
              ))}
              <p className="scene-fine">
                肖像为当代插画意象，不代表人物真实容貌。
              </p>
            </div>
          )}
          {tab === "sources" && (
            <div className="scene-sources">
              <h2>故事从哪里来</h2>
              <p className="scene-section-intro">
                原典留下线索，地图帮助理解。
              </p>
              {scene.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{source.title}</span>
                  <Icon name="travel" size={15} />
                  {source.note && <p>{source.note}</p>}
                </a>
              ))}
              <h3>我们能确定到哪里</h3>
              <ul>
                {scene.boundaries.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className="scene-fine">
                疆域表达大致控制范围，不代表现代国界；路径表达行军方向，不是导航路线。
              </p>
            </div>
          )}
        </div>
        <footer className="scene-reading-footer">
          <button
            className="scene-prev"
            disabled={index === 0}
            onClick={() => go(index - 1)}
            aria-label="上一段"
          >
            <Icon name="prev" size={17} />
            上一段
          </button>
          <span>{String(index + 1).padStart(2, "0")} / 05</span>
          {index < scene.steps.length - 1 ? (
            <button className="scene-next" onClick={() => go(index + 1)}>
              下一段
              <Icon name="next" size={17} />
            </button>
          ) : (
            <button
              className="scene-next"
              onClick={() =>
                scene.id === scenes[scenes.length - 1].id
                  ? onLibrary()
                  : onSelect(nextScene.id)
              }
            >
              {scene.id === scenes[scenes.length - 1].id
                ? "返回故事集"
                : "下个故事"}
              <Icon name="next" size={17} />
            </button>
          )}
        </footer>
      </aside>
    </section>
  );
}

type MapPoint = {
  name: string;
  point: [number, number];
  kind?: "river" | "pass" | "city";
  from?: number;
};
const POINTS: Record<string, MapPoint[]> = {
  chibi: [
    { name: "江陵", point: [112.19, 30.35] },
    { name: "赤壁", point: [113.627, 29.874], kind: "pass" },
    { name: "夏口", point: [114.3, 30.56] },
    { name: "长江", point: [113.28, 30.05], kind: "river" },
  ],
  jiupin: [
    { name: "邺城", point: [114.4, 36.275] },
    { name: "洛阳", point: [112.45, 34.69] },
    { name: "颍川", point: [113.5, 34.1] },
  ],
  yinping: [
    { name: "阴平", point: [104.68, 32.94] },
    { name: "剑阁", point: [105.57, 32.2], kind: "pass" },
    { name: "古江油", point: [104.75, 32.2], from: 2 },
    { name: "古绵竹", point: [104.4, 31.22], from: 3 },
    { name: "成都", point: [104.07, 30.66] },
    { name: "岷山", point: [103.7, 32.3], kind: "river" },
  ],
};
const PATHS: Record<
  string,
  {
    name: string;
    color: string;
    points: [number, number][];
    from: number;
    dashed?: boolean;
  }[]
> = {
  chibi: [
    {
      name: "曹军南下方向",
      color: "#a45543",
      points: [
        [112.19, 30.35],
        [112.8, 30.03],
        [113.627, 29.874],
      ],
      from: 0,
    },
    {
      name: "孙刘联军迎击方向",
      color: "#486f88",
      points: [
        [114.3, 30.56],
        [114.02, 30.18],
        [113.627, 29.874],
      ],
      from: 1,
    },
  ],
  yinping: [
    {
      name: "钟会主力方向",
      color: "#a45543",
      points: [
        [106.8, 33.1],
        [106.05, 32.5],
        [105.57, 32.2],
      ],
      from: 0,
    },
    {
      name: "邓艾绕行方向",
      color: "#5b7760",
      points: [
        [104.68, 32.94],
        [104.25, 32.6],
        [104.45, 32.15],
        [104.75, 32.2],
        [104.7, 31.5],
        [104.4, 31.22],
        [104.07, 30.66],
      ],
      from: 1,
      dashed: true,
    },
  ],
};
const EMPTY_PATHS: (typeof PATHS)[string] = [];
const EMPTY_POINTS: MapPoint[] = [];

export function SceneMap({
  scene,
  index,
}: {
  scene: SceneDefinition;
  index: number;
}) {
  const [projection, setProjection] = useState<{
    points: { x: number; y: number; visible: boolean }[];
    paths: string[];
  }>({ points: [], paths: [] });
  const points = POINTS[scene.id] ?? EMPTY_POINTS;
  const paths = PATHS[scene.id] ?? EMPTY_PATHS;
  useEffect(() => {
    let disposed = false,
      raf = 0,
      cleanup = () => {};
    void whenMap().then((map) => {
      if (disposed) return;
      const paint = () => {
        raf = 0;
        const visibleMap = document
          .querySelector(".scene-cartography")
          ?.getBoundingClientRect();
        const title = document
          .querySelector(".scene-map-heading")
          ?.getBoundingClientRect();
        setProjection({
          points: points.map((p) => {
            const q = map.project(p.point);
            const y = q.y + (p.kind === "river" ? 27 : 0);
            const underTitle =
              title &&
              q.x < title.right + 24 &&
              q.x > title.left - 24 &&
              y < title.bottom + 18 &&
              y > title.top - 18;
            return {
              x: q.x,
              y,
              visible:
                !!visibleMap &&
                q.x > 35 &&
                q.x < visibleMap.right - 50 &&
                y > visibleMap.top + 15 &&
                y < visibleMap.bottom - 24 &&
                !underTitle,
            };
          }),
          paths: paths.map((p) =>
            p.points
              .map((pt, i) => {
                const q = map.project(pt);
                return `${i ? "L" : "M"}${q.x},${q.y}`;
              })
              .join(" "),
          ),
        });
      };
      const schedule = () => {
        if (!raf) raf = requestAnimationFrame(paint);
      };
      map.on("move", schedule);
      map.on("resize", schedule);
      paint();
      cleanup = () => {
        map.off("move", schedule);
        map.off("resize", schedule);
        cancelAnimationFrame(raf);
      };
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [scene.id, points, paths]);
  return (
    <div className="scene-cartography" aria-hidden="true">
      <svg className="scene-route-svg">
        <defs>
          {paths.map((p, i) => (
            <marker
              id={`scene-arrow-${i}`}
              key={i}
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path
                d="M1 1 L7 4 L1 7"
                fill="none"
                stroke={p.color}
                strokeWidth="1.5"
              />
            </marker>
          ))}
        </defs>
        {paths.map(
          (p, i) =>
            index >= p.from && (
              <g key={p.name}>
                <path
                  d={projection.paths[i]}
                  fill="none"
                  stroke="var(--scene-paper)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <path
                  d={projection.paths[i]}
                  fill="none"
                  stroke={p.color}
                  strokeWidth="2.5"
                  strokeDasharray={p.dashed ? "5 6" : undefined}
                  strokeLinecap="round"
                  markerEnd={`url(#scene-arrow-${i})`}
                />
              </g>
            ),
        )}
      </svg>
      {points.map(
        (p, i) =>
          projection.points[i]?.visible &&
          index >= (p.from ?? 0) && (
            <div
              key={p.name}
              className={`scene-map-label ${p.kind ?? "city"}`}
              style={{
                left: projection.points[i].x,
                top: projection.points[i].y,
              }}
            >
              <i />
              <span>{p.name}</span>
            </div>
          ),
      )}
      <div className="scene-route-legend">
        {paths
          .filter((p) => index >= p.from)
          .map((p) => (
            <span key={p.name}>
              <i style={{ background: p.color }} />
              {p.name}
            </span>
          ))}
      </div>
    </div>
  );
}
