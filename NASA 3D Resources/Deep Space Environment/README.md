# Deep Space Environment V1 — Wayang Antariksa

Cinematic deep-space background for the website (Three.js + GLB). Built in Blender 5.3 so that the **Blender render and the GLB contain the same objects**: only emissive textures, one sun and a few small meshes. Lunar and Mars assets are untouched. No wayang/gunungan imagery, text, logos or UI.

## Look
Near-black space with a warm rust/ochre nebula and dust band (with a few blue-grey accents) taken from the Mars palette, ~40k faint stars baked into the sky plus ~1100 tinted star sprites (a handful brighter with soft diffraction spikes), one rust-coloured planet lit as a crescent-gibbous with a soft atmosphere rim, and one small grey cratered moon. Upper-left of the desktop frame is left empty for text.

## Files
| Path | Content |
|---|---|
| `blender/deep_space_environment_v1.blend` | Scene (collections: Space_Dome, Stars, Planets, Atmosphere, Lighting, Cameras) |
| `models/deep_space_environment_v1.glb` | **2.8 MB**, no Draco, 3 cameras, 1 directional sun |
| `renders/` | `deep_space_hero_v1_4k.png` (3840x2160), `_2560.webp`, `_tablet.webp` (1600x1200), `_mobile.webp` (1080x1920) — Cycles, 96 samples, no denoiser |
| `previews/` | `deep_space_v1_{desktop,tablet,mobile}_preview.jpg`, `threejs_{desktop,tablet,mobile}.png` (Three.js screenshots), `compare_blender_vs_threejs_desktop.jpg`, `v1_pass6_desktop.png` (preview checkpoint) |
| `textures/` | `deep_space_sky.jpg` (4096x2048), `deep_space_star_atlas.png` (256x128), `deep_space_planet_albedo.jpg`, `deep_space_moon_albedo.jpg` (1024x512), `deep_space_atmosphere_gradient.png` (4x256) |
| `scripts/build_deep_space_v1.py` | Generates textures and builds the scene (about 20 s; `DEBUG_SMALL = True` for a fast low-res pass) |
| `scripts/export_deep_space_v1.py` | GLB export (open the .blend in one call, run in the next) |
| `scripts/threejs_test.py`, `viewer/` | Headless-Chrome Three.js r160 test; viewer with vendored three.js (`?cam=…&exp=…&sun=…`) |

## How it exports to glTF
- **Sky:** inverted sphere (16k tris) with an emissive equirect texture (nebula + dust lanes + faint stars). The seam is behind the camera.
- **Bright stars:** one mesh of 1100 quads (2200 tris) facing the origin, UVs into an 8x4 tint/intensity atlas; material `alphaMode BLEND`, emissive = base colour = atlas, metallic 1 so the sun does not shade them.
- **Planet / moon:** textured spheres (9k tris each), lit by one `KHR_lights_punctual` directional light.
- **Atmosphere:** glTF has no fresnel, so a slightly larger shell has the fresnel x sun-facing value **baked per vertex** into its UV and read from a 1D gradient (emissive + alpha). Valid because all three cameras sit at the origin.
- **Cameras:** pure rotation, no lens shift. glTF takes yfov/aspect from the scene resolution, so the export patches each camera's `yfov`/`aspectRatio` to its designed values.
- **Sun:** exported at Blender strength x pi (10.05) so Three.js (output = albedo * E / pi) matches the Blender look.

## Spec (measured)
| | |
|---|---|
| Size | 2.8 MB (sky JPEG 0.97 MB, rest mostly uncompressed geometry) |
| Triangles | 46k; 5 meshes, 7 draw calls (measured in Three.js) |
| Materials / textures | 5 / 5 |
| Cameras | `Cam_Desktop_16x9` 28 mm (pitch +6), `Cam_Tablet_4x3` 26 mm (yaw 6, pitch 6), `Cam_Mobile_9x16` 30 mm (yaw 14, pitch 8) |

## Test results
- Cycles preview and final renders for all three cameras.
- GLB loaded with Three.js r160 `GLTFLoader` in headless Chrome (SwiftShader), all three cameras: `glError` 0, **no console errors or warnings**, 5 textures, 5 materials (2 alpha-blended), 1 light, 3 cameras. Dome, stars, planet, moon and glow render in the right order (the viewer sets `renderOrder`: dome -10, stars -5, glow +5, and `frustumCulled = false` on the dome).
- Not tested: real GPU frame rate, real devices.

## Blender vs Three.js
Very close (`compare_blender_vs_threejs_desktop.jpg`): same composition and contrast. Differences: ACES (Three) vs AgX (Blender) tone mapping, slightly crisper stars and a slightly warmer planet limb in Three.js. Without the viewer's `renderOrder` hints the glow shell or stars may draw in the wrong order; the dome needs `frustumCulled = false` (radius 20000 vs camera far plane 30000).

## Limitations
- Stars/nebula are textured, not volumetric: there is no parallax and the sky resolution (4096 px across 360 deg) is soft if the field of view is much narrower than the cameras here.
- Planet atmosphere is baked for the camera position at the origin; moving the camera breaks the rim.
- The planet is plain (soft banding only, no clouds); the dark side is pure black by design (silhouette).
- Textures are procedural (FFT noise), not astronomical data.
