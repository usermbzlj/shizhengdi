import { useEffect, useRef, useState } from "react";
import { setState, useStore } from "../lib/store";
import { Icon } from "./Icon";

/** Optional local narration follows the chosen paragraph; it never advances the story. */
export default function SceneNarration({
  sceneId,
  stepId,
  paused = false,
}: {
  sceneId: string;
  stepId: string;
  paused?: boolean;
}) {
  const muted = useStore((s) => s.muted);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "playing" | "paused" | "ended" | "error"
  >(() => (muted ? "paused" : "idle"));
  const [progress, setProgress] = useState(0);
  const play = (player: HTMLAudioElement) => {
    void player
      .play()
      .then(() => {
        if (audio.current === player)
          setStatus(player.paused ? "paused" : "playing");
      })
      .catch(() => {
        if (audio.current === player) setStatus("error");
      });
  };
  useEffect(() => {
    const player = new Audio(
      `${import.meta.env.BASE_URL}audio/scene-${sceneId}/${stepId}.mp3`,
    );
    player.preload = "metadata";
    audio.current = player;
    // This component is keyed by paragraph. State starts fresh on a new paragraph;
    // subsequent status changes follow the media element's actual events.
    player.onplay = player.onwaiting = () => {
      if (audio.current === player) setStatus("loading");
    };
    player.onplaying = () => {
      if (audio.current === player) setStatus("playing");
    };
    player.onpause = () => {
      if (audio.current === player && !player.ended) setStatus("paused");
    };
    player.ontimeupdate = () => {
      if (audio.current === player && player.duration)
        setProgress(player.currentTime / player.duration);
    };
    player.onended = () => {
      if (audio.current === player) setStatus("ended");
    };
    player.onerror = () => {
      if (audio.current === player) setStatus("error");
    };
    return () => {
      audio.current = null;
      player.pause();
      player.ontimeupdate = player.onended = player.onerror = null;
      player.onplay =
        player.onwaiting =
        player.onplaying =
        player.onpause =
          null;
      player.removeAttribute("src");
      player.load();
    };
  }, [sceneId, stepId]);
  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    if (muted || paused) {
      player.pause();
    } else if (!player.ended) play(player);
  }, [muted, paused, sceneId, stepId]);
  const label = muted
    ? "开启本段旁白"
    : status === "error"
      ? "旁白未能播放，点击重试"
      : status === "ended"
        ? "重听本段旁白"
        : "暂停本段旁白";
  const toggle = () => {
    const player = audio.current;
    if (!muted && player && (status === "ended" || status === "error")) {
      if (status === "ended") {
        player.currentTime = 0;
        setProgress(0);
      } else player.load();
      play(player);
    } else setState({ muted: !muted });
  };
  return (
    <button
      className="scene-icon-btn scene-narration"
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={!muted}
      data-audio-state={status}
    >
      <Icon name={muted ? "mute" : "sound"} />
      {!muted && (
        <svg
          className="scene-narration-ring"
          width="44"
          height="44"
          viewBox="0 0 44 44"
          aria-hidden="true"
        >
          <circle
            cx="22"
            cy="22"
            r="19"
            pathLength="1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray={`${progress} 1`}
            transform="rotate(-90 22 22)"
          />
        </svg>
      )}
      {status === "error" && !muted && (
        <span className="scene-audio-error" aria-hidden="true">
          !
        </span>
      )}
    </button>
  );
}
