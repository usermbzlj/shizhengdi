import { useEffect, useState } from "react";
import MapView from "./map/MapView";
import Timeline from "./components/Timeline";
import TopBar from "./components/TopBar";
import Panel from "./components/Panel";
import GuidePlayer, { type GuideScript } from "./components/GuidePlayer";
import Opening from "./components/Opening";
import { Chat, TravelOverlay, useTravel } from "./components/Travel";
import { getState, setState, useStore } from "./lib/store";
import { abortTravel } from "./components/Travel";
import { chapters, lineById } from "./data";
import { startPlayback } from "./lib/playback";
import { SceneHub } from "./components/SceneExperience";
import SceneStudio from "./components/SceneStudio";
import { sceneById } from "./data/scenes";
import Life from "./life/Life";
import Hub from "./game/Hub";
import Traveler from "./game/Traveler";

const params = new URLSearchParams(window.location.search);
const lifeSample = params.has("life");
const route: "life" | "roam" | "atlas" | "hub" = lifeSample
  ? "life"
  : params.has("roam")
    ? "roam"
    : params.has("atlas") || params.has("scene")
      ? "atlas"
      : "hub";

const requestedScene = new URLSearchParams(window.location.search).get("scene");
const linkedScene =
  requestedScene && sceneById.has(requestedScene) ? requestedScene : null;
function sceneAddress(id: string | null) {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set("scene", id);
  else url.searchParams.delete("scene");
  window.history.replaceState(window.history.state, "", url);
}

function chapterScript(): GuideScript | null {
  const c = chapters[0];
  return c
    ? {
        id: c.id,
        title: c.title,
        subtitle: c.subtitle,
        steps: c.steps,
        visitor: c.visitor,
        audioDir: `audio/${c.id}`,
      }
    : null;
}

export default function App() {
  if (route === "life") return <LifeSample />;
  if (route === "atlas") return <Main />;
  return <Game />;
}

function Game() {
  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
  }, []);
  return (
    <div className={`app mode-${route === "roam" ? "roam" : "game"}`}>
      <div className="app-content">
        <MapView />
        {route === "hub" && <Hub />}
        {route === "roam" && <Traveler resume={params.get("resume") === "1"} />}
      </div>
    </div>
  );
}

function LifeSample() {
  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
  }, []);
  return (
    <div className="app mode-life">
      <div className="app-content">
        <MapView />
        <Life />
      </div>
    </div>
  );
}

function Main() {
  const mode = useStore((s) => s.mode);
  const theme = useStore((s) => s.theme);
  const [script, setScript] = useState<GuideScript | null>(null);
  const [cue, setCue] = useState<string | null>(null);
  const [sceneId, setSceneId] = useState<string | null>(linkedScene);
  const [storiesOpen, setStoriesOpen] = useState(false);
  const panel = useStore((s) => s.panel);
  const travel = useTravel();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => startPlayback(), []);

  useEffect(() => {
    if (!cue) return;
    const t = setTimeout(() => setCue(null), 5600);
    return () => clearTimeout(t);
  }, [cue]);

  const startGuide = () => {
    if (getState().mode === "guide")
      return setState({ mode: "explore", hold: false, panel: null });
    abortTravel();
    setScript(chapterScript());
    setState({
      mode: "guide",
      panel: null,
      modernity: 0,
      chatPerson: null,
      hold: false,
    });
  };

  const playLine = (id: string) => {
    const l = lineById.get(id);
    if (!l) return;
    abortTravel();
    setScript({
      id: `line-${l.id}`,
      title: "一条线的故事",
      subtitle: l.name,
      steps: l.story,
      audioDir: `audio/line-${l.id}`,
    });
    setState({
      mode: "guide",
      panel: null,
      modernity: 0,
      chatPerson: null,
      hold: false,
    });
  };

  const exitGuide = () =>
    setState({ mode: "explore", hold: false, panel: null });

  const invite = (id: string) => {
    sceneAddress(null);
    setState({ mode: "explore" });
    travel.invite(id);
  };

  const onToday = () => {
    const s = getState();
    setState({
      mode: "explore",
      hold: false,
      layers: { ...s.layers, people: true },
    });
    setCue("点一位此时此地的人，请他来到今天。");
  };

  const openStories = () => {
    if (getState().mode === "scene") {
      setStoriesOpen(true);
      return;
    }
    sceneAddress(null);
    abortTravel();
    setState({
      mode: "explore",
      panel: null,
      hold: false,
      modernity: 0,
      chatPerson: null,
    });
    setStoriesOpen(true);
  };
  const startScene = (id: string) => {
    if (!sceneById.has(id)) return;
    abortTravel();
    sceneAddress(id);
    setStoriesOpen(false);
    setSceneId(id);
    setState({
      mode: "scene",
      panel: null,
      hold: false,
      modernity: 0,
      chatPerson: null,
    });
  };

  return (
    <div className={`app mode-${mode}`}>
      <div className="app-content" inert={storiesOpen}>
        <MapView />
        <div className="vignette" />
        <TopBar onGuide={startGuide} onStories={openStories} />
        <Panel onInvite={invite} onPlayLine={playLine} onScene={startScene} />
        <GuidePlayer script={script} onExit={exitGuide} onInvite={invite} />
        <TravelOverlay trip={travel.trip} />
        <Chat trip={travel.trip} onBack={travel.sendBack} />
        <Timeline onToday={onToday} cue={panel ? null : cue} />
        {mode === "scene" && sceneId && (
          <SceneStudio
            key={sceneId}
            id={sceneId}
            suspended={storiesOpen}
            onExit={() => {
              sceneAddress(null);
              setState({ mode: "explore", panel: null });
            }}
            onLibrary={openStories}
            onSelect={startScene}
            onInvite={invite}
          />
        )}
        <Opening
          onDone={(choice) => {
            if (choice === "guide") {
              setScript(chapterScript());
              setState({ mode: "guide" });
            } else if (choice === "stories") openStories();
            else setState({ mode: "explore" });
          }}
        />
      </div>
      {storiesOpen && (
        <SceneHub onSelect={startScene} onClose={() => setStoriesOpen(false)} />
      )}
    </div>
  );
}
