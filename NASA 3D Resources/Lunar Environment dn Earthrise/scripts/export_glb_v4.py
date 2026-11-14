"""Per-device GLB export for Lunar Environment v4.
Run inside Blender, once per profile:   PROFILE = "desktop"  # or "tablet" / "mobile"; exec(open(path).read())
Start from a freshly opened lunar_environment_v4.blend (see note below). It applies the profile's level-of-detail budget, swaps procedural materials for
glTF-safe textured ones, keeps ONLY that device's camera, and exports <name>.glb with Draco compression.
Not transferable to glTF: procedural shaders (regolith bump chain, rock noise), Cycles atmosphere-rim shell, World-shader stars."""
import bpy, bmesh, os, math, numpy as np

V4 = r"C:\Users\Edorf\Project\blander skill\blender-skills\lunar-landscape\v4"
P = {  # decimate ratios, rock-size cutoff, pebble ratios (None = drop), texture sizes, Earth sphere res, output name, render size
 "desktop": dict(grid=(260, 200), presmooth=2, gsmooth=3, mnt=0.04, rock_min=0.0, rock_ratio=1.0, peb_near=250, peb_mid=150, ground_tex=1024, earth_tex=2048, seg=(128, 64), out="lunar_environment_v4.glb", res=(1920, 1080), cam="Cam_Desktop_16x9"),
 "tablet":  dict(grid=(190, 150), presmooth=2, gsmooth=4, mnt=0.025, rock_min=0.25, rock_ratio=0.5, peb_near=150, peb_mid=None, ground_tex=1024, earth_tex=1024, seg=(96, 48), out="lunar_environment_v4_tablet.glb", res=(2048, 1536), cam="Cam_Tablet_4x3"),
 "mobile":  dict(grid=(120, 96), presmooth=2, gsmooth=5, mnt=0.015, rock_min=0.5, rock_ratio=0.25, peb_near=80, peb_mid=None, ground_tex=512, earth_tex=1024, seg=(64, 32), out="lunar_environment_v4_mobile.glb", res=(1080, 1920), cam="Cam_Mobile_9x16"),
}[PROFILE]
# Blender cannot export in the same call that reopens a file: first call  bpy.ops.wm.open_mainfile(filepath=<v3 blend>), then run this script.
rng = np.random.default_rng(3)
D = bpy.data.objects
def remove(ob):
    if ob and ob.name in D: bpy.data.objects.remove(ob)

# ---- tileable ground textures (FFT noise is periodic) ----
N = P["ground_tex"]
fy, fx = np.meshgrid(np.fft.fftfreq(N), np.fft.fftfreq(N), indexing="ij"); f = np.hypot(fx, fy); f[0, 0] = 1
def spec(beta):
    a = np.fft.ifft2(np.fft.fft2(rng.standard_normal((N, N))) / f ** beta).real; return (a - a.mean()) / a.std()
patch, grain = spec(1.5), spec(0.9)
alb = np.clip(0.5 + 0.12 * patch + 0.07 * grain, 0.2, 0.85)                 # neutral grey; warm tint + large-scale variation come from vertex colour
alb_s = np.where(alb <= 0.0031308, alb * 12.92, 1.055 * alb ** (1 / 2.4) - 0.055)
gy, gx = np.gradient(0.65 * spec(1.1) + 0.5 * grain)
nrm = np.stack([-gx * 5, -gy * 5, np.ones_like(gx)], -1); nrm = nrm / np.linalg.norm(nrm, axis=-1, keepdims=True) * 0.5 + 0.5
def save_img(name, rgb, srgb):
    img = bpy.data.images.new(name, N, N, alpha=False)
    px = np.ones((N, N, 4), np.float32); px[..., :3] = rgb
    img.colorspace_settings.name = "sRGB" if srgb else "Non-Color"      # must come BEFORE setting pixels: changing it afterwards wipes the buffer to black
    img.pixels.foreach_set(px.ravel()); img.pack(); return img
img_a = save_img("regolith_albedo", np.repeat(alb_s[..., None], 3, -1), True); img_n = save_img("regolith_normal", nrm, False)
for im, fn in ((img_a, "regolith_albedo_v4.png"), (img_n, "regolith_normal_v4.png")):
    im.filepath_raw = os.path.join(V4, "textures", fn); im.file_format = "PNG"; im.save()
    im.pack()

def principled_mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True
    return m, m.node_tree, next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
def ground_mat():
    # No normal map: at the low sun angle a tangent-space normal map on the 1 m terrain grid renders as dark quads (verified by isolating it in a test render).
    m, nt, b = principled_mat("LunarGround_web"); b.inputs["Roughness"].default_value = 0.95
    ta = nt.nodes.new("ShaderNodeTexImage"); ta.image = img_a
    ca = nt.nodes.new("ShaderNodeVertexColor"); ca.layer_name = "Col"
    mx = nt.nodes.new("ShaderNodeMixRGB"); mx.blend_type = "MULTIPLY"; mx.inputs["Fac"].default_value = 1.0
    nt.links.new(ta.outputs["Color"], mx.inputs[1]); nt.links.new(ca.outputs["Color"], mx.inputs[2]); nt.links.new(mx.outputs["Color"], b.inputs["Base Color"]); return m
def rock_mat(name, tone):
    m, nt, b = principled_mat(name); b.inputs["Base Color"].default_value = (0.125 * tone, 0.117 * tone, 0.105 * tone, 1); b.inputs["Roughness"].default_value = 0.88; return m
MG = ground_mat(); MRS = [rock_mat("LunarRock_Basalt_web", 0.7), rock_mat("LunarRock_Mixed_web", 1.0), rock_mat("LunarRock_Light_web", 1.35)]; MR = MRS[1]

def decimate(ob, ratio, smooth=0):
    if smooth:        # pre-smooth so the collapse keeps the large forms instead of shredding fine noise into shards (normal map restores the micro detail)
        bm = bmesh.new(); bm.from_mesh(ob.data)
        for _ in range(smooth): bmesh.ops.smooth_vert(bm, verts=bm.verts, factor=0.5, use_axis_x=True, use_axis_y=True, use_axis_z=True)
        bm.to_mesh(ob.data); bm.free()
    md = ob.modifiers.new("dec", "DECIMATE"); md.ratio = ratio
    new = bpy.data.meshes.new_from_object(ob.evaluated_get(bpy.context.evaluated_depsgraph_get()))
    new.validate(); ob.modifiers.remove(md); old = ob.data; ob.data = new; bpy.data.meshes.remove(old)
def finish_terrain(ob, tile):
    me = ob.data
    bm = bmesh.new(); bm.from_mesh(me); uv = bm.loops.layers.uv.verify()
    for fc in bm.faces:
        for lp in fc.loops: lp[uv].uv = (lp.vert.co.x / tile, lp.vert.co.y / tile)
    bm.to_mesh(me); bm.free()
    for k in list(me.color_attributes): me.color_attributes.remove(k)
    ca = me.color_attributes.new("Col", "BYTE_COLOR", "POINT")
    co = np.empty(len(me.vertices) * 3, np.float32); me.vertices.foreach_get("co", co); co = co.reshape(-1, 3)
    nz = np.empty(len(me.vertices) * 3, np.float32); me.vertices.foreach_get("normal", nz); nz = nz.reshape(-1, 3)[:, 2]
    def vn(x, y):    # cheap value noise for large-scale albedo variation
        ix, iy = np.floor(x), np.floor(y); h = lambda a, b: (np.sin(a * 127.1 + b * 311.7) * 43758.5453) % 1.0
        fx_, fy_ = x - ix, y - iy; u, v = fx_ * fx_ * (3 - 2 * fx_), fy_ * fy_ * (3 - 2 * fy_)
        return (h(ix, iy) * (1 - u) + h(ix + 1, iy) * u) * (1 - v) + (h(ix, iy + 1) * (1 - u) + h(ix + 1, iy + 1) * u) * v
    var = 0.55 + 0.75 * (0.6 * vn(co[:, 0] / 90, co[:, 1] / 90) + 0.4 * vn(co[:, 0] / 17, co[:, 1] / 17)) - 0.18 * (1 - np.clip(nz, 0, 1)) * 3
    var = np.clip(var * 1.35, 0.5, 1.0)
    cols_ = np.stack([var * 1.0, var * 0.93, var * 0.85, np.ones_like(var)], 1)       # warm grey tint (linear)
    ca.data.foreach_set("color", cols_.astype(np.float32).ravel())
    me.color_attributes.active_color = ca
    me.materials.clear(); me.materials.append(MG); me.shade_smooth()

# ---- strip everything that is not part of this device's asset ----
for n in ("Earth_AtmosphereRim", "Starfield_Controller"): remove(D.get(n))
for c in ("Cam_Desktop_16x9", "Cam_Tablet_4x3", "Cam_Mobile_9x16"):
    if c != P["cam"]: remove(D.get(c))
for ob in [o for o in D if o.name.startswith("Lunar_Rock_") and o.scale.x < P["rock_min"]]: remove(ob)
# ---- terrain levels of detail ----
# Near terrain + crater patches: DECIMATE shreds the stretched camera-space grid into slivers, so resample it instead:
# raycast the full-res meshes from above onto a coarser camera-space grid (same parametrisation as the build) -> clean, evenly shaped triangles.
from mathutils.bvhtree import BVHTree
SRC = [D[n] for n in ("Lunar_Terrain_Near", "Lunar_Crater_Midground_Right", "Lunar_Crater_Midground_Left", "Lunar_Crater_Far_Right", "Lunar_Crater_Foreground_Left") if n in D]
for o in SRC:     # low-pass the source so the coarse grid does not alias micro-relief into spiky triangles (normal map brings the detail back)
    bm = bmesh.new(); bm.from_mesh(o.data)
    for _ in range(P["presmooth"]): bmesh.ops.smooth_vert(bm, verts=bm.verts, factor=0.5, use_axis_x=True, use_axis_y=True, use_axis_z=True)
    bm.to_mesh(o.data); bm.free()
vv, pp, off = [], [], 0
for o in SRC:
    vv += [v.co[:] for v in o.data.vertices]; pp += [[i + off for i in pl.vertices] for pl in o.data.polygons]; off += len(o.data.vertices)
bvh = BVHTree.FromPolygons(vv, pp)
NRr, NCc = P["grid"]
dd = 1.5 * (800.0 / 1.5) ** (np.arange(NRr) / (NRr - 1)); aa = np.linspace(-math.radians(62), math.radians(62), NCc)
Dg, Ag = np.meshgrid(dd, aa, indexing="ij"); Xg, Yg = (1.5 + Dg) * np.tan(Ag), Dg
Zg = np.zeros(Xg.shape); Wg = np.zeros(Xg.shape)
stepR = (800.0 / 1.5) ** (1.0 / (NRr - 1)); stepA = 2 * math.radians(62) / (NCc - 1)
for oi in (-0.6, 0.0, 0.6):                      # 3x3 supersampled box filter per grid cell: removes sub-cell relief that would alias into spikes and hard shadows
    for oj in (-0.6, 0.0, 0.6):
        Ds, As = Dg * stepR ** oi, Ag + oj * stepA
        Xs, Ys = (1.5 + Ds) * np.tan(As), Ds
        for i in range(NRr):
            for j in range(NCc):
                h = bvh.ray_cast((Xs[i, j], Ys[i, j], 400.0), (0, 0, -1))
                if h[0] is not None: Zg[i, j] += h[0][2]; Wg[i, j] += 1
Zg = np.where(Wg > 0, Zg / np.maximum(Wg, 1), np.nan)
Zg = np.where(np.isnan(Zg), np.nanmin(Zg), Zg)
for _ in range(P["gsmooth"]):      # separable [1 2 1] low-pass on the grid: sub-cell relief otherwise shows as a checkerboard of lit/unlit facets at grazing sun
    Zp = np.pad(Zg, 1, mode="edge"); Zg = (Zp[:-2, 1:-1] + 2 * Zp[1:-1, 1:-1] + Zp[2:, 1:-1]) / 4
    Zp = np.pad(Zg, 1, mode="edge"); Zg = (Zp[1:-1, :-2] + 2 * Zp[1:-1, 1:-1] + Zp[1:-1, 2:]) / 4
coll = D["Lunar_Terrain_Near"].users_collection[0]
for o in SRC: remove(o)
me_ = bpy.data.meshes.new("Lunar_Terrain_Near")
fr, fc_ = np.meshgrid(np.arange(NRr - 1), np.arange(NCc - 1), indexing="ij"); fa = (fr * NCc + fc_).ravel()
me_.from_pydata(np.stack([Xg.ravel(), Yg.ravel(), Zg.ravel()], 1).tolist(), [], np.stack([fa, fa + 1, fa + NCc + 1, fa + NCc], 1).tolist()); me_.update()
ob_ = bpy.data.objects.new("Lunar_Terrain_Near", me_); coll.objects.link(ob_); finish_terrain(ob_, 8)
ob = D["Lunar_Mountains_Far"]; decimate(ob, P["mnt"], 2); finish_terrain(ob, 40)
# Pebbles: DECIMATE on the merged pebble meshes shreds them into shards, so rebuild a thinned set of low-poly (80 / 20 tri) stones at the original positions/sizes.
from mathutils import Matrix
def lowpoly_pebbles(name, nv, keep, sub):
    ob = D.get(name)
    if ob is None: return
    if keep is None: remove(ob); return
    co = np.empty(len(ob.data.vertices) * 3, np.float32); ob.data.vertices.foreach_get("co", co); co = co.reshape(-1, nv, 3)
    ctr = co.mean(1); rad = np.linalg.norm(co - ctr[:, None], axis=2).mean(1)
    idx = np.arange(len(ctr))[:: max(1, int(math.ceil(len(ctr) / keep)))]
    bm = bmesh.new(); r_ = np.random.default_rng(5)
    for i in idx:
        sc_ = rad[i] * 1.05; rot = Matrix.Rotation(r_.uniform(0, 6.28), 4, "Z")
        bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=1.0, matrix=Matrix.Translation(ctr[i]) @ rot @ Matrix.Diagonal((sc_ * r_.uniform(0.9, 1.4), sc_ * r_.uniform(0.9, 1.4), sc_ * 0.6, 1.0)))
    me = bpy.data.meshes.new(name + "_lp"); bm.to_mesh(me); bm.free()
    for pl in me.polygons: pl.use_smooth = False
    me.materials.append(MR); old = ob.data; ob.data = me; bpy.data.meshes.remove(old)
lowpoly_pebbles("Lunar_Foreground_Pebbles_Near", 42, P["peb_near"], 2)
lowpoly_pebbles("Lunar_Foreground_Pebbles_Mid", 12, P["peb_mid"], 1)
for me in {o.data for o in bpy.data.objects if o.type == "MESH" and o.name.startswith("Lunar_Rock_")}:
    i = int(me.name.split("_")[-1].split(".")[0]); me.materials.clear(); me.materials.append(MRS[[1, 0, 2, 1, 0][i % 5]])

# Rock LOD: decimate each SHARED rock mesh once (instances keep sharing it)
if P["rock_ratio"] < 1.0:
    users = {}
    for o in D:
        if o.type == "MESH" and o.name.startswith("Lunar_Rock_"): users.setdefault(o.data, []).append(o)
    for me, objs in users.items():
        first = objs[0]; first.data = me
        md = first.modifiers.new("dec", "DECIMATE"); md.ratio = P["rock_ratio"]
        new = bpy.data.meshes.new_from_object(first.evaluated_get(bpy.context.evaluated_depsgraph_get())); first.modifiers.remove(md)
        new.validate(); new.name = me.name + "_lod"
        for o in objs: o.data = new
        bpy.data.meshes.remove(me)

# ---- Earth: re-tessellate to the profile, glTF-compatible textured materials ----
E = P["earth_tex"]
def load(n, cs):
    im = bpy.data.images.load(os.path.join(V4, "textures", n)); im.colorspace_settings.name = cs; im.pack(); return im
def earth_mat():
    m, nt, b = principled_mat("Earth_Surface_web"); b.inputs["Roughness"].default_value = 0.8
    c, l = nt.nodes.new("ShaderNodeTexImage"), nt.nodes.new("ShaderNodeTexImage")
    c.image, l.image = load(f"earth_color_{E}.jpg", "sRGB"), load(f"earth_lights_{E}.png", "sRGB")
    dim = nt.nodes.new("ShaderNodeMixRGB"); dim.blend_type = "MULTIPLY"; dim.inputs["Fac"].default_value = 1.0
    nt.links.new(c.outputs["Color"], dim.inputs[1]); dim.inputs[2].default_value = (0.85, 0.86, 0.88, 1)
    nt.links.new(dim.outputs["Color"], b.inputs["Base Color"]); nt.links.new(l.outputs["Color"], b.inputs["Emission Color"])
    b.inputs["Emission Strength"].default_value = 0.5; return m
def cloud_mat():
    m, nt, b = principled_mat("Earth_Clouds_web"); b.inputs["Roughness"].default_value = 0.9
    t = nt.nodes.new("ShaderNodeTexImage"); t.image = load(f"earth_clouds_{E}.png", "sRGB")
    nt.links.new(t.outputs["Color"], b.inputs["Base Color"]); nt.links.new(t.outputs["Alpha"], b.inputs["Alpha"])
    try: m.surface_render_method = "BLENDED"
    except Exception: pass
    return m
for name, mat in (("Earth_Globe", earth_mat()), ("Earth_CloudLayer", cloud_mat())):
    ob = D[name]; bm = bmesh.new(); bm.loops.layers.uv.verify()
    bmesh.ops.create_uvsphere(bm, u_segments=P["seg"][0], v_segments=P["seg"][1], radius=1.0, calc_uvs=True)
    bm.to_mesh(ob.data); ob.data.update(); bm.free(); ob.data.shade_smooth()
    ob.data.materials.clear(); ob.data.materials.append(mat)

sc = bpy.context.scene; sc.render.resolution_x, sc.render.resolution_y = P["res"]; sc.camera = D[P["cam"]]
bpy.ops.object.select_all(action="DESELECT")
path = os.path.join(V4, "models", P["out"])
kw = dict(filepath=path, export_format="GLB", export_cameras=True, export_lights=True, export_apply=True, export_yup=True,
          export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6, export_image_format="AUTO")
for o in (dict(export_vertex_color="ACTIVE", export_import_convert_lighting_mode="RAW"), dict(export_vertex_color="ACTIVE"), {}):
    try:
        bpy.ops.export_scene.gltf(**dict(kw, **o)); break
    except TypeError as e:
        print("option not supported, retrying:", e)
print("exported", P["out"], os.path.getsize(path) // 1024, "KB")
