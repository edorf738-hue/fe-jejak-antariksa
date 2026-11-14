# Lunar Environment 4.0 "Earthrise" — Wayang Antariksa

Refinement of V3 (V3 is untouched in `../v3/`). Blender 5.3, Cycles. Same composition, camera positions and render settings as V3;
only terrain realism, Earth, materials and lighting changed. Contains only terrain, craters, rocks, mountains, Earth, stars, lights and cameras.

## Layout
| Path | Content |
|---|---|
| `blender/lunar_environment_v4.blend` | Editable scene |
| `models/lunar_environment_v4.glb` (desktop), `_tablet.glb`, `_mobile.glb` | Per-device web assets (Draco, KHR_lights_punctual) |
| `renders/` | `lunar_hero_v4_4k.png` (3840x2160), `_2560.webp`, `_tablet.webp` (1600x1200), `_mobile.webp` (1080x1920) |
| `previews/` | `compare_v3_vs_v4.jpg` (V3 top, V4 bottom, identical camera/settings: 1600x900, 96 samples), `glb_check_*.png` (GLB re-imported and rendered), `lunar_hero_v4_preview.jpg` |
| `scripts/` | `build_lunar_v4.py` (rebuild scene), `export_glb_v4.py` (per-device export), `make_earth_textures_v4.py` |
| `textures/` | Earth colour / clouds (RGBA) / roughness / night lights (2048 + 1024), tiled regolith albedo (last exported profile) |

Rebuild: run `make_earth_textures_v4.py` inside Blender (set `V4_DIR`, `EARTH_W`), then `PREVIEW_MODE = False; exec(open(build_lunar_v4.py).read())`.
Export: per device, open the .blend in one MCP call, then run `export_glb_v4.py` with `PROFILE = "desktop" | "tablet" | "mobile"` in the next call.

## Checkpoint 1 - V3 weaknesses found (from the V3 render)
- Terrain read as soft clay lumps: low-frequency noise dominated, craters shallow with smooth round rims, horizon = rounded mounds.
- Rocks were smooth, evenly scattered blobs; one material for everything.
- Earth: saturated blue, glossy ocean, blotchy cloud patches, polar axis pointing at the viewer (pole pinching visible).
- Shadows crushed to black in the lower left; world had no fill.

## What changed in V4
- Craters: flatter floors, steeper walls, blocky/uneven rim crests, oblique-impact asymmetry, terraces and central mounds on large craters, fresh (sharp) vs degraded (soft) populations, more small craters with a wider size/depth range, one extra foreground crater. Rim heights capped to avoid overlap spikes.
- Terrain: lower-amplitude lumps, domain-warped ridge layers, mesas at mid distance, two overlapping far-ridge layers (more varied horizon).
- Rocks: 24 shared shapes (was 16) with more cut planes and sharper creases, three materials (basalt / mixed / anorthosite), placed in 18 power-law "rock fields" plus patchiness-masked scatter instead of uniform random.
- Regolith: slope-dependent brightening, extra micro-crater bump layer, roughness variation, more neutral grey; separate darker material for far mountains.
- Earth: re-authored textures (less saturated, darker ocean, higher roughness), wispy sheared clouds fading toward the poles, axis re-oriented (Africa/Asia/Australia face the camera, pole no longer at the viewer), thinner atmosphere rim, sun moved slightly for a clearer day/night terminator.
- Lighting: sun unchanged in strength; faint ambient that only affects lighting (sky stays black), earthshine 0.3 -> 0.6, exposure +0.2 EV. Shadow detail is visible in the foreground.

## Cameras (unchanged from V3)
`Cam_Desktop_16x9` 26 mm, `Cam_Tablet_4x3` 24 mm, `Cam_Mobile_9x16` 28 mm yawed toward Earth. Each GLB contains only its own camera.

## GLB files (sizes measured)
| File | Size | Unique tris | Drawn tris (instances) | Earth tex | Notes |
|---|---|---|---|---|---|
| `lunar_environment_v4.glb` | 3.7 MB | 203k | 490k | 2048 | 260x200 near-terrain grid, full-res rocks |
| `lunar_environment_v4_tablet.glb` | 2.1 MB | 114k | 232k | 1024 | 190x150 grid, rocks < 0.25 m removed, rock meshes at 50% |
| `lunar_environment_v4_mobile.glb` | 1.0 MB | 52k | 100k | 1024 | 120x96 grid, 512 ground tile, rocks < 0.5 m removed, rock meshes at 25% |

Level of detail: the near terrain and crater patches are resampled (raycast, 3x3 box filter + light smoothing) onto a camera-space grid
whose density falls off with distance; mountains are decimated; rocks are shared mesh instances; pebbles are rebuilt as thinned low-poly stones.
GLB contents verified by parsing the files: Earth globe + cloud shell (alpha-blended), 4 embedded textures, 6 materials, one camera, sun + earthshine lights, no hidden helper objects.

## Differences between the Blender render and the GLB
- Procedural shaders do not export. The GLB ground uses a tiled albedo texture multiplied by baked vertex colour, with no normal map, so it looks plainer and flatter than the render. (A tangent-space normal map was tried and removed: at the 14 degree sun it rendered as dark quads on the terrain grid; isolated by test renders.)
- Not in the GLB: Earth atmosphere rim, procedural stars, Cycles global illumination, ambient fill, AgX tone mapping. Add a star layer / glow / ambient light in the viewer.
- Lights are exported raw: sun 6.5, earthshine 0.6 (directional). Tune per engine; without an ambient/hemisphere light the shadow side is near black.
- Draco compression: Three.js needs `DRACOLoader`.

## Known limitations
- GLB check was done by re-importing into Blender and rendering with Cycles (previews/glb_check_*.png), not in Three.js. The dark-quad artefact seen earlier is gone after removing the normal map; behaviour in a WebGL viewer is still unconfirmed.
- Rocks are still low-detail procedural shapes (smooth-ish near the camera); the horizon is improved but still procedural, not real DEM data.
- Earth continents are original simplified outlines, not real geography.
- Render comparison covers the desktop camera only (V3 vs V4, same camera and settings); tablet and mobile V4 renders were checked visually but have no V3 counterpart in this folder.

## Fix applied after the first delivery
The tiled regolith albedo embedded in the three GLBs was black (setting an image colour space after writing its pixels wipes the buffer in Blender). Fixed in `scripts/export_glb_v4.py`, GLBs re-exported (sizes above updated). The ground now carries its grain albedo times the baked vertex colours; with the correct albedo the ground is noticeably brighter than before. The Blender glTF importer ignores vertex colours, so its check render shows the albedo without the vertex-colour tint.
