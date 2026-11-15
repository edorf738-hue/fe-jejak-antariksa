// Config for the 3D scene layer (owner: Edo). Asset names follow kebab-case.

export type Environment = "moon" | "mars" | "deep-space";
export type Device = "desktop" | "tablet" | "mobile";

// Same breakpoints as the Figma handoff (1440 / 768 / 390), cut halfway between them.
export const deviceForWidth = (width: number): Device =>
  width < 576 ? "mobile" : width < 1104 ? "tablet" : "desktop";

export const DRACO_PATH = "/draco/";

// Camera rig: the visitor looks around freely (drag, arrow keys, wheel / pinch zoom). The camera only ROTATES and zooms,
// it never moves: Deep Space's baked atmosphere needs the camera at the origin, and the Moon and Mars terrain only exists
// in front of the camera (z from -800 m to -1.5 m), so walking around would show its edges. Degrees; limits are measured
// from the GLB camera's own angle.
export type RigConfig = {
  yawLimitDeg: number; // hard cap on how far left and right the visitor can turn (Infinity = all the way round)
  // The Moon and Mars terrain is a wedge in front of the camera (about 62 degrees to each side of straight ahead). The
  // view is kept inside it: the allowed turn is worldHalfDeg - half the horizontal field of view (+ edgeMarginDeg), so
  // zooming in or a narrow phone screen lets the visitor look further to the side. Infinity = no wedge, free all round.
  worldHalfDeg: number;
  edgeMarginDeg: number; // how far the edge of the screen may poke past the wedge
  pitchUpDeg: number; // how far up
  pitchDownDeg: number; // how far down (the Moon and Mars ground starts 1.5 m ahead, so very steep views show a void)
  zoomIn: number; // narrowest field of view, as a fraction of the GLB camera's (0.35 = about 3x closer)
  zoomOut: number; // widest field of view, as a fraction of the GLB camera's
  parallaxDeg: number; // small extra turn that follows the mouse (0 = off)
  guidedStartDeg: number; // intro: starts this far to the side and eases to the GLB angle (0 = off)
  guidedSeconds: number;
  // Fixed tilt added to the GLB camera angle (+ = look up). 0 since Lunar v5, whose cameras already carry the render's pitch.
  pitchDeg: Record<Device, number>;
};

const defaultRig: RigConfig = {
  yawLimitDeg: 90,
  worldHalfDeg: 62,
  edgeMarginDeg: 6,
  pitchUpDeg: 70,
  pitchDownDeg: 35,
  zoomIn: 0.35,
  zoomOut: 1.15,
  parallaxDeg: 5,
  guidedStartDeg: 6,
  guidedSeconds: 2.2,
  pitchDeg: { desktop: 0, tablet: 0, mobile: -12 }, // portrait: look down a little so the ground and its objects sit above the bottom HUD
};
export const rig: Record<Environment, RigConfig> = {
  moon: defaultRig,
  mars: defaultRig, // Mars v3 GLB cameras already carry the render's pitch (about 8 degrees)
  // Deep Space is a sky only (dome + stars + planet), so it can be explored in every direction.
  // Its atmosphere is baked for a camera at the origin: turning in place is fine.
  "deep-space": { ...defaultRig, pitchDeg: { desktop: 0, tablet: 0, mobile: 0 }, yawLimitDeg: Infinity, worldHalfDeg: Infinity, pitchUpDeg: 85, pitchDownDeg: 85, zoomIn: 0.3, zoomOut: 1.3, guidedStartDeg: 4 },
};

// Look of each environment. The GLB sun is exported raw, so exposure and fill light are set here.
export type Look = {
  tone: "agx" | "aces";
  exposure: number;
  ambient: number;
  ambientColor: string;
  hemi: { sky: string; ground: string; intensity: number }; // cheap stand-in for light bounced off the ground (Cycles has real GI)
  stars: boolean; // not in the Moon GLB; Mars has its own sky dome
  shadows: boolean; // sun shadows (desktop only, drawn once)
  shadowExtent: number; // metres around the camera covered by the sun's shadow map
};
export const look: Record<Environment, Look> = {
  moon: { tone: "agx", exposure: 0.5, ambient: 0.1, ambientColor: "#ffffff", hemi: { sky: "#0b0e16", ground: "#8d8982", intensity: 0.35 }, stars: true, shadows: true, shadowExtent: 70 },
  // Mars: same fill and tone mapping as the viewer shipped with the Mars package (ACES); exposure lowered from 1 to 0.85 by eye, closer to the Cycles render.
  mars: { tone: "aces", exposure: 0.85, ambient: 0.3, ambientColor: "#ffd8c0", hemi: { sky: "#e0a07a", ground: "#5a2c1c", intensity: 0.35 }, stars: false, shadows: true, shadowExtent: 90 },
  // Deep Space: only emissive textures plus one sun (planet and moon); no fill light, as in the viewer shipped with the package (ACES, exposure 1).
  "deep-space": { tone: "aces", exposure: 1, ambient: 0, ambientColor: "#ffffff", hemi: { sky: "#000000", ground: "#000000", intensity: 0 }, stars: false, shadows: false, shadowExtent: 0 },
};

type Asset = { model: string; poster: string; camera: string }; // camera = node name inside the GLB
export const assets: Record<Environment, Record<Device, Asset>> = {
  moon: {
    desktop: { model: "/models/moon/moon-environment-desktop.glb", poster: "/models/moon/moon-poster-desktop.webp", camera: "Cam_Desktop_16x9" },
    tablet: { model: "/models/moon/moon-environment-tablet.glb", poster: "/models/moon/moon-poster-tablet.webp", camera: "Cam_Tablet_4x3" },
    mobile: { model: "/models/moon/moon-environment-mobile.glb", poster: "/models/moon/moon-poster-mobile.webp", camera: "Cam_Mobile_9x16" },
  },
  // One GLB with all three cameras, shared by every device.
  mars: {
    desktop: { model: "/models/mars/mars-environment.glb", poster: "/models/mars/mars-poster-desktop.webp", camera: "Cam_Desktop_16x9" },
    tablet: { model: "/models/mars/mars-environment.glb", poster: "/models/mars/mars-poster-tablet.webp", camera: "Cam_Tablet_4x3" },
    mobile: { model: "/models/mars/mars-environment.glb", poster: "/models/mars/mars-poster-mobile.webp", camera: "Cam_Mobile_9x16" },
  },
  // One GLB (2.8 MB, no Draco) with all three cameras, shared by every device.
  "deep-space": {
    desktop: { model: "/models/deep-space/deep-space-environment.glb", poster: "/models/deep-space/deep-space-poster-desktop.webp", camera: "Cam_Desktop_16x9" },
    tablet: { model: "/models/deep-space/deep-space-environment.glb", poster: "/models/deep-space/deep-space-poster-tablet.webp", camera: "Cam_Tablet_4x3" },
    mobile: { model: "/models/deep-space/deep-space-environment.glb", poster: "/models/deep-space/deep-space-poster-mobile.webp", camera: "Cam_Mobile_9x16" },
  },
};

export const altText: Record<Environment, string> = {
  moon: "Permukaan Bulan dengan Bumi terbit di cakrawala",
  mars: "Permukaan Mars berdebu merah dengan batu dan bukit di bawah langit oranye",
  "deep-space": "Ruang angkasa dalam dengan bintang, nebula berdebu, sebuah planet berwarna karat, dan satu bulan kecil",
};
