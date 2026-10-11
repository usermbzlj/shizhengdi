import { useId, useState } from "react";
import "./scene-diagrams.css";

type DiagramProps = { sceneId: string; stepIndex: number };

/** Small explanatory diagrams. Their shapes express relationships, never a historical basemap. */
export function SceneDiagram({ sceneId, stepIndex }: DiagramProps) {
  if (sceneId === "chibi") return <ChibiDiagram stepIndex={stepIndex} />;
  if (sceneId === "jiupin") return <JiupinDiagram stepIndex={stepIndex} />;
  if (sceneId === "yinping") return <YinpingDiagram stepIndex={stepIndex} />;
  return null;
}

function ChibiDiagram({ stepIndex }: { stepIndex: number }) {
  const [view, setView] = useState<"alliance" | "river">(() =>
    stepIndex === 1 || stepIndex === 3 ? "alliance" : "river",
  );
  const id = useId().replace(/:/g, "");
  return (
    <section
      className="scene-diagram scene-diagram--chibi"
      aria-label="赤壁之战的联盟与地理关系"
    >
      <div className="scene-diagram-heading">
        <span>看懂赤壁</span>
        <small>关系示意</small>
      </div>
      <div
        className="scene-diagram-tabs"
        role="group"
        aria-label="赤壁示意图视角"
      >
        <button
          type="button"
          aria-pressed={view === "alliance"}
          onClick={() => setView("alliance")}
        >
          谁与谁联手
        </button>
        <button
          type="button"
          aria-pressed={view === "river"}
          onClick={() => setView("river")}
        >
          江面上的难题
        </button>
      </div>
      <svg
        className="scene-diagram-canvas"
        viewBox="0 0 320 216"
        role="img"
        aria-label={
          view === "alliance"
            ? "曹操南下，孙权与刘备联手抵抗"
            : "渡江与水战经验、疾病和火攻，共同影响战局"
        }
      >
        <defs>
          <marker
            id={`${id}-arrow`}
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path
              d="M1 1 7 4 1 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            />
          </marker>
          <pattern
            id={`${id}-river`}
            width="32"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 6 Q8 1 16 6 T32 6"
              fill="none"
              className="scene-diagram-water-line"
            />
          </pattern>
        </defs>
        {view === "alliance" ? (
          <>
            <path
              d="M160 68 V112"
              className="scene-diagram-arrow"
              markerEnd={`url(#${id}-arrow)`}
            />
            <text x="177" y="95" className="scene-diagram-label">
              南下
            </text>
            <rect
              x="113"
              y="18"
              width="94"
              height="48"
              rx="24"
              className="scene-diagram-node scene-diagram-node--opponent"
            />
            <text x="160" y="47" className="scene-diagram-name">
              曹操
            </text>
            <rect
              x="18"
              y="150"
              width="106"
              height="48"
              rx="24"
              className="scene-diagram-node"
            />
            <text x="71" y="179" className="scene-diagram-name">
              孙权一方
            </text>
            <rect
              x="196"
              y="150"
              width="106"
              height="48"
              rx="24"
              className="scene-diagram-node"
            />
            <text x="249" y="179" className="scene-diagram-name">
              刘备一方
            </text>
            <path d="M122 174 H198" className="scene-diagram-alliance" />
            <rect
              x="134"
              y="159"
              width="52"
              height="29"
              rx="14"
              className="scene-diagram-pill"
            />
            <text
              x="160"
              y="178"
              className="scene-diagram-label scene-diagram-label--accent"
            >
              联手
            </text>
            <path
              d="M71 148 Q86 112 143 128 M249 148 Q234 112 177 128"
              className="scene-diagram-alliance"
            />
            <circle
              cx="160"
              cy="128"
              r="19"
              className="scene-diagram-confluence"
            />
            <text
              x="160"
              y="132"
              className="scene-diagram-label scene-diagram-label--accent"
            >
              抵抗
            </text>
          </>
        ) : (
          <>
            <path
              d="M-10 108 Q76 78 151 116 T330 115 L330 174 Q234 189 151 159 T-10 157 Z"
              className="scene-diagram-water"
            />
            <path
              d="M-10 108 Q76 78 151 116 T330 115 L330 174 Q234 189 151 159 T-10 157 Z"
              fill={`url(#${id}-river)`}
            />
            <text x="254" y="158" className="scene-diagram-label">
              长江
            </text>
            <path
              d="M81 119 h46 l-8 9 H89 Z M173 127 h46 l-8 9 h-30 Z"
              className="scene-diagram-boat"
            />
            <path
              d="M191 123 c-8-9 0-13-1-22 11 8 14 15 8 22"
              className="scene-diagram-fire"
            />
            <path
              d="M104 65 V104 M204 70 V110"
              className="scene-diagram-leader"
            />
            <rect
              x="32"
              y="21"
              width="144"
              height="45"
              rx="12"
              className="scene-diagram-node"
            />
            <text x="104" y="48" className="scene-diagram-name">
              水战经验与疾病
            </text>
            <rect
              x="188"
              y="27"
              width="96"
              height="45"
              rx="12"
              className="scene-diagram-node scene-diagram-node--opponent"
            />
            <text x="236" y="54" className="scene-diagram-name">
              火攻
            </text>
            <text x="160" y="201" className="scene-diagram-note-svg">
              兵多，并不等于善于江上作战
            </text>
          </>
        )}
      </svg>
      <p className="scene-diagram-explanation" aria-live="polite">
        {view === "alliance"
          ? "孙权与刘备有各自的目标，却面对同一个南下的对手。联盟，让抵抗成为可能。"
          : "江河改变了交战方式。水战经验、疾病与火攻一起影响结果，不能只用一阵风解释胜败。"}
      </p>
      <p className="scene-diagram-caption">
        {stepIndex > 1
          ? "把人物关系与地图上的江河连起来看。"
          : "先看各方的选择，再看战局如何形成。"}
        图形不表示兵力或战场位置。
      </p>
    </section>
  );
}

function JiupinDiagram({ stepIndex }: { stepIndex: number }) {
  const [view, setView] = useState<"early" | "later">(() =>
    stepIndex >= 3 ? "later" : "early",
  );
  const currentStage = [0, 1, 1, 2, 1][stepIndex] ?? 0;
  const labels = ["地方士人", "中正评定", "九等乡品", "朝廷授官"];
  const notes = [
    "进入人才考察范围",
    "综合考察，提出评价",
    "记录人才评价的等第",
    "朝廷任用仍有自己的程序",
  ];
  const laterNotes = [
    "家世逐渐影响机会",
    "中正与大族关系更密切",
    "乡品受到门第影响",
    "高位机会向大族集中",
  ];
  return (
    <section
      className="scene-diagram scene-diagram--jiupin"
      aria-label="九品中正制的选官流程与历史变化"
    >
      <div className="scene-diagram-heading">
        <span>人才怎样被看见</span>
        <small>制度示意</small>
      </div>
      <div
        className="scene-diagram-tabs"
        role="group"
        aria-label="九品中正制的历史阶段"
      >
        <button
          type="button"
          aria-pressed={view === "early"}
          onClick={() => setView("early")}
        >
          220 年初建
        </button>
        <button
          type="button"
          aria-pressed={view === "later"}
          onClick={() => setView("later")}
        >
          后来怎样变化
        </button>
      </div>
      <ol className="scene-diagram-process" aria-label="选官流程">
        {labels.map((label, index) => (
          <li
            key={label}
            className={
              index === currentStage
                ? "scene-diagram-process-step scene-diagram-process-step--current"
                : "scene-diagram-process-step"
            }
          >
            <span className="scene-diagram-step-number" aria-hidden="true">
              0{index + 1}
            </span>
            <div>
              <strong>{label}</strong>
              <small>
                {view === "early" ? notes[index] : laterNotes[index]}
              </small>
            </div>
            {index === 2 && (
              <div
                className="scene-diagram-ranks"
                aria-label="乡品分为一至九品"
              >
                {["一", "二", "三", "四", "五", "六", "七", "八", "九"].map(
                  (rank) => (
                    <span key={rank}>{rank}</span>
                  ),
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
      <div className="scene-diagram-distinction">
        <span>乡品</span>
        <b aria-label="不等于">≠</b>
        <span>官品</span>
        <small>人才的评价等第，不是官职的等级。</small>
      </div>
      <p className="scene-diagram-explanation" aria-live="polite">
        {view === "early"
          ? "战乱后，原有的人才推荐网络难以运转。新制度试图把地方评价与朝廷用人接起来。"
          : "门第影响是在后来逐渐增强的。不能把魏晋时期的发展，全部套回 220 年制度初建的那一刻。"}
      </p>
    </section>
  );
}

function YinpingDiagram({ stepIndex }: { stepIndex: number }) {
  const [route, setRoute] = useState<"front" | "detour">(() =>
    stepIndex > 0 ? "detour" : "front",
  );
  const id = useId().replace(/:/g, "");
  return (
    <section
      className="scene-diagram scene-diagram--yinping"
      aria-label="剑阁正面防线与阴平绕行的路线比较"
    >
      <div className="scene-diagram-heading">
        <span>两条路，两种代价</span>
        <small>路线示意</small>
      </div>
      <div
        className="scene-diagram-tabs"
        role="group"
        aria-label="选择一条进军路线"
      >
        <button
          type="button"
          aria-pressed={route === "front"}
          onClick={() => setRoute("front")}
        >
          剑阁正面
        </button>
        <button
          type="button"
          aria-pressed={route === "detour"}
          onClick={() => setRoute("detour")}
        >
          阴平绕行
        </button>
      </div>
      <svg
        className="scene-diagram-canvas"
        viewBox="0 0 320 260"
        role="img"
        aria-label={
          route === "front"
            ? "钟会进攻剑阁，受到姜维防守的阻挡"
            : "邓艾由阴平走险路，抵达古江油，再经古绵竹向成都推进"
        }
      >
        <defs>
          <marker
            id={`${id}-arrow`}
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path
              d="M1 1 7 4 1 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
            />
          </marker>
        </defs>
        <g className="scene-diagram-mountains" aria-hidden="true">
          <path d="M116 139 144 84 171 139 M139 139 167 66 202 139 M170 139 199 92 225 139 M141 84 151 101 157 91 M161 80 167 66 175 85" />
          <path d="M15 159 38 115 67 159 M248 169 274 115 310 169" />
        </g>
        <path
          d="M145 31 Q85 39 81 105"
          className={`scene-diagram-route${route === "front" ? " scene-diagram-route--active" : ""}`}
          markerEnd={route === "front" ? `url(#${id}-arrow)` : undefined}
        />
        <path
          d="M81 137 V144 Q79 195 145 229"
          className="scene-diagram-route scene-diagram-route--detour"
        />
        <path
          d="M148 31 Q230 33 244 75 Q266 111 244 145 Q237 172 210 193 Q185 217 148 229"
          className={`scene-diagram-route scene-diagram-route--detour${route === "detour" ? " scene-diagram-route--active" : ""}`}
          markerEnd={route === "detour" ? `url(#${id}-arrow)` : undefined}
        />
        <circle cx="146" cy="31" r="5" className="scene-diagram-dot" />
        <text x="146" y="17" className="scene-diagram-name">
          魏军南下
        </text>
        <circle cx="81" cy="105" r="6" className="scene-diagram-dot" />
        <text x="55" y="93" className="scene-diagram-name">
          剑阁
        </text>
        <path
          d="M65 122 H97 M67 116 V128 M95 116 V128"
          className="scene-diagram-barrier"
        />
        <text x="48" y="150" className="scene-diagram-label">
          姜维守关
        </text>
        <text x="75" y="184" className="scene-diagram-label">
          关后通道
        </text>
        <circle cx="244" cy="75" r="5" className="scene-diagram-dot" />
        <text x="272" y="61" className="scene-diagram-name">
          阴平
        </text>
        <circle cx="244" cy="145" r="5" className="scene-diagram-dot" />
        <text x="279" y="151" className="scene-diagram-name">
          古江油
        </text>
        <circle cx="210" cy="193" r="5" className="scene-diagram-dot" />
        <text x="251" y="199" className="scene-diagram-name">
          古绵竹
        </text>
        <circle
          cx="146"
          cy="229"
          r="6"
          className="scene-diagram-dot scene-diagram-dot--destination"
        />
        <text x="146" y="253" className="scene-diagram-name">
          成都
        </text>
        <text x="171" y="164" className="scene-diagram-label">
          山地
        </text>
      </svg>
      <div className="scene-diagram-route-facts" aria-live="polite">
        <strong>
          {route === "front" ? "钟会：沿正面推进" : "邓艾：离开常规道路"}
        </strong>
        <p>
          {route === "front"
            ? "能沿既有通道推进，却必须突破剑阁防守。地势把双方力量集中在关口。"
            : "避开剑阁的正面防线，却要承担险路、缺粮与队伍难以通行的风险。绕过关口，仍须继续作战。"}
        </p>
      </div>
      <p className="scene-diagram-caption">
        {stepIndex > 1
          ? "险路打开了另一种可能，不代表没有代价。"
          : "关口与山路，改变了进军的选择。"}
        路线与地形不按比例，节点仅用于理解先后。
      </p>
    </section>
  );
}
