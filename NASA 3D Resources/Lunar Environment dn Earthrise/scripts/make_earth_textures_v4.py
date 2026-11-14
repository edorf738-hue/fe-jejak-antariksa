"""Generate Earth textures (equirectangular) with numpy; run inside Blender (needs bpy to save). Continents are hand-simplified outlines
warped with fractal noise, so the result is original artwork (no third-party imagery).
Outputs in ./textures: earth_color_<N>.jpg, earth_clouds_<N>.png (RGBA, alpha = cloud), earth_rough_<N>.png, earth_lights_<N>.png"""
import numpy as np, os

W = int(globals().get("EARTH_W", 2048))
H = W // 2
OUT = os.path.join(V4_DIR, "textures")  # set V4_DIR before exec
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(11)

def hsh(ix, iy, s):
    v = np.sin(ix * 127.1 + iy * 311.7 + s * 74.7) * 43758.5453
    return v - np.floor(v)
def vn(x, y, s=0):
    ix, iy = np.floor(x), np.floor(y); fx, fy = x - ix, y - iy
    u, v = fx * fx * (3 - 2 * fx), fy * fy * (3 - 2 * fy)
    a, b, c, d = hsh(ix, iy, s), hsh(ix + 1, iy, s), hsh(ix, iy + 1, s), hsh(ix + 1, iy + 1, s)
    return a + (b - a) * u + (c + (d - c) * u - (a + (b - a) * u)) * v
def fbm(x, y, o=5, s=0):
    t = tot = 0; a = 1.0
    for i in range(o):
        t = t + a * vn(x, y, s + i); tot += a; x, y, a = x * 2.03 + 11.7, y * 2.03 + 5.3, a * 0.5
    return t / tot
def bs(lst, axis=-1):
    return np.stack(np.broadcast_arrays(*lst), axis)
def sst(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

# (lon, lat) outlines, deliberately simplified
CONT = {
 "NA": [(-168,66),(-157,71),(-140,70),(-125,70),(-110,73),(-95,72),(-85,69),(-80,63),(-93,58),(-90,52),(-80,52),(-78,58),(-65,60),(-60,55),(-55,50),(-64,45),(-70,43),(-76,38),(-76,35),(-81,31),(-80,26),(-83,30),(-90,30),(-97,28),(-97,21),(-91,19),(-87,21),(-88,16),(-84,10),(-80,8),(-78,9),(-84,9),(-87,13),(-92,15),(-97,16),(-105,20),(-110,24),(-112,29),(-115,30),(-110,23),(-117,32),(-121,35),(-124,41),(-124,48),(-130,54),(-140,60),(-150,60),(-160,58),(-165,62)],
 "SA": [(-80,8),(-77,8),(-72,12),(-62,10),(-52,5),(-50,0),(-45,-2),(-35,-5),(-38,-13),(-41,-22),(-48,-26),(-53,-34),(-58,-38),(-63,-41),(-65,-46),(-68,-52),(-70,-55),(-74,-50),(-73,-40),(-71,-30),(-70,-18),(-76,-14),(-81,-5),(-80,0),(-78,5)],
 "EA": [(-10,36),(-9,43),(-2,44),(-5,48),(2,51),(8,54),(10,57),(12,55),(20,55),(24,60),(30,60),(23,64),(25,66),(18,69),(30,70),(40,67),(60,69),(80,73),(105,77),(130,72),(160,70),(180,66),(180,62),(165,60),(160,53),(155,59),(143,59),(140,52),(135,43),(129,35),(126,38),(122,40),(121,31),(122,25),(115,22),(108,20),(106,10),(100,13),(103,2),(98,8),(98,16),(92,22),(88,22),(80,15),(77,8),(73,18),(67,25),(57,25),(57,22),(52,17),(44,12),(40,20),(35,28),(34,31),(36,36),(28,36),(26,40),(23,38),(20,40),(18,40),(15,38),(12,42),(8,44),(3,43),(-1,38)],
 "AF": [(-17,21),(-16,28),(-10,35),(-5,36),(10,37),(11,33),(20,31),(32,31),(34,27),(38,20),(43,12),(51,12),(48,5),(40,-3),(40,-15),(35,-24),(33,-29),(28,-33),(20,-35),(18,-31),(14,-23),(12,-12),(9,-1),(9,4),(5,6),(-4,5),(-9,5),(-13,9),(-17,14)],
 "AU": [(114,-22),(122,-18),(130,-12),(136,-12),(142,-11),(146,-19),(153,-27),(150,-37),(141,-38),(131,-31),(123,-34),(115,-34)],
 "GL": [(-73,78),(-55,82),(-25,83),(-20,75),(-22,70),(-40,64),(-50,66),(-58,75)],
 "MG": [(44,-25),(47,-25),(50,-15),(49,-12),(44,-17)],
 "UK": [(-5,50),(1,51),(0,53),(-3,56),(-5,58),(-6,55)],
 "JP": [(130,31),(135,34),(141,38),(142,45),(140,42),(136,36)],
 "BO": [(109,1),(117,7),(119,1),(116,-4),(110,-3)],
 "SU": [(95,5),(106,-6),(103,-5),(98,1)],
 "NZ": [(172,-34),(178,-38),(175,-41),(167,-46),(171,-44),(173,-40)],
}
def draw(names):
    cross = np.zeros((H, W), np.int32)
    out = np.zeros((H, W), bool)
    for n in names:
        pts = [((lo + 180) / 360 * W, (90 - la) / 180 * H) for lo, la in CONT[n]]
        cross[:] = 0
        for (x1, y1), (x2, y2) in zip(pts, pts[1:] + pts[:1]):
            if y1 == y2: continue
            r0, r1 = int(np.ceil(min(y1, y2))), int(np.floor(max(y1, y2)))
            rows = np.arange(r0, r1 + 1)
            rows = rows[(rows >= 0) & (rows < H)]
            xi = np.clip(np.ceil(x1 + (rows - y1) * (x2 - x1) / (y2 - y1)).astype(int), 0, W - 1)
            np.add.at(cross, (rows, xi), 1)
        out |= (np.cumsum(cross, axis=1) % 2) == 1
    return out.astype(float) * 255
def blur(a, sigma):
    fy, fx = np.meshgrid(np.fft.fftfreq(H), np.fft.fftfreq(W), indexing="ij")
    return np.fft.ifft2(np.fft.fft2(a) * np.exp(-2 * np.pi ** 2 * sigma ** 2 * (fx ** 2 + fy ** 2))).real
def save(arr, name, q=90):
    import bpy
    a = np.asarray(arr)
    if a.ndim == 2: a = np.repeat(a[..., None], 3, -1); a = np.dstack([a, np.full(a.shape[:2] + (1,), 255, a.dtype)])
    elif a.shape[2] == 3: a = np.dstack([a, np.full(a.shape[:2] + (1,), 255, a.dtype)])
    img = bpy.data.images.new(name, W, H, alpha=True)
    img.colorspace_settings.name = "Non-Color"            # write raw values, no transform
    img.pixels.foreach_set((a[::-1].astype(np.float32) / 255).ravel())
    img.filepath_raw = os.path.join(OUT, name)
    img.file_format = "JPEG" if name.endswith("jpg") else "PNG"
    img.save(quality=q) if name.endswith("jpg") else img.save()
    bpy.data.images.remove(img)
land_im = draw(CONT.keys())
ice_im = draw(["GL"])
Y, X = np.mgrid[0:H, 0:W].astype(float)
lat = 90 - Y / H * 180
lon = X / W * 360 - 180
# coastline roughening: displace sampling coordinates with fractal noise (several scales)
dx = (fbm(X / 90, Y / 90, 5, 1) - 0.5) * 26 + (fbm(X / 22, Y / 22, 4, 8) - 0.5) * 7
dy = (fbm(X / 90 + 40, Y / 90, 5, 3) - 0.5) * 26 + (fbm(X / 22, Y / 22 + 9, 4, 4) - 0.5) * 7
sx, sy = np.clip(X + dx, 0, W - 1).astype(int), np.clip(Y + dy, 0, H - 1).astype(int)
land = land_im[sy, sx] / 255
land = np.maximum(land, (lat < -68).astype(float) * (0.85 + 0.15 * fbm(X / 40, Y / 40, 3, 2) > 0.6))
shelf = np.clip(blur(land, W / 2048 * 9), 0, 1)
land = np.clip(blur(land, W / 2048 * 1.1), 0, 1)
ice = ice_im[sy, sx] / 255
ice = np.maximum(ice, (lat < -66) * 1.0)
# colours (linear)
n1, n2, n3 = fbm(X / 150, Y / 150, 5, 21), fbm(X / 40, Y / 40, 5, 31), fbm(X / 9, Y / 9, 3, 41)
alat = np.abs(lat)
arid = np.exp(-(((alat - 24) / 11) ** 2)) * sst(0.38, 0.62, n1)          # subtropical deserts
trop = np.exp(-((alat / 17) ** 2))
boreal = sst(48, 62, alat) * (1 - sst(68, 76, alat))
tundra = sst(66, 76, alat)
col = bs([0.2 + 0.12 * n2, 0.3 + 0.1 * n2, 0.11 + 0.03 * n2], -1)               # temperate
col = col * (1 - trop[..., None]) + bs([0.05, 0.17 + 0.06 * n2, 0.06], -1) * trop[..., None]
col = col * (1 - boreal[..., None]) + bs([0.09, 0.17 + 0.04 * n2, 0.1], -1) * boreal[..., None]
des = bs([0.58 + 0.12 * n2, 0.45 + 0.1 * n2, 0.28 + 0.06 * n2], -1)
col = col * (1 - arid[..., None]) + des * arid[..., None]
col = col * (1 - tundra[..., None] * 0.7) + bs([0.5, 0.52, 0.5], -1) * tundra[..., None] * 0.7
col = col * (0.82 + 0.36 * n3[..., None])
col = col * (1 - ice[..., None]) + 0.9 * ice[..., None]
deep = bs([0.012 + 0 * X, 0.05 + 0.02 * n1, 0.13 + 0.05 * n1], -1)
shal = bs([0.04 + 0 * X, 0.2 + 0 * X, 0.3 + 0 * X], -1)
sh = (sst(0.02, 0.35, shelf) ** 0.8)[..., None]
ocean = deep * (1 - sh * 0.5) + shal * sh * 0.5
sea_ice = sst(72, 80, alat + 4 * (n2 - 0.5))[..., None]
ocean = ocean * (1 - sea_ice) + 0.85 * sea_ice
rgb = ocean * (1 - land[..., None]) + col * land[..., None]
srgb = np.where(rgb <= 0.0031308, rgb * 12.92, 1.055 * np.clip(rgb, 0, 1) ** (1 / 2.4) - 0.055)
save((np.clip(srgb, 0, 1) * 255).astype(np.uint8), f"earth_color_{W}.jpg")
# roughness: ocean glossy, land/ice matte
rough = 0.62 + 0.33 * np.maximum(land, sea_ice[..., 0])
save((rough * 255).astype(np.uint8), f"earth_rough_{W}.png")
# clouds: warped fbm, banded by latitude (ITCZ + mid-latitude storm tracks)
wx, wy = fbm(X / 200, Y / 200, 4, 51) * 110, fbm(X / 200 + 7, Y / 200, 4, 52) * 70
shear = 1 + 0.0 * lat            # storm bands stretch east-west, flip with latitude
c = fbm((X + wx + 25 * np.sin(Y / 40)) / (45 * shear), (Y + wy) / 38, 7, 61)
c2 = fbm((X + wx * 0.5) / 18, (Y + wy * 0.5) / 11, 5, 62)          # fine wisps / cumulus texture
band = 0.5 * np.exp(-((alat / 9) ** 2)) + 0.5 * np.exp(-(((alat - 52) / 13) ** 2)) + 0.1 - 0.35 * np.exp(-(((alat - 24) / 8) ** 2))
cv = sst(0.56 - band * 0.25, 0.86 - band * 0.2, c * 0.8 + c2 * 0.3 + 0.1 * (fbm(X / 12, Y / 12, 3, 71) - 0.5))
dens = np.clip(cv, 0, 1)
a = (dens ** 1.15 * 0.85 * (1 - sst(60, 80, alat)) * 255).astype(np.uint8)
shade = 232 + 22 * sst(0.3, 0.9, dens)                              # thin cloud slightly grey-blue, thick cloud white
cl = np.zeros((H, W, 4), np.uint8); cl[..., 0] = shade - 4; cl[..., 1] = shade - 1; cl[..., 2] = shade + 1; cl[..., 3] = a
save(cl, f"earth_clouds_{W}.png")
# night lights: clustered points on populated latitudes
pop = sst(0.55, 0.8, fbm(X / 55, Y / 55, 5, 81)) * land * sst(15, 30, alat) * (1 - sst(58, 66, alat)) * (1 - ice)
pts = sst(0.72, 0.9, fbm(X / 4, Y / 4, 2, 91))
save((np.clip(pop * pts * 1.5 + pop * 0.12, 0, 1) * 255).astype(np.uint8), f"earth_lights_{W}.png")
print("ok", W)
