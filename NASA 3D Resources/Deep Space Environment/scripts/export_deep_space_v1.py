"""GLB export for Deep Space Environment V1. Run inside Blender in TWO calls: (1) open the .blend  (2) exec this script.
The scene is already glTF-friendly (emissive textures, one sun, small meshes), so nothing is rebuilt: only the export and a camera patch.
No Draco: the meshes are tiny (a sky dome, ~1100 star quads, two spheres and a shell) and Draco would add a decoder dependency for no gain.
glTF cameras take yfov/aspect from the scene resolution, so each camera's yfov/aspectRatio is patched after export to its designed values."""
import bpy, os, math, json, struct

ROOT = r"C:\Users\Edorf\Project\blander skill\blender-skills\deep-space-environment\v1"
CAMSPEC = {"Cam_Desktop_16x9": 16 / 9, "Cam_Tablet_4x3": 4 / 3, "Cam_Mobile_9x16": 9 / 16}
path = os.path.join(ROOT, "models", "deep_space_environment_v1.glb")
# Blender sun strength S lights a white diffuse surface to ~S; glTF/Three lights use lux where output = albedo*E/pi, so export E = S*pi to match the Blender look
bpy.data.lights["Sun"].energy *= math.pi
bpy.ops.object.select_all(action="DESELECT")
kw = dict(filepath=path, export_format="GLB", export_cameras=True, export_lights=True, export_apply=True, export_yup=True, export_draco_mesh_compression_enable=False, export_image_format="AUTO")
for o in (dict(export_import_convert_lighting_mode="RAW"), {}):
    try: bpy.ops.export_scene.gltf(**dict(kw, **o)); break
    except TypeError as e: print("option not supported, retrying:", e)
raw = open(path, "rb").read(); jl = struct.unpack("<I", raw[12:16])[0]; js = json.loads(raw[20:20 + jl]); rest = raw[20 + jl:]
for cm in js["cameras"]:
    a = CAMSPEC[cm["name"]]; lens = bpy.data.objects[cm["name"]].data.lens
    cm["perspective"]["yfov"] = 2 * math.atan(18.0 / lens / a) if a >= 1 else 2 * math.atan(18.0 / lens); cm["perspective"]["aspectRatio"] = a
jb = json.dumps(js, separators=(",", ":")).encode(); jb += b" " * ((4 - len(jb) % 4) % 4)
open(path, "wb").write(b"glTF" + struct.pack("<II", 2, 12 + 8 + len(jb) + len(rest)) + struct.pack("<I", len(jb)) + b"JSON" + jb + rest)
print("exported", os.path.getsize(path) // 1024, "KB")
