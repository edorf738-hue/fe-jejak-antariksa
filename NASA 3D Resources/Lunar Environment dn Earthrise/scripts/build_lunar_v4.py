"""Wayang Antariksa - Lunar Environment 4.0 "Earthrise" realism refinement (built from v3) (Blender 5.x, Cycles).
Run inside Blender:  PREVIEW_MODE = False; exec(open(path).read())
Contains ONLY: terrain, craters, rocks, distant mountains, Earth, stars, lights, cameras (no human-made objects).
Earth textures come from make_earth_textures.py (run it first; files live in ./textures)."""
import bpy, bmesh, math, os, numpy as np
from mathutils import Vector, Matrix, noise as mnoise

V4 = r"C:\Users\Edorf\Project\blander skill\blender-skills\lunar-landscape\v4"
PREVIEW = bool(globals().get("PREVIEW_MODE", False))
rng = np.random.default_rng(7)

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

def crater(X, Y, cx, cy, R, depth, rim, seed=0, ell=1.0, rot=0.0):
    """Irregular impact crater: wobbly outline, elliptical stretch, uneven rim height, ray-modulated ejecta."""
    dx, dy = X - cx, Y - cy
    c, s = math.cos(rot), math.sin(rot)
    u, v = dx * c + dy * s, (-dx * s + dy * c) / ell
    th = np.arctan2(v, u)
    cth, sth = np.cos(th), np.sin(th)
    wob = 1 + 0.13 * (vnoise(cth * 1.7 + seed, sth * 1.7 + seed * 3, seed) - 0.5) * 2 \
            + 0.06 * (vnoise(cth * 4.5 + 7, sth * 4.5 + seed, seed + 1) - 0.5) * 2
    r = np.hypot(u, v) / (R * wob)
    tilt = 1 + 0.22 * np.cos(th - seed)                              # asymmetric depth (oblique impact)
    pr = np.clip(1 - r * r, 0, 1)
    floor = 1 + 0.10 * (vnoise(u / R * 3.1 + seed, v / R * 3.1, seed + 9) - 0.5) * 2 * (R > 6)
    bowl = np.where(r < 1, -depth * tilt * (pr ** 0.78) * floor, 0.0)       # flatter floor, steeper wall
    if R > 25:                                                         # wall terraces on large craters
        bowl = bowl + np.where(r < 1, 0.05 * depth * np.sin(r * 14) * sstep(0.45, 0.95, r), 0.0)
    if R > 40:                                                         # low central mound
        bowl = bowl + 0.14 * depth * np.exp(-(r / 0.13) ** 2)
    blk = 0.65 + 0.7 * vnoise(u / R * 9 + seed, v / R * 9, seed + 3)    # blocky rim crest
    rimv = rim * (0.5 + 0.9 * vnoise(cth * 2.4 + seed * 2, sth * 2.4, seed + 5)) * blk
    rimh = rimv * np.exp(-(((r - 1) / 0.16) ** 2))
    ej = np.where(r > 1, 0.3 * rim * np.exp(-(r - 1) / 0.85) * (0.4 + 1.2 * vnoise(cth * 3.3 + seed, sth * 3.3 + 4, seed + 2)) * (0.6 + 0.8 * vnoise(u / R * 5, v / R * 5, seed + 4)), 0.0)
    return bowl + rimh + ej

# ================================================================ terrain function
HERO = [(15, 52, 17, 2.8, 1.3), (-70, 150, 38, 6.5, 3.2), (62, 235, 52, 8.5, 4.0), (-26, 33, 10, 1.8, 0.9)]   # high-res patches
BIG = [(c + (101 + i, 1.0 + 0.1 * i, 0.4 * i)) for i, c in enumerate(HERO)]
BIG += [(-18, 120, 24, 3.2, 1.8, 77, 0.85, 0.5), (-140, 90, 30, 4.0, 2.2, 78, 0.9, 1.1)]
_rm = np.random.default_rng(5)
for i in range(760 if not PREVIEW else 300):                       # mid/far craters that give the horizon its texture
    d = np.sqrt(_rm.uniform(120 ** 2, 2800 ** 2)); a = _rm.uniform(-1.45, 1.45)
    R = float(np.clip(14 * (1 - _rm.random()) ** (-1 / 1.25), 14, 170)) * (1 + d / 2500)
    fresh = _rm.random() < 0.3                                         # fresh sharp vs degraded (shallow, soft) craters
    dr, rr_ = (_rm.uniform(0.12, 0.2), _rm.uniform(0.018, 0.03)) if fresh else (_rm.uniform(0.04, 0.09), _rm.uniform(0.006, 0.016))
    BIG.append((d * math.sin(a), d * math.cos(a), R, R * dr * 0.85, R * rr_, 200 + i, _rm.uniform(0.75, 1.0), _rm.uniform(0, 3.1)))


def hbig(X, Y):
    D = np.hypot(X, Y)
    h = (fbm(X / 600, Y / 600, 3, 1) - 0.5) * 9 + (fbm(X / 130, Y / 130, 4, 2) - 0.5) * 1.0
    wx_, wy_ = (fbm(X / 350, Y / 350, 3, 41) - 0.5) * 300, (fbm(X / 350 + 9, Y / 350, 3, 42) - 0.5) * 300   # domain warp breaks repetition
    h = h + sstep(120, 750, D) * (3 + 14 * np.sqrt(ridged((X + wx_) / 330 + 3, (Y + wy_) / 330 + 7, 4, 3)))          # near ridge line (horizon)
    h = h + sstep(900, 2500, D) * (22 + 105 * np.sqrt(ridged((X + wx_) / 900 + 1, (Y + wy_) / 900 + 4, 5, 6)))       # far mountains, ridge layer 1
    h = h + sstep(1100, 2600, D) * 32 * np.sqrt(ridged((X - wy_) / 520 + 8, (Y + wx_) / 1300 + 2, 4, 21)) * sstep(0.35, 0.6, fbm(X / 800, Y / 800, 3, 33))  # ridge layer 2, patchy
    h = h + sstep(450, 1500, D) * 16 * sstep(0.5, 0.62, fbm(X / 650 + 5, Y / 650, 3, 31))                   # low plateaus / mesas at mid distance
    h = h + sstep(200, 900, D) * 2.5 * np.sqrt(ridged(X / 60 + 4, Y / 60 + 8, 4, 12))
    h = h + sstep(350, 900, D) * (fbm(X / 40, Y / 40, 4, 17) - 0.5) * 4
    for c in BIG:
        m = (np.abs(X - c[0]) < 4 * c[2] * 1.4) & (np.abs(Y - c[1]) < 4 * c[2] * 1.4)
        if m.any():
            h[m] += crater(X[m], Y[m], *c)
    edge = np.maximum(np.abs(X), np.abs(Y))
    return h + sstep(2400, 3300, edge) * (80 + 90 * fbm(X / 400, Y / 400, 3, 9))

NS, NM = (900, 800) if PREVIEW else (4200, 5200)
_d = np.sqrt(rng.uniform(5 ** 2, 330 ** 2, NS)); _a = rng.uniform(-1.0, 1.0, NS)
_R = np.minimum(0.8 * (1 - rng.random(NS)) ** (-1 / 1.7), 18) * (1 + _d / 170)
_d2 = np.sqrt(rng.uniform(1.5 ** 2, 36 ** 2, NM)); _a2 = rng.uniform(-1.15, 1.15, NM)
_R2 = np.minimum(0.14 * (1 - rng.random(NM)) ** (-1 / 1.6), 1.0)
cx_ = np.concatenate([_d * np.tan(_a), _d2 * np.tan(_a2)]); cy_ = np.concatenate([_d, _d2])
RR_ = np.concatenate([_R, _R2])
SMALL = np.stack([cx_, cy_, RR_, RR_ * rng.uniform(0.06, 0.18, len(RR_)), RR_ * rng.uniform(0.012, 0.035, len(RR_)),
                  np.arange(len(RR_)) + 1000.0, rng.uniform(0.8, 1.0, len(RR_)), rng.uniform(0, 3.1, len(RR_))], 1)

def hdet(X, Y):
    h = (fbm(X / 11, Y / 11, 4, 11) - 0.5) * 0.32 + (fbm(X / 3.5, Y / 3.5, 3, 5) - 0.5) * 0.12
    h += (fbm(X / 1.1, Y / 1.1, 3, 9) - 0.5) * 0.08 + (ridged(X / 0.45, Y / 0.45, 3, 19) - 0.35) * 0.03 + (fbm(X / 0.15, Y / 0.15, 2, 23) - 0.5) * 0.012
    for c in SMALL:
        R = c[2]
        m = (np.abs(X - c[0]) < 3.2 * R * 1.2) & (np.abs(Y - c[1]) < 3.2 * R * 1.2)
        if m.any():
            h[m] += crater(X[m], Y[m], *c)
    return h

def hfull(X, Y):
    X, Y = np.asarray(X, float), np.asarray(Y, float)
    return hbig(X, Y) + (1 - sstep(300, 760, np.hypot(X, Y))) * hdet(X, Y)

# ================================================================ scene reset + collections
bpy.ops.object.select_all(action="SELECT"); bpy.ops.object.delete()
for blk in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras, bpy.data.collections, bpy.data.images):
    for b in list(blk):
        blk.remove(b)
scene = bpy.context.scene
cols = {}
for n in ["Lunar_Terrain", "Lunar_Foreground_Details", "Lunar_Craters", "Lunar_Rocks", "Lunar_Mountains", "Earth",
          "Space_Environment", "Lighting", "Cameras"]:
    c = bpy.data.collections.new(n); scene.collection.children.link(c); cols[n] = c

def make_obj(name, verts, faces, col, mat=None, smooth=True):
    me = bpy.data.meshes.new(name)
    me.from_pydata(np.asarray(verts).tolist(), [], faces.tolist() if hasattr(faces, "tolist") else faces)
    me.update()
    if smooth: me.shade_smooth()
    ob = bpy.data.objects.new(name, me); col.objects.link(ob)
    if mat: me.materials.append(mat)
    return ob
def grid_faces(nr, nc):
    r, c = np.meshgrid(np.arange(nr - 1), np.arange(nc - 1), indexing="ij")
    a = (r * nc + c).ravel()
    return np.stack([a, a + 1, a + nc + 1, a + nc], 1)

# ================================================================ materials
def new_mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True; m.node_tree.nodes.clear()
    return m, m.node_tree, m.node_tree.nodes.new
def set_in(node, names, val):
    for n in names:
        if n in node.inputs: node.inputs[n].default_value = val; return

def mk_regolith(tone=1.0, name="LunarRegolith"):
    m, nt, N = new_mat(name)
    out, bsdf, geo = N("ShaderNodeOutputMaterial"), N("ShaderNodeBsdfPrincipled"), N("ShaderNodeNewGeometry")
    def noise(scale, det, rough=0.55, vec=None):
        n = N("ShaderNodeTexNoise")
        n.inputs["Scale"].default_value, n.inputs["Detail"].default_value, n.inputs["Roughness"].default_value = scale, det, rough
        nt.links.new(vec or geo.outputs["Position"], n.inputs["Vector"]); return n
    wn = noise(1.3, 2)
    warp = N("ShaderNodeVectorMath"); warp.operation = "MULTIPLY_ADD"
    nt.links.new(wn.outputs["Color"], warp.inputs[0]); warp.inputs[1].default_value = (0.4, 0.4, 0.4)
    nt.links.new(geo.outputs["Position"], warp.inputs[2])
    def vor(scale):
        v = N("ShaderNodeTexVoronoi"); v.inputs["Scale"].default_value = scale
        nt.links.new(warp.outputs[0], v.inputs["Vector"]); return v
    v1, v2, v3 = vor(2.6), vor(12), vor(46)
    big, mid, fine, grain = noise(0.012, 3), noise(0.35, 6), noise(9, 6), noise(60, 5)
    def madd(a, k, b):
        n = N("ShaderNodeMath"); n.operation = "MULTIPLY_ADD"
        nt.links.new(a, n.inputs[0]); n.inputs[1].default_value = k; nt.links.new(b, n.inputs[2]); return n
    s3 = madd(v1.outputs["Distance"], 0.4, madd(fine.outputs["Fac"], 0.35, madd(big.outputs["Fac"], 0.6, mid.outputs["Fac"]).outputs[0]).outputs[0])
    ramp = N("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position, ramp.color_ramp.elements[0].color = 0.4, (0.034 * tone, 0.033 * tone, 0.031 * tone, 1)
    ramp.color_ramp.elements[1].position, ramp.color_ramp.elements[1].color = 1.25, (0.2 * tone, 0.19 * tone, 0.176 * tone, 1)   # warm grey like the references
    sp = N("ShaderNodeSeparateXYZ"); nt.links.new(geo.outputs["Normal"], sp.inputs["Vector"])
    sl = N("ShaderNodeMath"); sl.operation = "SUBTRACT"; sl.inputs[0].default_value = 1.0; nt.links.new(sp.outputs["Z"], sl.inputs[1])
    s4 = madd(sl.outputs[0], 1.4, s3.outputs[0])                    # steeper slopes are brighter (fresher, less dust)
    nt.links.new(s4.outputs[0], ramp.inputs["Fac"]); nt.links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    rg = madd(fine.outputs["Fac"], 0.12, big.outputs["Fac"]); rg.inputs[2].default_value = 0.0
    rgm = N("ShaderNodeMath"); rgm.operation = "ADD"; rgm.inputs[1].default_value = 0.82; nt.links.new(rg.outputs[0], rgm.inputs[0])
    rgm.use_clamp = True; nt.links.new(rgm.outputs[0], bsdf.inputs["Roughness"])
    set_in(bsdf, ["Specular IOR Level", "Specular"], 0.15)
    prev = None
    for src, st, ds in [(v1.outputs["Distance"], 0.3, 0.12), (v2.outputs["Distance"], 0.4, 0.04), (v3.outputs["Distance"], 0.5, 0.015),
                        (fine.outputs["Fac"], 0.45, 0.012), (grain.outputs["Fac"], 0.6, 0.006)]:
        b = N("ShaderNodeBump"); b.inputs["Strength"].default_value, b.inputs["Distance"].default_value = st, ds
        nt.links.new(src, b.inputs["Height"])
        if prev: nt.links.new(prev.outputs["Normal"], b.inputs["Normal"])
        prev = b
    nt.links.new(prev.outputs["Normal"], bsdf.inputs["Normal"]); nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return m

def mk_rock(tone=1.0, name="LunarRock", rough=0.8):
    m, nt, N = new_mat(name)
    out, bsdf, tc, oi = N("ShaderNodeOutputMaterial"), N("ShaderNodeBsdfPrincipled"), N("ShaderNodeTexCoord"), N("ShaderNodeObjectInfo")
    n1 = N("ShaderNodeTexNoise"); n1.inputs["Scale"].default_value, n1.inputs["Detail"].default_value = 5, 9
    nt.links.new(tc.outputs["Object"], n1.inputs["Vector"])
    n2 = N("ShaderNodeTexNoise"); n2.inputs["Scale"].default_value, n2.inputs["Detail"].default_value = 28, 6
    nt.links.new(tc.outputs["Object"], n2.inputs["Vector"])
    vor = N("ShaderNodeTexVoronoi"); vor.inputs["Scale"].default_value = 6
    nt.links.new(tc.outputs["Object"], vor.inputs["Vector"])
    add = N("ShaderNodeMath"); add.operation = "MULTIPLY_ADD"
    nt.links.new(oi.outputs["Random"], add.inputs[0]); add.inputs[1].default_value = 0.55; nt.links.new(n1.outputs["Fac"], add.inputs[2])
    ramp = N("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position, ramp.color_ramp.elements[0].color = 0.3, (0.07 * tone, 0.065 * tone, 0.058 * tone, 1)
    ramp.color_ramp.elements[1].position, ramp.color_ramp.elements[1].color = 1.15, (0.26 * tone, 0.235 * tone, 0.2 * tone, 1)
    nt.links.new(add.outputs[0], ramp.inputs["Fac"]); nt.links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = rough
    prev = None
    for src, st, ds in [(vor.outputs["Distance"], 0.35, 0.05), (n1.outputs["Fac"], 0.5, 0.025), (n2.outputs["Fac"], 0.5, 0.008)]:
        b = N("ShaderNodeBump"); b.inputs["Strength"].default_value, b.inputs["Distance"].default_value = st, ds
        nt.links.new(src, b.inputs["Height"])
        if prev: nt.links.new(prev.outputs["Normal"], b.inputs["Normal"])
        prev = b
    nt.links.new(prev.outputs["Normal"], bsdf.inputs["Normal"]); nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return m

MAT_T, MAT_M = mk_regolith(), mk_regolith(0.78, "LunarMountain")
MAT_RS = [mk_rock(0.7, "LunarRock_Basalt", 0.85), mk_rock(1.0, "LunarRock_Mixed"), mk_rock(1.35, "LunarRock_Anorthosite", 0.7)]
MAT_R = MAT_RS[1]

# ================================================================ terrain: near (camera-space grid), craters (polar patches), mountains
NR, NC = (220, 220) if PREVIEW else (520, 400)
DMIN, DMAX, HALF = 1.5, 800.0, math.radians(62)
dd = DMIN * (DMAX / DMIN) ** (np.arange(NR) / (NR - 1)); aa = np.linspace(-HALF, HALF, NC)
Dg, Ag = np.meshgrid(dd, aa, indexing="ij")
Xn, Yn = (1.5 + Dg) * np.tan(Ag), Dg
Zn = hfull(Xn.ravel(), Yn.ravel()).reshape(NR, NC)
faces = grid_faces(NR, NC)
V = np.stack([Xn.ravel(), Yn.ravel(), Zn.ravel()], 1)
fc = V[faces][:, :, :2]
keep = np.ones(len(faces), bool)
for cx, cy, R, dp, rm in HERO:
    keep &= np.hypot(fc[:, :, 0] - cx, fc[:, :, 1] - cy).min(1) > 1.45 * R
make_obj("Lunar_Terrain_Near", V, faces[keep], cols["Lunar_Terrain"], MAT_T)

def patch(name, cx, cy, R, M=110, S=260):
    if PREVIEW: M, S = 50, 120
    rr = 1.75 * (np.arange(1, M + 1) / M) ** 1.0
    th = np.linspace(0, 2 * np.pi, S, endpoint=False)
    RR, TT = np.meshgrid(rr, th, indexing="ij")
    X, Y = cx + RR * R * np.cos(TT), cy + RR * R * np.sin(TT)
    Z = hfull(X.ravel(), Y.ravel()) - 0.8 * sstep(1.5, 1.7, RR.ravel())
    verts = np.vstack([[cx, cy, float(hfull(np.array([cx]), np.array([cy]))[0])], np.stack([X.ravel(), Y.ravel(), Z], 1)])
    f = [[0, 1 + s, 1 + (s + 1) % S] for s in range(S)]
    for j in range(M - 1):
        for s in range(S):
            a, b = 1 + j * S + s, 1 + j * S + (s + 1) % S
            f.append([a, a + S, b + S, b])
    return make_obj(name, verts, f, cols["Lunar_Craters"], MAT_T)
for i, (cx, cy, R, dp, rm) in enumerate(HERO):
    patch(f"Lunar_Crater_{['Midground_Right', 'Midground_Left', 'Far_Right', 'Foreground_Left'][i]}", cx, cy, R)

NF, EXT = (321 if PREVIEW else 641), 3500.0
fx = np.linspace(-EXT, EXT, NF); FX, FY = np.meshgrid(fx, fx, indexing="ij")
inside = (FY > 0) & (FY < 740) & (np.abs(FX) < (1.5 + FY) * math.tan(math.radians(58)))
FZ = hbig(FX, FY) - np.where(inside, 40, 0)
make_obj("Lunar_Mountains_Far", np.stack([FX.ravel(), FY.ravel(), FZ.ravel()], 1), grid_faces(NF, NF), cols["Lunar_Mountains"], MAT_M)

# ================================================================ rocks (16 shared shape variants -> linked instances) + pebbles
def rock_mesh(i, sub=3):
    r = np.random.default_rng(100 + i)
    bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=sub, radius=1.0)
    angular = i % 4 != 3 or i >= 40
    sq = Vector((1.0, r.uniform(0.55, 1.0), r.uniform(0.4, 0.8)))
    off = Vector(r.uniform(-50, 50, 3))
    planes = [(Vector(r.normal(size=3)).normalized(), r.uniform(0.4, 0.78)) for _ in range(r.integers(7, 14))]
    for v in bm.verts:
        p = v.co.copy()
        p = p * (1 + 0.2 * mnoise.fractal(p * 1.2 + off, 0.5, 2.0, 4) + 0.1 * (1 - abs(mnoise.noise(p * 2.6 + off))))
        if angular:
            for n, d in planes:
                ex = p.dot(n) - d
                if ex > 0: p -= n * ex
        p = p + 0.04 * Vector((mnoise.noise(p * 7 + off), mnoise.noise(p * 7 + off + Vector((5, 0, 0))), mnoise.noise(p * 7 + off + Vector((0, 5, 0)))))
        v.co = Vector((p.x * sq.x, p.y * sq.y, max(p.z * sq.z, -0.4 * sq.z)))
    for e in bm.edges:
        e.smooth = not (len(e.link_faces) == 2 and e.calc_face_angle(0) > 0.5)
    for f in bm.faces: f.smooth = True
    me = bpy.data.meshes.new(f"RockVariant_{i:02d}"); bm.to_mesh(me); bm.free(); me.materials.append(MAT_RS[[1, 0, 2, 1, 0][i % 5]])
    return me
BASES = [rock_mesh(i) for i in range(24)]
HI = [rock_mesh(40 + i, 4) for i in range(5)]       # high-resolution variants for large boulders
rc = [0]
def add_rock(x, y, s, col="Lunar_Rocks", sink=0.12, k=None):
    ob = bpy.data.objects.new(f"Lunar_Rock_{rc[0]:03d}", (HI[rng.integers(len(HI))] if s > 0.9 else BASES[rng.integers(len(BASES))]) if k is None else BASES[k])
    cols[col].objects.link(ob)
    ob.location = (x, y, float(hfull(np.array([x]), np.array([y]))[0]) + sink * s)
    ob.rotation_euler = (rng.uniform(-0.4, 0.4), rng.uniform(-0.4, 0.4), rng.uniform(0, 6.28))
    ob.scale = (s * rng.uniform(0.7, 1.45), s * rng.uniform(0.7, 1.45), s * rng.uniform(0.55, 1.1)); rc[0] += 1

if not PREVIEW:
    # composition anchors: large angular boulders in the foreground (bottom-left / bottom-right), as in the references
    for (x, y, s) in [(-3.9, 7.2, 1.35), (-6.2, 12.0, 1.0), (4.9, 8.2, 0.95), (7.5, 14.0, 0.7), (-9, 19, 1.5), (11, 24, 1.1), (-2.3, 4.4, 0.55)]:
        add_rock(x, y, s)
    def patchy(x, y): return float(vnoise(np.array([x / 55.0]), np.array([y / 55.0]), 71)[0])
    for k in range(18):                                             # rock fields: geological groupings with power-law sizes
        d = 7 * (140 / 7) ** rng.random(); a_ = rng.uniform(-0.75, 0.75)
        cx, cy, cr = d * math.tan(a_), d, rng.uniform(2.5, 9) * (1 + d / 60)
        for q in range(int(rng.integers(8, 28))):
            ang, rr = rng.uniform(0, 6.28), cr * abs(rng.normal(0, 0.55))
            sz = min(0.11 * (1 + cy / 40) * (1 - rng.random()) ** (-1 / 1.5), 1.8 * (1 + cy / 60))
            add_rock(cx + rr * math.cos(ang), cy + rr * math.sin(ang), sz, "Lunar_Foreground_Details" if cy < 40 else "Lunar_Rocks")
    n_med = 0
    while n_med < 110:                                              # sparse scatter, modulated by a patchiness mask
        d = 3.5 * (320 / 3.5) ** (rng.random() ** 0.8); a = rng.uniform(-0.85, 0.85)
        x, y = d * math.tan(a), d
        if rng.random() > (0.6 if a < -0.3 else 0.9) * (0.15 + 1.3 * patchy(x, y) ** 1.5): continue
        s = max(0.1 * (4 * (1 + d / 50)) ** (rng.random() ** 2.2), 0.22 * min(d / 50, 1.0))
        add_rock(x, y, s, "Lunar_Foreground_Details" if d < 40 else "Lunar_Rocks"); n_med += 1
    for (cx, cy, R, dp, rm) in HERO:                                # ejecta blocks around crater rims
        for k in range(26):
            ang, rr = rng.uniform(0, 6.28), R * rng.uniform(1.0, 2.0)
            add_rock(cx + rr * math.cos(ang), cy + rr * math.sin(ang), rng.uniform(0.25, 1.1) * (1 + R / 40))
        for k in range(2):
            ang, rr = rng.uniform(0, 6.28), R * rng.uniform(1.05, 1.5)
            add_rock(cx + rr * math.cos(ang), cy + rr * math.sin(ang), rng.uniform(1.6, 3.4))

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
        dpb = dlo * (dhi / dlo) ** (rng.random(n) ** 0.9); ap = rng.uniform(-0.95, 0.95, n)
        px, py = dpb * np.tan(ap), dpb
        ps = np.exp(rng.normal(np.log(smin), 0.55, n)).clip(smin * 0.4, smax) * (1 + dpb / 80)
        pz = hfull(px, py); allv, allf, off = [], [], 0
        for i in range(n):
            vv, ff = shapes[i % 8]; th = rng.uniform(0, 6.28); c_, s_ = math.cos(th), math.sin(th)
            q = vv * ps[i] * np.array([rng.uniform(0.8, 1.5), rng.uniform(0.8, 1.5), rng.uniform(0.5, 0.9)])
            q = np.stack([q[:, 0] * c_ - q[:, 1] * s_, q[:, 0] * s_ + q[:, 1] * c_, q[:, 2]], 1) + [px[i], py[i], pz[i] + 0.12 * ps[i]]
            allv.append(q); allf.append(ff + off); off += len(vv)
        return make_obj(name, np.vstack(allv), np.vstack(allf), cols["Lunar_Foreground_Details"], MAT_R, smooth=True)
    pebble_group("Lunar_Foreground_Pebbles_Near", 2, 900, 2.2, 14, 0.035, 0.16)
    pebble_group("Lunar_Foreground_Pebbles_Mid", 1, 4200, 10, 140, 0.04, 0.2)
print("rocks", rc[0])

# ================================================================ lighting
S = Vector((-0.88, -0.22, 0.24)).normalized()                         # direction toward the sun (from the left, ~17 deg up)
def aim(ob, direction): ob.rotation_euler = (-Vector(direction)).to_track_quat("-Z", "Y").to_euler()
sun = bpy.data.lights.new("Sun", "SUN"); sun.energy, sun.angle = 6.5, math.radians(0.6)
sob = bpy.data.objects.new("Sun_Directional", sun); cols["Lighting"].objects.link(sob); aim(sob, S)

# ================================================================ cameras
z0 = float(hfull(np.array([0.0]), np.array([0.0]))[0]) + 2.2
CAM = Vector((0, 0, z0))
def ridge_profile(az0, half, n=21):
    out = []
    for a in np.linspace(az0 - half, az0 + half, n):
        ds = np.geomspace(60, 3300, 300); Zs = hfull(ds * math.sin(a), ds * math.cos(a)) - z0
        out.append(float(np.max(np.arctan2(Zs, ds))))
    return np.array(out)
EAZ = math.radians(19)                                             # Earth azimuth (right of centre)
R_ANG = math.radians(6.0)                                          # Earth angular radius (kept modest, ref ~12 deg diameter)
RIDGE = ridge_profile(EAZ, R_ANG * 0.9)
EEL = float(RIDGE.mean() + R_ANG * 0.5)                            # ~25% of the globe hidden behind the horizon
ridge_all = float(np.mean(ridge_profile(0.0, math.radians(30))))
def make_cam(name, lens, W, H, ridge_frac_from_top, yaw_deg):
    c = bpy.data.cameras.new(name); c.lens, c.sensor_width, c.clip_start, c.clip_end = lens, 36, 0.1, 30000
    k = math.tan(ridge_all) * lens / 36                           # ridge height in sensor-fit units
    want = -(ridge_frac_from_top - 0.5) * (H / W if W >= H else 1.0)
    c.shift_y = k - want
    o = bpy.data.objects.new(name, c); cols["Cameras"].objects.link(o)
    o.location = CAM; o.rotation_euler = (math.radians(90), 0, math.radians(-yaw_deg)); return o
cam_d = make_cam("Cam_Desktop_16x9", 26, 16, 9, 0.56, 0)
cam_t = make_cam("Cam_Tablet_4x3", 24, 4, 3, 0.57, 0)
cam_m = make_cam("Cam_Mobile_9x16", 28, 9, 16, 0.62, math.degrees(EAZ) - 8)
scene.camera = cam_d

# ================================================================ Earth (3D sphere, textured: oceans, continents, clouds, night lights, atmosphere rim)
ED = 9000.0; ER = ED * math.tan(R_ANG)
E_DIR = Vector((math.sin(EAZ) * math.cos(EEL), math.cos(EAZ) * math.cos(EEL), math.sin(EEL)))
ECEN = CAM + E_DIR * ED
es = bpy.data.lights.new("Earthshine", "SUN"); es.energy, es.angle, es.color = 0.6, math.radians(3), (0.55, 0.75, 1.0)
eob = bpy.data.objects.new("Earthshine_Fill", es); cols["Lighting"].objects.link(eob); aim(eob, E_DIR)

def sphere(name, r, loc, col, seg=160, rings=80):
    bm = bmesh.new(); bm.loops.layers.uv.verify(); bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=rings, radius=1.0, calc_uvs=True)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); me.shade_smooth()
    o = bpy.data.objects.new(name, me); col.objects.link(o); o.location = loc; o.scale = (r, r, r); return o
def tex(nt, N, name, colorspace="sRGB", ext="REPEAT"):
    n = N("ShaderNodeTexImage")
    n.image = bpy.data.images.load(os.path.join(V4, "textures", name)); n.image.colorspace_settings.name = colorspace
    n.extension = ext; n.interpolation = "Linear"; return n
EW = 1024 if PREVIEW else 2048
def mk_earth():
    m, nt, N = new_mat("Earth_Surface")
    out, b = N("ShaderNodeOutputMaterial"), N("ShaderNodeBsdfPrincipled")
    c, r, l = tex(nt, N, f"earth_color_{EW}.jpg"), tex(nt, N, f"earth_rough_{EW}.png", "Non-Color"), tex(nt, N, f"earth_lights_{EW}.png", "Non-Color")
    dim = N("ShaderNodeMixRGB"); dim.blend_type = "MULTIPLY"; dim.inputs["Fac"].default_value = 1.0   # grade: slightly darker, less saturated
    nt.links.new(c.outputs["Color"], dim.inputs[1]); dim.inputs[2].default_value = (0.85, 0.86, 0.88, 1)
    nt.links.new(dim.outputs["Color"], b.inputs["Base Color"]); nt.links.new(r.outputs["Color"], b.inputs["Roughness"])
    tint = N("ShaderNodeMixRGB"); tint.blend_type = "MULTIPLY"; tint.inputs["Fac"].default_value = 1.0
    nt.links.new(l.outputs["Color"], tint.inputs[1]); tint.inputs[2].default_value = (1.0, 0.75, 0.4, 1)
    nt.links.new(tint.outputs["Color"], b.inputs["Emission Color"]); b.inputs["Emission Strength"].default_value = 0.5; set_in(b, ["Specular IOR Level", "Specular"], 0.3)
    nt.links.new(b.outputs["BSDF"], out.inputs["Surface"]); return m
def mk_clouds():
    m, nt, N = new_mat("Earth_Clouds")
    out, b = N("ShaderNodeOutputMaterial"), N("ShaderNodeBsdfPrincipled")
    t = tex(nt, N, f"earth_clouds_{EW}.png")
    t.image.alpha_mode = "STRAIGHT"
    nt.links.new(t.outputs["Color"], b.inputs["Base Color"]); nt.links.new(t.outputs["Alpha"], b.inputs["Alpha"])
    b.inputs["Roughness"].default_value = 0.9
    nt.links.new(b.outputs["BSDF"], out.inputs["Surface"])
    try: m.surface_render_method = "BLENDED"
    except Exception: pass
    return m
def mk_atmo():
    m, nt, N = new_mat("Earth_AtmosphereRim")
    out, geo = N("ShaderNodeOutputMaterial"), N("ShaderNodeNewGeometry")
    d = N("ShaderNodeVectorMath"); d.operation = "DOT_PRODUCT"
    nt.links.new(geo.outputs["Normal"], d.inputs[0]); nt.links.new(geo.outputs["Incoming"], d.inputs[1])
    ab = N("ShaderNodeMath"); ab.operation = "ABSOLUTE"; nt.links.new(d.outputs["Value"], ab.inputs[0])
    inv = N("ShaderNodeMath"); inv.operation = "SUBTRACT"; inv.inputs[0].default_value = 1.0; nt.links.new(ab.outputs[0], inv.inputs[1])
    pw = N("ShaderNodeMath"); pw.operation = "POWER"; pw.inputs[1].default_value = 6.0; nt.links.new(inv.outputs[0], pw.inputs[0])
    ld = N("ShaderNodeVectorMath"); ld.operation = "DOT_PRODUCT"; nt.links.new(geo.outputs["Normal"], ld.inputs[0]); ld.inputs[1].default_value = tuple(S)
    lit = N("ShaderNodeMath"); lit.operation = "MULTIPLY_ADD"; lit.use_clamp = True
    nt.links.new(ld.outputs["Value"], lit.inputs[0]); lit.inputs[1].default_value = 1.2; lit.inputs[2].default_value = 0.15
    fac = N("ShaderNodeMath"); fac.operation = "MULTIPLY"; fac.use_clamp = True
    nt.links.new(pw.outputs[0], fac.inputs[0]); nt.links.new(lit.outputs[0], fac.inputs[1])
    em, tr, mx = N("ShaderNodeEmission"), N("ShaderNodeBsdfTransparent"), N("ShaderNodeMixShader")
    em.inputs["Color"].default_value = (0.35, 0.6, 1.0, 1); em.inputs["Strength"].default_value = 1.0
    nt.links.new(fac.outputs[0], mx.inputs["Fac"]); nt.links.new(tr.outputs[0], mx.inputs[1]); nt.links.new(em.outputs[0], mx.inputs[2])
    nt.links.new(mx.outputs[0], out.inputs["Surface"]); return m
YAW = float(globals().get("EARTH_YAW_DEG", 140.0)); TILTX = float(globals().get("EARTH_TILT_X", 12.0))
TILT = math.radians(23.5)
earth = sphere("Earth_Globe", ER, ECEN, cols["Earth"]); earth.data.materials.append(mk_earth())
clouds = sphere("Earth_CloudLayer", ER * 1.008, ECEN, cols["Earth"]); clouds.data.materials.append(mk_clouds())
atmo = sphere("Earth_AtmosphereRim", ER * 1.022, ECEN, cols["Earth"], 96, 48); atmo.data.materials.append(mk_atmo()); atmo.visible_shadow = False
for o, extra in ((earth, 0.0), (clouds, 6.0)):
    o.rotation_euler = (math.radians(90) - TILT * 0.0 + 0, 0, math.radians(YAW + extra))
    o.rotation_euler = (math.radians(TILTX), 0, math.radians(YAW + extra))
ctl = bpy.data.objects.new("Starfield_Controller", None)
ctl["note"] = "Sparse stars are procedural World shader nodes (World > Surface). Not exported to GLB."
cols["Space_Environment"].objects.link(ctl)

# ================================================================ world: sparse stars only
w = bpy.data.worlds.get("World") or bpy.data.worlds.new("World")
scene.world = w; w.use_nodes = True
nt = w.node_tree; nt.nodes.clear(); N = nt.nodes.new
tc = N("ShaderNodeTexCoord")
def wmath(op, a=None, b=None, c=None, clamp=False):
    n = N("ShaderNodeMath"); n.operation = op; n.use_clamp = clamp
    for i, v in enumerate((a, b, c)):
        if v is None: continue
        if isinstance(v, (int, float)): n.inputs[i].default_value = v
        else: nt.links.new(v, n.inputs[i])
    return n
def stars(scale, p, bright, rad=0.06):
    v = N("ShaderNodeTexVoronoi"); v.inputs["Scale"].default_value = scale
    nt.links.new(tc.outputs["Generated"], v.inputs["Vector"])
    sp = N("ShaderNodeSeparateColor"); nt.links.new(v.outputs["Color"], sp.inputs["Color"])
    sel = wmath("GREATER_THAN", sp.outputs[0], 1 - p); rd = wmath("LESS_THAN", v.outputs["Distance"], rad)
    br = wmath("MULTIPLY", wmath("POWER", sp.outputs[1], 3.0).outputs[0], bright)
    return wmath("MULTIPLY", wmath("MULTIPLY", sel.outputs[0], rd.outputs[0]).outputs[0], br.outputs[0])
tot = wmath("ADD", wmath("ADD", stars(380, 0.03, 1.0).outputs[0], stars(150, 0.012, 2.6).outputs[0]).outputs[0], stars(80, 0.01, 5.0).outputs[0])
lp = N("ShaderNodeLightPath")
amb = wmath("MULTIPLY", wmath("SUBTRACT", 1.0, lp.outputs["Is Camera Ray"]).outputs[0], 0.02)   # ambient only for lighting, sky stays black
stc = N("ShaderNodeCombineColor")
for i, k in enumerate((1.0, 0.97, 0.93)): nt.links.new(wmath("ADD", wmath("MULTIPLY", tot.outputs[0], k).outputs[0], amb.outputs[0]).outputs[0], stc.inputs[i])   # 0.02 = faint ambient so shadows keep detail
bg, wo = N("ShaderNodeBackground"), N("ShaderNodeOutputWorld"); bg.inputs["Strength"].default_value = 1.0
nt.links.new(stc.outputs["Color"], bg.inputs["Color"]); nt.links.new(bg.outputs["Background"], wo.inputs["Surface"])

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
vs.exposure = float(globals().get("EXPOSURE", 0.1))
if not PREVIEW:
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(V4, "blender", "lunar_environment_v4.blend"))
print("built v4", "PREVIEW" if PREVIEW else "FULL", "Earth el deg", round(math.degrees(EEL), 2), "ridge deg", round(math.degrees(ridge_all), 2), "ER", round(ER))
