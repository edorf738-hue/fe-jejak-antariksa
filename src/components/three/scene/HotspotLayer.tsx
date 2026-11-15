"use client";

import { useEffect, useMemo, useRef } from "react";
import { useImersif } from "@/components/hud";
import { TitikInfoPlaceholder } from "@/components/hud/ScenePlaceholder";
import type { Environment } from "./config";
import { objek } from "./objects";
import { useScene } from "./scene-context";

/**
 * Titik Info tied to the real 3D objects (slot `hotspots` of <HalamanImersif>). Each dot follows its object's world position
 * (written straight to `style.transform` every frame: no React re-render while the camera moves). The name shows on hover,
 * focus or when selected. Selecting turns the camera toward the object and opens its data card; selecting again closes it
 * and brings the view back. Environments with no object of their own (Mars) show a short note instead of invented dots.
 */
export function HotspotLayer({ environment }: { environment: Environment }) {
  const { benda, bendaIdx, pilihBenda, statusScene } = useImersif();
  const { anchors, worldToScreen, focusOn, resetCamera } = useScene();
  const refs = useRef(new Map<string, HTMLDivElement>());

  useEffect(() => {
    if (anchors.length === 0) return;
    let raf = 0;
    const place = () => {
      for (const a of anchors) {
        const el = refs.current.get(a.id);
        if (!el) continue;
        const p = worldToScreen(a.pos);
        el.style.transform = `translate(${(p.x - 22).toFixed(1)}px, ${(p.y - 22).toFixed(1)}px)`;
        el.style.visibility = p.terlihat ? "visible" : "hidden";
      }
    };
    const loop = () => {
      place();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    // Slow fallback: browsers hold back requestAnimationFrame in background or hidden tabs, and the dots must still land right.
    const timer = setInterval(place, 200);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
  }, [anchors, worldToScreen]);

  // Once the scene and its objects are there, ease the view toward them so they are what the eye lands on (otherwise they
  // sit low in the frame, under the HUD cards). It aims at the middle of all the dots, so several objects stay in view.
  // Runs once per scene; the visitor can take over any time.
  const sudahFokus = useRef("");
  const tengah = useMemo<[number, number, number] | null>(() => {
    // only the placed models count; ground markers without a model must not pull the view away from the objects
    const ids = objek[environment].filter((d) => d.model).map((d) => d.id);
    const dots = anchors.filter((a) => ids.some((id) => a.id.startsWith(id + "-")));
    if (dots.length === 0) return null;
    const sum = dots.reduce((a, p) => [a[0] + p.pos[0], a[1] + p.pos[1], a[2] + p.pos[2]], [0, 0, 0]);
    return [sum[0] / dots.length, sum[1] / dots.length, sum[2] / dots.length];
  }, [anchors, environment]);
  const jumlah = objek[environment].filter((d) => d.model).length;
  useEffect(() => {
    if (statusScene !== "siap" || !tengah || sudahFokus.current === environment) return;
    const t = setTimeout(() => {
      sudahFokus.current = environment;
      focusOn(tengah, jumlah > 1 ? 0.95 : 0.8);
    }, 2400); // after the entrance animation
    return () => clearTimeout(t);
  }, [statusScene, tengah, jumlah, environment, focusOn]);

  function pilih(idx: number, pos: [number, number, number]) {
    if (bendaIdx === idx) {
      pilihBenda(null);
      resetCamera();
      return;
    }
    pilihBenda(idx);
    focusOn(pos, 0.6);
  }

  if (statusScene !== "siap") return null;

  if (objek[environment].length === 0) {
    return (
      <p className="glass pointer-events-none absolute bottom-40 left-1/2 z-10 -translate-x-1/2 rounded-pill border border-white/10 px-5 py-2 text-center text-sm text-text-secondary-normal max-lg:w-[calc(100%-48px)] lg:bottom-32">
        Objek 3D untuk lingkungan ini belum tersedia.
      </p>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {anchors.map((a, i) => {
        const b = benda[a.bendaIdx];
        if (!b) return null;
        return (
          <div
            key={a.id}
            ref={(el) => {
              if (el) refs.current.set(a.id, el);
              else refs.current.delete(a.id);
            }}
            className="absolute left-0 top-0 will-change-transform"
            style={{ visibility: "hidden" }}
          >
            <TitikInfoPlaceholder
              label={b.hotspot}
              aktif={bendaIdx === a.bendaIdx}
              urutan={i}
              onClick={() => pilih(a.bendaIdx, a.pos)}
              className="pointer-events-auto"
            />
          </div>
        );
      })}
    </div>
  );
}
