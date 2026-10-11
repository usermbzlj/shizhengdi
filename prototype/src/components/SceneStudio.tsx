import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { sceneById, scenes, type SceneDefinition } from "../data/scenes";
import { portraits } from "../data/portraits";
import { personById, personLocationAt } from "../data";
import { jumpYear, setState, useStore } from "../lib/store";
import { flyTo, whenMap } from "../map/mapRef";
import { SceneMap } from "./SceneExperience";
import SceneNarration from "./SceneNarration";
import BattleLab from "./BattleLab";
import InstitutionLab from "./InstitutionLab";
import { Icon } from "./Icon";
import "./scene-studio.css";

type View = "stage" | "research" | "map";
type ResearchPlace = { point: [number, number]; zoom: number };
const VIEWS: { id: View; name: string }[] = [
  { id: "stage", name: "故事现场" },
  { id: "research", name: "拆开看看" },
  { id: "map", name: "地图手札" },
];
const SHORT_TITLES: Record<string, string[]> = {
  chibi: ["防线易手", "结盟抉择", "火船靠近", "胜后争夺", "史实与小说"],
  jiupin: ["重识人才", "评价入官", "谁持尺子", "门第渐重", "监督评价"],
  yinping: ["剑阁对峙", "选择绕行", "险路代价", "进入腹地", "魏灭蜀汉"],
};
const THEMES: Record<string, { accent: string; pale: string; dark: string }> = {
  chibi: { accent: "#954d3d", pale: "#e3c7b4", dark: "#dda48d" },
  jiupin: { accent: "#406c83", pale: "#c3d4df", dark: "#9bc0d7" },
  yinping: { accent: "#506f50", pale: "#c5d1b8", dark: "#aac997" },
};

function loadStep(id: string, length: number) {
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

function loadPlace(id: string): ResearchPlace | null {
  try {
    const place = JSON.parse(
      sessionStorage.getItem(`szd-studio-place-${id}`) ?? "null",
    );
    if (
      !place ||
      !Array.isArray(place.point) ||
      place.point.length !== 2 ||
      !place.point.every(
        (n: unknown) => typeof n === "number" && Number.isFinite(n),
      ) ||
      place.point[0] < 70 ||
      place.point[0] > 135 ||
      place.point[1] < 18 ||
      place.point[1] > 55 ||
      typeof place.zoom !== "number" ||
      !Number.isFinite(place.zoom) ||
      place.zoom < 1 ||
      place.zoom > 12
    )
      return null;
    return { point: [place.point[0], place.point[1]], zoom: place.zoom };
  } catch {
    return null;
  }
}

export default function SceneStudio({
  id,
  onLibrary,
  onExit,
  onSelect,
  onInvite,
  suspended = false,
}: {
  id: string;
  onLibrary: () => void;
  onExit: () => void;
  onSelect: (id: string) => void;
  onInvite: (id: string) => void;
  suspended?: boolean;
}) {
  const scene = sceneById.get(id)!;
  const [index, setIndex] = useState(() => loadStep(id, scene.steps.length));
  const [view, setView] = useState<View>(() => {
    try {
      const saved = sessionStorage.getItem(`szd-studio-view-${id}`);
      return VIEWS.some((v) => v.id === saved) ? (saved as View) : "stage";
    } catch {
      return "stage";
    }
  });
  const [references, setReferences] = useState<"people" | "sources" | null>(
    null,
  );
  const [researchPlace, setResearchPlace] = useState<ResearchPlace | null>(() =>
    loadPlace(id),
  );
  const step = scene.steps[index];
  const theme = useStore((s) => s.theme);
  const reduce = useReducedMotion();
  const heading = useRef<HTMLHeadingElement>(null);
  const mapHeading = useRef<HTMLHeadingElement>(null);
  const focusChapter = useRef(false);
  const focusMap = useRef(false);
  const focusResearch = useRef(false);
  const researchHeading = useRef<HTMLHeadingElement>(null);
  const previousView = useRef<View>(view);
  const root = useRef<HTMLDivElement>(null);
  const camera = useRef<AbortController | null>(null);
  const [referenceTrigger, setReferenceTrigger] =
    useState<HTMLButtonElement | null>(null);
  const next = scenes[scenes.findIndex((s) => s.id === id) + 1];
  const colors = THEMES[id];
  const style = {
    "--studio-accent-light": colors.accent,
    "--studio-accent-dark": colors.dark,
    "--studio-pale": colors.pale,
  } as CSSProperties;

  useEffect(() => {
    jumpYear(step.year);
    try {
      localStorage.setItem(`szd-scene-${id}`, String(index));
    } catch {
      /* Reading remains available. */
    }
  }, [id, index, step]);

  useEffect(() => {
    try {
      if (researchPlace)
        sessionStorage.setItem(
          `szd-studio-place-${id}`,
          JSON.stringify(researchPlace),
        );
      else sessionStorage.removeItem(`szd-studio-place-${id}`);
    } catch {
      /* Map reading remains available. */
    }
  }, [id, researchPlace]);

  useEffect(() => {
    try {
      sessionStorage.setItem(`szd-studio-view-${id}`, view);
    } catch {
      /* View switching remains available. */
    }
    if (view === "research" && focusResearch.current) {
      researchHeading.current?.focus({ preventScroll: true });
      focusResearch.current = false;
    }
    if (
      view === "stage" &&
      previousView.current !== "stage" &&
      focusChapter.current
    ) {
      heading.current?.focus({ preventScroll: true });
      focusChapter.current = false;
    }
    previousView.current = view;
  }, [id, view]);

  useEffect(() => {
    const canvas = document.querySelector<HTMLElement>(".map");
    if (!canvas) return;
    const previous = {
      inert: canvas.inert,
      hidden: canvas.getAttribute("aria-hidden"),
    };
    canvas.inert = view !== "map" || references !== null;
    if (canvas.inert) canvas.setAttribute("aria-hidden", "true");
    else canvas.removeAttribute("aria-hidden");
    return () => {
      canvas.inert = previous.inert;
      if (previous.hidden === null) canvas.removeAttribute("aria-hidden");
      else canvas.setAttribute("aria-hidden", previous.hidden);
    };
  }, [view, references]);

  useEffect(() => {
    if (view !== "map") return;
    camera.current?.abort();
    camera.current = new AbortController();
    void flyTo(
      researchPlace?.point ?? step.center,
      researchPlace?.zoom ?? step.zoom,
      reduce ? 0 : 1100,
      camera.current.signal,
    );
    if (focusMap.current) {
      mapHeading.current?.focus({ preventScroll: true });
      focusMap.current = false;
    }
    return () => {
      camera.current?.abort();
      camera.current = null;
    };
  }, [view, step, researchPlace, reduce]);

  // Resize changes the reading layout, not the place the reader has dragged to.
  useEffect(() => {
    if (view !== "map") return;
    const resize = () => {
      void whenMap().then((map) => map.resize());
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [view]);

  const go = (n: number) => {
    focusChapter.current = true;
    setResearchPlace(null);
    setIndex(n);
    setView("stage");
    root.current?.querySelector(".studio-stage")?.scrollTo({ top: 0 });
    if (n === index && view === "stage") {
      heading.current?.focus({ preventScroll: true });
      focusChapter.current = false;
    }
  };
  const enterMap = (point?: [number, number], zoom?: number) => {
    focusMap.current = true;
    setResearchPlace(point && zoom ? { point, zoom } : null);
    setView("map");
  };

  return (
    <div
      ref={root}
      className={`scene-studio studio-${id}`}
      data-view={view}
      style={style}
    >
      <div className="studio-shell" inert={references !== null}>
        <header className="studio-header">
          <div className="studio-identity">
            <button
              className="studio-library"
              onClick={onLibrary}
              aria-label="打开精选故事"
            >
              <Icon name="prev" size={16} /> <span>精选故事</span>
            </button>
            <span className="studio-header-title">{scene.title}</span>
          </div>
          <div
            className="studio-view-tabs"
            role="tablist"
            aria-label="选择探索形式"
            onKeyDown={(e) => {
              const current = VIEWS.findIndex((v) => v.id === view);
              const n =
                e.key === "ArrowRight"
                  ? (current + 1) % 3
                  : e.key === "ArrowLeft"
                    ? (current + 2) % 3
                    : e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? 2
                        : -1;
              if (n < 0) return;
              e.preventDefault();
              setView(VIEWS[n].id);
              e.currentTarget
                .querySelectorAll<HTMLButtonElement>("button")
                [n]?.focus();
            }}
          >
            {VIEWS.map((v) => (
              <button
                key={v.id}
                id={`studio-tab-${v.id}`}
                role="tab"
                aria-selected={view === v.id}
                aria-controls={`studio-view-${v.id}`}
                tabIndex={view === v.id ? 0 : -1}
                onClick={() => setView(v.id)}
              >
                {v.name}
              </button>
            ))}
          </div>
          <div className="studio-header-tools">
            <SceneNarration
              key={`${id}:${step.id}`}
              sceneId={id}
              stepId={step.id}
              paused={suspended || references !== null}
            />
            <button
              className="studio-icon"
              onClick={() =>
                setState({ theme: theme === "light" ? "dark" : "light" })
              }
              aria-label={theme === "light" ? "切换深色" : "切换浅色"}
            >
              <Icon name={theme === "light" ? "moon" : "sun"} />
            </button>
            <button className="studio-exit" onClick={onExit}>
              自由探索 <Icon name="travel" size={14} />
            </button>
          </div>
        </header>

        <main
          className="studio-stage"
          id="studio-view-stage"
          role="tabpanel"
          aria-labelledby="studio-tab-stage"
          hidden={view !== "stage"}
        >
          <StageEngraving sceneId={id} />
          <div className="studio-stage-grain" aria-hidden="true" />
          <div className="studio-stage-number" aria-hidden="true">
            0{index + 1}
          </div>
          <div className="studio-stage-copy">
            <span className="studio-kicker">
              <i />
              {step.yearLabel}
              <span>·</span>
              {step.evidence.label}
            </span>
            <motion.article
              key={step.id}
              className="studio-stage-article"
              initial={{ opacity: 0, y: reduce ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.35 }}
              onAnimationComplete={() => {
                if (focusChapter.current) {
                  heading.current?.focus({ preventScroll: true });
                  focusChapter.current = false;
                }
              }}
            >
              <h1 ref={heading} tabIndex={-1}>
                {step.title}
              </h1>
              <p>{step.text}</p>
            </motion.article>
            <div className="studio-stage-evidence">
              <span>换个角度看</span>
              <p>{step.evidence.text}</p>
            </div>
            <div className="studio-stage-actions">
              <button
                className="studio-action-primary"
                onClick={() => {
                  focusResearch.current = true;
                  setView("research");
                }}
              >
                拆开看看 <Icon name="next" size={16} />
              </button>
              <button className="studio-action-text" onClick={() => enterMap()}>
                <Icon name="pin" size={16} />
                到地图上观察
              </button>
            </div>
          </div>
          <figure className="studio-stage-portrait">
            <img
              src={portraits[scene.portraitId].src}
              alt={`${portraits[scene.portraitId].name}人物意象插画`}
            />
            <figcaption>
              <strong>{portraits[scene.portraitId].name}</strong>
              <span>人物意象 · 当代插画</span>
            </figcaption>
          </figure>
          <div className="studio-stage-side-note">
            <span>从一个问题开始</span>
            <p>{scene.question}</p>
          </div>
        </main>

        <main
          className="studio-research"
          id="studio-view-research"
          role="tabpanel"
          aria-labelledby="studio-tab-research"
          hidden={view !== "research"}
        >
          <header className="studio-research-heading">
            <span className="studio-kicker">{scene.kicker}</span>
            <h1 ref={researchHeading} tabIndex={-1}>
              把历史拆开看。
            </h1>
            <p>换一个观察角度，看选择如何彼此影响。</p>
          </header>
          {id === "jiupin" ? (
            <InstitutionLab />
          ) : (
            <BattleLab
              sceneId={id as "chibi" | "yinping"}
              onLocate={(point, zoom) => enterMap(point, zoom)}
            />
          )}
        </main>

        <main
          className="studio-map"
          id="studio-view-map"
          role="tabpanel"
          aria-labelledby="studio-tab-map"
          hidden={view !== "map"}
        >
          <SceneMap scene={scene} index={researchPlace ? 4 : index} />
          <div className="scene-map-heading studio-map-heading">
            <span className="studio-kicker">
              {researchPlace ? "研究台 · 地理观察" : step.yearLabel}
            </span>
            <h1 ref={mapHeading} tabIndex={-1}>
              {scene.title}
            </h1>
            <button
              className="studio-map-locate"
              onClick={() => {
                camera.current?.abort();
                camera.current = new AbortController();
                void flyTo(
                  researchPlace?.point ?? step.center,
                  researchPlace?.zoom ?? step.zoom,
                  reduce ? 0 : 900,
                  camera.current.signal,
                );
              }}
            >
              <Icon name="pin" size={15} />
              回到观察地点
            </button>
          </div>
          <aside className="studio-map-note" aria-label="地图手札">
            <span className="studio-kicker">
              {researchPlace
                ? "从研究台来到地图"
                : `第 ${index + 1} 幕 · ${SHORT_TITLES[id][index]}`}
            </span>
            <h2>{researchPlace ? "让地形替你回答。" : step.title}</h2>
            <p>
              {researchPlace
                ? "拖动或缩放地图，观察河流、关口与周围地势。把研究台中的关系，放回真实的空间。"
                : step.text}
            </p>
            <div className="studio-map-observe">
              <span>读图线索</span>
              <p>
                {researchPlace
                  ? id === "chibi"
                    ? "沿长江寻找江陵、赤壁和夏口：水路既能阻隔，也能送来军队。"
                    : "把剑阁、阴平、古江油、古绵竹与成都连起来，比较关口、山路和腹地之间的关系。"
                  : step.evidence.text}
              </p>
            </div>
            <button
              className="studio-action-text"
              onClick={() => setView("research")}
            >
              带着问题，回到研究台 <Icon name="next" size={16} />
            </button>
            <small>路线和位置为教学示意，疆域为大致控制范围。</small>
          </aside>
        </main>

        <footer className="studio-footer">
          <nav className="studio-chapters" aria-label="故事五幕">
            {scene.steps.map((s, i) => (
              <button
                key={s.id}
                className={i === index ? "current" : i < index ? "past" : ""}
                aria-current={i === index ? "step" : undefined}
                aria-label={`第${i + 1}幕：${s.title}`}
                onClick={() => go(i)}
              >
                <span>0{i + 1}</span>
                <strong>{SHORT_TITLES[id][i]}</strong>
                <i />
              </button>
            ))}
          </nav>
          <div className="studio-footer-bottom">
            <div className="studio-reference-buttons">
              <button
                onClick={(event) => {
                  setReferenceTrigger(event.currentTarget);
                  setReferences("people");
                }}
              >
                人物档案
              </button>
              <span>/</span>
              <button
                onClick={(event) => {
                  setReferenceTrigger(event.currentTarget);
                  setReferences("sources");
                }}
              >
                史料与边界
              </button>
            </div>
            <span className="studio-footer-position">
              0{index + 1}
              <i>/</i>05
            </span>
            <div className="studio-step-buttons">
              <button
                onClick={() => go(index - 1)}
                disabled={index === 0}
                aria-label="上一幕"
              >
                <Icon name="prev" size={17} />
                <span>上一幕</span>
              </button>
              {index < 4 ? (
                <button className="primary" onClick={() => go(index + 1)}>
                  下一幕 <Icon name="next" size={17} />
                </button>
              ) : (
                <button
                  className="primary"
                  onClick={() => (next ? onSelect(next.id) : onLibrary())}
                >
                  {next ? "下个故事" : "返回故事集"}
                  <Icon name="next" size={17} />
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
      {references && (
        <StudioReferences
          scene={scene}
          year={step.year}
          initialTab={references}
          restoreFocus={referenceTrigger}
          onClose={() => setReferences(null)}
          onInvite={onInvite}
        />
      )}
    </div>
  );
}

function StageEngraving({ sceneId }: { sceneId: string }) {
  return (
    <svg
      className="studio-engraving"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {sceneId === "chibi" ? (
        <g>
          <path
            className="studio-river-wash"
            d="M-100 695C160 580 210 855 505 701S850 477 1076 678S1340 625 1570 490L1570 565C1340 708 1280 844 1040 750S780 610 500 780S170 714-100 800Z"
          />
          {[0, 16, 34, 54].map((y) => (
            <path
              key={y}
              transform={`translate(0 ${y})`}
              d="M-100 700C160 580 250 855 505 710S850 520 1076 715S1340 668 1570 525"
            />
          ))}
          <path
            className="studio-engraving-route"
            d="M165 583Q265 624 404 664Q533 637 666 601"
          />
          <g className="studio-engraving-places">
            <circle cx="165" cy="583" r="5" />
            <text x="140" y="560">
              江陵
            </text>
            <circle cx="404" cy="664" r="5" />
            <text x="380" y="705">
              赤壁
            </text>
            <circle cx="666" cy="601" r="5" />
            <text x="640" y="579">
              夏口
            </text>
          </g>
        </g>
      ) : sceneId === "jiupin" ? (
        <g className="studio-engraving-manuscript">
          {Array.from({ length: 11 }, (_, i) => (
            <path key={i} d={`M${180 + i * 63} 190V850`} />
          ))}
          {[395, 665].map((y) => (
            <path key={y} d={`M95 ${y}H1360`} />
          ))}
          <text x="116" y="825" className="studio-large-glyph">
            品
          </text>
          <path
            className="studio-engraving-route"
            d="M188 715H380V663H635V586H849"
          />
        </g>
      ) : (
        <g className="studio-engraving-mountains">
          {Array.from({ length: 7 }, (_, i) => (
            <path
              key={i}
              d={`M-100 ${855 - i * 21}Q70 ${565 - i * 35} 196 ${760 - i * 32}T${398 + i * 25} ${739 - i * 24}T${635 + i * 23} ${685 - i * 34}T920 ${746 - i * 24}T1260 ${678 - i * 40}T1515 655`}
            />
          ))}
          <path
            className="studio-engraving-route"
            d="M145 578Q279 493 362 622T448 696T585 658T747 780"
          />
          <g className="studio-engraving-places">
            <circle cx="145" cy="578" r="5" />
            <text x="110" y="553">
              阴平
            </text>
            <circle cx="448" cy="696" r="5" />
            <text x="423" y="735">
              古江油
            </text>
            <circle cx="747" cy="780" r="5" />
            <text x="724" y="821">
              成都
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}

function StudioReferences({
  scene,
  year,
  initialTab,
  restoreFocus,
  onClose,
  onInvite,
}: {
  scene: SceneDefinition;
  year: number;
  initialTab: "people" | "sources";
  restoreFocus: HTMLButtonElement | null;
  onClose: () => void;
  onInvite: (id: string) => void;
}) {
  const [tab, setTab] = useState(initialTab);
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const controls = [
        ...(dialog.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]),a[href]",
        ) ?? []),
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
      requestAnimationFrame(() => {
        if (restoreFocus?.isConnected)
          restoreFocus.focus({ preventScroll: true });
      });
    };
  }, [onClose, restoreFocus]);
  return (
    <div className="studio-reference-backdrop">
      <section
        ref={dialog}
        className="studio-reference-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="studio-reference-title"
      >
        <header>
          <span className="studio-kicker">{scene.title} / 随手查阅</span>
          <button
            className="studio-icon"
            onClick={onClose}
            aria-label="关闭查阅"
          >
            <Icon name="close" />
          </button>
        </header>
        <h1 id="studio-reference-title">
          {tab === "people" ? "把人放回他的处境。" : "让故事有据可寻。"}
        </h1>
        <div className="studio-reference-tabs">
          <button
            aria-pressed={tab === "people"}
            onClick={() => setTab("people")}
          >
            人物档案
          </button>
          <button
            aria-pressed={tab === "sources"}
            onClick={() => setTab("sources")}
          >
            史料与边界
          </button>
        </div>
        <div className="studio-reference-content">
          {tab === "people" ? (
            <>
              <div className="studio-reference-people">
                {scene.people.map((p) => (
                  <article key={p.id}>
                    {portraits[p.id] ? (
                      <img
                        src={portraits[p.id].src}
                        alt={`${p.name}人物意象插画`}
                      />
                    ) : (
                      <span className="studio-person-seal" aria-hidden="true">
                        {p.name.slice(0, 1)}
                      </span>
                    )}
                    <div>
                      <h2>{p.name}</h2>
                      <p>{p.role}</p>
                      {personById.has(p.id) &&
                        personLocationAt(personById.get(p.id)!, year) && (
                          <button onClick={() => onInvite(p.id)}>
                            邀请他来到今天 <Icon name="travel" size={14} />
                          </button>
                        )}
                    </div>
                  </article>
                ))}
              </div>
              <p className="studio-reference-fine">
                肖像是当代人物意象插画，不代表真实容貌。
              </p>
            </>
          ) : (
            <>
              <div className="studio-reference-sources">
                {scene.sources.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                    <span>{s.title}</span>
                    <Icon name="next" size={15} />
                    {s.note && <p>{s.note}</p>}
                  </a>
                ))}
              </div>
              <h2 className="studio-boundaries-title">读图与史料的边界</h2>
              <ul className="studio-boundaries">
                {scene.boundaries.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
