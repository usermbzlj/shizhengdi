import type { Map as MLMap } from "maplibre-gl";

let map: MLMap | null = null;
const waiters: ((m: MLMap) => void)[] = [];
let stopWatching: (() => void) | null = null;
let paddingFrame = 0;
let cancelDeferredPadding: (() => void) | null = null;
let cameraRequest = 0;
const OCCLUDERS =
  ".topbar, .timeline, .panel, .guide, .chat, .scene-reading, .scene-sidebar, .scene-header, .studio-header, .studio-footer, .studio-map-note";

export function setMap(m: MLMap | null) {
  stopWatching?.();
  stopWatching = null;
  map = m;
  if (import.meta.env.DEV)
    (window as unknown as { __map: MLMap | null }).__map = m;
  if (m) {
    waiters.splice(0).forEach((w) => w(m));
    stopWatching = watchCameraLayout();
  }
}

/** Recompute the map's clear reading area after a panel opens, closes, or changes size. */
export function refreshCameraPadding() {
  if (paddingFrame) return;
  paddingFrame = requestAnimationFrame(() => {
    paddingFrame = 0;
    if (!map) return;
    // MapLibre setPadding delegates to jumpTo, which stops an active flight.
    // Flights already receive the current layout padding; reconcile changes
    // after the move rather than stranding the camera at an intermediate zoom.
    if (map.isMoving()) {
      if (!cancelDeferredPadding) {
        const movingMap = map;
        const afterMove = () => {
          cancelDeferredPadding = null;
          if (map === movingMap) refreshCameraPadding();
        };
        movingMap.once("moveend", afterMove);
        cancelDeferredPadding = () => {
          movingMap.off("moveend", afterMove);
        };
      }
      return;
    }
    const next = cameraPadding();
    const current = map.getPadding();
    if (
      Object.keys(next).some(
        (key) =>
          Math.abs(
            next[key as keyof typeof next] -
              (current[key as keyof typeof next] ?? 0),
          ) > 1,
      )
    )
      map.setPadding(next);
  });
}

function watchCameraLayout() {
  const watched = new Set<Element>();
  const sizes = new ResizeObserver(refreshCameraPadding);
  const scan = () => {
    for (const node of document.querySelectorAll(OCCLUDERS)) {
      if (!watched.has(node)) {
        watched.add(node);
        sizes.observe(node);
      }
    }
    for (const node of watched)
      if (!node.isConnected) {
        sizes.unobserve(node);
        watched.delete(node);
      }
    refreshCameraPadding();
  };
  const changes = new MutationObserver((records) => {
    if (
      records.some(
        (record) =>
          [...record.addedNodes, ...record.removedNodes].some(
            (node) =>
              node instanceof Element &&
              (node.matches(OCCLUDERS) || node.querySelector(OCCLUDERS)),
          ) ||
          (record.type === "attributes" &&
            record.target instanceof Element &&
            (record.target.matches(".app") ||
              record.target.matches(OCCLUDERS))),
      )
    )
      scan();
  });
  const root = document.querySelector(".app");
  if (root)
    changes.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  window.addEventListener("resize", scan);
  scan();
  return () => {
    sizes.disconnect();
    changes.disconnect();
    window.removeEventListener("resize", scan);
    cancelAnimationFrame(paddingFrame);
    paddingFrame = 0;
    cancelDeferredPadding?.();
    cancelDeferredPadding = null;
  };
}

export function getMap() {
  return map;
}

export function whenMap(): Promise<MLMap> {
  return map ? Promise.resolve(map) : new Promise((r) => waiters.push(r));
}

/** Fly the camera and resolve when the move ends, or shortly after the expected duration. */
export async function flyTo(
  center: [number, number],
  zoom: number,
  duration = 2200,
  signal?: AbortSignal,
) {
  if (
    !Number.isFinite(center[0]) ||
    !Number.isFinite(center[1]) ||
    signal?.aborted
  )
    return;
  const request = ++cameraRequest;
  const m = await whenMap();
  if (getMap() !== m || request !== cameraRequest || signal?.aborted) return;
  // Stop before subscribing: flyTo itself stops the previous flight and emits
  // its moveend synchronously. That old event must not settle this new request.
  m.stop();
  return new Promise<void>((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      m.off("moveend", done);
      signal?.removeEventListener("abort", abort);
      resolve();
    };
    const abort = () => {
      if (request === cameraRequest && getMap() === m) {
        cameraRequest++;
        m.stop();
      }
      done();
    };
    const timer = window.setTimeout(done, duration + 600);
    m.once("moveend", done);
    signal?.addEventListener("abort", abort, { once: true });
    try {
      m.flyTo({
        center,
        zoom,
        duration,
        curve: 1.3,
        essential: true,
        padding: cameraPadding(),
      });
    } catch {
      done();
    }
  });
}

/** Keep focal points clear of the bottom timeline and side panel. */
export function cameraPadding() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const padding = { top: 16, bottom: 16, left: 16, right: 16 };
  for (const node of document.querySelectorAll<HTMLElement>(OCCLUDERS)) {
    const style = getComputedStyle(node);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      (Number(style.opacity) < 0.05 && style.pointerEvents === "none")
    )
      continue;
    const rect = node.getBoundingClientRect();
    if (
      !rect.width ||
      !rect.height ||
      rect.bottom <= 0 ||
      rect.top >= h ||
      rect.right <= 0 ||
      rect.left >= w
    )
      continue;
    if (node.matches(".topbar"))
      padding.top = Math.max(padding.top, rect.bottom + 12);
    else if (node.matches(".timeline"))
      padding.bottom = Math.max(padding.bottom, h - rect.top + 12);
    else if (rect.width > w * 0.62 || (w < 760 && rect.top > h * 0.3)) {
      if (rect.top > h * 0.25)
        padding.bottom = Math.max(padding.bottom, h - rect.top + 16);
      else padding.top = Math.max(padding.top, rect.bottom + 12);
    } else if (rect.left > w * 0.45)
      padding.right = Math.max(padding.right, w - rect.left + 16);
    else if (rect.right < w * 0.55)
      padding.left = Math.max(padding.left, rect.right + 16);
    else if (rect.top > h * 0.4)
      padding.bottom = Math.max(padding.bottom, h - rect.top + 16);
  }
  // Very short windows still keep a usable map viewport when several panels are open.
  const vertical = padding.top + padding.bottom;
  if (vertical > h - 120) {
    const scale = Math.max(0, h - 120) / vertical;
    padding.top *= scale;
    padding.bottom *= scale;
  }
  const horizontal = padding.left + padding.right;
  if (horizontal > w - 120) {
    const scale = Math.max(0, w - 120) / horizontal;
    padding.left *= scale;
    padding.right *= scale;
  }
  return padding;
}
