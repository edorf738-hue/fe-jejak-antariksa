"use client";

import { Component, useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useGLTF, useProgress } from "@react-three/drei";
import { altText, assets, deviceForWidth, type Device, type Environment } from "./config";
import { useScene, useSceneInternals, type SceneStatus } from "./scene-context";
import { useLang } from "@/components/ui/LangProvider";
import { HUD } from "@/lib/ui-copy";

/** English alt text for the poster image (Indonesian lives in config.ts `altText`). */
const ALT_EN: Record<Environment, string> = {
  moon: "The lunar surface with Earth rising on the horizon",
  mars: "The dusty red surface of Mars with rocks and hills under an orange sky",
  "deep-space": "Deep space with stars, a dusty nebula, a rust-colored planet, and one small moon",
};

// The 3D bundle (three + R3F) is only downloaded on the client when a scene is shown.
const SceneRenderer = dynamic(() => import("./SceneRenderer"), { ssr: false });

// --- browser state read without effects (null on the server) ---
const MOBILE = "(max-width: 575.98px)";
const TABLET = "(max-width: 1103.98px)";

function subscribeDevice(cb: () => void) {
  const qs = [MOBILE, TABLET].map((q) => window.matchMedia(q));
  qs.forEach((q) => q.addEventListener("change", cb));
  return () => qs.forEach((q) => q.removeEventListener("change", cb));
}
const getDevice = (): Device | null => deviceForWidth(window.innerWidth);

let webglOk: boolean | undefined;
function getWebgl(): boolean | null {
  if (webglOk === undefined) {
    const c = document.createElement("canvas");
    webglOk = !!(c.getContext("webgl2") || c.getContext("webgl"));
  }
  return webglOk;
}
const noop = () => () => {};

class SceneErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error("[SceneCanvas] 3D scene failed, showing static image", error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * One 3D environment, filling its parent (give the parent a size). Shows the static poster while loading and
 * whenever 3D is unavailable (no WebGL, load error, context lost), so the page keeps working without it.
 * Must be rendered inside <SceneProvider>.
 */
export function SceneCanvas({
  environment = "moon",
  className = "",
  interactive = true,
  headless = false,
  onStatusChange,
}: {
  environment?: Environment;
  className?: string;
  /** Drag (and arrow keys) turn the view left/right. Turn off on pages that scroll, so touch scrolling still works. */
  interactive?: boolean;
  /** The page draws its own loading and fallback messages (the HUD does): keep the poster, skip our status text. */
  headless?: boolean;
  /** Called whenever the status or the load progress (0 to 1) changes. Read straight from here, not from useScene(), which can still hold the previous scene's status right after a remount. */
  onStatusChange?: (status: SceneStatus, progress: number) => void;
}) {
  const { setStatus, register, setAnchors, paused } = useSceneInternals();
  const lang = useLang();
  const { rotateYaw, rotatePitch, zoomBy } = useScene();
  const device = useSyncExternalStore(subscribeDevice, getDevice, () => null);
  const webgl = useSyncExternalStore(noop, getWebgl, () => null);
  const { progress } = useProgress();

  // Status is derived from "which scene finished or failed", not set from an effect: a GLB that is already cached
  // (Mars shares one file across devices) reports ready before any effect could have reset the status to loading.
  const key = `${environment}-${device}`;
  const [readyKey, setReadyKey] = useState<string | null>(null);
  const [failedKey, setFailedKey] = useState<string | null>(null);
  const onReady = useCallback(() => setReadyKey(key), [key]);
  const onError = useCallback(() => {
    // A GLB that failed to load stays cached (drei keeps the rejected promise), so "Coba Lagi" would fail instantly
    // without a request. Drop it from the cache so the next mount tries the network again.
    if (device) useGLTF.clear(assets[environment][device].model);
    setFailedKey(key);
  }, [key, device, environment]);
  const status: SceneStatus = webgl === false || failedKey === key ? "fallback" : readyKey === key ? "siap" : "memuat";
  useEffect(() => {
    setStatus(status);
  }, [status, setStatus]);
  useEffect(() => {
    onStatusChange?.(status, progress / 100);
  }, [status, progress, onStatusChange]);

  const show3d = device !== null && webgl !== false && status !== "fallback";

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-black focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#72b8d5] ${className}`}
      {...(interactive && {
        tabIndex: 0,
        role: "group",
        "aria-label": HUD[lang].sceneAria,
        onKeyDown: (e: React.KeyboardEvent) => {
          const act: Record<string, () => void> = {
            ArrowLeft: () => rotateYaw(5),
            ArrowRight: () => rotateYaw(-5),
            ArrowUp: () => rotatePitch(5),
            ArrowDown: () => rotatePitch(-5),
            "+": () => zoomBy(0.85),
            "=": () => zoomBy(0.85),
            "-": () => zoomBy(1 / 0.85),
          };
          const fn = act[e.key];
          if (fn) {
            e.preventDefault();
            fn();
          }
        },
      })}
    >
      {/* Poster is plain HTML (<picture>, chosen by media query), so it shows from the first paint, before any JavaScript has loaded.
          Same breakpoints as deviceForWidth(). Not next/image: it cannot do <picture>, and the WebP files are already sized per device. */}
      <picture>
        <source media="(max-width: 575.98px)" srcSet={assets[environment].mobile.poster} />
        <source media="(max-width: 1103.98px)" srcSet={assets[environment].tablet.poster} />
        <img src={assets[environment].desktop.poster} alt={lang === "en" ? ALT_EN[environment] : altText[environment]} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      </picture>

      {show3d && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${status === "siap" ? "opacity-100" : "opacity-0"}`}
          aria-hidden="true"
        >
          <SceneErrorBoundary key={key} onError={onError}>
            <SceneRenderer
              environment={environment}
              device={device}
              paused={paused}
              interactive={interactive}
              register={register}
              onAnchors={setAnchors}
              onReady={onReady}
              onError={onError}
            />
          </SceneErrorBoundary>
        </div>
      )}

      {!headless && status === "memuat" && show3d && (
        <div role="status" className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 text-sm text-[#a8b1c2]">
          <span>{HUD[lang].sceneMemuat} {Math.round(progress)}%</span>
          <span className="h-1 w-40 overflow-hidden rounded-full bg-white/15">
            <span className="block h-full bg-[#72b8d5]" style={{ width: `${progress}%` }} />
          </span>
        </div>
      )}
      {!headless && status === "fallback" && (
        <p role="status" className="absolute inset-x-0 bottom-6 text-center text-sm text-[#a8b1c2]">
          {HUD[lang].sceneFallback}
        </p>
      )}
    </div>
  );
}
