"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { DRACO_PATH } from "@/components/three/scene/config";
import { useLang } from "@/components/ui";
import { HUD } from "@/lib/ui-copy";

useGLTF.setDecoderPath(DRACO_PATH);

/**
 * Penampil model 3D interaktif di dalam popup objek: Canvas sendiri (terpisah dari scene utama, jadi kontrolnya tidak
 * mengganggu navigasi lingkungan), OrbitControls untuk putar 360, zoom, dan sudut pandang, serta tombol setel ulang.
 * Berkas GLB yang sama dengan di scene: useGLTF menyimpannya di cache, jadi tidak diunduh ulang; yang dipasang di sini
 * hanya salinan (clone) agar scene utama tidak terganggu. Pencahayaan netral (`flat`: tanpa tone mapping) supaya warna
 * material tetap asli.
 */
type Kontrol = { reset: () => void; autoRotate: boolean } | null;

function Model({ src, onReady }: { src: string; onReady: () => void }) {
  const gltf = useGLTF(src);
  const model = useMemo(() => clone(gltf.scene), [gltf.scene]);
  // fit: the largest side becomes 2.2 units and the model is centred, so every model fills the view the same way
  const { k, pusat } = useMemo(() => {
    model.updateMatrixWorld(true);
    const box = new Box3().setFromObject(model, true);
    const size = box.getSize(new Vector3());
    const pusat = box.getCenter(new Vector3());
    return { k: 2.2 / Math.max(size.x, size.y, size.z, 1e-6), pusat };
  }, [model]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <group scale={k} position={[-pusat.x * k, -pusat.y * k, -pusat.z * k]}>
      <primitive object={model} />
    </group>
  );
}

class BatasGalat extends Component<{ children: ReactNode; saatGagal: () => void }, { gagal: boolean }> {
  state = { gagal: false };
  static getDerivedStateFromError() {
    return { gagal: true };
  }
  componentDidCatch(e: unknown) {
    console.warn("[Model3DViewer] model gagal dimuat:", e);
    this.props.saatGagal();
  }
  render() {
    return this.state.gagal ? null : this.props.children;
  }
}

export default function Model3DViewer({ src, keterangan, className = "" }: { src: string; keterangan: string; className?: string }) {
  const h = HUD[useLang()];
  const [status, setStatus] = useState<"memuat" | "siap" | "gagal">("memuat");
  const kontrol = useRef<Kontrol>(null);
  const gerakKurang =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [putarOtomatis, setPutarOtomatis] = useState(!gerakKurang);

  return (
    <div
      role="img"
      aria-label={`${h.modelAria} ${keterangan}`}
      className={`relative overflow-hidden bg-[radial-gradient(ellipse_at_center,#1b2638_0%,#080b12_80%)] ${className}`}
    >
      {status !== "gagal" && (
        <BatasGalat saatGagal={() => setStatus("gagal")}>
          <Canvas
            flat
            dpr={[1, 2]}
            frameloop={putarOtomatis ? "always" : "demand"}
            camera={{ position: [3.4, 1.9, 3.8], fov: 35 }}
            style={{ touchAction: "none" }}
          >
            <ambientLight intensity={0.9} />
            <hemisphereLight args={["#ffffff", "#40485a", 0.7]} />
            <directionalLight position={[4, 6, 5]} intensity={2.2} />
            <directionalLight position={[-5, 2, -4]} intensity={0.8} />
            <Suspense fallback={null}>
              <Model src={src} onReady={() => setStatus("siap")} />
            </Suspense>
            <OrbitControls
              ref={(c: unknown) => {
                kontrol.current = c as Kontrol;
              }}
              enablePan={false}
              enableDamping
              dampingFactor={0.08}
              minDistance={2.6}
              maxDistance={9}
              autoRotate={putarOtomatis}
              autoRotateSpeed={1.4}
              onStart={() => setPutarOtomatis(false)}
            />
          </Canvas>
        </BatasGalat>
      )}

      {status === "memuat" && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-text-secondary-normal" role="status">
          {h.modelMemuat}
        </p>
      )}
      {status === "gagal" && (
        <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-text-secondary-normal" role="status">
          {h.modelGagal}
        </p>
      )}
      {status === "siap" && (
        <>
          <p className="pointer-events-none absolute bottom-2 left-3 text-xs text-text-secondary-normal">{h.modelPetunjuk}</p>
          <button
            type="button"
            onClick={() => {
              kontrol.current?.reset();
              setPutarOtomatis(false);
            }}
            className="absolute right-2 top-2 cursor-pointer rounded-pill border border-white/20 bg-black/50 px-3 py-1 text-xs text-text-primary-normal transition-colors hover:border-aksen-informasi-normal"
          >
            {h.modelReset}
          </button>
        </>
      )}
    </div>
  );
}
