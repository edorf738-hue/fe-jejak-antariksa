"""Wayang Antariksa - Deep Space Environment V1 (Blender 5.x, Cycles).
Run inside Blender:  exec(open(path).read())      (set DEBUG_SMALL = True for a fast low-res texture pass)
Everything is built so that Blender render == GLB content (only emissive textures, one sun and a few small meshes):
  Space_Dome  - inverted sphere, emissive equirect texture: nebula / cosmic dust band + faint stars (baked)
  Stars       - ~1100 camera-centred sprite quads (tinted glow atlas, alpha-blended) for the brighter stars
  Planets     - a rust-coloured planet (crescent-lit) and a small grey moon, lit by one directional sun
  Atmosphere  - baked-fresnel glow shell around the planet (view-dependent effects are baked for the fixed camera position)
  Lighting / Cameras
No wayang/gunungan imagery, text, logos or UI."""
import bpy, math, os, numpy as np

ROOT = r"C:\Users\Edorf\Project\blander skill\blender-skills\deep-space-environment\v1"
SMALL = bool(globals().get("DEBUG_SMALL", False))
rng = np.random.default_rng(42)
R_DOME, R_STAR = 20000.0, 19000.0
SW, SH = (1024, 512) if SMALL else (4096, 2048)

# ---------------------------------------------------------------- helpers
def sdir(az_deg, el_deg):
    """unit vector: azimuth to the right of forward (+Y), elevation above the horizon (Blender Z up)"""
    a, e = math.radians(az_deg), math.radians(el_deg)
    return np.array([math.sin(a) * math.cos(e), math.cos(a) * math.cos(e), math.sin(e)])
def fnoise(shape, beta, seed):
    r = np.random.default_rng(seed); H, W = shape
    fy, fx = np.meshgrid(np.fft.fftfreq(H), np.fft.fftfreq(W), indexing="ij"); f = np.hypot(fx, fy); f[0, 0] = 1
    a = np.fft.ifft2(np.fft.fft2(r.standard_normal(shape)) / f ** beta).real
    return (a - a.mean()) / a.std()
def sst(a, b, x): t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
def srgb(a): return np.where(a <= 0.0031308, a * 12.92, 1.055 * np.clip(a, 0, None) ** (1 / 2.4) - 0.055)
def save_tex(name, rgba, colorspace, ext):
    """write a texture to disk (JPEG for opaque, PNG for alpha) and reload it from disk, so the glTF exporter embeds the original file bytes.
    NOTE: the colour space must be set BEFORE the pixels are written (afterwards it wipes the buffer in Blender)."""
    H, W = rgba.shape[:2]
    img = bpy.data.images.new(name, W, H, alpha=True); img.colorspace_settings.name = colorspace
    img.pixels.foreach_set(np.ascontiguousarray(rgba, np.float32).ravel())
    path = os.path.join(ROOT, "textures", name + ext); img.filepath_raw = path; img.file_format = "JPEG" if ext == ".jpg" else "PNG"
    img.save(quality=90) if ext == ".jpg" else img.save()
    bpy.data.images.remove(img)
    im = bpy.data.images.load(path); im.colorspace_settings.name = colorspace; return im
def rgba_from(rgb, a=None):
    out = np.ones(rgb.shape[:2] + (4,), np.float32); out[..., :3] = rgb
    if a is not None: out[..., 3] = a
    return out

# ---------------------------------------------------------------- scene reset
bpy.ops.object.select_all(action="SELECT"); bpy.ops.object.delete()
for blk in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras, bpy.data.collections, bpy.data.images):
    for b in list(blk): blk.remove(b)
scene = bpy.context.scene
cols = {}
for n in ["Space_Dome", "Stars", "Planets", "Atmosphere", "Lighting", "Cameras"]:
    c = bpy.data.collections.new(n); scene.collection.children.link(c); cols[n] = c

# ---------------------------------------------------------------- nebula / dust / faint-star dome texture
H, W = SH, SW
DOME_LON0 = 270.0                                                          # texture seam sits behind the camera
uu = (np.arange(W) + 0.5) / W; vv = (np.arange(H) + 0.5) / H
lon = np.radians(DOME_LON0) + uu[None, :] * 2 * np.pi; lat = (vv[:, None] - 0.5) * np.pi
dx, dy, dz = np.cos(lat) * np.cos(lon), np.cos(lat) * np.sin(lon), np.sin(lat) * np.ones_like(lon)   # world direction (lon=90deg -> +Y forward)
# note: lon is measured from +X; forward (+Y) = lon 90. azimuth-to-the-right a  <->  lon = 90 - a
P0 = sdir(4, 0); T = np.array([math.cos(math.radians(24)), 0, math.sin(math.radians(24))])      # band centre line passes just below the view centre, rising to the right
T = T - P0 * np.dot(T, P0); T /= np.linalg.norm(T); NB = np.cross(P0, T); NB /= np.linalg.norm(NB)
dist = dx * NB[0] + dy * NB[1] + dz * NB[2]
along = dx * T[0] + dy * T[1] + dz * T[2]
n1, n2, n3, n4 = (fnoise((H, W), b, s) for b, s in ((1.5, 1), (1.25, 2), (2.0, 3), (2.6, 4)))
core = np.exp(-(dist / 0.26) ** 2); wide = np.exp(-(dist / 0.62) ** 2)
fil = 1 - np.abs(np.tanh(n2 * 0.9))                                      # filaments
dens = (core * (0.12 + 0.88 * sst(-0.5, 1.1, n1)) * (0.35 + 0.65 * fil) + 0.12 * wide * sst(-0.2, 1.4, n3)) * (0.75 + 0.25 * np.cos(along * 1.3))
lane = sst(0.3, 1.6, n4 + 0.5 * n1) * wide                              # dark dust lanes
dens = dens * (1 - 0.6 * lane)
mix_blue = sst(0.1, 1.6, n3 * 0.8 + 0.6 * np.sin(along * 2.2))          # where the nebula leans blue-grey instead of rust
rust, ochre, blue = np.array([0.85, 0.30, 0.12]), np.array([0.9, 0.55, 0.22]), np.array([0.10, 0.17, 0.30])
tone = rust[None, None, :] * (1 - mix_blue[..., None]) + blue[None, None, :] * mix_blue[..., None] * 1.1
tone = tone * (1 - 0.35 * sst(0.2, 1.2, n1)[..., None]) + ochre[None, None, :] * 0.35 * sst(0.2, 1.2, n1)[..., None]
neb = tone * (dens * 0.24)[..., None]                                   # peak ~0.07 linear: subtle, stars stay the hero
neb += np.array([0.007, 0.004, 0.0025])[None, None, :] * (0.4 + 0.6 * wide[..., None])   # faint warm haze
# faint stars baked into the texture (denser along the band)
NF = 8000 if SMALL else 42000
zz = rng.uniform(-1, 1, NF * 3); lo = rng.uniform(0, 2 * np.pi, NF * 3); rr = np.sqrt(1 - zz ** 2)
dirs = np.stack([rr * np.cos(lo), rr * np.sin(lo), zz], 1)
bw = np.exp(-((dirs @ NB) / 0.35) ** 2); keep = rng.random(len(dirs)) < (0.25 + 0.75 * bw) * 0.9
dirs = dirs[keep][:NF]
sl = np.arcsin(np.clip(dirs[:, 2], -1, 1)); sn = np.arctan2(dirs[:, 1], dirs[:, 0])
px = ((np.degrees(sn) - DOME_LON0) % 360.0) / 360.0 * W; py = (sl / np.pi + 0.5) * H
br = 0.025 + 0.5 * rng.random(len(px)) ** 10
tint = np.array([[1.0, 0.95, 0.9], [0.85, 0.9, 1.0], [1.0, 0.85, 0.7], [1.0, 1.0, 1.0]])[rng.integers(0, 4, len(px))]
stars = np.zeros((H, W, 3))
for ox, oy in ((0, 0), (1, 0), (0, 1), (1, 1)):                          # bilinear splat
    ix = np.floor(px).astype(int) + ox; iy = np.floor(py).astype(int) + oy
    w_ = (1 - np.abs(px - ix)) * (1 - np.abs(py - iy)); ok = (iy >= 0) & (iy < H)
    np.add.at(stars, (iy[ok], ix[ok] % W), (br[ok] * w_[ok])[:, None] * tint[ok])
sky = np.clip(neb + stars, 0, 1)
sky = sky + (rng.random((H, W, 1)) - 0.5) * (1.5 / 255) * 0.3             # tiny dither against JPEG banding
dome_img = save_tex("deep_space_sky", rgba_from(np.clip(srgb(np.clip(sky, 0, 1)), 0, 1)), "sRGB", ".jpg")
del n1, n2, n3, n4, dens, tone, neb, stars, sky

# ---------------------------------------------------------------- star sprite atlas (8 tints x 4 rows), alpha = glow
CELL = 32; AT = np.zeros((CELL * 4, CELL * 8, 4), np.float32)
TINTS = [(1.0, 1.0, 1.0), (1.0, 0.93, 0.82), (0.82, 0.88, 1.0), (1.0, 0.78, 0.58), (1.0, 0.88, 0.62), (0.72, 0.82, 1.0), (1.0, 0.96, 0.9), (0.92, 0.92, 1.0)]
yy_, xx_ = np.mgrid[0:CELL, 0:CELL]; cx_ = (xx_ - CELL / 2 + 0.5) / (CELL / 2); cy_ = (yy_ - CELL / 2 + 0.5) / (CELL / 2); rr_ = np.hypot(cx_, cy_)
glow = np.exp(-(rr_ / 0.14) ** 2) + 0.22 * np.exp(-(rr_ / 0.38) ** 2); glow = glow / glow.max()
spike = (np.exp(-(np.abs(cy_) / 0.025) ** 1) * np.exp(-(np.abs(cx_) / 0.7) ** 1.5) + np.exp(-(np.abs(cx_) / 0.025) ** 1) * np.exp(-(np.abs(cy_) / 0.7) ** 1.5)) * 0.35
for row, inten in enumerate((1.0, 0.7, 0.42, 1.0)):
    prof = glow * inten if row < 3 else np.clip(glow + spike * (1 - np.clip(rr_, 0, 1)), 0, 1)
    prof = prof * (1 - sst(0.85, 1.0, rr_))                              # fade to 0 at the cell border
    for col, t in enumerate(TINTS):
        AT[row * CELL:(row + 1) * CELL, col * CELL:(col + 1) * CELL, :3] = t; AT[row * CELL:(row + 1) * CELL, col * CELL:(col + 1) * CELL, 3] = prof
atlas_img = save_tex("deep_space_star_atlas", AT[::-1], "sRGB", ".png")   # atlas rows are authored top-first; Blender images are bottom-first

# ---------------------------------------------------------------- planet / moon textures (equirect, seam on the far side)
def planet_tex(w, h, seed, kind):
    n1 = fnoise((h, w), 2.4, seed); n2 = fnoise((h, w), 1.6, seed + 1); n3 = fnoise((h, w), 3.0, seed + 2)
    lat_ = np.linspace(-1, 1, h)[:, None] * np.ones((1, w))
    if kind == "rust":
        base = np.array([0.20, 0.085, 0.05]); och = np.array([0.38, 0.21, 0.10]); dark = np.array([0.07, 0.035, 0.028])
        a = sst(-0.3, 1.2, n1 + 0.4 * np.sin(lat_ * 9 + 2 * n3))[..., None]; b = sst(0.1, 1.4, n2)[..., None]
        c = base * (1 - a) + och * a; c = c * (1 - 0.65 * b) + dark * 0.65 * b
        c = c * (0.85 + 0.15 * n3[..., None]); cap = sst(0.86, 0.97, np.abs(lat_))[..., None]; c = c * (1 - cap) + np.array([0.55, 0.5, 0.46]) * cap
        return np.clip(c, 0, 1)
    g = 0.30 + 0.07 * n1 + 0.03 * n3; yy, xx = np.mgrid[0:h, 0:w]; cr = np.random.default_rng(seed + 9)
    for _ in range(140):                                                  # impact craters
        cx, cy = cr.uniform(0, w), cr.uniform(0.1 * h, 0.9 * h); R = cr.uniform(4, 30) * w / 1024; d = np.hypot((xx - cx + w / 2) % w - w / 2, yy - cy) / R
        m = d < 1.6; g[m] += (-0.07 * np.clip(1 - d[m] ** 2, 0, 1) + 0.06 * np.exp(-((d[m] - 1.0) / 0.2) ** 2))
    maria = sst(0.2, 1.1, n2)[..., None]; c = np.stack([g, g * 0.97, g * 0.92], -1) * (1 - 0.38 * maria)
    return np.clip(c, 0, 1)
PW, PH = (512, 256) if SMALL else (1024, 512)
planet_img = save_tex("deep_space_planet_albedo", rgba_from(srgb(planet_tex(PW, PH, 11, "rust"))), "sRGB", ".jpg")
moon_img = save_tex("deep_space_moon_albedo", rgba_from(srgb(planet_tex(PW, PH, 21, "moon"))), "sRGB", ".jpg")

# ---------------------------------------------------------------- mesh helpers
def make_mesh(name, V, F, UV, col, mat, smooth=True):
    me = bpy.data.meshes.new(name); me.from_pydata(np.asarray(V).tolist(), [], np.asarray(F).tolist()); me.update()
    uvl = me.uv_layers.new(name="UVMap"); li = np.empty(len(me.loops), np.int64); me.loops.foreach_get("vertex_index", li)
    uvl.data.foreach_set("uv", np.asarray(UV, np.float32)[li].ravel())
    if smooth: me.shade_smooth()
    me.materials.append(mat); ob = bpy.data.objects.new(name, me); col.objects.link(ob); return ob
def sphere_arrays(R, center, nu, nv, lon0_deg):
    u = np.linspace(0, 1, nu + 1); v = np.linspace(0, 1, nv + 1)
    lo = np.radians(lon0_deg) + u * 2 * np.pi; la = (v - 0.5) * np.pi
    LO, LA = np.meshgrid(lo, la, indexing="xy")                           # shape (nv+1, nu+1)
    d = np.stack([np.cos(LA) * np.cos(LO), np.cos(LA) * np.sin(LO), np.sin(LA)], -1)
    V = (np.asarray(center) + R * d).reshape(-1, 3); U, Vv = np.meshgrid(u, v, indexing="xy"); UV = np.stack([U, Vv], -1).reshape(-1, 2)
    F = []
    for j in range(nv):
        for i in range(nu):
            a = j * (nu + 1) + i; F.append([a, a + 1, a + nu + 2, a + nu + 1])      # outward (counter-clockwise seen from outside)
    return V, np.array(F), UV, d.reshape(-1, 3)

def principled(name, base=(0, 0, 0), rough=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    b = next(n for n in nt.nodes if n.type == "BSDF_PRINCIPLED"); b.inputs["Base Color"].default_value = (*base, 1); b.inputs["Roughness"].default_value = rough
    for k in ("Specular IOR Level", "Specular"):
        if k in b.inputs: b.inputs[k].default_value = 0.0
    return m, nt, b
def tex_node(nt, img, ext="EXTEND"):
    t = nt.nodes.new("ShaderNodeTexImage"); t.image = img; t.extension = ext; t.interpolation = "Linear"; return t

# ---------------------------------------------------------------- dome (emissive texture only)
V, F, UV, _ = sphere_arrays(R_DOME, (0, 0, 0), 128, 64, DOME_LON0)
F = F[:, ::-1]                                                              # inward-facing
m, nt, b = principled("DeepSpace_Sky_emissive"); t = tex_node(nt, dome_img); nt.links.new(t.outputs["Color"], b.inputs["Emission Color"]); b.inputs["Emission Strength"].default_value = 1.0
dome = make_mesh("DeepSpace_Dome", V, F, UV, cols["Space_Dome"], m, False)

# ---------------------------------------------------------------- bright stars as sprite quads
NB_ = 600 if SMALL else 1100
zz = rng.uniform(-0.55, 0.9, NB_ * 4); lo = rng.uniform(0, 2 * np.pi, NB_ * 4); rr = np.sqrt(1 - zz ** 2)
dirs = np.stack([rr * np.cos(lo), rr * np.sin(lo), zz], 1); bw = np.exp(-((dirs @ NB) / 0.4) ** 2); dirs = dirs[rng.random(len(dirs)) < 0.35 + 0.65 * bw][:NB_]
ang = 0.05 + 0.32 * rng.random(len(dirs)) ** 5                               # angular size in degrees (most are tiny, a few bright)
ang[:10] = rng.uniform(0.28, 0.4, 10)                                        # a handful of brighter stars with diffraction spikes
SV, SF, SUV = [], [], []
for k, (d, a) in enumerate(zip(dirs, ang)):
    up = np.array([0, 0, 1.0]); e1 = np.cross(d, up); e1 /= np.linalg.norm(e1) + 1e-9; e2 = np.cross(d, e1)
    s = R_STAR * math.tan(math.radians(a) / 2) * (2.2 if a > 0.27 else 0.9)      # sprite is larger than the visible core (glow falls off)
    c0 = d * R_STAR; base = len(SV)
    SV += [c0 - e1 * s - e2 * s, c0 + e1 * s - e2 * s, c0 + e1 * s + e2 * s, c0 - e1 * s + e2 * s]
    col = int(rng.integers(0, 8)); row = 3 if a > 0.27 else (0 if a > 0.14 else (1 if a > 0.085 else 2))
    u0, u1 = col / 8, (col + 1) / 8; v0, v1 = row / 4, (row + 1) / 4
    v0, v1 = 1 - v1, 1 - v0                                                  # atlas row 0 is stored at the top of the image
    SUV += [(u0, v0), (u1, v0), (u1, v1), (u0, v1)]; SF.append([base, base + 1, base + 2, base + 3])
m, nt, b = principled("DeepSpace_Stars_sprite"); t = tex_node(nt, atlas_img, "CLIP")
b.inputs["Metallic"].default_value = 1.0                                     # no diffuse response to the sun: sprites are pure emission
nt.links.new(t.outputs["Color"], b.inputs["Emission Color"]); nt.links.new(t.outputs["Color"], b.inputs["Base Color"]); nt.links.new(t.outputs["Alpha"], b.inputs["Alpha"]); b.inputs["Emission Strength"].default_value = 1.0
try: m.surface_render_method = "BLENDED"
except Exception: pass
make_mesh("DeepSpace_Stars", np.array(SV), np.array(SF), np.array(SUV), cols["Stars"], m, False)

# ---------------------------------------------------------------- sun + planet + moon
SUN_AZ, SUN_EL = 86.0, 12.0
S = sdir(SUN_AZ, SUN_EL)
PL_C, PL_R = sdir(21, 1.0) * 8000.0, 8000.0 * math.tan(math.radians(7.4))
MN_C, MN_R = sdir(5, 19) * 12000.0, 12000.0 * math.tan(math.radians(1.6))
def body(name, center, R, img, rough):
    V, F, UV, _ = sphere_arrays(R, center, 96, 48, 90.0)
    m, nt, b = principled(name + "_mat", rough=rough); t = tex_node(nt, img, "EXTEND"); nt.links.new(t.outputs["Color"], b.inputs["Base Color"]); return make_mesh(name, V, F, UV, cols["Planets"], m, True)
body("DeepSpace_Planet", PL_C, PL_R, planet_img, 0.92); body("DeepSpace_Moon", MN_C, MN_R, moon_img, 0.95)
# atmosphere shell around the planet: fresnel x sun-facing baked per vertex (camera sits at the origin for all three views); value is stored in V of the UV and read from a gradient texture
V, F, UV, Dn = sphere_arrays(PL_R * 1.045, PL_C, 96, 48, 90.0)
view = -V / np.linalg.norm(V, axis=1)[:, None]; ndv = np.abs(np.sum(Dn * view, 1)); lit = np.clip(Dn @ S * 1.25 + 0.15, 0, 1)
vals = np.clip(lit * sst(0.0, 0.28, ndv) * (1 - sst(0.28, 0.8, ndv)) * 1.9, 0, 1); UVa = np.stack([np.full(len(V), 0.5), vals], 1)      # soft ring: fades to 0 at the shell silhouette (no hard outline) and toward the disc centre
GH = 256; gv = np.linspace(0, 1, GH)[:, None] * np.ones((1, 4)); gcol = np.array([0.95, 0.52, 0.30]); gradient = np.zeros((GH, 4, 4), np.float32); gradient[..., :3] = gcol; gradient[..., 3] = (gv ** 1.2) * 0.8
grad_img = save_tex("deep_space_atmosphere_gradient", gradient, "sRGB", ".png")
m, nt, b = principled("DeepSpace_Atmosphere_glow"); b.inputs["Metallic"].default_value = 1.0
t = tex_node(nt, grad_img, "EXTEND"); nt.links.new(t.outputs["Color"], b.inputs["Emission Color"]); nt.links.new(t.outputs["Color"], b.inputs["Base Color"]); nt.links.new(t.outputs["Alpha"], b.inputs["Alpha"]); b.inputs["Emission Strength"].default_value = 1.0
try: m.surface_render_method = "BLENDED"
except Exception: pass
shell = make_mesh("DeepSpace_PlanetAtmosphere", V, F, UVa, cols["Atmosphere"], m, True)
sun = bpy.data.lights.new("Sun", "SUN"); sun.energy = 3.2; sun.angle = math.radians(0.5); sun.color = (1.0, 0.93, 0.84)
sob = bpy.data.objects.new("Sun_Directional", sun); cols["Lighting"].objects.link(sob); sob.rotation_euler = (-__import__("mathutils").Vector(S)).to_track_quat("-Z", "Y").to_euler()

# ---------------------------------------------------------------- cameras (pure rotation, no lens shift: glTF-friendly)
def make_cam(name, lens, yaw, pitch):
    c = bpy.data.cameras.new(name); c.lens, c.sensor_width, c.clip_start, c.clip_end = lens, 36, 1.0, 30000
    o = bpy.data.objects.new(name, c); cols["Cameras"].objects.link(o); o.location = (0, 0, 0)
    o.rotation_euler = (math.radians(90 + pitch), 0, math.radians(-yaw)); return o
cam_d = make_cam("Cam_Desktop_16x9", 28, 0, 6)
cam_t = make_cam("Cam_Tablet_4x3", 26, 6, 6)
cam_m = make_cam("Cam_Mobile_9x16", 30, 14, 8)
scene.camera = cam_d
for o_ in (dome, bpy.data.objects["DeepSpace_Stars"], shell):
    o_.visible_shadow = False                                                # the dome/sprites/shell must not shadow the planet in Cycles

# ---------------------------------------------------------------- world + render
w = bpy.data.worlds.get("World") or bpy.data.worlds.new("World"); scene.world = w; w.use_nodes = True
for n in w.node_tree.nodes:
    if n.type == "BACKGROUND": n.inputs["Color"].default_value = (0, 0, 0, 1); n.inputs["Strength"].default_value = 0.0
r = scene.render; r.resolution_x, r.resolution_y, r.resolution_percentage, r.film_transparent = 1920, 1080, 100, False
scene.render.engine = "CYCLES"; scene.render.filter_size = 1.2
c = scene.cycles; c.samples, c.use_denoising, c.max_bounces = 64, False, 4                  # no denoiser: it would smear the tiny stars
c.transparent_max_bounces = 16
try:
    prefs = bpy.context.preferences.addons["cycles"].preferences; prefs.compute_device_type = "OPTIX"; prefs.get_devices()
    for d in prefs.devices: d.use = d.type != "CPU"
    c.device = "GPU"
except Exception as e: print("gpu", e)
vs = scene.view_settings; vs.view_transform = "AgX"
for l in ("AgX - Base Contrast", "None"):
    try: vs.look = l; break
    except TypeError: pass
vs.exposure = float(globals().get("EXPOSURE", 0.0))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, "blender", "deep_space_environment_v1.blend"))
print("built deep space", "SMALL" if SMALL else "FULL", "stars", len(dirs), "planet R", round(PL_R), "moon R", round(MN_R))
