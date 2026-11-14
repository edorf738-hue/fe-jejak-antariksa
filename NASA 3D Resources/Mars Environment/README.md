# Mars Environment V3 — Realism Pass

Built from the supplied V3 scripts (`scripts/build_mars_v3.py`, `scripts/export_mars_v3.py`; package notes in `README_from_package.md`). V1 and V2 are untouched. The package contained scripts only, so everything below was actually built, rendered, exported and tested here.

## What V3 changes vs V2 (from the scripts)
- Cameras reframed: horizon at 52 % from the top for all three (V2: 56-60 %) so there is less empty sky and more terrain; mobile uses a 24 mm lens (V2: 26) and 8 deg yaw (V2: 14) to keep one big rock from dominating.
- Rock bump reduced (voronoi 0.10, noise 0.62/0.58) to avoid the inflated/faceted look.
- Slightly more fine terrain relief (hdet micro layer 0.016 vs 0.012).
- GLB: rock meshes keep a bit more detail (decimate 0.24 / 0.42 vs 0.20 / 0.40).
Everything else (terrain, rock families, materials, sky, export pipeline) is V2.

## Files
| Path | Content |
|---|---|
| `blender/mars_environment_v3.blend` | Scene |
| `models/mars_environment_v3.glb` | 4.6 MB, Draco, 3 cameras, 1 sun |
| `renders/` | `mars_hero_v3_4k.png`, `_2560.webp`, `_tablet.webp`, `_mobile.webp` (Cycles) |
| `previews/` | `mars_hero_v3_*_preview.jpg`, `threejs_{desktop,tablet,mobile}.png` (Three.js screenshots), `compare_v2_vs_v3_desktop.jpg` (V2 left, V3 right, Cycles), `v3_check_desktop.png` |
| `scripts/threejs_test.py`, `viewer/` | Headless-Chrome Three.js r160 + DRACOLoader test; viewer loads `?f=<glb>` (default V3) |

## Measured GLB (V3 vs V2)
| | V2 | V3 |
|---|---|---|
| Size | 4.69 MB | 4.73 MB |
| Unique / drawn triangles | 409k / 755k | 415k / 823k |
| Mesh nodes | 426 | 426 |
| Draw calls desktop / tablet / mobile | 350 / 375 / 199 | 352 / 378 / 159 |

## Test results
- Cycles: all three cameras rendered.
- Three.js r160 + DRACOLoader (headless Chrome, SwiftShader): all three cameras load and render, `glError` 0, no console errors or warnings, 4 textures, 1 light, 3 cameras. Shadows and ambient/hemisphere fill on (same viewer settings as V2).
- Not tested: real GPU frame rate, real devices. Drawn triangle count rose ~9 % from V2, so the V2 caveat stands (heavy for low-end phones).

## Notes
- The tablet and mobile Cycles views still have roughly half the frame as sky (52 % horizon); lower it further (e.g. 0.45) in `make_cam` if the website text area does not need that space.
- Blender-vs-Three.js differences are the same as in V2 (Three.js more saturated, Cycles hazier; baked colours/haze; no GI/AO node in WebGL).
