# Mars Environment V3 — Realism Pass

V3 is a non-destructive refinement branch based on the supplied V2 scripts. It does not overwrite V2.

## Changes
- Reframed desktop, tablet, and mobile cameras to reduce excessive empty sky and give the terrain more visual presence.
- Mobile camera uses a slightly wider lens and reduced yaw to avoid an oversized foreground rock dominating the vertical composition.
- Reduced procedural bump intensity on rocks to avoid an inflated/faceted appearance while retaining multi-scale surface detail.
- Added a restrained amount of fine terrain relief.
- Slightly increased retention of rock mesh detail during GLB export.

## Important limitation
This package contains the V3 Blender build/export scripts, not a newly rendered GLB. Blender is not installed in the execution environment used to prepare this package, so the scripts could not be run or visually validated here. The supplied V2 GLB remains unchanged.

## Run on the Windows machine
1. Create the folder `C:\Users\Edorf\Project\blander skill\blender-skills\mars-environment\v3` with subfolders `blender`, `models`, `textures`, and `previews`.
2. Open Blender and run `build_mars_v3.py` with `PREVIEW_MODE = True` first to inspect the scene. For the full build, set `PREVIEW_MODE = False`.
3. Open `blender/mars_environment_v3.blend`, then run `export_mars_v3.py`.
4. Update the local viewer to load `models/mars_environment_v3.glb`, then run the desktop/tablet/mobile Three.js test.

## Validation targets
- No missing textures or GLB loader errors.
- Check horizon position and mobile foreground scale at actual device aspect ratios.
- Compare GPU frame time on a real device; the previous SwiftShader render is not a real GPU performance benchmark.
- Keep the V2 GLB as rollback until V3 is visually approved.
