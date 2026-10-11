import { useEffect, useMemo, useRef, useState } from "react";
import { animateYear, getState, setState, useStore } from "../lib/store";
import { openExplore } from "../lib/nav";
import { flyTo } from "../map/mapRef";
import {
  cities,
  eventTime,
  events,
  gazetteer,
  persons,
  personLocationAt,
  storyLines,
} from "../data";
import { Icon } from "./Icon";

interface Hit {
  key: string;
  title: string;
  sub: string;
  go: () => void;
}

function takeRoundRobin(groups: Hit[][], limit: number) {
  const out: Hit[] = [];
  for (let n = 0; out.length < limit; n++) {
    let added = false;
    for (const g of groups) {
      if (g[n]) {
        out.push(g[n]);
        added = true;
        if (out.length >= limit) break;
      }
    }
    if (!added) break;
  }
  return out;
}

function useSearch(q: string, forHome: boolean): Hit[] {
  return useMemo(() => {
    const s = q.trim();
    if (!s) return [];
    const cityHits: Hit[] = [];
    const gazHits: Hit[] = [];
    const personHits: Hit[] = [];
    const eventHits: Hit[] = [];
    const lineHits: Hit[] = [];
    const seen = new Set<string>();
    for (const c of cities) {
      if (cityHits.length >= 8) break;
      const matched =
        c.modern.includes(s) || c.names.some((n) => n.name.includes(s));
      if (!matched) continue;
      const ancient = c.names.find((n) => n.name.includes(s));
      seen.add(c.modern);
      cityHits.push({
        key: `c-${c.id}`,
        title:
          ancient && !c.modern.includes(s)
            ? `${ancient.name}（今${c.modern}）`
            : c.modern,
        sub: c.names
          .map((n) => n.name)
          .filter((v, i, a) => a.indexOf(v) === i)
          .slice(0, 6)
          .join(" · "),
        go: () => {
          if (forHome)
            return setState({
              hometown:
                gazetteer.find((g) => g.cityId === c.id)?.name ?? c.modern,
            });
          openExplore({ panel: { kind: "city", id: c.id } });
          flyTo([c.lng, c.lat], 6);
        },
      });
    }
    for (const g of gazetteer) {
      if (gazHits.length >= 8) break;
      if (seen.has(g.name)) continue;
      if (!g.name.includes(s) && !g.alt.some((a) => a.includes(s))) continue;
      if (!Number.isFinite(g.lng) || !Number.isFinite(g.lat)) continue;
      if (g.kind === "seat" && forHome) continue;
      seen.add(g.name);
      gazHits.push({
        key: `g-${g.name}-${g.lng}`,
        title: g.name,
        sub:
          g.kind === "seat"
            ? `郡治 · ${g.alt.join(" ")}`
            : g.alt.length
              ? g.alt.join(" · ")
              : "现代城市",
        go: () => {
          if (forHome) return setState({ hometown: g.name });
          if (g.cityId) openExplore({ panel: { kind: "city", id: g.cityId } });
          else
            openExplore({
              panel: { kind: "place", name: g.name, lng: g.lng, lat: g.lat },
            });
          flyTo([g.lng, g.lat], 6.2);
        },
      });
    }
    if (forHome) return [...cityHits, ...gazHits].slice(0, 12);
    for (const p of persons) {
      if (personHits.length >= 8) break;
      const courtesy = p.courtesy ?? "";
      if (!p.name.includes(s) && !courtesy.includes(s)) continue;
      const byCourtesy = !p.name.includes(s);
      personHits.push({
        key: `p-${p.id}`,
        title: byCourtesy && courtesy ? `${p.name}（${courtesy}）` : p.name,
        sub: `人物 · ${p.birth ?? "?"}—${p.death ?? "?"}`,
        go: () => {
          const y = getState().year;
          const loc =
            personLocationAt(p, y) ??
            p.locations[Math.floor(p.locations.length / 2)];
          if (!personLocationAt(p, y) && loc)
            animateYear((loc.from + loc.to) / 2 + 0.5, 1000);
          openExplore({
            panel: { kind: "person", id: p.id },
            layers: { ...getState().layers, people: true },
          });
          if (loc) flyTo([loc.lng, loc.lat], 5.6);
        },
      });
    }
    for (const e of events) {
      if (eventHits.length >= 8) break;
      if (!e.name.includes(s)) continue;
      eventHits.push({
        key: `e-${e.id}`,
        title: e.name,
        sub: `${e.year} 年 · ${e.place}`,
        go: () => {
          openExplore({ panel: { kind: "event", id: e.id } });
          animateYear(eventTime(e), 1000);
        },
      });
    }
    for (const l of storyLines) {
      if (lineHits.length >= 4) break;
      if (!l.name.includes(s)) continue;
      lineHits.push({
        key: `l-${l.id}`,
        title: l.name,
        sub: "一条线的故事",
        go: () => openExplore({ panel: { kind: "line", id: l.id } }),
      });
    }
    return takeRoundRobin(
      [cityHits, personHits, eventHits, gazHits, lineHits],
      12,
    );
  }, [q, forHome]);
}

export function SearchBox({
  forHome = false,
  autoFocus = false,
  onDone,
}: {
  forHome?: boolean;
  autoFocus?: boolean;
  onDone?: () => void;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const hits = useSearch(q, forHome);
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className={`search${open && hits.length ? " open" : ""}`}>
      <Icon name="search" />
      <input
        ref={input}
        autoFocus={autoFocus}
        value={q}
        placeholder={
          forHome ? "输入你家乡的城市，如 杭州" : "搜索城市、古地名、人物、事件"
        }
        onChange={(e) => {
          setQ(e.target.value);
          setHi(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing || e.keyCode === 229) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHi((i) => Math.min(hits.length - 1, i + 1));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setHi((i) => Math.max(0, i - 1));
          }
          if (e.key === "Enter" && hits[hi]) {
            hits[hi].go();
            setQ("");
            input.current?.blur();
            onDone?.();
          }
          if (e.key === "Escape") input.current?.blur();
        }}
      />
      {open && hits.length > 0 && (
        <ul className="search-list">
          {hits.map((h, i) => (
            <li key={h.key}>
              <button
                className={i === hi ? "on" : ""}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setHi(i)}
                onClick={() => {
                  h.go();
                  setQ("");
                  input.current?.blur();
                  onDone?.();
                }}
              >
                <b>{h.title}</b>
                <span>{h.sub}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TopBar({
  onGuide,
  onStories,
}: {
  onGuide: () => void;
  onStories: () => void;
}) {
  const theme = useStore((s) => s.theme);
  const muted = useStore((s) => s.muted);
  const layers = useStore((s) => s.layers);
  const mode = useStore((s) => s.mode);
  const hometown = useStore((s) => s.hometown);
  const [menu, setMenu] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e: PointerEvent) => {
      if (!anchor.current?.contains(e.target as Node)) setMenu(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const toggle = (k: keyof Omit<typeof layers, "lines">) =>
    setState({ layers: { ...layers, [k]: !layers[k] } });
  const toggleLine = (id: string) =>
    setState({
      layers: {
        ...layers,
        lines: { ...layers.lines, [id]: !layers.lines[id] },
      },
    });

  return (
    <header className={`topbar${mode === "opening" ? " hidden" : ""}`}>
      <div className="brand">
        <span className="brand-mark" />
        <span className="brand-name">时空地图</span>
        <span className="brand-sub">三国前后</span>
      </div>

      <SearchBox />

      <div className="tools">
        <button
          className="tool stories-btn"
          onClick={onStories}
          aria-label="精选故事"
        >
          <Icon name="layers" />
          <span>精选故事</span>
        </button>
        <button className="tool guide-btn" onClick={onGuide}>
          <Icon name={mode === "guide" ? "close" : "play"} />
          <span>{mode === "guide" ? "退出讲述" : "跟着历史走"}</span>
        </button>
        <div className="tool-anchor" ref={anchor}>
          <button
            className={`tool${menu ? " on" : ""}`}
            aria-expanded={menu}
            aria-label="更多"
            onClick={() => setMenu(!menu)}
          >
            <Icon name="layers" />
          </button>
          {menu && (
            <div className="popover">
              <h4>我的家乡</h4>
              <p className="muted">
                地图上会钉住它。点那枚针，看它在这一年属于谁。
              </p>
              <SearchBox forHome onDone={() => setMenu(false)} />
              {hometown && (
                <button
                  className="link"
                  onClick={() => setState({ hometown: null })}
                >
                  清除{hometown}
                </button>
              )}
              <h4>地图</h4>
              <p className="muted">
                眼前的大事会自己出现。下面两项打开后，才把整张图铺满。
              </p>
              <LayerRow
                label="势力范围"
                on={layers.territory}
                onClick={() => toggle("territory")}
              />
              <LayerRow
                label="州界"
                on={layers.provinces}
                onClick={() => toggle("provinces")}
              />
              <LayerRow
                label="全部事件"
                on={layers.events}
                onClick={() => toggle("events")}
              />
              <LayerRow
                label="全部人物"
                on={layers.people}
                onClick={() => toggle("people")}
              />
              <LayerRow
                label="古代水系"
                on={layers.rivers}
                onClick={() => toggle("rivers")}
              />
              <LayerRow
                label="关隘与要道"
                on={layers.passes}
                onClick={() => toggle("passes")}
              />
              {storyLines.length > 0 && <h4>一条线的故事</h4>}
              {storyLines.map((l) => (
                <div key={l.id} className="layer-line">
                  <LayerRow
                    label={l.name}
                    on={!!layers.lines[l.id]}
                    onClick={() => toggleLine(l.id)}
                    color={l.color}
                  />
                  <button
                    className="link"
                    onClick={() =>
                      openExplore({ panel: { kind: "line", id: l.id } })
                    }
                  >
                    看故事
                  </button>
                </div>
              ))}
              <h4>这一台</h4>
              <LayerRow
                label={muted ? "旁白关着" : "旁白开着"}
                on={!muted}
                onClick={() => setState({ muted: !muted })}
              />
              <LayerRow
                label={theme === "dark" ? "深色地图" : "浅色地图"}
                on={theme === "light"}
                onClick={() =>
                  setState({ theme: theme === "dark" ? "light" : "dark" })
                }
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function LayerRow({
  label,
  on,
  onClick,
  color,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button className={`layer-row${on ? " on" : ""}`} onClick={onClick}>
      <span
        className="switch"
        style={color ? ({ "--c": color } as React.CSSProperties) : undefined}
      >
        <i />
      </span>
      {label}
    </button>
  );
}
