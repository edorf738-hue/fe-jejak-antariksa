"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { Camera } from "three";

export type SceneStatus = "memuat" | "siap" | "fallback";
export type ScreenPoint = { x: number; y: number; terlihat: boolean };
/** A hotspot position tied to a placed 3D object: index into the page's `benda`, and its 3D world position. */
export type SceneAnchor = { id: string; bendaIdx: number; pos: [number, number, number] };

// What <SceneCanvas> registers once its 3D scene is ready.
export type SceneImpl = {
  camera: Camera;
  worldToScreen: (pos: [number, number, number]) => ScreenPoint;
  resetCamera: () => void;
  rotateYaw: (deltaDeg: number) => void;
  rotatePitch: (deltaDeg: number) => void;
  zoomBy: (factor: number) => void;
  focusOn: (pos: [number, number, number], zoom?: number) => void;
};

export type SceneApi = {
  status: SceneStatus;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  /** Camera of the active scene, null until status is "siap". */
  getCamera: () => Camera | null;
  /** 3D world position -> CSS pixels inside the canvas. */
  worldToScreen: (pos: [number, number, number]) => ScreenPoint;
  /** Back to the GLB camera angle (also cancels the intro animation). */
  resetCamera: () => void;
  /** Turn the view left (+) or right (-) by some degrees, within the yaw limit. For buttons and keyboard. */
  rotateYaw: (deltaDeg: number) => void;
  /** Look up (+) or down (-) by some degrees, within the limit. */
  rotatePitch: (deltaDeg: number) => void;
  /** Multiply the field of view: below 1 zooms in, above 1 zooms out. Clamped to the environment's zoom range. */
  zoomBy: (factor: number) => void;
  /** Hotspots of the objects placed in the scene (empty while loading, and on Mars). */
  anchors: SceneAnchor[];
  /** Ease the camera toward a 3D point and zoom in a little (`zoom` = fraction of the full field of view). */
  focusOn: (pos: [number, number, number], zoom?: number) => void;
};

// Internal: used by <SceneCanvas> only, not part of the public contract.
export type SceneInternals = {
  status: SceneStatus;
  setStatus: (status: SceneStatus) => void;
  register: (impl: SceneImpl | null) => void;
  setAnchors: (anchors: SceneAnchor[]) => void;
  paused: boolean;
};

const ApiContext = createContext<SceneApi | null>(null);
const InternalsContext = createContext<SceneInternals | null>(null);

/** Wrap the page with this so <SceneCanvas> and anything that reads useScene() (hotspots, HUD) share one scene. */
export function SceneProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SceneStatus>("memuat");
  // Start paused (one still frame) for visitors who asked the OS for reduced motion.
  const [paused, setPaused] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [anchors, setAnchors] = useState<SceneAnchor[]>([]);
  const impl = useRef<SceneImpl | null>(null);

  const register = useCallback((next: SceneImpl | null) => {
    impl.current = next;
  }, []);

  const api = useMemo<SceneApi>(
    () => ({
      status,
      paused,
      setPaused,
      getCamera: () => impl.current?.camera ?? null,
      worldToScreen: (pos) => impl.current?.worldToScreen(pos) ?? { x: 0, y: 0, terlihat: false },
      resetCamera: () => impl.current?.resetCamera(),
      rotateYaw: (d) => impl.current?.rotateYaw(d),
      rotatePitch: (d) => impl.current?.rotatePitch(d),
      zoomBy: (f) => impl.current?.zoomBy(f),
      anchors,
      focusOn: (p, z) => impl.current?.focusOn(p, z),
    }),
    [status, paused, anchors],
  );
  const internals = useMemo<SceneInternals>(() => ({ status, setStatus, register, setAnchors, paused }), [status, register, paused]);

  return (
    <ApiContext.Provider value={api}>
      <InternalsContext.Provider value={internals}>{children}</InternalsContext.Provider>
    </ApiContext.Provider>
  );
}

export function useScene(): SceneApi {
  const api = useContext(ApiContext);
  if (!api) throw new Error("useScene() must be used inside <SceneProvider>");
  return api;
}

export function useSceneInternals(): SceneInternals {
  const internals = useContext(InternalsContext);
  if (!internals) throw new Error("<SceneCanvas> must be used inside <SceneProvider>");
  return internals;
}
