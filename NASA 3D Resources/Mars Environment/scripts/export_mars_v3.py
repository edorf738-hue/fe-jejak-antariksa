"""GLB export for Mars Environment V3 (single file, all three cameras).
Run inside Blender in TWO calls: (1) bpy.ops.wm.open_mainfile(filepath=<v2/blender/mars_environment_v3.blend>)  (2) exec this script.
Procedural shaders cannot be exported, so: terrain = resampled grid + baked vertex colours (palette, slope, curvature AO, haze) x tiled grain albedo + tiled NORMAL MAP;
rocks = PBR materials x baked per-vertex AO/dust colours; atmosphere = emissive sky-dome texture; sun = KHR_lights_punctual.
NOTE: set an image's colour space BEFORE writing its pixels - changing it afterwards wipes the buffer to black (this broke V1 lunar/mars textures)."""
import bpy, bmesh, os, math, numpy as np
from mathutils import Matrix
from mathutils.bvhtree import BVHTree

ROOT = r"C:\Users\Edorf\Project\blander skill\blender-skills\mars-environment\v3"
GRID, GSMOOTH, MNT_RATIO, ROCK_MIN, PEB_NEAR, PEB_MID, TILE_N = (330, 240), 2, 0.05, 0.2, 400, 300, 512
rng = np.random.default_rng(3)
D = bpy.data.objects
def remove(ob):
    if ob and ob.name in D: bpy.data.objects.remove(ob)

# ---- tiled textures (FFT noise is periodic): grain albedo + two normal maps ----
N = TILE_N
fy, fx = np.meshgrid(np.fft.fftfreq(N), np.fft.fftfreq(N), indexing="ij"); f = np.hypot(fx, fy); f[0, 0] = 1
def spec(beta):
    a = np.fft.ifft2(np.fft.fft2(rng.standard_normal((N, N))) / f ** beta).real; return (a - a.mean()) / a.std()
def srgb(a): return np.where(a <= 0.0031308, a * 12.92, 1.055 * np.clip(a, 0, None) ** (1 / 2.4) - 0.055)
def new_img(name, rgb, colorspace, path=None):
    img = bpy.data.images.new(name, N, N, alpha=True)
    img.colorspace_settings.name = colorspace                                   # FIRST, then pixels
    px = np.ones((N, N, 4), np.float32); px[..., :3] = rgb; img.pixels.foreach_set(px.ravel())
    if path: img.filepath_raw = path; img.file_format = "PNG"; img.save()
    img.pack(); return img
def normal_rgb(h, strength):
    gx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) / 2; gy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) / 2; k = strength / max(float(np.std(np.hypot(gx, gy))), 1e-6) * 0.5
    n = np.stack([-gx * k, -gy * k, np.ones_like(gx)], -1); n /= np.linalg.norm(n, axis=-1, keepdims=True); return n * 0.5 + 0.5      # OpenGL (+Y) tangent space
alb = np.clip(0.88 + 0.05 * spec(1.5) + 0.04 * spec(0.9), 0.5, 1.0)
img_a = new_img("mars_regolith_albedo", srgb(alb)[..., None].repeat(3, -1), "sRGB", os.path.join(ROOT, "textures", "mars_regolith_albedo.png"))
hn = 0.55 * spec(1.5) + 0.35 * spec(1.0) + 0.25 * spec(0.6)                      # soil: granular, multi-scale, tile = 4 m
img_n = new_img("mars_regolith_normal", normal_rgb(hn, 1.1), "Non-Color", os.path.join(ROOT, "textures", "mars_regolith_normal.png"))
yy = np.arange(N)[:, None] / N
hm = 0.6 * spec(1.3) + 0.25 * np.sin(yy * 2 * np.pi * 14 + 2.5 * spec(2.0)) + 0.3 * spec(0.8)   # rock strata: ledges + fine erosion, tile = 60 m
img_m = new_img("mars_mountain_normal", normal_rgb(hm, 1.0), "Non-Color", os.path.join(ROOT, "textures", "mars_mountain_normal.png"))

def principled_mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True
    return m, m.node_tree, next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
def ground_mat(name, nimg, nstrength):
    m, nt, b = principled_mat(name); b.inputs["Roughness"].default_value = 0.95
    ta, tn, nm = nt.nodes.new("ShaderNodeTexImage"), nt.nodes.new("ShaderNodeTexImage"), nt.nodes.new("ShaderNodeNormalMap")
    ta.image, tn.image = img_a, nimg; nm.inputs["Strength"].default_value = nstrength
    ca = nt.nodes.new("ShaderNodeVertexColor"); ca.layer_name = "Col"
    mx = nt.nodes.new("ShaderNodeMixRGB"); mx.blend_type = "MULTIPLY"; mx.inputs["Fac"].default_value = 1.0
    nt.links.new(ta.outputs["Color"], mx.inputs[1]); nt.links.new(ca.outputs["Color"], mx.inputs[2]); nt.links.new(mx.outputs["Color"], b.inputs["Base Color"])
    nt.links.new(tn.outputs["Color"], nm.inputs["Color"]); nt.links.new(nm.outputs["Normal"], b.inputs["Normal"]); return m
ROCK_RGB = {}
def rock_mat(name, rgb, rough):
    m, nt, b = principled_mat(name); b.inputs["Roughness"].default_value = rough; ROCK_RGB[name] = rgb
    c = nt.nodes.new("ShaderNodeRGB"); c.outputs[0].default_value = (1, 1, 1, 1)   # tint lives in the vertex colours (baked in rock_colours)
    ca = nt.nodes.new("ShaderNodeVertexColor"); ca.layer_name = "Col"
    mx = nt.nodes.new("ShaderNodeMixRGB"); mx.blend_type = "MULTIPLY"; mx.inputs["Fac"].default_value = 1.0
    nt.links.new(c.outputs[0], mx.inputs[1]); nt.links.new(ca.outputs["Color"], mx.inputs[2]); nt.links.new(mx.outputs["Color"], b.inputs["Base Color"]); return m
MG, MM = ground_mat("MarsGround_web", img_n, 0.9), ground_mat("MarsMountain_web", img_m, 1.0)
MRS = [rock_mat("MarsRock_Basalt_web", (0.1, 0.06, 0.045), 0.82), rock_mat("MarsRock_Rust_web", (0.3, 0.12, 0.065), 0.86),
       rock_mat("MarsRock_WeatheredRed_web", (0.24, 0.14, 0.1), 0.9), rock_mat("MarsRock_DustCovered_web", (0.36, 0.2, 0.11), 0.95)]
MR = MRS[2]

def decimate(ob, ratio, smooth=0):
    if smooth:
        bm = bmesh.new(); bm.from_mesh(ob.data)
        for _ in range(smooth): bmesh.ops.smooth_vert(bm, verts=bm.verts, factor=0.5, use_axis_x=True, use_axis_y=True, use_axis_z=True)
        bm.to_mesh(ob.data); bm.free()
    md = ob.modifiers.new("dec", "DECIMATE"); md.ratio = ratio
    new = bpy.data.meshes.new_from_object(ob.evaluated_get(bpy.context.evaluated_depsgraph_get())); new.validate()
    ob.modifiers.remove(md); old = ob.data; ob.data = new; bpy.data.meshes.remove(old)

# ---- baked Martian colour (linear) ----
def vn(x, y, s=0):
    h = lambda a, b: (np.sin(a * 127.1 + b * 311.7 + s * 74.7) * 43758.5453) % 1.0
    ix, iy = np.floor(x), np.floor(y); fx_, fy_ = x - ix, y - iy; u, v = fx_ * fx_ * (3 - 2 * fx_), fy_ * fy_ * (3 - 2 * fy_)
    return (h(ix, iy) * (1 - u) + h(ix + 1, iy) * u) * (1 - v) + (h(ix, iy + 1) * (1 - u) + h(ix + 1, iy + 1) * u) * v
def sst(a, b, x): t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
def lerp_ramp(t, stops):
    t = np.clip(t, stops[0][0], stops[-1][0]); out = np.zeros(t.shape + (3,))
    for (p0, c0), (p1, c1) in zip(stops, stops[1:]):
        m = (t >= p0) & (t <= p1); w = ((t - p0) / (p1 - p0))[..., None]
        out = np.where(m[..., None], np.array(c0) * (1 - w) + np.array(c1) * w, out)
    return out
RAMP = [(0.0, (0.04, 0.02, 0.015)), (0.3, (0.17, 0.062, 0.034)), (0.6, (0.25, 0.1, 0.058)), (0.85, (0.29, 0.135, 0.075)), (1.0, (0.32, 0.17, 0.09))]
def finish_terrain(ob, tile, mountain=False, ao=None):
    me = ob.data
    bm = bmesh.new(); bm.from_mesh(me); uv = bm.loops.layers.uv.verify()
    for fc in bm.faces:
        for lp in fc.loops: lp[uv].uv = (lp.vert.co.x / tile, lp.vert.co.y / tile)
    bm.to_mesh(me); bm.free()
    for k in list(me.color_attributes): me.color_attributes.remove(k)
    ca = me.color_attributes.new("Col", "BYTE_COLOR", "POINT")
    n = len(me.vertices)
    co = np.empty(n * 3, np.float32); me.vertices.foreach_get("co", co); co = co.reshape(-1, 3)
    nz = np.empty(n * 3, np.float32); me.vertices.foreach_get("normal", nz); nz = nz.reshape(-1, 3)[:, 2]
    x, y, z = co[:, 0], co[:, 1], co[:, 2]
    t = 0.2 + 0.6 * (0.55 * vn(x / 120, y / 120, 1) + 0.3 * vn(x / 22, y / 22, 2) + 0.15 * vn(x / 8, y / 8, 3)) + 0.12 * (nz - 0.5)
    col = lerp_ramp(t, RAMP)
    patch = np.clip((vn(x / 40, y / 40, 9) - 0.62) / 0.15, 0, 1)[:, None] * 0.8
    col = col * (1 - patch) + np.array([0.09, 0.05, 0.04]) * patch
    if mountain: col = col * (0.85 + 0.12 * np.sin(z * 0.42 + vn(x / 60, y / 60, 5) * 6))[:, None]
    col = col * 1.2
    if ao is not None: col = col * ao[:, None]
    dist = np.sqrt(x ** 2 + y ** 2 + (z - 2.6) ** 2)                                  # baked atmospheric perspective
    hz = (np.clip((dist - 250) / 3350, 0, 1) ** 1.4 * 0.65)[:, None]
    col = col * (1 - hz) + np.array([0.52, 0.31, 0.21]) * hz
    ca.data.foreach_set("color", np.concatenate([np.clip(col, 0, 1), np.ones((n, 1))], 1).astype(np.float32).ravel())
    me.color_attributes.active_color = ca
    me.materials.clear(); me.materials.append(MM if mountain else MG); me.shade_smooth()

# ---- near terrain + crater patches: resample onto a camera-space grid by raycasting ----
SRC = [D[n] for n in ("Mars_Terrain_Near", "Mars_Crater_Midground_Right", "Mars_Crater_Midground_Left", "Mars_Crater_Far_Right", "Mars_Crater_Foreground_Left") if n in D]
vv, pp, off = [], [], 0
for o in SRC:
    vv += [v.co[:] for v in o.data.vertices]; pp += [[i + off for i in pl.vertices] for pl in o.data.polygons]; off += len(o.data.vertices)
bvh = BVHTree.FromPolygons(vv, pp)
NRr, NCc = GRID
dd = 1.5 * (800.0 / 1.5) ** (np.arange(NRr) / (NRr - 1)); aa = np.linspace(-math.radians(62), math.radians(62), NCc)
Dg, Ag = np.meshgrid(dd, aa, indexing="ij"); Xg, Yg = (1.5 + Dg) * np.tan(Ag), Dg
Zg = np.zeros(Xg.shape); Wg = np.zeros(Xg.shape)
stepR = (800.0 / 1.5) ** (1.0 / (NRr - 1)); stepA = 2 * math.radians(62) / (NCc - 1)
for oi in (-0.6, 0.0, 0.6):
    for oj in (-0.6, 0.0, 0.6):
        Ds, As = Dg * stepR ** oi, Ag + oj * stepA; Xs, Ys = (1.5 + Ds) * np.tan(As), Ds
        for i in range(NRr):
            for j in range(NCc):
                h = bvh.ray_cast((Xs[i, j], Ys[i, j], 600.0), (0, 0, -1))
                if h[0] is not None: Zg[i, j] += h[0][2]; Wg[i, j] += 1
Zg = np.where(Wg > 0, Zg / np.maximum(Wg, 1), np.nan); Zg = np.where(np.isnan(Zg), np.nanmin(Zg), Zg)
def blur121(a, n):
    for _ in range(n):
        p = np.pad(a, 1, mode="edge"); a = (p[:-2, 1:-1] + 2 * p[1:-1, 1:-1] + p[2:, 1:-1]) / 4
        p = np.pad(a, 1, mode="edge"); a = (p[1:-1, :-2] + 2 * p[1:-1, 1:-1] + p[1:-1, 2:]) / 4
    return a
Zg = blur121(Zg, GSMOOTH)
curv = Zg - blur121(Zg, 14)                                                         # concave (<0) -> darker: baked ambient occlusion, fading with distance
ao = np.clip(1 + 1.0 * curv, 0.6, 1.0); ao = 1 - (1 - ao) * np.exp(-Dg / 250.0)
coll = D["Mars_Terrain_Near"].users_collection[0]
for o in SRC: remove(o)
me_ = bpy.data.meshes.new("Mars_Terrain_Near")
fr, fc_ = np.meshgrid(np.arange(NRr - 1), np.arange(NCc - 1), indexing="ij"); fa = (fr * NCc + fc_).ravel()
me_.from_pydata(np.stack([Xg.ravel(), Yg.ravel(), Zg.ravel()], 1).tolist(), [], np.stack([fa, fa + 1, fa + NCc + 1, fa + NCc], 1).tolist()); me_.update()
ob_ = bpy.data.objects.new("Mars_Terrain_Near", me_); coll.objects.link(ob_); finish_terrain(ob_, 4, False, ao.ravel())
ob = D["Mars_Mountains_Far"]; decimate(ob, MNT_RATIO, 2); finish_terrain(ob, 60, True)

# ---- rocks: drop tiny ones, decimate each SHARED mesh once, bake per-vertex AO/dust colours ----
for o in [o for o in D if o.name.startswith("Mars_Rock_") and o.scale.x < ROCK_MIN]: remove(o)
users = {}
for o in D:
    if o.type == "MESH" and o.name.startswith("Mars_Rock_"): users.setdefault(o.data, []).append(o)
def rock_colours(me, rgb):
    n = len(me.vertices)
    co = np.empty(n * 3, np.float32); me.vertices.foreach_get("co", co); co = co.reshape(-1, 3)
    nm = np.empty(n * 3, np.float32); me.vertices.foreach_get("normal", nm); nm = nm.reshape(-1, 3)
    z = (co[:, 2] - co[:, 2].min()) / max(float(np.ptp(co[:, 2])), 1e-6)
    ao_ = 0.5 + 0.5 * sst(0.0, 0.45, z)                                           # darker where the rock meets the ground / in low crevices
    var = 0.85 + 0.3 * vn(co[:, 0] * 3, co[:, 1] * 3 + co[:, 2] * 2, 7)
    dust = np.clip((nm[:, 2] - 0.55) / 0.45, 0, 1)[:, None] * 0.45                 # dust settled on upward faces
    c = (ao_ * var)[:, None] * (1 - dust) + (ao_ * var)[:, None] * np.array([1.25, 0.95, 0.78]) * dust
    c = c * np.array(rgb)
    ca = me.color_attributes.new("Col", "BYTE_COLOR", "POINT")
    ca.data.foreach_set("color", np.concatenate([np.clip(c, 0, 1), np.ones((n, 1))], 1).astype(np.float32).ravel()); me.color_attributes.active_color = ca
LOWOF = {}                                                                        # very-low-poly twin of every rock mesh, used for the merged small rocks
def decim_copy(first, ratio):
    md = first.modifiers.new("dec", "DECIMATE"); md.ratio = ratio
    new = bpy.data.meshes.new_from_object(first.evaluated_get(bpy.context.evaluated_depsgraph_get())); first.modifiers.remove(md); new.validate(); return new
for me, objs in users.items():
    first = objs[0]; ratio = 0.24 if len(me.polygons) > 3000 else 0.42
    new = decim_copy(first, ratio); low = decim_copy(first, 0.1 if len(me.polygons) < 3000 else 0.03)
    i = int(me.name.split("_")[1])
    for m_, nm_ in ((new, me.name + "_lod"), (low, me.name + "_low")):
        m_.name = nm_; m_.materials.clear(); m_.materials.append(MRS[i % 4]); rock_colours(m_, ROCK_RGB[MRS[i % 4].name])
    LOWOF[new] = low
    for o in objs: o.data = new
    bpy.data.meshes.remove(me)
_small_all = [o for o in D if o.type == "MESH" and o.name.startswith("Mars_Rock_") and o.scale.x < 0.9]
_keep = set(rng.permutation(len(_small_all))[:650].tolist())                     # cap the merged small rocks
for k, o in enumerate(_small_all):
    if k not in _keep: remove(o)

# ---- draw-call budget: merge small rocks (scale < 0.6) into one mesh per material ----
small = {}
for o in [o for o in D if o.type == "MESH" and o.name.startswith("Mars_Rock_") and o.scale.x < 0.9]:
    small.setdefault(int(o.data.name.split("_")[1]) % 4, []).append(o)
def vcols(me):
    n = len(me.vertices); out = np.empty(n * 4, np.float32); me.color_attributes["Col"].data.foreach_get("color", out); return out.reshape(-1, 4)
for mi, objs in small.items():                                                   # bmesh merge (vertex order is preserved) + colours concatenated by hand
    bm = bmesh.new(); colsl = []
    for o in objs:
        src = LOWOF[o.data] if (o.scale.x < 0.6 and o.data in LOWOF) else o.data
        t_ = bmesh.new(); t_.from_mesh(src); bmesh.ops.transform(t_, matrix=o.matrix_world, verts=t_.verts)
        tm = bpy.data.meshes.new("t"); t_.to_mesh(tm); t_.free(); bm.from_mesh(tm); bpy.data.meshes.remove(tm); colsl.append(vcols(src))
    me = bpy.data.meshes.new(f"Mars_Rocks_Merged_{mi}"); bm.to_mesh(me); bm.free()
    for k in list(me.color_attributes): me.color_attributes.remove(k)
    ca = me.color_attributes.new("Col", "BYTE_COLOR", "POINT"); ca.data.foreach_set("color", np.concatenate(colsl).ravel()); me.color_attributes.active_color = ca
    me.materials.append(MRS[mi]); me.shade_smooth()
    m_ob = bpy.data.objects.new(f"Mars_Rocks_Merged_{mi}", me); coll.objects.link(m_ob)
    for o in objs: remove(o)

# ---- gravel: thinned low-poly stones at the original positions ----
def lowpoly(name, nv, keep, sub):
    ob = D.get(name)
    if ob is None: return
    co = np.empty(len(ob.data.vertices) * 3, np.float32); ob.data.vertices.foreach_get("co", co); co = co.reshape(-1, nv, 3)
    ctr = co.mean(1); rad = np.linalg.norm(co - ctr[:, None], axis=2).mean(1)
    idx = np.arange(len(ctr))[:: max(1, int(math.ceil(len(ctr) / keep)))]
    bm = bmesh.new(); r_ = np.random.default_rng(5)
    for i in idx:
        s_ = rad[i] * 1.05; rot = Matrix.Rotation(r_.uniform(0, 6.28), 4, "Z")
        bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=1.0, matrix=Matrix.Translation(ctr[i]) @ rot @ Matrix.Diagonal((s_ * r_.uniform(0.9, 1.4), s_ * r_.uniform(0.9, 1.4), s_ * 0.6, 1.0)))
    me = bpy.data.meshes.new(name + "_lp"); bm.to_mesh(me); bm.free()
    for pl in me.polygons: pl.use_smooth = False
    ca = me.color_attributes.new("Col", "BYTE_COLOR", "POINT"); ca.data.foreach_set("color", np.tile([*(np.array(ROCK_RGB["MarsRock_WeatheredRed_web"]) * 0.85), 1.0], len(me.vertices)).astype(np.float32)); me.color_attributes.active_color = ca
    me.materials.append(MR); old = ob.data; ob.data = me; bpy.data.meshes.remove(old)
lowpoly("Mars_Gravel_Near", 42, PEB_NEAR, 2); lowpoly("Mars_Gravel_Mid", 12, PEB_MID, 1)

# ---- sky: inverted dome, emissive gradient+mottling texture (u = azimuth, v = elevation; horizon at v 0.5) ----
SKY = [(0.0, (0.42, 0.25, 0.16)), (0.1, (0.24, 0.125, 0.08)), (0.4, (0.11, 0.055, 0.04)), (1.0, (0.05, 0.025, 0.022))]
SW, SH = 512, 256
vv_ = np.linspace(0, 1, SH)[:, None] * np.ones((1, SW)); uu_ = np.ones((SH, 1)) * np.linspace(0, 1, SW)[None, :]
elev = np.clip((vv_ - 0.5) * 2, 0, 1)
th = uu_ * 2 * np.pi; mott = 0.88 + 0.24 * vn(2.5 * np.cos(th) + 0.0 * elev, 2.5 * np.sin(th) + 9 * elev, 4)
sky_rgb = lerp_ramp(elev, SKY) * mott[..., None]
si = bpy.data.images.new("mars_sky_gradient", SW, SH, alpha=True); si.colorspace_settings.name = "sRGB"
sp = np.ones((SH, SW, 4), np.float32); sp[..., :3] = srgb(sky_rgb); si.pixels.foreach_set(sp.ravel()); si.pack()
bm = bmesh.new(); bm.loops.layers.uv.verify(); bmesh.ops.create_uvsphere(bm, u_segments=48, v_segments=24, radius=20000.0, calc_uvs=True); bmesh.ops.reverse_faces(bm, faces=bm.faces)
me = bpy.data.meshes.new("Mars_SkyDome"); bm.to_mesh(me); bm.free()
sm = bpy.data.materials.new("MarsSky_emissive"); sm.use_nodes = True; snt = sm.node_tree
sb = next(n for n in snt.nodes if n.type == "BSDF_PRINCIPLED"); sb.inputs["Base Color"].default_value = (0, 0, 0, 1)
for k in ("Specular IOR Level", "Specular"):
    if k in sb.inputs: sb.inputs[k].default_value = 0.0
sb.inputs["Roughness"].default_value = 1.0
ti = snt.nodes.new("ShaderNodeTexImage"); ti.image = si; ti.extension = "EXTEND"
snt.links.new(ti.outputs["Color"], sb.inputs["Emission Color"]); sb.inputs["Emission Strength"].default_value = 1.0
me.materials.append(sm)
sky = bpy.data.objects.new("Mars_SkyDome", me); bpy.data.collections["Mars_Atmosphere"].objects.link(sky)
remove(D.get("Atmosphere_Haze_Controller"))

# ---- cameras: glTF has no lens shift, so convert Blender's shift_y into an equivalent pitch; yfov/aspect are patched after export (the exporter uses the scene resolution for all cameras)
CAMSPEC = {"Cam_Desktop_16x9": 16 / 9, "Cam_Tablet_4x3": 4 / 3, "Cam_Mobile_9x16": 9 / 16}
for cn in CAMSPEC:
    c = D[cn]; ang = math.atan(c.data.shift_y * 36.0 / c.data.lens); c.rotation_euler.x += ang; c.data.shift_y = 0.0
bpy.ops.object.select_all(action="DESELECT")
path = os.path.join(ROOT, "models", "mars_environment_v3.glb")
kw = dict(filepath=path, export_format="GLB", export_cameras=True, export_lights=True, export_apply=True, export_yup=True,
          export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=6, export_draco_position_quantization=18, export_draco_normal_quantization=14, export_draco_texcoord_quantization=20, export_draco_color_quantization=10, export_image_format="AUTO")
for o in (dict(export_vertex_color="ACTIVE", export_import_convert_lighting_mode="RAW"), dict(export_vertex_color="ACTIVE"), {}):
    try:
        bpy.ops.export_scene.gltf(**dict(kw, **o)); break
    except TypeError as e:
        print("option not supported, retrying:", e)
import json, struct
raw = open(path, "rb").read(); jl = struct.unpack("<I", raw[12:16])[0]; js = json.loads(raw[20:20 + jl]); rest = raw[20 + jl:]
for cm in js["cameras"]:
    a = CAMSPEC[cm["name"]]; lens = D[cm["name"]].data.lens
    cm["perspective"]["yfov"] = 2 * math.atan(18.0 / lens / a) if a >= 1 else 2 * math.atan(18.0 / lens); cm["perspective"]["aspectRatio"] = a
jb = json.dumps(js, separators=(",", ":")).encode(); jb += b" " * ((4 - len(jb) % 4) % 4)
open(path, "wb").write(b"glTF" + struct.pack("<II", 2, 12 + 8 + len(jb) + len(rest)) + struct.pack("<I", len(jb)) + b"JSON" + jb + rest)
print("exported", os.path.getsize(path) // 1024, "KB")
