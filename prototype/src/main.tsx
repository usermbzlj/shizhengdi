import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";
import { sceneById } from "./data/scenes";
import { setState } from "./lib/store";

// A shared story link opens the story immediately, without mounting the rewind.
const requestedScene = new URLSearchParams(window.location.search).get("scene");
if (requestedScene && sceneById.has(requestedScene)) {
  setState({ mode: "scene", modernity: 0, panel: null });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
