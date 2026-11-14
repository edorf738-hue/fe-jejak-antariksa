"""Wayang Antariksa - Mars Environment V3 (Realism Pass) (Blender 5.x, Cycles).
Run inside Blender:  PREVIEW_MODE = False; exec(open(path).read())
Natural Martian landscape only: terrain, craters, rocks, mountains, sky/haze, light, cameras. No rovers, landers or human-made objects."""
import bpy, bmesh, math, os, numpy as np
from mathutils import Vector, noise as mnoise

ROOT = r"C:\Users\Edorf\Project\blander skill\blender-skills\mars-environment\v3"
PREVIEW = bool(globals().get("PREVIEW_MODE", False))
rng = np.random.default_rng(21)

# ================================================================ noise helpers
def _h(ix, iy, s):
    v = np.sin(ix * 127.1 + iy * 311.7 + s * 74.7) * 43758.5453
    return v - np.floor(v)
def vnoise(x, y, s=0):
    ix, iy = np.floor(x), np.floor(y); fx, fy = x - ix, y - iy
    u, v = fx * fx * (3 - 2 * fx), fy * fy * (3 - 2 * fy)
    a, b, c, d = _h(ix, iy, s), _h(ix + 1, iy, s), _h(ix, iy + 1, s), _h(ix + 1, iy + 1, s)
    return (a + (b - a) * u) + ((c + (d - c) * u) - (a + (b - a) * u)) * v
def fbm(x, y, octv=5, s=0):
    t = tot = 0; amp = 1.0
    for i in range(octv):
        t = t + amp * vnoise(x, y, s + i); tot += amp
        x, y, amp = x * 2.03 + 17.1, y * 2.03 + 9.3, amp * 0.5
    return t / tot
def ridged(x, y, octv=5, s=0):
    t = tot = 0; amp = 1.0
    for i in range(octv):
        n = 1 - np.abs(2 * vnoise(x, y, s + i) - 1)
        t = t + amp * n * n; tot += amp
        x, y, amp = x * 2.1 + 5.7, y * 2.1 + 3.1, amp * 0.5
    return t / tot
def sstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
def terrace(x, n):
    """stepped profile 0..1 (layered rock strata): n flat steps joined by short slopes"""
    t = np.clip(x, 0, 1) * n; f = np.floor(t)
    return np.minimum((f + sstep(0.3, 0.7, t - f)) / n, 1.0)

def crater(X, Y, cx, cy, R, depth, rim, seed=0, ell=1.0, rot=0.0):
    """Irregular impact crater: wobbly outline, elliptical, uneven blocky rim, asymmetric depth, ray-modulated ejecta."""
    dx, dy = X - cx, Y - cy
    c, s = math.cos(rot), math.sin(rot)
    u, v = dx * c + dy * s, (-dx * s + dy * c) / ell
    th = np.arctan2(v, u); cth, sth = np.cos(th), np.sin(th)
    wob = 1 + 0.14 * (vnoise(cth * 1.7 + seed, sth * 1.7 + seed * 3, seed) - 0.5) * 2 \
            + 0.06 * (vnoise(cth * 4.5 + 7, sth * 4.5 + seed, seed + 1) - 0.5) * 2
    r = np.hypot(u, v) / (R * wob)
    tilt = 1 + 0.22 * np.cos(th - seed)
    pr = np.clip(1 - r * r, 0, 1)
    floor = 1 + 0.10 * (vnoise(u / R * 3.1 + seed, v / R * 3.1, seed + 9) - 0.5) * 2 * (R > 6)
    bowl = np.where(r < 1, -depth * tilt * (pr ** 0.8) * floor, 0.0)
    if R > 25: bowl = bowl + np.where(r < 1, 0.05 * depth * np.sin(r * 14) * sstep(0.45, 0.95, r), 0.0)
    if R > 40: bowl = bowl + 0.14 * depth * np.exp(-(r / 0.13) ** 2)
    blk = 0.65 + 0.7 * vnoise(u / R * 9 + seed, v / R * 9, seed + 3)
    rimv = rim * (0.5 + 0.9 * vnoise(cth * 2.4 + seed * 2, sth * 2.4, seed + 5)) * blk
    rimh = rimv * np.exp(-(((r - 1) / 0.17) ** 2))
    ej = np.where(r > 1, 0.3 * rim * np.exp(-(r - 1) / 0.9) * (0.4 + 1.2 * vnoise(cth * 3.3 + seed, sth * 3.3 + 4, seed + 2)) * (0.6 + 0.8 * vnoise(u / R * 5, v / R * 5, seed + 4)), 0.0)
    return bowl + rimh + ej

# ================================================================ terrain height function
HERO = [(14, 44, 15, 2.8, 1.3), (-58, 125, 34, 6.0, 2.6), (58, 230, 48, 8.0, 3.4), (-24, 28, 9, 1.8, 0.8)]   # high-res patches (cx, cy, R, depth, rim)
BIG = [(c + (101 + i, 1.0 + 0.1 * i, 0.4 * i)) for i, c in enumerate(HERO)]
BIG += [(-900, 2100, 520, 60, 34, 71, 0.9, 0.4), (1150, 2650, 700, 75, 40, 72, 0.85, 1.2), (150, 1500, 260, 24, 14, 73, 0.9, 2.0)]   # giant far crater rims
_rm = np.random.default_rng(5)
for i in range(650 if not PREVIEW else 260):                           # mid/far craters: mostly eroded (shallow, soft), some fresh
    d = np.sqrt(_rm.uniform(110 ** 2, 2800 ** 2)); a = _rm.uniform(-1.45, 1.45)
    R = float(np.clip(10 * (1 - _rm.random()) ** (-1 / 1.2), 10, 160)) * (1 + d / 2500)
    fresh = _rm.random() < 0.2
    dr, rr_ = (_rm.uniform(0.1, 0.17), _rm.uniform(0.022, 0.035)) if fresh else (_rm.uniform(0.025, 0.07), _rm.uniform(0.005, 0.014))
    BIG.append((d * math.sin(a), d * math.cos(a), R, R * dr, R * rr_, 200 + i, _rm.uniform(0.75, 1.0), _rm.uniform(0, 3.1)))

_rb = np.random.default_rng(9)
BUTTES = []                                                            # eroded flat-topped mesas / buttes: varied width, height and distance -> irregular, non-repeating skyline
for i in range(20):
    d = _rb.uniform(900, 3000); a = _rb.uniform(-1.3, 1.3)
    BUTTES.append((d * math.sin(a), d * math.cos(a), _rb.uniform(70, 330) * (0.6 + d / 3000), _rb.uniform(35, 170) * (0.5 + d / 3000 * 0.6), 300 + i))
for i in range(12):                                                    # nearer rocky formations
    d = _rb.uniform(260, 800); a = _rb.uniform(-1.0, 1.0)
    BUTTES.append((d * math.sin(a), d * math.cos(a), _rb.uniform(25, 80), _rb.uniform(8, 32), 400 + i))
for i in range(150):                                                   # fresher small/medium craters in the midground so craters read from the low camera
    d = math.sqrt(_rb.uniform(25 ** 2, 380 ** 2)); a = _rb.uniform(-1.25, 1.25)
    R = float(np.clip(4 * (1 - _rb.random()) ** (-1 / 1.3), 4, 32))
    BIG.append((d * math.sin(a), d * math.cos(a), R, R * _rb.uniform(0.09, 0.2), R * _rb.uniform(0.03, 0.06), 600 + i, _rb.uniform(0.8, 1.0), _rb.uniform(0, 3.1)))
def butte(X, Y, cx, cy, r, hgt, seed):
    dx, dy = X - cx, Y - cy; th = np.arctan2(dy, dx)
    wob = 1 + 0.25 * (vnoise(np.cos(th) * 2 + seed, np.sin(th) * 2, seed) - 0.5) * 2 + 0.1 * (vnoise(np.cos(th) * 7, np.sin(th) * 7 + seed, seed + 1) - 0.5) * 2
    rr = np.hypot(dx, dy) / (r * wob)
    return hgt * terrace(1 - sstep(0.5, 1.25, rr), 5) * (0.85 + 0.15 * vnoise(X / 30, Y / 30, seed + 2))

def hbig(X, Y):
    D = np.hypot(X, Y)
    wx_, wy_ = (fbm(X / 350, Y / 350, 3, 41) - 0.5) * 320, (fbm(X / 350 + 9, Y / 350, 3, 42) - 0.5) * 320   # domain warp breaks repetition
    h = (fbm(X / 500, Y / 500, 3, 1) - 0.5) * 7 + (fbm(X / 110, Y / 110, 4, 2) - 0.5) * 1.4
    h = h + sstep(100, 700, D) * (3 + 16 * np.sqrt(ridged((X + wx_) / 300 + 3, (Y + wy_) / 300 + 7, 4, 3)))          # rocky ridges / low hills
    mesa = sstep(0.5, 0.62, fbm(X / 700 + 5, Y / 700, 3, 31))
    h = h + sstep(380, 1400, D) * mesa * 28 * terrace(fbm(X / 280, Y / 280, 3, 36) * 1.3, 4)                      # stepped mesas / plateaus
    r1 = np.sqrt(ridged((X + wx_) / 800 + 1, (Y + wy_) / 800 + 4, 5, 6))
    h = h + sstep(800, 2400, D) * (15 + 170 * terrace(r1, 6))                                                       # layered far mountains
    h = h + sstep(1100, 2700, D) * 40 * np.sqrt(ridged((X - wy_) / 520 + 8, (Y + wx_) / 1300 + 2, 4, 21)) * sstep(0.35, 0.6, fbm(X / 800, Y / 800, 3, 33))
    h = h + sstep(200, 900, D) * 2.2 * np.sqrt(ridged(X / 60 + 4, Y / 60 + 8, 4, 12))
    h = h + sstep(350, 900, D) * (fbm(X / 40, Y / 40, 4, 17) - 0.5) * 4
    h = h + sstep(20, 120, D) * (1 - sstep(450, 900, D)) * (0.9 * (ridged(X / 16 + 3, Y / 16, 4, 51) - 0.3) + 0.25 * (ridged(X / 5, Y / 5 + 2, 3, 52) - 0.3))   # rocky roughness
    for b in BUTTES:
        m = (np.abs(X - b[0]) < 3.2 * b[2]) & (np.abs(Y - b[1]) < 3.2 * b[2])
        if m.any(): h[m] += butte(X[m], Y[m], *b)
    for c in BIG:
        m = (np.abs(X - c[0]) < 4 * c[2] * 1.4) & (np.abs(Y - c[1]) < 4 * c[2] * 1.4)
        if m.any(): h[m] += crater(X[m], Y[m], *c)
    edge = np.maximum(np.abs(X), np.abs(Y))
    return h + sstep(2400, 3300, edge) * (90 + 90 * fbm(X / 400, Y / 400, 3, 9))

NS, NM = (900, 800) if PREVIEW else (4200, 5200)
_d = np.sqrt(rng.uniform(5 ** 2, 330 ** 2, NS)); _a = rng.uniform(-1.0, 1.0, NS)
_R = np.minimum(0.7 * (1 - rng.random(NS)) ** (-1 / 1.7), 16) * (1 + _d / 170)
_d2 = np.sqrt(rng.uniform(1.5 ** 2, 36 ** 2, NM)); _a2 = rng.uniform(-1.15, 1.15, NM)
_R2 = np.minimum(0.13 * (1 - rng.random(NM)) ** (-1 / 1.6), 0.9)
cx_ = np.concatenate([_d * np.tan(_a), _d2 * np.tan(_a2)]); cy_ = np.concatenate([_d, _d2]); RR_ = np.concatenate([_R, _R2])
SMALL = np.stack([cx_, cy_, RR_, RR_ * rng.uniform(0.03, 0.12, len(RR_)), RR_ * rng.uniform(0.01, 0.03, len(RR_)),
                  np.arange(len(RR_)) + 1000.0, rng.uniform(0.8, 1.0, len(RR_)), rng.uniform(0, 3.1, len(RR_))], 1)

def hdet(X, Y):
    h = (fbm(X / 9, Y / 9, 4, 11) - 0.5) * 0.28 + (fbm(X / 3, Y / 3, 3, 5) - 0.5) * 0.11
    h += (fbm(X / 1.0, Y / 1.0, 3, 9) - 0.5) * 0.07 + (ridged(X / 0.4, Y / 0.4, 3, 19) - 0.35) * 0.03 + (fbm(X / 0.15, Y / 0.15, 2, 23) - 0.5) * 0.016
    mk = sstep(0.5, 0.7, fbm(X / 30 + 2, Y / 30, 3, 44))                                   # wind-ripple fields (patchy, wavy, not a uniform pattern)
    w = (fbm(X / 4, Y / 4, 3, 47) - 0.5) * 2.2
    h += mk * 0.045 * np.sin(((X * 0.8 + Y * 0.6) / 1.1 + w) * 2 * np.pi)
    for c in SMALL:
        R = c[2]
        m = (np.abs(X - c[0]) < 3.2 * R * 1.2) & (np.abs(Y - c[1]) < 3.2 * R * 1.2)
        if m.any(): h[m] += crater(X[m], Y[m], *c)
    return h

def hfull(X, Y):
    X, Y = np.asarray(X, float), np.asarray(Y, float)
    return hbig(X, Y) + (1 - sstep(300, 760, np.hypot(X, Y))) * hdet(X, Y)

# ================================================================ scene reset + collections
bpy.ops.object.select_all(action="SELECT"); bpy.ops.object.delete()
for blk in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras, bpy.data.collections, bpy.data.images):
    for b in list(blk): blk.remove(b)
scene = bpy.context.scene
cols = {}
for n in ["Mars_Terrain", "Mars_Foreground", "Mars_Regolith", "Mars_Rocks", "Mars_Craters", "Mars_Mountains", "Mars_Atmosphere", "Lighting", "Cameras"]:
    c = bpy.data.collections.new(n); scene.collection.children.link(c); cols[n] = c

def make_obj(name, verts, faces, col, mat=None, smooth=True):
    me = bpy.data.meshes.new(name)
    me.from_pydata(np.asarray(verts).tolist(), [], faces.tolist() if hasattr(faces, "tolist") else faces); me.update()
    if smooth: me.shade_smooth()
    ob = bpy.data.objects.new(name, me); col.objects.link(ob)
    if mat: me.materials.append(mat)
    return ob
def grid_faces(nr, nc):
    r, c = np.meshgrid(np.arange(nr - 1), np.arange(nc - 1), indexing="ij"); a = (r * nc + c).ravel()
    return np.stack([a, a + 1, a + nc + 1, a + nc], 1)

# ================================================================ materials
def new_mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True; m.node_tree.nodes.clear()
    return m, m.node_tree, m.node_tree.nodes.new
def set_in(node, names, val):
    for n in names:
        if n in node.inputs: node.inputs[n].default_value = val; return
def ramp_node(N, stops):
    r = N("ShaderNodeValToRGB"); el = r.color_ramp.elements
    while len(el) < len(stops): el.new(0.5)
    for e, (p, c) in zip(el, stops): e.position, e.color = p, (*c, 1)
    return r

HAZE_COL = (0.34, 0.2, 0.14)
def finish(nt, N, bsdf, out, geo):
    """Atmospheric perspective: blend toward the horizon dust colour with distance from the camera (a world volume would also swallow the sky)."""
    d = N("ShaderNodeVectorMath"); d.operation = "DISTANCE"; nt.links.new(geo.outputs["Position"], d.inputs[0]); d.inputs[1].default_value = (0, 0, 2)
    mr = N("ShaderNodeMapRange"); mr.clamp = True; mr.inputs["From Min"].default_value, mr.inputs["From Max"].default_value = 250.0, 3600.0
    mr.inputs["To Min"].default_value, mr.inputs["To Max"].default_value = 0.0, float(globals().get("HAZE_MAX", 0.65))
    nt.links.new(d.outputs["Value"], mr.inputs["Value"])
    pw = N("ShaderNodeMath"); pw.operation = "POWER"; pw.inputs[1].default_value = 1.4; nt.links.new(mr.outputs["Result"], pw.inputs[0])
    em, mx = N("ShaderNodeEmission"), N("ShaderNodeMixShader"); em.inputs["Color"].default_value = (*HAZE_COL, 1); em.inputs["Strength"].default_value = float(globals().get("HAZE_E", 0.9))
    nt.links.new(pw.outputs[0], mx.inputs["Fac"]); nt.links.new(bsdf.outputs["BSDF"], mx.inputs[1]); nt.links.new(em.outputs[0], mx.inputs[2]); nt.links.new(mx.outputs[0], out.inputs["Surface"])

def mk_regolith(name, mountain=False):
    m, nt, N = new_mat(name)
    out, bsdf, geo = N("ShaderNodeOutputMaterial"), N("ShaderNodeBsdfPrincipled"), N("ShaderNodeNewGeometry")
    def noise(scale, det, rough=0.55):
        n = N("ShaderNodeTexNoise"); n.inputs["Scale"].default_value, n.inputs["Detail"].default_value, n.inputs["Roughness"].default_value = scale, det, rough
        nt.links.new(geo.outputs["Position"], n.inputs["Vector"]); return n
    wn = noise(1.3, 2)
    warp = N("ShaderNodeVectorMath"); warp.operation = "MULTIPLY_ADD"
    nt.links.new(wn.outputs["Color"], warp.inputs[0]); warp.inputs[1].default_value = (0.4, 0.4, 0.4); nt.links.new(geo.outputs["Position"], warp.inputs[2])
    def vor(scale):
        v = N("ShaderNodeTexVoronoi"); v.inputs["Scale"].default_value = scale; nt.links.new(warp.outputs[0], v.inputs["Vector"]); return v
    v1, v2, v3 = vor(2.6), vor(12), vor(46)
    big, mid, fine, grain, blot = noise(0.009, 3), noise(0.3, 6), noise(9, 6), noise(70, 5), noise(0.04, 4)
    def madd(a, k, b):
        n = N("ShaderNodeMath"); n.operation = "MULTIPLY_ADD"; nt.links.new(a, n.inputs[0]); n.inputs[1].default_value = k; nt.links.new(b, n.inputs[2]); return n
    s3 = madd(v1.outputs["Distance"], 0.35, madd(fine.outputs["Fac"], 0.3, madd(big.outputs["Fac"], 0.55, mid.outputs["Fac"]).outputs[0]).outputs[0])
    sp = N("ShaderNodeSeparateXYZ"); nt.links.new(geo.outputs["Normal"], sp.inputs["Vector"])
    # dust settles on flats (lighter orange), slopes show darker exposed material
    s4 = madd(sp.outputs["Z"], 0.4, s3.outputs[0])
    ramp = ramp_node(N, [(0.3, (0.04, 0.02, 0.015)), (0.5, (0.17, 0.062, 0.034)), (0.7, (0.25, 0.1, 0.058)), (0.9, (0.29, 0.135, 0.075)), (1.15, (0.32, 0.17, 0.09))])
    nt.links.new(s4.outputs[0], ramp.inputs["Fac"])
    col = ramp.outputs["Color"]
    # dark basaltic sand patches (large-scale colour variation, not uniform red)
    bm = ramp_node(N, [(0.5, (0, 0, 0)), (0.66, (1, 1, 1))]); nt.links.new(blot.outputs["Fac"], bm.inputs["Fac"])
    dk = N("ShaderNodeMixRGB"); dk.blend_type = "MIX"; dk.inputs[2].default_value = (0.045, 0.032, 0.03, 1)
    nt.links.new(bm.outputs["Color"], dk.inputs["Fac"]); nt.links.new(col, dk.inputs[1])
    dk.inputs["Fac"].default_value = 0.0; nt.links.new(bm.outputs["Color"], dk.inputs["Fac"])
    scl = N("ShaderNodeMath"); scl.operation = "MULTIPLY"; scl.inputs[1].default_value = 0.6; nt.links.new(bm.outputs["Color"], scl.inputs[0]) if False else None
    col = dk.outputs["Color"]
    if mountain:   # geological strata: banding by elevation, tan / rust / dark
        sn = N("ShaderNodeMath"); sn.operation = "SINE"
        ar = madd(sp.outputs["Z"], 0.0, big.outputs["Fac"])
        zp = N("ShaderNodeSeparateXYZ"); nt.links.new(geo.outputs["Position"], zp.inputs["Vector"])
        arg = N("ShaderNodeMath"); arg.operation = "MULTIPLY_ADD"; nt.links.new(zp.outputs["Z"], arg.inputs[0]); arg.inputs[1].default_value = 0.42; nt.links.new(mid.outputs["Fac"], arg.inputs[2])
        nt.links.new(arg.outputs[0], sn.inputs[0])
        band = N("ShaderNodeMath"); band.operation = "MULTIPLY_ADD"; nt.links.new(sn.outputs[0], band.inputs[0]); band.inputs[1].default_value = 0.12; band.inputs[2].default_value = 0.8
        mx = N("ShaderNodeMixRGB"); mx.blend_type = "MULTIPLY"; mx.inputs["Fac"].default_value = 1.0
        nt.links.new(col, mx.inputs[1]); nt.links.new(band.outputs[0], mx.inputs[2]); col = mx.outputs["Color"]
    ao = N("ShaderNodeAmbientOcclusion"); ao.inputs["Distance"].default_value = 9.0 if mountain else 0.9; ao.samples = 8
    aom = N("ShaderNodeMapRange"); aom.inputs["To Min"].default_value, aom.inputs["To Max"].default_value = 0.4, 1.0; nt.links.new(ao.outputs["AO"], aom.inputs["Value"])
    axm = N("ShaderNodeMixRGB"); axm.blend_type = "MULTIPLY"; axm.inputs["Fac"].default_value = 1.0
    nt.links.new(col, axm.inputs[1]); nt.links.new(aom.outputs["Result"], axm.inputs[2]); col = axm.outputs["Color"]
    nt.links.new(col, bsdf.inputs["Base Color"])
    rg = madd(fine.outputs["Fac"], 0.12, big.outputs["Fac"]); rgm = N("ShaderNodeMath"); rgm.operation = "ADD"; rgm.inputs[1].default_value = 0.78; rgm.use_clamp = True
    nt.links.new(rg.outputs[0], rgm.inputs[0]); nt.links.new(rgm.outputs[0], bsdf.inputs["Roughness"])
    set_in(bsdf, ["Specular IOR Level", "Specular"], 0.2)
    prev = None
    for src, st, ds in [(v1.outputs["Distance"], 0.3, 0.12), (v2.outputs["Distance"], 0.4, 0.04), (v3.outputs["Distance"], 0.5, 0.015), (fine.outputs["Fac"], 0.45, 0.012), (grain.outputs["Fac"], 0.6, 0.006)]:
        b = N("ShaderNodeBump"); b.inputs["Strength"].default_value, b.inputs["Distance"].default_value = st, ds
        nt.links.new(src, b.inputs["Height"])
        if prev: nt.links.new(prev.outputs["Normal"], b.inputs["Normal"])
        prev = b
    nt.links.new(prev.outputs["Normal"], bsdf.inputs["Normal"]); finish(nt, N, bsdf, out, geo)
    return m

def mk_rock(name, lo, hi, rough, dust=0.35):
    m, nt, N = new_mat(name)
    out, bsdf, tc, oi, geo = N("ShaderNodeOutputMaterial"), N("ShaderNodeBsdfPrincipled"), N("ShaderNodeTexCoord"), N("ShaderNodeObjectInfo"), N("ShaderNodeNewGeometry")
    def tn(scale, det):
        n = N("ShaderNodeTexNoise"); n.inputs["Scale"].default_value, n.inputs["Detail"].default_value = scale, det; nt.links.new(tc.outputs["Object"], n.inputs["Vector"]); return n
    n1, n2 = tn(5, 9), tn(28, 6)
    vor = N("ShaderNodeTexVoronoi"); vor.inputs["Scale"].default_value = 6; nt.links.new(tc.outputs["Object"], vor.inputs["Vector"])
    add = N("ShaderNodeMath"); add.operation = "MULTIPLY_ADD"; nt.links.new(oi.outputs["Random"], add.inputs[0]); add.inputs[1].default_value = 0.5; nt.links.new(n1.outputs["Fac"], add.inputs[2])
    ramp = ramp_node(N, [(0.3, lo), (1.15, hi)]); nt.links.new(add.outputs[0], ramp.inputs["Fac"])
    sp = N("ShaderNodeSeparateXYZ"); nt.links.new(geo.outputs["Normal"], sp.inputs["Vector"])
    dm = N("ShaderNodeMath"); dm.operation = "MULTIPLY_ADD"; dm.use_clamp = True; nt.links.new(sp.outputs["Z"], dm.inputs[0]); dm.inputs[1].default_value = 1.6 * dust; dm.inputs[2].default_value = -0.5 * dust   # dust on upward faces
    dmn = N("ShaderNodeMath"); dmn.operation = "MULTIPLY"; dmn.use_clamp = True; nt.links.new(dm.outputs[0], dmn.inputs[0]); nt.links.new(n2.outputs["Fac"], dmn.inputs[1])
    mxd = N("ShaderNodeMixRGB"); mxd.inputs[2].default_value = (0.3, 0.15, 0.08, 1)
    nt.links.new(dmn.outputs[0], mxd.inputs["Fac"]); nt.links.new(ramp.outputs["Color"], mxd.inputs[1])
    ao = N("ShaderNodeAmbientOcclusion"); ao.inputs["Distance"].default_value = 0.45; ao.samples = 8
    aom = N("ShaderNodeMapRange"); aom.inputs["To Min"].default_value, aom.inputs["To Max"].default_value = 0.35, 1.0; nt.links.new(ao.outputs["AO"], aom.inputs["Value"])
    axm = N("ShaderNodeMixRGB"); axm.blend_type = "MULTIPLY"; axm.inputs["Fac"].default_value = 1.0
    nt.links.new(mxd.outputs["Color"], axm.inputs[1]); nt.links.new(aom.outputs["Result"], axm.inputs[2])
    nt.links.new(axm.outputs["Color"], bsdf.inputs["Base Color"]); bsdf.inputs["Roughness"].default_value = rough
    prev = None
    # V3: restrained multi-scale relief; avoid the overly faceted / inflated look.
    for src, st, ds in [(vor.outputs["Distance"], 0.10, 0.022), (n1.outputs["Fac"], 0.62, 0.035), (n2.outputs["Fac"], 0.58, 0.010)]:
        b = N("ShaderNodeBump"); b.inputs["Strength"].default_value, b.inputs["Distance"].default_value = st, ds
        nt.links.new(src, b.inputs["Height"])
        if prev: nt.links.new(prev.outputs["Normal"], b.inputs["Normal"])
        prev = b
    nt.links.new(prev.outputs["Normal"], bsdf.inputs["Normal"]); finish(nt, N, bsdf, out, geo)
    return m

MAT_T, MAT_M = mk_regolith("Mars_Regolith"), mk_regolith("Mars_Mountain_Strata", True)
MAT_RS = [mk_rock("Mars_Rock_Basalt", (0.04, 0.026, 0.02), (0.125, 0.07, 0.045), 0.85, 0.5),
          mk_rock("Mars_Rock_Rust", (0.12, 0.05, 0.028), (0.3, 0.13, 0.065), 0.85, 0.3),
          mk_rock("Mars_Rock_WeatheredRed", (0.1, 0.06, 0.045), (0.26, 0.15, 0.1), 0.9, 0.4),
          mk_rock("Mars_Rock_DustCovered", (0.17, 0.085, 0.045), (0.31, 0.16, 0.085), 0.95, 0.75)]
MAT_R = MAT_RS[2]

# ================================================================ terrain: near (camera-space grid), crater patches, far mountains
NR, NC = (220, 220) if PREVIEW else (640, 480)
DMIN, DMAX, HALF = 1.5, 800.0, math.radians(62)
dd = DMIN * (DMAX / DMIN) ** (np.arange(NR) / (NR - 1)); aa = np.linspace(-HALF, HALF, NC)
Dg, Ag = np.meshgrid(dd, aa, indexing="ij"); Xn, Yn = (1.5 + Dg) * np.tan(Ag), Dg
Zn = hfull(Xn.ravel(), Yn.ravel()).reshape(NR, NC)
faces = grid_faces(NR, NC); V = np.stack([Xn.ravel(), Yn.ravel(), Zn.ravel()], 1)
fc = V[faces][:, :, :2]; keep = np.ones(len(faces), bool)
for cx, cy, R, dp, rm in HERO: keep &= np.hypot(fc[:, :, 0] - cx, fc[:, :, 1] - cy).min(1) > 1.45 * R
make_obj("Mars_Terrain_Near", V, faces[keep], cols["Mars_Terrain"], MAT_T)

def patch(name, cx, cy, R, M=110, S=260):
    if PREVIEW: M, S = 50, 120
    rr = 1.75 * (np.arange(1, M + 1) / M); th = np.linspace(0, 2 * np.pi, S, endpoint=False)
    RR, TT = np.meshgrid(rr, th, indexing="ij")
    X, Y = cx + RR * R * np.cos(TT), cy + RR * R * np.sin(TT)
    Z = hfull(X.ravel(), Y.ravel()) - 0.8 * sstep(1.5, 1.7, RR.ravel())
    verts = np.vstack([[cx, cy, float(hfull(np.array([cx]), np.array([cy]))[0])], np.stack([X.ravel(), Y.ravel(), Z], 1)])
    f = [[0, 1 + s, 1 + (s + 1) % S] for s in range(S)]
    for j in range(M - 1):
        for s in range(S):
            a, b = 1 + j * S + s, 1 + j * S + (s + 1) % S; f.append([a, a + S, b + S, b])
    return make_obj(name, verts, f, cols["Mars_Craters"], MAT_T)
for i, (cx, cy, R, dp, rm) in enumerate(HERO):
    patch(f"Mars_Crater_{['Midground_Right', 'Midground_Left', 'Far_Right', 'Foreground_Left'][i]}", cx, cy, R)

NF, EXT = (321 if PREVIEW else 801), 3500.0
fx = np.linspace(-EXT, EXT, NF); FX, FY = np.meshgrid(fx, fx, indexing="ij")
inside = (FY > 0) & (FY < 740) & (np.abs(FX) < (1.5 + FY) * math.tan(math.radians(58)))
FZ = hbig(FX, FY) - np.where(inside, 40, 0)
make_obj("Mars_Mountains_Far", np.stack([FX.ravel(), FY.ravel(), FZ.ravel()], 1), grid_faces(NF, NF), cols["Mars_Mountains"], MAT_M)

# ================================================================ rocks (24 shared shapes -> linked instances) + pebbles
def rock_mesh(i, sub=4):
    """Four rock families (by i % 4): angular cut-plane blocks, layered slabs with ledges, weathered pitted boulders, fractured blocks with cracks."""
    r = np.random.default_rng(700 + i); kind = ["poly", "slab", "round", "fract"][i % 4]
    bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=1.0)
    off = Vector(r.uniform(-50, 50, 3))
    sq, npl, po = {"poly": (Vector((1.0, r.uniform(0.55, 1.0), r.uniform(0.4, 0.85))), (7, 13), (0.4, 0.78)),
                   "slab": (Vector((1.0, r.uniform(0.6, 1.0), r.uniform(0.2, 0.36))), (3, 6), (0.55, 0.85)),
                   "round": (Vector((1.0, r.uniform(0.65, 1.0), r.uniform(0.45, 0.8))), (0, 1), (0.8, 1.0)),
                   "fract": (Vector((1.0, r.uniform(0.6, 1.0), r.uniform(0.5, 0.9))), (10, 17), (0.38, 0.62))}[kind]
    planes = [(Vector(r.normal(size=3)).normalized(), r.uniform(*po)) for _ in range(int(r.integers(*npl)))] if npl[1] > 1 else []
    cracks = [(Vector(r.normal(size=3)).normalized(), r.uniform(-0.3, 0.3)) for _ in range(2)] if kind == "fract" else []
    amp = 0.32 if kind == "round" else 0.2
    for v in bm.verts:
        p = v.co.copy()
        p = p * (1 + amp * mnoise.fractal(p * 1.2 + off, 0.5, 2.0, 4) + 0.1 * (1 - abs(mnoise.noise(p * 2.6 + off))))
        for n, d in planes:
            ex = p.dot(n) - d
            if ex > 0: p -= n * ex
        if kind == "slab": p.z += 0.05 * math.sin(p.z * 28 + 3 * mnoise.noise(p * 2 + off))        # sedimentary ledges
        for n, d in cracks:
            dist = abs(p.dot(n) - d)
            if dist < 0.035: p -= p.normalized() * 0.045 * (1 - dist / 0.035)                        # crack grooves
        if kind == "round" and mnoise.noise(p * 4 + off) > 0.42: p *= 0.94                          # pits
        p = p + 0.03 * Vector((mnoise.noise(p * 7 + off), mnoise.noise(p * 7 + off + Vector((5, 0, 0))), mnoise.noise(p * 7 + off + Vector((0, 5, 0)))))
        v.co = Vector((p.x * sq.x, p.y * sq.y, max(p.z * sq.z, -0.4 * sq.z)))
    for e in bm.edges: e.smooth = (kind == "round") or not (len(e.link_faces) == 2 and e.calc_face_angle(0) > 0.5)
    for f in bm.faces: f.smooth = True
    me = bpy.data.meshes.new(f"RockVariant_{i:02d}"); bm.to_mesh(me); bm.free(); me.materials.append(MAT_RS[i % 4])
    return me
BASES = [rock_mesh(i) for i in range(32)]
HI = [rock_mesh(60 + i, 5) for i in range(6)]
rc = [0]
def add_rock(x, y, s, col="Mars_Rocks", sink=0.14, apron=True):
    ob = bpy.data.objects.new(f"Mars_Rock_{rc[0]:03d}", HI[rng.integers(len(HI))] if s > 0.9 else BASES[rng.integers(len(BASES))])
    cols[col].objects.link(ob)
    ob.location = (x, y, float(hfull(np.array([x]), np.array([y]))[0]) + sink * s)
    ob.rotation_euler = (rng.uniform(-0.4, 0.4), rng.uniform(-0.4, 0.4), rng.uniform(0, 6.28))
    ob.scale = (s * rng.uniform(0.7, 1.45), s * rng.uniform(0.7, 1.45), s * rng.uniform(0.5, 1.0)); rc[0] += 1
    if apron and s > 0.9:                                               # debris apron: small fragments around big boulders -> natural rock-to-soil transition
        for _ in range(int(14 + 6 * s)):
            ang, rr = rng.uniform(0, 6.28), s * rng.uniform(0.9, 2.3)
            add_rock(x + rr * math.cos(ang), y + rr * math.sin(ang), s * rng.uniform(0.03, 0.12), col, 0.3, False)

if not PREVIEW:
    for (x, y, s) in [(-3.9, 7.2, 1.3), (-6.4, 12.0, 0.95), (4.9, 8.4, 0.9), (7.5, 14.0, 0.7), (-9, 19, 1.7), (11, 24, 1.2), (-2.3, 4.4, 0.5),
                      (-30, 52, 2.6), (34, 70, 3.2), (-52, 95, 3.8), (22, 120, 4.2), (-14, 150, 3.4), (46, 175, 4.6), (-80, 210, 5.0), (8, 260, 5.5)]:     # large weathered boulders, foreground to midground
        add_rock(x, y, s, "Mars_Foreground" if y < 25 else "Mars_Rocks")
    def patchy(x, y): return float(vnoise(np.array([x / 55.0]), np.array([y / 55.0]), 71)[0])
    for k in range(46):                                                 # rock fields: geological groupings, power-law sizes
        d = 7 * (280 / 7) ** rng.random(); a_ = rng.uniform(-0.75, 0.75)
        cx, cy, cr = d * math.tan(a_), d, rng.uniform(2.5, 10) * (1 + d / 60)
        for q in range(int(rng.integers(8, 30))):
            ang, rr = rng.uniform(0, 6.28), cr * abs(rng.normal(0, 0.55))
            sz = min(0.11 * (1 + cy / 40) * (1 - rng.random()) ** (-1 / 1.5), 1.8 * (1 + cy / 60))
            add_rock(cx + rr * math.cos(ang), cy + rr * math.sin(ang), sz, "Mars_Foreground" if cy < 40 else "Mars_Rocks")
    n_med = 0
    while n_med < 140:                                                  # sparse scatter modulated by a patchiness mask
        d = 3.5 * (320 / 3.5) ** (rng.random() ** 0.8); a = rng.uniform(-0.85, 0.85); x, y = d * math.tan(a), d
        if rng.random() > 0.8 * (0.15 + 1.3 * patchy(x, y) ** 1.5): continue
        s = max(0.1 * (4 * (1 + d / 50)) ** (rng.random() ** 2.2), 0.22 * min(d / 50, 1.0))
        add_rock(x, y, s, "Mars_Foreground" if d < 40 else "Mars_Rocks"); n_med += 1
    for (cx, cy, R, dp, rm) in HERO:                                    # ejecta blocks around crater rims
        for k in range(22):
            ang, rr = rng.uniform(0, 6.28), R * rng.uniform(1.0, 2.0)
            add_rock(cx + rr * math.cos(ang), cy + rr * math.sin(ang), rng.uniform(0.25, 1.0) * (1 + R / 40))

    def pebble_group(name, sub, n, dlo, dhi, smin, smax):
        shapes = []
        for k in range(8):
            r_ = np.random.default_rng(900 + k + sub * 10); bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=1.0)
            pl = [(Vector(r_.normal(size=3)).normalized(), r_.uniform(0.5, 0.8)) for _ in range(6)]
            for v in bm.verts:
                p = v.co * (1 + 0.3 * mnoise.noise(v.co * 2.2 + Vector((k, 0, 0))))
                for n_, d_ in pl:
                    ex = p.dot(n_) - d_
                    if ex > 0: p -= n_ * ex
                v.co = p
            vv = np.array([x.co[:] for x in bm.verts]); bm.verts.ensure_lookup_table()
            ff = np.array([[l.vert.index for l in fc_.loops] for fc_ in bm.faces]); bm.free(); shapes.append((vv, ff))
        dpb = dlo * (dhi / dlo) ** (rng.random(n) ** 0.9); ap = rng.uniform(-0.95, 0.95, n); px, py = dpb * np.tan(ap), dpb
        ps = np.exp(rng.normal(np.log(smin), 0.55, n)).clip(smin * 0.4, smax) * (1 + dpb / 80)
        pz = hfull(px, py); allv, allf, off = [], [], 0
        for i in range(n):
            vv, ff = shapes[i % 8]; th = rng.uniform(0, 6.28); c_, s_ = math.cos(th), math.sin(th)
            q = vv * ps[i] * np.array([rng.uniform(0.8, 1.5), rng.uniform(0.8, 1.5), rng.uniform(0.5, 0.9)])
            q = np.stack([q[:, 0] * c_ - q[:, 1] * s_, q[:, 0] * s_ + q[:, 1] * c_, q[:, 2]], 1) + [px[i], py[i], pz[i] + 0.12 * ps[i]]
            allv.append(q); allf.append(ff + off); off += len(vv)
        return make_obj(name, np.vstack(allv), np.vstack(allf), cols["Mars_Regolith"], MAT_R)
    pebble_group("Mars_Gravel_Near", 2, 1100, 2.2, 14, 0.03, 0.14)
    pebble_group("Mars_Gravel_Mid", 1, 4200, 10, 140, 0.04, 0.2)
print("rocks", rc[0])

# ================================================================ lighting
S = Vector((-0.9, 0.12, 0.38)).normalized()                            # sun from the left/behind, ~27 deg up
def aim(ob, direction): ob.rotation_euler = (-Vector(direction)).to_track_quat("-Z", "Y").to_euler()
sun = bpy.data.lights.new("Sun", "SUN"); sun.energy, sun.angle, sun.color = float(globals().get("SUN_E", 5.0)), math.radians(0.55), (1.0, 0.93, 0.84)
sob = bpy.data.objects.new("Sun_Directional", sun); cols["Lighting"].objects.link(sob); aim(sob, S)

# ================================================================ cameras
z0 = float(hfull(np.array([0.0]), np.array([0.0]))[0]) + 2.6
CAM = Vector((0, 0, z0))
def ridge_profile(az0, half, n=21):
    out = []
    for a in np.linspace(az0 - half, az0 + half, n):
        ds = np.geomspace(60, 3300, 300); Zs = hfull(ds * math.sin(a), ds * math.cos(a)) - z0
        out.append(float(np.max(np.arctan2(Zs, ds))))
    return np.array(out)
ridge_all = float(np.mean(ridge_profile(0.0, math.radians(30))))
def make_cam(name, lens, W, H, ridge_frac_from_top, yaw_deg):
    c = bpy.data.cameras.new(name); c.lens, c.sensor_width, c.clip_start, c.clip_end = lens, 36, 0.1, 30000
    k = math.tan(ridge_all) * lens / 36
    want = -(ridge_frac_from_top - 0.5) * (H / W if W >= H else 1.0)
    c.shift_y = k - want
    o = bpy.data.objects.new(name, c); cols["Cameras"].objects.link(o)
    o.location = CAM; o.rotation_euler = (math.radians(90), 0, math.radians(-yaw_deg)); return o
cam_d = make_cam("Cam_Desktop_16x9", 24, 16, 9, 0.52, 0)
cam_t = make_cam("Cam_Tablet_4x3", 22, 4, 3, 0.52, 0)
cam_m = make_cam("Cam_Mobile_9x16", 24, 9, 16, 0.52, float(globals().get("MOBILE_YAW", 8)))
scene.camera = cam_d

# ================================================================ atmosphere: dusty sky gradient + thin scattering haze
ctl = bpy.data.objects.new("Atmosphere_Haze_Controller", None)
ctl["note"] = "Sky gradient and haze are World nodes (World > Surface / Volume). Not exported to GLB; the GLB gets a vertex-colour sky dome instead."
cols["Mars_Atmosphere"].objects.link(ctl)
w = bpy.data.worlds.get("World") or bpy.data.worlds.new("World")
scene.world = w; w.use_nodes = True
nt = w.node_tree; nt.nodes.clear(); N = nt.nodes.new
tc = N("ShaderNodeTexCoord"); sepz = N("ShaderNodeSeparateXYZ"); nt.links.new(tc.outputs["Object"], sepz.inputs["Vector"])
el = N("ShaderNodeMapRange"); el.inputs["From Min"].default_value, el.inputs["From Max"].default_value = 0.0, 0.8; el.clamp = True
nt.links.new(sepz.outputs["Z"], el.inputs["Value"])
sky = ramp_node(N, [(0.0, (0.42, 0.25, 0.16)), (0.14, (0.24, 0.125, 0.08)), (0.55, (0.11, 0.055, 0.04)), (1.0, (0.05, 0.025, 0.022))])
nt.links.new(el.outputs["Result"], sky.inputs["Fac"])
bg, wo = N("ShaderNodeBackground"), N("ShaderNodeOutputWorld"); bg.inputs["Strength"].default_value = float(globals().get("SKY_E", 0.7))
mp = N("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (2.5, 2.5, 9.0); nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
nz = N("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value, nz.inputs["Detail"].default_value = 1.2, 5; nt.links.new(mp.outputs["Vector"], nz.inputs["Vector"])
nzv = N("ShaderNodeMath"); nzv.operation = "MULTIPLY_ADD"; nzv.inputs[1].default_value = 0.3; nzv.inputs[2].default_value = 0.85; nt.links.new(nz.outputs["Fac"], nzv.inputs[0])
skm = N("ShaderNodeMixRGB"); skm.blend_type = "MULTIPLY"; skm.inputs["Fac"].default_value = 1.0                  # faint dust-streak mottling so the sky is not a flat gradient
nt.links.new(sky.outputs["Color"], skm.inputs[1]); nt.links.new(nzv.outputs[0], skm.inputs[2])
nt.links.new(skm.outputs["Color"], bg.inputs["Color"]); nt.links.new(bg.outputs["Background"], wo.inputs["Surface"])

# ================================================================ render settings
r = scene.render
r.resolution_x, r.resolution_y, r.resolution_percentage, r.film_transparent = 1920, 1080, 100, False
scene.render.engine = "CYCLES"; scene.render.filter_size = 1.3
c = scene.cycles; c.samples, c.use_denoising, c.max_bounces, c.sample_clamp_indirect = 128, True, 5, 4.0
try:
    prefs = bpy.context.preferences.addons["cycles"].preferences
    prefs.compute_device_type = "OPTIX"; prefs.get_devices()
    for d in prefs.devices: d.use = d.type != "CPU"
    c.device = "GPU"
except Exception as e: print("gpu", e)
vs = scene.view_settings; vs.view_transform = "AgX"
for l in ("AgX - Base Contrast", "None"):
    try: vs.look = l; break
    except TypeError: pass
vs.exposure = float(globals().get("EXPOSURE", 0.0))
if not PREVIEW:
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, "blender", "mars_environment_v3.blend"))
print("built mars", "PREVIEW" if PREVIEW else "FULL", "ridge deg", round(math.degrees(ridge_all), 2))
