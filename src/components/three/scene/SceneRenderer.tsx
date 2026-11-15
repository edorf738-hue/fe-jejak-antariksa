"use client";

import { Component, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AgXToneMapping,
  BackSide,
  Box3,
  BufferGeometry,
  Color,
  DirectionalLight,
  Float32BufferAttribute,
  MathUtils,
  Mesh,
  Quaternion,
  Raycaster,
  SRGBColorSpace,
  DoubleSide,
  CanvasTexture,
  Vector3,
  type Material,
  type Object3D,
  type PerspectiveCamera,
  type Texture,
  type WebGLRenderer,
} from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { assets, DRACO_PATH, look, rig, type Device, type Environment, type RigConfig } from "./config";
import { objek, type ObjekDef } from "./objects";
import type { SceneAnchor, SceneImpl } from "./scene-context";

useGLTF.setDecoderPath(DRACO_PATH);

// Earth atmosphere rim: also missing from the Moon GLB (see Lunar README).
const GLOW = { color: "#7fb4ff", strength: 3, power: 1.8, size: 1.08 };

const toneMapping = (tone: "agx" | "aces") => (tone === "aces" ? ACESFilmicToneMapping : AgXToneMapping);

const STAR_COUNT = 2500;
const STAR_RADIUS = 20000; // camera far plane in the GLB is 30000

// Deterministic PRNG so the star field is the same on every load.
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Stars() {
  const geometry = useMemo(() => {
    const rand = mulberry32(1969);
    const pos: number[] = [];
    while (pos.length < STAR_COUNT * 3) {
      // uniform on a sphere, keep the upper part of the sky only
      const y = rand() * 2 - 1;
      if (y < -0.05) continue;
      const phi = rand() * Math.PI * 2;
      const r = Math.sqrt(1 - y * y);
      pos.push(Math.cos(phi) * r * STAR_RADIUS, y * STAR_RADIUS, Math.sin(phi) * r * STAR_RADIUS);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <points geometry={geometry} frustumCulled={false} renderOrder={-10}>
      <pointsMaterial color="#ffffff" size={1.6} sizeAttenuation={false} transparent opacity={0.85} depthWrite={false} />
    </points>
  );
}

const inUse = new Map<string, number>(); // GLB url -> mounted users

function disposeScene(root: Object3D) {
  root.traverse((o) => {
    if (!(o instanceof Mesh)) return;
    o.geometry?.dispose();
    const mats = (Array.isArray(o.material) ? o.material : [o.material]) as (Material | undefined)[];
    for (const m of mats) {
      if (!m) continue;
      for (const v of Object.values(m)) if (v && (v as Texture).isTexture) (v as Texture).dispose();
      m.dispose();
    }
  });
}

function fitCamera(cam: PerspectiveCamera, width: number, height: number) {
  // Before the canvas is measured its size is 0 x 0, and 0 / 0 is NaN: keep the aspect the GLB camera came with.
  if (width > 0 && height > 0) cam.aspect = width / height;
  cam.updateProjectionMatrix();
}

type RigControls = {
  reset: () => void;
  rotate: (deltaDeg: number) => void;
  rotatePitch: (deltaDeg: number) => void;
  zoom: (factor: number) => void;
  focus: (pos: [number, number, number], zoom?: number) => void;
};

// Earth: position, radius and the direction to the sun, read from the GLB nodes.
function readEarth(root: Object3D) {
  root.updateMatrixWorld(true);
  const globe = root.getObjectByName("Earth_Globe");
  if (!(globe instanceof Mesh)) return null;
  const sun = root.getObjectByName("Sun_Directional");
  globe.geometry.computeBoundingSphere();
  return {
    position: globe.getWorldPosition(new Vector3()),
    radius: (globe.geometry.boundingSphere?.radius ?? 1) * globe.getWorldScale(new Vector3()).x,
    // glTF directional lights shine along their local -Z, so the sun lies along +Z
    sunDir: sun ? new Vector3(0, 0, 1).applyQuaternion(sun.getWorldQuaternion(new Quaternion())) : new Vector3(0, 1, 0),
  };
}

const glowVertex = `
varying vec3 vWorldNormal;
varying vec3 vViewDir;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;
// Back faces of a slightly bigger sphere: brightest right at the planet's edge, fading out to nothing, and only on the lit side.
const glowFragment = `
uniform vec3 uColor;
uniform vec3 uSun;
uniform float uStrength;
uniform float uPower;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
void main() {
  float rim = pow(max(-dot(normalize(vWorldNormal), normalize(vViewDir)), 0.0), uPower);
  float day = smoothstep(-0.3, 0.6, dot(normalize(vWorldNormal), uSun));
  gl_FragColor = vec4(uColor, rim * day * uStrength);
}`;

function EarthGlow({ earth }: { earth: NonNullable<ReturnType<typeof readEarth>> }) {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color(GLOW.color) },
      uSun: { value: earth.sunDir.clone().normalize() },
      uStrength: { value: GLOW.strength },
      uPower: { value: GLOW.power },
    }),
    [earth],
  );
  return (
    <mesh position={earth.position} renderOrder={5} frustumCulled={false}>
      <sphereGeometry args={[earth.radius * GLOW.size, 64, 48]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={glowVertex}
        fragmentShader={glowFragment}
        side={BackSide}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

// The sun casts shadows (desktop only). The scene never changes, so the shadow map is drawn once instead of every frame.
function enableShadows(gl: WebGLRenderer, root: Object3D, extent: number) {
  let sun: DirectionalLight | null = null;
  root.traverse((o) => {
    if (o instanceof DirectionalLight && (!sun || o.intensity > sun.intensity)) sun = o;
  });
  const light = sun as DirectionalLight | null;
  if (!light) return;
  // GLB lights sit at the origin; pull the sun back along its direction so the shadow camera covers the ground in front of us.
  const toSun = new Vector3(0, 0, 1).applyQuaternion(light.getWorldQuaternion(new Quaternion()));
  light.position.copy(toSun.multiplyScalar(120));
  light.castShadow = true;
  light.shadow.mapSize.set(2048, 2048);
  const cam = light.shadow.camera;
  cam.left = -extent;
  cam.right = extent;
  cam.top = extent;
  cam.bottom = -extent;
  cam.near = 1;
  cam.far = 300;
  cam.updateProjectionMatrix();
  light.shadow.bias = -0.0005;
  light.shadow.normalBias = 0.06;
  root.traverse((o) => {
    if (!(o instanceof Mesh)) return;
    const background = o.name.startsWith("Earth") || o.name.includes("Mountains_Far") || o.name.endsWith("Dome");
    o.castShadow = !background;
    o.receiveShadow = !background;
  });
  gl.shadowMap.autoUpdate = false;
  gl.shadowMap.needsUpdate = true;
}

// Sky dome, stars and atmosphere shells sit thousands of metres out and overlap, so they need a fixed draw order
// (dome first, then stars, atmosphere last) and no frustum culling by bounding sphere. Same hints as the packages' own viewers.
function prepareSky(root: Object3D) {
  root.traverse((o) => {
    if (!(o instanceof Mesh)) return;
    if (/Dome$/.test(o.name)) {
      o.frustumCulled = false;
      o.renderOrder = -10;
    } else if (/_Stars$/.test(o.name)) {
      o.renderOrder = -5;
    } else if (/Atmosphere$/.test(o.name)) {
      o.renderOrder = 5;
    }
  });
}

/** An object that fails to load must not take the whole scene down: it is optional, the environment still works. */
class Senyap extends Component<{ children: ReactNode }, { gagal: boolean }> {
  state = { gagal: false };
  static getDerivedStateFromError() {
    return { gagal: true };
  }
  componentDidCatch(e: unknown) {
    console.warn("[SceneObjek] object skipped:", e);
  }
  render() {
    return this.state.gagal ? null : this.props.children;
  }
}

const NOT_GROUND = /Dome|Stars|Atmosphere|Earth/;
function refreshShadows(gl: WebGLRenderer) {
  gl.shadowMap.needsUpdate = true;
}

/** Ground height under (x, z): a ray straight down through the environment (sky shells and the like are skipped). */
function groundAt(scene: Object3D, x: number, z: number, fallback: number) {
  scene.updateMatrixWorld(true);
  const ray = new Raycaster(new Vector3(x, 200, z), new Vector3(0, -1, 0));
  const hit = ray.intersectObjects(scene.children, true).find((h) => h.object.visible && !NOT_GROUND.test(h.object.name));
  return hit ? hit.point.y : fallback;
}

/** Soft golden halo (radial gradient), drawn once and shared. */
let halo: CanvasTexture | null = null;
function getHalo() {
  if (halo) return halo;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  if (g) {
    const grad = g.createRadialGradient(64, 64, 20, 64, 64, 64);
    grad.addColorStop(0, "rgba(217,168,91,0.38)");
    grad.addColorStop(1, "rgba(217,168,91,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
  }
  halo = new CanvasTexture(c);
  halo.colorSpace = SRGBColorSpace;
  return halo;
}

/** Small four-point glint, like light catching polished metal. */
let kilau: CanvasTexture | null = null;
function getKilau() {
  if (kilau) return kilau;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  if (g) {
    g.translate(64, 64);
    for (const [w, h] of [
      [60, 2.2],
      [2.2, 60],
    ]) {
      const grad = g.createLinearGradient(-w, 0, w, 0);
      grad.addColorStop(0, "rgba(255,240,200,0)");
      grad.addColorStop(0.5, "rgba(255,246,220,0.95)");
      grad.addColorStop(1, "rgba(255,240,200,0)");
      g.fillStyle = grad;
      g.fillRect(-w, -h, w * 2, h * 2);
    }
    const core = g.createRadialGradient(0, 0, 0, 0, 0, 14);
    core.addColorStop(0, "rgba(255,250,235,0.95)");
    core.addColorStop(1, "rgba(255,240,200,0)");
    g.fillStyle = core;
    g.fillRect(-14, -14, 28, 28);
  }
  kilau = new CanvasTexture(c);
  kilau.colorSpace = SRGBColorSpace;
  return kilau;
}

function markSrgb(t: Texture) {
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
}

/**
 * Stand-in for an item NASA has no 3D model of: the real NASA photo as a small framed plate on a post, turned toward the
 * camera, like an exhibit label. Unlit and untoned, so the photo keeps its true colours. Honest about what it is: the card says so.
 */
function Pelat3D({ def, onPlace }: { def: ObjekDef & { foto: string }; onPlace: (id: string, a: SceneAnchor[]) => void }) {
  const tex = useTexture(def.foto, markSrgb);
  const { scene } = useThree();
  const g = useRef<Object3D>(null);
  const w = def.fotoLebarM ?? 1.6;
  const img = tex.image as { width: number; height: number };
  const h = def.bentuk === "bulat" ? w : w * (img.height / img.width);
  useLayoutEffect(() => {
    const o = g.current;
    if (!o) return;
    o.visible = false;
    // on a surface: stand on the ground under `at`; in open space (no ground): float at `y`
    const y = def.ground ? groundAt(scene, def.at[0], def.at[1], 0) : (def.y ?? 0);
    const lift = def.ground ? 0.45 + h / 2 : 0;
    o.visible = true;
    o.position.set(def.at[0], y + lift, def.at[1]);
    o.rotation.y = Math.atan2(-def.at[0], -def.at[1]) + MathUtils.degToRad(def.yawDeg); // front faces the camera at the origin, turned a little for depth
    onPlace(
      def.id,
      def.titik.map((t, i) => {
        // the dot sits on the plate, shifted by `offset` (fractions of its width, in the plate's own axes)
        o.updateMatrixWorld(true);
        const w3 = o.localToWorld(new Vector3(t.offset[0] * w, t.offset[1] * w, 0.05));
        return { id: `${def.id}-${i}`, bendaIdx: t.bendaIdx, pos: [w3.x, w3.y, w3.z] as [number, number, number] };
      }),
    );
    return () => onPlace(def.id, []);
  }, [def, scene, onPlace, h, w]);
  if (def.bentuk === "bulat") {
    const r = w / 2;
    return (
      <group ref={g}>
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[w * 2.1, w * 2.1]} />
          <meshBasicMaterial map={getHalo()} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[r, 72]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} side={DoubleSide} />
        </mesh>
        <mesh position={[0, 0, -0.05]}>
          <circleGeometry args={[r * 1.005, 72]} />
          <meshBasicMaterial color="#6f5320" toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, 0.005]}>
          <ringGeometry args={[r * 0.992, r * 1.012, 96]} />
          <meshBasicMaterial color="#f0d9a2" toneMapped={false} side={DoubleSide} />
        </mesh>
        <mesh position={[-r * 0.62, r * 0.66, 0.03]}>
          <planeGeometry args={[r * 0.55, r * 0.55]} />
          <meshBasicMaterial map={getKilau()} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
        </mesh>
      </group>
    );
  }
  return (
    <group ref={g}>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} side={DoubleSide} />
      </mesh>
      <mesh>
        <planeGeometry args={[w + 0.1, h + 0.1]} />
        <meshBasicMaterial color="#d9a85b" toneMapped={false} side={DoubleSide} />
      </mesh>
      <mesh position={[0, -h / 2 - 0.22, 0]} visible={def.ground}>
        <cylinderGeometry args={[0.025, 0.025, 0.44, 8]} />
        <meshBasicMaterial color="#202a3a" toneMapped={false} />
      </mesh>
    </group>
  );
}

/** A hotspot with no 3D model behind it: just a point on the ground, so the HUD can pin the dot there. */
function Penanda3D({ def, onPlace }: { def: ObjekDef; onPlace: (id: string, a: SceneAnchor[]) => void }) {
  const { scene } = useThree();
  useLayoutEffect(() => {
    const y = groundAt(scene, def.at[0], def.at[1], 0) + 0.5;
    onPlace(
      def.id,
      def.titik.map((t, i) => ({ id: `${def.id}-${i}`, bendaIdx: t.bendaIdx, pos: [def.at[0], y, def.at[1]] as [number, number, number] })),
    );
    return () => onPlace(def.id, []);
  }, [def, scene, onPlace]);
  return null;
}

/**
 * A NASA model placed in the scene: scaled to `sizeM`, set on the ground under `at` (found with a ray) or floating at `y`.
 * Reports where its hotspots are in the world, so the HUD can pin them to the real object.
 */
function Objek3D({ def, shadows, onPlace }: { def: ObjekDef & { model: string; sizeM: number }; shadows: boolean; onPlace: (id: string, a: SceneAnchor[]) => void }) {
  const gltf = useGLTF(def.model);
  const { scene, gl, get, invalidate, advance } = useThree();
  const model = useMemo(() => clone(gltf.scene), [gltf.scene]);
  const group = useRef<Object3D>(null);

  useLayoutEffect(() => {
    const g = group.current;
    if (!g) return;
    // size and pivot: largest side = sizeM; origin at the bottom centre (ground) or at the centre (floating)
    // measure the model alone: this effect can run again, and the group's earlier place would otherwise leak into the box
    g.position.set(0, 0, 0);
    g.rotation.set(0, 0, 0);
    model.scale.setScalar(1);
    model.position.set(0, 0, 0);
    g.updateMatrixWorld(true);
    const box = new Box3().setFromObject(model, true); // precise: real vertex positions (animated or skinned models have loose bounds)
    const size = box.getSize(new Vector3());
    const k = def.sizeM / Math.max(size.x, size.y, size.z, 1e-6);
    model.scale.setScalar(k);
    const c = box.getCenter(new Vector3()).multiplyScalar(k);
    model.position.set(-c.x, def.ground ? -box.min.y * k : -c.y, -c.z);
    const height = size.y * k;

    let y = def.y ?? 0;
    if (def.ground) {
      g.visible = false; // do not hit ourselves
      scene.updateMatrixWorld(true);
      const ray = new Raycaster(new Vector3(def.at[0], 200, def.at[1]), new Vector3(0, -1, 0));
      const hit = ray.intersectObjects(scene.children, true).find((h) => h.object.visible && !NOT_GROUND.test(h.object.name));
      if (hit) y = hit.point.y;
      g.visible = true;
    }
    g.position.set(def.at[0], y, def.at[1]);
    g.rotation.y = MathUtils.degToRad(def.yawDeg);
    g.updateMatrixWorld(true);

    const mid = def.ground ? height / 2 : 0;
    onPlace(
      def.id,
      def.titik.map((t, i) => {
        const local = new Vector3(t.offset[0] * def.sizeM, mid + t.offset[1] * def.sizeM, t.offset[2] * def.sizeM);
        const w = g.localToWorld(local);
        return { id: `${def.id}-${i}`, bendaIdx: t.bendaIdx, pos: [w.x, w.y, w.z] as [number, number, number] };
      }),
    );

    model.traverse((o) => {
      if (o instanceof Mesh) {
        o.castShadow = shadows;
        o.receiveShadow = shadows;
        o.frustumCulled = false;
      }
    });
    if (shadows) refreshShadows(gl); // the shadow map is static: draw it again now the object is there
    if (get().frameloop === "never") advance(performance.now());
    else invalidate();
    return () => onPlace(def.id, []);
  }, [def, model, scene, gl, get, invalidate, advance, shadows, onPlace]);

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  );
}

function Environment3D({
  url,
  onReady,
  register,
  getRig,
  shadows,
  cameraName,
  shadowExtent,
}: {
  url: string;
  onReady: () => void;
  register: (impl: SceneImpl | null) => void;
  getRig: () => RigControls | null;
  shadows: boolean;
  cameraName: string;
  shadowExtent: number;
}) {
  const gltf = useGLTF(url);
  const { set, size, gl, invalidate, advance, get } = useThree();
  // Draw a frame now. While paused the frame loop is "never" (Jeda Gerak, or reduced motion), where invalidate() does nothing
  // and the canvas would stay black after the GLB arrives.
  const redraw = useCallback(() => {
    if (get().frameloop === "never") advance(performance.now());
    else invalidate();
  }, [get, advance, invalidate]);
  const camera = (gltf.cameras.find((c) => c.name === cameraName) ?? gltf.cameras[0]) as PerspectiveCamera | undefined;
  const earth = useMemo(() => readEarth(gltf.scene), [gltf.scene]);

  useLayoutEffect(() => {
    if (!camera) throw new Error(`${url} has no camera`);
    set({ camera });
    register({
      camera,
      worldToScreen: (p) => {
        camera.updateMatrixWorld();
        const v = new Vector3(...p).project(camera);
        const w = gl.domElement.clientWidth;
        const h = gl.domElement.clientHeight;
        return { x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, terlihat: v.z < 1 && Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1 };
      },
      resetCamera: () => getRig()?.reset(),
      rotateYaw: (d) => getRig()?.rotate(d),
      rotatePitch: (d) => getRig()?.rotatePitch(d),
      zoomBy: (f) => getRig()?.zoom(f),
      focusOn: (p, z) => getRig()?.focus(p, z),
    });
    onReady();
    return () => register(null);
  }, [camera, url, set, gl, register, onReady, getRig]);

  useLayoutEffect(() => {
    prepareSky(gltf.scene);
    if (shadows) enableShadows(gl, gltf.scene, shadowExtent);
    redraw();
  }, [gltf, gl, shadows, shadowExtent, redraw]);

  useLayoutEffect(() => {
    if (!camera) return;
    fitCamera(camera, size.width, size.height);
    redraw();
  }, [camera, size, redraw]);

  // Free GPU/CPU memory once nobody uses this GLB anymore (scene swapped or unmounted).
  // Deferred check: React strict mode unmounts and remounts right away, and clearing then would reload the file in a loop.
  useEffect(() => {
    const root = gltf.scene;
    inUse.set(url, (inUse.get(url) ?? 0) + 1);
    return () => {
      inUse.set(url, (inUse.get(url) ?? 1) - 1);
      // Grace period: a new Canvas (device change, same GLB as with Mars) mounts a moment after the old one goes away.
      setTimeout(() => {
        if (inUse.get(url) === 0) {
          inUse.delete(url);
          disposeScene(root);
          useGLTF.clear(url);
        }
      }, 3000);
    };
  }, [gltf, url]);

  return (
    <>
      <primitive object={gltf.scene} />
      {earth && <EarthGlow earth={earth} />}
    </>
  );
}

const Y_AXIS = new Vector3(0, 1, 0);
const X_AXIS = new Vector3(1, 0, 0);
const PITCH = new Quaternion();
function styleCanvas(el: HTMLElement, touchAction: string, cursor: string) {
  el.style.touchAction = touchAction;
  el.style.cursor = cursor;
}
const rad = MathUtils.degToRad;
const easeOutCubic = (k: number) => 1 - (1 - k) ** 3;

// State of the camera rig. A function, because Fast Refresh keeps the OLD ref object when this file is edited while a page is
// open: fields added since then would be undefined (-> NaN camera, black canvas). step() fills in whatever is missing.
function newRigState() {
  return {
    homeFor: "",
    home: new Quaternion(),
    baseFov: 50,
    glb: new Quaternion(), // the GLB camera's own orientation, as it came out of the file
    warned: false,
    homeAz: 0, // where the GLB camera looks, as an azimuth (radians, + = right of straight ahead)
    user: 0, // yaw, radians
    pitch: 0, // radians, + = up
    zoom: 1, // field of view as a fraction of the GLB camera's
    guided: 0,
    guidedT: -1,
    parallax: 0,
    parallaxTarget: 0,
    parallaxP: 0, // the same follow-the-mouse drift, up and down (radians)
    parallaxPTarget: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    pinch: 0, // distance between two fingers, 0 = not pinching
    // What the camera actually shows. Input writes the TARGETS (user, pitch, zoom); these ease toward them every frame, so every
    // move (drag, two-finger swipe, wheel, keys, focus, reset) is smooth instead of jumping to the new value.
    sInit: false,
    su: 0,
    sp: 0,
    sz: 1,
    tw: null as null | { t: number; dur: number; u0: number; p0: number; z0: number; u1: number; p1: number; z1: number }, // focus glide
    vYaw: 0, // drag velocity (rad/s), for a short glide after the finger lets go
    vPitch: 0,
    lastMove: 0,
  };
}

/**
 * Camera rig. Final view = the GLB camera, turned by stacked layers:
 *   1. guided intro (yaw only: eases from the side to the GLB angle, once),
 *   2. the visitor's own view: drag / arrow keys turn it left-right and up-down, wheel / pinch / +- zoom the field of
 *      view; clamped, and it stays where it is when released,
 *   3. small yaw parallax that follows the mouse.
 * The camera only rotates and zooms, it never moves. Renders only while something is moving (frameloop "demand").
 * While paused (Jeda Gerak / reduced motion) layers 1 and 3 are off; the visitor's own controls still work.
 */
function CameraRig({
  cfg,
  pitchDeg,
  paused,
  interactive,
  onControls,
}: {
  cfg: RigConfig;
  pitchDeg: number;
  paused: boolean;
  interactive: boolean;
  onControls: (c: RigControls | null) => void;
}) {
  const { gl, advance, invalidate, get } = useThree();
  const pausedRef = useRef(paused);
  const s = useRef(newRigState());

  // frameloop is "never" while paused, so a single frame has to be pushed by hand
  const request = useCallback(() => {
    if (pausedRef.current) advance(performance.now());
    else invalidate();
  }, [advance, invalidate]);

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) {
      s.current.guided = 0;
      s.current.guidedT = -1;
      s.current.parallax = 0;
      s.current.parallaxP = 0;
    }
    request();
  }, [paused, request]);

  const yawCap = rad(cfg.yawLimitDeg);
  // Keep the whole view inside the wedge of world that exists (see RigConfig.worldHalfDeg). Yaw is + = turn left, so the
  // view's azimuth is homeAz - yaw; zooming in or a narrower screen widens the allowed turn.
  const limitYaw = useCallback(
    (yaw: number) => {
      const r = s.current;
      const cam = get().camera as PerspectiveCamera;
      const aspect = Number.isFinite(cam.aspect) && cam.aspect > 0 ? cam.aspect : 16 / 9;
      const hfov = 2 * Math.atan(Math.tan(rad(r.baseFov * r.zoom) / 2) * aspect);
      const wedge = Number.isFinite(cfg.worldHalfDeg) ? Math.max(0, rad(cfg.worldHalfDeg) - hfov / 2 + rad(cfg.edgeMarginDeg)) : Infinity;
      const reach = Math.min(yawCap, wedge);
      const out = MathUtils.clamp(yaw, r.homeAz - reach, r.homeAz + reach);
      return Number.isFinite(out) ? out : 0;
    },
    [get, yawCap, cfg.worldHalfDeg, cfg.edgeMarginDeg],
  );
  const up = rad(cfg.pitchUpDeg);
  const down = rad(cfg.pitchDownDeg);
  const { zoomIn, zoomOut } = cfg;
  // a view that is mid-intro becomes the visitor's own view as soon as they take over
  const takeOver = () => {
    const r = s.current;
    r.tw = null;
    r.user += r.guided;
    r.guided = 0;
    r.guidedT = -1;
  };

  useEffect(() => {
    const r = s.current;
    onControls({
      reset: () => {
        r.tw = null;
        r.vYaw = 0;
        r.vPitch = 0;
        r.user = 0;
        r.pitch = 0;
        r.zoom = 1;
        r.guided = 0;
        r.guidedT = -1;
        request();
      },
      rotate: (deltaDeg) => {
        takeOver();
        r.user = limitYaw(r.user + rad(deltaDeg));
        request();
      },
      rotatePitch: (deltaDeg) => {
        takeOver();
        r.pitch = MathUtils.clamp(r.pitch + rad(deltaDeg), -down, up);
        request();
      },
      zoom: (factor) => {
        r.zoom = MathUtils.clamp(r.zoom * factor, zoomIn, zoomOut);
        r.user = limitYaw(r.user);
        request();
      },
      // Turn (and zoom a little) so a 3D point sits in the middle of the view. Rotation only: the camera never moves.
      focus: (p, zoomTo = 0.55) => {
        takeOver();
        const cam = get().camera as PerspectiveCamera;
        const dir = new Vector3(p[0], p[1], p[2]).sub(cam.position);
        if (dir.lengthSq() < 1e-6) return;
        const fwd = new Vector3(0, 0, -1).applyQuaternion(r.home);
        const az = (v: Vector3) => Math.atan2(-v.x, -v.z); // + = turn left, like r.user
        const el = (v: Vector3) => Math.asin(MathUtils.clamp(v.y / v.length(), -1, 1));
        let dYaw = az(dir) - az(fwd);
        dYaw = Math.atan2(Math.sin(dYaw), Math.cos(dYaw));
        const toYaw = limitYaw(dYaw);
        const toZoom = MathUtils.clamp(zoomTo, zoomIn, zoomOut);
        // look a bit below the object, so it sits above the middle: the HUD cards and the dock are at the bottom
        const lift = rad(cam.fov * toZoom) * (cam.aspect < 1 ? 0.2 : 0.1);
        const toPitch = MathUtils.clamp(el(dir) - el(fwd) - lift, -down, up);
        if (![toYaw, toPitch, toZoom].every(Number.isFinite)) return;
        if (pausedRef.current) {
          // reduced motion: no glide, go straight there
          r.tw = null;
          r.user = toYaw;
          r.pitch = toPitch;
          r.zoom = toZoom;
        } else {
          r.tw = { t: 0, dur: 1.1, u0: r.user, p0: r.pitch, z0: r.zoom, u1: toYaw, p1: toPitch, z1: toZoom };
        }
        request();
      },
    });
    return () => onControls(null);
  }, [onControls, request, limitYaw, get, up, down, zoomIn, zoomOut]);

  // mouse parallax (touch has no hover, so nothing to follow there)
  useEffect(() => {
    if (cfg.parallaxDeg <= 0) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || s.current.dragging || pausedRef.current) return;
      if (!(window.innerWidth > 0)) return;
      s.current.parallaxTarget = -((e.clientX / window.innerWidth) * 2 - 1) * rad(cfg.parallaxDeg);
      if (window.innerHeight > 0) s.current.parallaxPTarget = -((e.clientY / window.innerHeight) * 2 - 1) * rad(cfg.parallaxDeg * 0.8);
      request();
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [cfg.parallaxDeg, request]);

  // drag to look around, wheel or two-finger pinch to zoom
  useEffect(() => {
    if (!interactive) return;
    const el = gl.domElement;
    const r = s.current;
    const fingers = new Map<number, { x: number; y: number }>();
    const spread = () => {
      const [a, b] = [...fingers.values()];
      return Math.hypot(a.x - b.x, a.y - b.y);
    };
    styleCanvas(el, "none", "grab");
    const down = (e: PointerEvent) => {
      takeOver();
      fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      r.dragging = true;
      r.lastX = e.clientX;
      r.lastY = e.clientY;
      r.pinch = fingers.size === 2 ? spread() : 0;
      r.vYaw = 0;
      r.vPitch = 0;
      r.lastMove = e.timeStamp;
      el.setPointerCapture(e.pointerId);
      styleCanvas(el, "none", "grabbing");
    };
    const move = (e: PointerEvent) => {
      if (!fingers.has(e.pointerId)) return;
      fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (fingers.size === 2) {
        const d = spread();
        if (r.pinch > 0 && d > 0) r.zoom = MathUtils.clamp((r.zoom * r.pinch) / d, zoomIn, zoomOut);
        r.pinch = d;
        request();
        return;
      }
      if (!r.dragging) return;
      const cam = get().camera as PerspectiveCamera;
      const vfov = rad(cam.fov);
      const hfov = 2 * Math.atan(Math.tan(vfov / 2) * (Number.isFinite(cam.aspect) && cam.aspect > 0 ? cam.aspect : 16 / 9));
      // dragging right drags the scene right = turn the camera left (+yaw); dragging down = look up
      const dYaw = (e.clientX - r.lastX) * (hfov / el.clientWidth);
      const dPitch = (e.clientY - r.lastY) * (vfov / el.clientHeight);
      const dt = (e.timeStamp - r.lastMove) / 1000;
      if (dt > 0 && dt < 0.1) {
        r.vYaw = r.vYaw * 0.5 + (dYaw / dt) * 0.5;
        r.vPitch = r.vPitch * 0.5 + (dPitch / dt) * 0.5;
      }
      r.lastMove = e.timeStamp;
      r.user = limitYaw(r.user + dYaw);
      r.pitch = MathUtils.clamp(r.pitch + dPitch, -down, up);
      r.lastX = e.clientX;
      r.lastY = e.clientY;
      request();
    };
    const end = (e: PointerEvent) => {
      fingers.delete(e.pointerId);
      r.pinch = 0;
      if (fingers.size === 1) {
        // one finger left after a pinch: carry on dragging from where it is
        const [rest] = [...fingers.values()];
        r.lastX = rest.x;
        r.lastY = rest.y;
      }
      if (fingers.size === 0) {
        r.dragging = false;
        if (e.timeStamp - r.lastMove > 80) {
          r.vYaw = 0;
          r.vPitch = 0;
        }
        request();
        styleCanvas(el, "none", "grab");
      }
    };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      // line and page units to pixels
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1;
      const dx = e.deltaX * unit;
      const dy = e.deltaY * unit;
      if (e.ctrlKey) {
        // a pinch on a trackpad arrives as ctrl + wheel (so does Ctrl + scroll with a mouse): zoom
        r.zoom = MathUtils.clamp(r.zoom * Math.exp(dy * 0.01), zoomIn, zoomOut);
        r.user = limitYaw(r.user);
      } else {
        // two fingers swiping on a trackpad, or the mouse wheel: look around, no click needed
        takeOver();
        const cam = get().camera as PerspectiveCamera;
        const vfov = rad(cam.fov);
        const aspect = Number.isFinite(cam.aspect) && cam.aspect > 0 ? cam.aspect : 16 / 9;
        const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
        r.user = limitYaw(r.user - dx * (hfov / Math.max(1, el.clientWidth)));
        r.pitch = MathUtils.clamp(r.pitch - dy * (vfov / Math.max(1, el.clientHeight)), -down, up);
      }
      request();
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
      el.removeEventListener("wheel", wheel);
      styleCanvas(el, "", "");
    };
  }, [gl, get, interactive, limitYaw, up, down, zoomIn, zoomOut, request]);

  const step = (state: RootState, delta: number) => {
    const cam = state.camera as PerspectiveCamera;
    const r = s.current;
    for (const [key, value] of Object.entries(newRigState())) {
      if (!(key in r)) (r as Record<string, unknown>)[key] = value;
    }
    const homeKey = `${cam.uuid}:${pitchDeg}`;
    if (r.homeFor !== homeKey) {
      // new GLB camera: remember its angle and field of view, and play the intro once
      r.homeFor = homeKey;
      r.glb.copy(cam.quaternion);
      r.home.copy(cam.quaternion).multiply(PITCH.setFromAxisAngle(X_AXIS, rad(pitchDeg)));
      r.baseFov = cam.fov;
      const ahead = new Vector3(0, 0, -1).applyQuaternion(r.home);
      r.homeAz = Math.atan2(ahead.x, -ahead.z);
      if (!pausedRef.current && cfg.guidedStartDeg > 0) {
        r.guidedT = 0;
        r.guided = rad(cfg.guidedStartDeg);
      }
    }

    // a bad or huge time step (first frame, a tab that was in the background) must not poison the state
    const dt = Number.isFinite(delta) && delta > 0 ? Math.min(delta, 0.1) : 0;
    const bad: string[] = [];
    const repair = (name: "user" | "pitch" | "guided" | "parallax" | "parallaxTarget" | "parallaxP" | "parallaxPTarget" | "su" | "sp" | "vYaw" | "vPitch", fallback = 0) => {
      if (Number.isFinite(r[name])) return;
      bad.push(name);
      r[name] = fallback;
    };
    repair("user");
    repair("pitch");
    repair("guided");
    repair("parallax");
    repair("parallaxTarget");
    repair("parallaxP");
    repair("parallaxPTarget");
    repair("su");
    repair("sp");
    repair("vYaw");
    repair("vPitch");
    if (!Number.isFinite(r.sz)) r.sz = r.zoom;
    if (!Number.isFinite(r.zoom)) {
      bad.push("zoom");
      r.zoom = 1;
    }
    if (!Number.isFinite(r.baseFov) || r.baseFov <= 0) {
      bad.push("baseFov");
      r.baseFov = cam.fov > 0 ? cam.fov : 50;
    }
    if (bad.length && !r.warned) {
      r.warned = true; // one report is enough
      console.warn("[SceneRig] repaired values that were not numbers:", bad, { delta, aspect: cam.aspect, size: state.size, homeAz: r.homeAz });
    }
    let moving = false;
    if (r.guidedT >= 0) {
      r.guidedT += dt;
      const k = Math.min(r.guidedT / cfg.guidedSeconds, 1);
      r.guided = rad(cfg.guidedStartDeg) * (1 - easeOutCubic(k));
      if (k < 1) moving = true;
      else {
        r.guided = 0;
        r.guidedT = -1;
      }
    }
    if (!pausedRef.current) {
      r.parallax += (r.parallaxTarget - r.parallax) * (1 - Math.exp(-dt * 6));
      if (Math.abs(r.parallaxTarget - r.parallax) > 1e-4) moving = true;
      else r.parallax = r.parallaxTarget;
      r.parallaxP += (r.parallaxPTarget - r.parallaxP) * (1 - Math.exp(-dt * 6));
      if (Math.abs(r.parallaxPTarget - r.parallaxP) > 1e-4) moving = true;
      else r.parallaxP = r.parallaxPTarget;
    }

    if (!r.sInit) {
      r.su = r.user;
      r.sp = r.pitch;
      r.sz = r.zoom;
      r.sInit = true;
    }
    if (r.tw) {
      r.tw.t += dt;
      const k = Math.min(1, r.tw.t / r.tw.dur);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2; // ease in-out
      r.user = r.tw.u0 + (r.tw.u1 - r.tw.u0) * e;
      r.pitch = r.tw.p0 + (r.tw.p1 - r.tw.p0) * e;
      r.zoom = r.tw.z0 + (r.tw.z1 - r.tw.z0) * e;
      if (k >= 1) r.tw = null;
      moving = true;
    }
    // glide after a drag: keep going with the release speed, slowing down
    if (!r.dragging && !pausedRef.current && (Math.abs(r.vYaw) > 1e-3 || Math.abs(r.vPitch) > 1e-3)) {
      r.user = limitYaw(r.user + r.vYaw * dt);
      r.pitch = MathUtils.clamp(r.pitch + r.vPitch * dt, -down, up);
      const slow = Math.exp(-dt * 4.5);
      r.vYaw *= slow;
      r.vPitch *= slow;
      moving = true;
    } else if (!r.dragging) {
      r.vYaw = 0;
      r.vPitch = 0;
    }
    r.user = limitYaw(r.user); // the allowed turn changes with zoom and screen shape
    // ease what is shown toward the target (about 80 ms to cover most of the way)
    // (paused = reduced motion: frames are drawn one by one on demand, so show the target at once)
    const ease = pausedRef.current ? 1 : 1 - Math.exp(-dt * 14);
    r.su += (r.user - r.su) * ease;
    r.sp += (r.pitch - r.sp) * ease;
    r.sz += (r.zoom - r.sz) * ease;
    if (Math.abs(r.user - r.su) > 5e-5 || Math.abs(r.pitch - r.sp) > 5e-5 || Math.abs(r.zoom - r.sz) > 5e-5) moving = true;
    else {
      r.su = r.user;
      r.sp = r.pitch;
      r.sz = r.zoom;
    }
    const yaw = r.su + r.guided + r.parallax;
    // yaw about the world's up axis, then the GLB camera's own angle, then the visitor's pitch about the camera's own X axis
    cam.quaternion.setFromAxisAngle(Y_AXIS, yaw).multiply(r.home).multiply(PITCH.setFromAxisAngle(X_AXIS, r.sp + r.parallaxP));
    const fov = r.baseFov * r.sz;
    if (Math.abs(cam.fov - fov) > 1e-4) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
    if (moving && !pausedRef.current) invalidate();
  };

  // R3F skips drawing the frame if a useFrame callback throws, which would leave a black canvas. Keep the GLB camera instead.
  useFrame((state, delta) => {
    try {
      step(state, delta);
      const q = state.camera.quaternion;
      if (![q.x, q.y, q.z, q.w, (state.camera as PerspectiveCamera).fov].every(Number.isFinite)) throw new Error("camera became NaN");
    } catch (error) {
      const r = s.current;
      const cam = state.camera as PerspectiveCamera;
      if (!r.warned) {
        r.warned = true; // one report is enough; the same failure would repeat every frame
        console.error("[SceneRig] camera rig failed, using the GLB camera as is", error, {
          delta,
          user: r.user,
          pitch: r.pitch,
          zoom: r.zoom,
          guided: r.guided,
          parallax: r.parallax,
          baseFov: r.baseFov,
          homeAz: r.homeAz,
          aspect: cam.aspect,
          fov: cam.fov,
          size: state.size,
          home: r.home.toArray(),
          glb: r.glb.toArray(),
          camera: cam.quaternion.toArray(),
        });
      }
      r.user = 0;
      r.pitch = 0;
      r.zoom = 1;
      r.guided = 0;
      r.guidedT = -1;
      r.parallax = 0;
      r.parallaxTarget = 0;
      if (![r.glb.x, r.glb.y, r.glb.z, r.glb.w].every(Number.isFinite)) r.glb.identity();
      r.home.copy(r.glb);
      cam.quaternion.copy(r.glb);
      cam.fov = r.baseFov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

// With frameloop "never" the canvas stays blank; draw one frame on load, resize and toggle.
function RenderOnce({ paused }: { paused: boolean }) {
  const { advance, size } = useThree();
  useEffect(() => {
    if (paused) advance(performance.now());
  }, [paused, size, advance]);
  return null;
}

// Lost WebGL context (GPU reset, too many contexts): drop to the static image instead of a frozen canvas.
// Listener is removed on unmount, because R3F itself forces a context loss when a canvas is torn down.
function ContextLossGuard({ onError }: { onError: () => void }) {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const el = gl.domElement;
    const onLost = (e: Event) => {
      e.preventDefault();
      onError();
    };
    el.addEventListener("webglcontextlost", onLost);
    return () => el.removeEventListener("webglcontextlost", onLost);
  }, [gl, onError]);
  return null;
}

export default function SceneRenderer({
  environment,
  device,
  paused,
  interactive,
  register,
  onAnchors,
  onReady,
  onError,
}: {
  environment: Environment;
  device: Device;
  paused: boolean;
  interactive: boolean;
  register: (impl: SceneImpl | null) => void;
  onAnchors: (anchors: SceneAnchor[]) => void;
  onReady: () => void;
  onError: () => void;
}) {
  const placed = useRef(new Map<string, SceneAnchor[]>());
  const onPlace = useCallback(
    (id: string, list: SceneAnchor[]) => {
      if (list.length) placed.current.set(id, list);
      else placed.current.delete(id);
      onAnchors([...placed.current.values()].flat());
    },
    [onAnchors],
  );
  const controls = useRef<RigControls | null>(null);
  const onControls = useCallback((c: RigControls | null) => {
    controls.current = c;
  }, []);
  const getRig = useCallback(() => controls.current, []);
  const env = look[environment];
  const shadows = device === "desktop" && env.shadows;
  const asset = assets[environment][device];

  return (
    <Canvas
      shadows={shadows ? "percentage" : false} // three r187 dropped PCFSoft; plain PCF avoids the console warning
      frameloop={paused ? "never" : "demand"}
      dpr={device === "mobile" ? [1, 1.5] : [1, 2]}
      gl={{ antialias: device !== "mobile", powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = toneMapping(look[environment].tone);
        gl.toneMappingExposure = look[environment].exposure;
      }}
    >
      {/* opaque, so the poster underneath never shows through the finished scene */}
      <color attach="background" args={["#000000"]} />
      {env.stars && <Stars />}
      <ambientLight color={env.ambientColor} intensity={env.ambient} />
      <hemisphereLight args={[env.hemi.sky, env.hemi.ground, env.hemi.intensity]} />
      <Environment3D
        url={asset.model}
        cameraName={asset.camera}
        onReady={onReady}
        register={register}
        getRig={getRig}
        shadows={shadows}
        shadowExtent={env.shadowExtent}
      />
      {objek[environment].map((def) => (
        <Senyap key={def.id}>
          <Suspense fallback={null}>
            {def.model && def.sizeM ? (
              <Objek3D def={{ ...def, model: def.model, sizeM: def.sizeM }} shadows={shadows} onPlace={onPlace} />
            ) : def.foto ? (
              <Pelat3D def={{ ...def, foto: def.foto }} onPlace={onPlace} />
            ) : (
              <Penanda3D def={def} onPlace={onPlace} />
            )}
          </Suspense>
        </Senyap>
      ))}
      <CameraRig cfg={rig[environment]} pitchDeg={rig[environment].pitchDeg[device]} paused={paused} interactive={interactive} onControls={onControls} />
      <RenderOnce paused={paused} />
      <ContextLossGuard onError={onError} />
    </Canvas>
  );
}
