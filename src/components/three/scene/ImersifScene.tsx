"use client";

import { useCallback, useEffect } from "react";
import { useImersif, useResetKamera } from "@/components/hud";
import type { Environment } from "./config";
import { SceneCanvas } from "./SceneCanvas";
import { useScene, type SceneStatus } from "./scene-context";

/**
 * Puts a SceneCanvas into the `scene` slot of <HalamanImersif> and connects it to the HUD
 * (kontrak 3D <-> HUD, PEMBAGIAN_TUGAS bagian 5):
 *  - status and load progress go to the HUD (`setStatusScene`), which draws the Figma loading overlay and the fallback card;
 *  - Jeda Gerak (`paused`) comes from the HUD;
 *  - the Setel Ulang Kamera button resets the view (`useResetKamera`).
 * Must sit inside <SceneProvider>, which wraps the page so hotspots can read useScene() too.
 */
export function ImersifScene({ environment }: { environment: Environment }) {
  const { paused, setStatusScene } = useImersif();
  const { setPaused, resetCamera } = useScene();

  useEffect(() => {
    setPaused(paused);
  }, [paused, setPaused]);

  useResetKamera(resetCamera);

  const onStatusChange = useCallback(
    (status: SceneStatus, progress: number) => setStatusScene(status, status === "memuat" && progress > 0 ? progress : undefined),
    [setStatusScene],
  );

  // headless: the HUD owns the loading and fallback UI; the poster inside stays visible under its dimmed overlay.
  return <SceneCanvas environment={environment} headless onStatusChange={onStatusChange} />;
}
