"use client";

import { Component, useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useProgress } from "@react-three/drei";
import { altText, assets, deviceForWidth, type Device, type Environment } from "./config";
import { useScene, useSceneInternals, type SceneStatus } from "./scene-context";

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
}: {
  environment?: Environment;
  className?: string;
  /** Drag (and arrow keys) turn the view left/right. Turn off on pages that scroll, so touch scrolling still works. */
  interactive?: boolean;
}) {
  const { setStatus, register, paused } = useSceneInternals();
  const { rotateYaw } = useScene();
  const device = useSyncExternalStore(subscribeDevice, getDevice, () => null);
  const webgl = useSyncExternalStore(noop, getWebgl, () => null);
  const { progress } = useProgress();

  // Status is derived from "which scene finished or failed", not set from an effect: a GLB that is already cached
  // (Mars shares one file across devices) reports ready before any effect could have reset the status to loading.
  const key = `${environment}-${device}`;
  const [readyKey, setReadyKey] = useState<string | null>(null);
  const [failedKey, setFailedKey] = useState<string | null>(null);
  const onReady = useCallback(() => setReadyKey(key), [key]);
  const onError = useCallback(() => setFailedKey(key), [key]);
  const status: SceneStatus = webgl === false || failedKey === key ? "fallback" : readyKey === key ? "siap" : "memuat";
  useEffect(() => {
    setStatus(status);
  }, [status, setStatus]);

  const show3d = device !== null && webgl !== false && status !== "fallback";

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-black focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#72b8d5] ${className}`}
      {...(interactive && {
        tabIndex: 0,
        role: "group",
        "aria-label": "Scene 3D. Seret atau tekan tombol panah kiri dan kanan untuk memutar pandangan.",
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            rotateYaw(e.key === "ArrowLeft" ? 5 : -5);
          }
        },
      })}
    >
      {/* Poster is plain HTML (<picture>, chosen by media query), so it shows from the first paint, before any JavaScript has loaded.
          Same breakpoints as deviceForWidth(). Not next/image: it cannot do <picture>, and the WebP files are already sized per device. */}
      <picture>
        <source media="(max-width: 575.98px)" srcSet={assets[environment].mobile.poster} />
        <source media="(max-width: 1103.98px)" srcSet={assets[environment].tablet.poster} />
        <img src={assets[environment].desktop.poster} alt={altText[environment]} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
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
              onReady={onReady}
              onError={onError}
            />
          </SceneErrorBoundary>
        </div>
      )}

      {status === "memuat" && show3d && (
        <div role="status" className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 text-sm text-[#a8b1c2]">
          <span>Memuat scene 3D… {Math.round(progress)}%</span>
          <span className="h-1 w-40 overflow-hidden rounded-full bg-white/15">
            <span className="block h-full bg-[#72b8d5]" style={{ width: `${progress}%` }} />
          </span>
        </div>
      )}
      {status === "fallback" && (
        <p role="status" className="absolute inset-x-0 bottom-6 text-center text-sm text-[#a8b1c2]">
          Tampilan 3D tidak tersedia, menampilkan gambar statis.
        </p>
      )}
    </div>
  );
}
