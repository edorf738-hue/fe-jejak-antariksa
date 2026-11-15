"use client";

import { useEffect, useRef } from "react";

/**
 * Planet beranimasi (bola 3D prosedural, WebGL2, tanpa aset gambar maupun pustaka 3D): permukaan
 * dihitung di shader (derau fbm, kawah Worley, pita awan), diputar pada porosnya, disinari dari kiri-atas
 * dengan terminator lembut, tepi beratmosfer, dan pendar di luar tepi. Tiga jenis:
 *  - `mars`: karat oranye dengan bercak gelap dan tudung kutub putih, kabut tipis kemerahan;
 *  - `bulan`: abu-abu dengan kawah berbagai ukuran dan dataran gelap (mare), tanpa atmosfer;
 *  - `bumi`: samudra, benua, tudung es, awan yang melayang sedikit lebih cepat, kilau matahari di laut, dan
 *    lampu kota di sisi malam (titik berangkat di Peta Perjalanan);
 *  - `raksasa`: raksasa es biru berpita dengan bintik badai dan cincin (Deep Space, mengingat Voyager).
 * Interaksi: saat tautan induk (`a`) di-hover/difokus planet berputar lebih cepat, pendarnya menguat,
 * dan arah cahaya sedikit mengikuti kursor. Berhenti saat di luar layar; `prefers-reduced-motion`:
 * satu bingkai diam. Tanpa WebGL2 tampil bola gradasi statis (juga dipakai sebagai placeholder awal).
 * Kanvas selalu persegi dan mengisi lebarnya (beri lebar lewat pembungkus).
 */
export type JenisPlanet = "mars" | "bulan" | "raksasa" | "bumi";

const KONFIG: Record<JenisPlanet, { kind: number; radius: number; kecepatan: number; sudut0: number; gradasi: string; tekstur?: string; gain?: number }> = {
  mars: {
    kind: 0,
    radius: 0.6,
    kecepatan: 0.11,
    sudut0: 3.6,
    gradasi: "radial-gradient(circle at 32% 30%, #e8a070 0%, #b8552b 45%, #5a2412 80%, #1d0d08 100%)",
  },
  bulan: {
    kind: 1,
    radius: 0.5,
    kecepatan: 0.07,
    sudut0: 1.1,
    // Peta warna Bulan NASA SVS #14959 (LRO), diekstrak dari moon_small.glb dan diubah ke ekuirektangular 2048x1024.
    tekstur: "/images/planet/bulan.webp",
    gain: 1.25,
    gradasi: "radial-gradient(circle at 32% 30%, #d9d9dc 0%, #8f9096 45%, #4a4b52 80%, #16171b 100%)",
  },
  bumi: {
    kind: 3,
    radius: 0.5,
    kecepatan: 0.14,
    sudut0: 0.8,
    gradasi: "radial-gradient(circle at 32% 30%, #8fd0ff 0%, #2a74c8 45%, #0f2f6b 80%, #050d24 100%)",
  },
  raksasa: {
    kind: 2,
    radius: 0.4,
    kecepatan: 0.16,
    sudut0: 0.4,
    gradasi: "radial-gradient(circle at 32% 30%, #a8dcf0 0%, #3e86c8 45%, #14346e 80%, #070f26 100%)",
  },
};

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uAngle;
uniform float uHover;
uniform vec2 uMouse;
uniform int uKind;
uniform float uRadius;
uniform sampler2D uTex;
uniform float uHasTex;
uniform float uGain;
out vec4 outColor;

// Sampel peta ekuirektangular pada normal ruang-objek q (atas = kutub utara). Gradien dibuat kontinu di
// jahitan bujur agar tidak ada garis akibat pemilihan mipmap.
vec3 sampleTex(vec3 q) {
  float lon = atan(q.x, q.z);
  vec2 uv = vec2(lon * 0.15915494 + 0.5, 0.5 + asin(clamp(q.y, -1.0, 1.0)) * 0.31830989);
  vec2 dx = dFdx(uv);
  vec2 dy = dFdy(uv);
  dx.x -= round(dx.x);
  dy.x -= round(dy.x);
  return textureGrad(uTex, uv, dx, dy).rgb;
}

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}
float fbm(vec3 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 5; i++) {
    s += a * noise(p);
    p = p * 2.02 + vec3(1.7, 9.2, 3.1);
    a *= 0.5;
  }
  return s;
}
float cell(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  float d = 8.0;
  for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++)
      for (int z = -1; z <= 1; z++) {
        vec3 g = vec3(float(x), float(y), float(z));
        vec3 o = vec3(hash(i + g), hash(i + g + 7.1), hash(i + g + 13.7));
        vec3 r = g + o - f;
        d = min(d, dot(r, r));
      }
  return sqrt(d);
}
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
float crater(float c, float lo, float hi) {
  float bowl = smoothstep(lo, hi, c);
  float rim = smoothstep(hi - 0.06, hi + 0.02, c) * (1.0 - smoothstep(hi + 0.02, hi + 0.14, c));
  return bowl * 0.55 + rim * 0.45;
}

void main() {
  float sc = 0.5 * min(uRes.x, uRes.y);
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / sc;
  vec2 p = uv / uRadius;
  float r2 = dot(p, p);
  float r = sqrt(r2);
  float px = 1.0 / (sc * uRadius);
  vec3 L = normalize(vec3(-0.62 + uMouse.x * 0.32, 0.38 + uMouse.y * 0.28, 0.68));

  vec3 atm = vec3(0.0);
  float atmK = 0.0;
  if (uKind == 0) { atm = vec3(0.95, 0.52, 0.30); atmK = 0.55; }
  else if (uKind == 2) { atm = vec3(0.42, 0.74, 1.0); atmK = 0.9; }
  else if (uKind == 3) { atm = vec3(0.30, 0.58, 1.0); atmK = 1.35; }

  // --- permukaan planet
  float disc = 1.0 - smoothstep(1.0 - 1.2 * px, 1.0 + 0.6 * px, r);
  vec3 planetCol = vec3(0.0);
  float zs = 0.0;
  if (r < 1.0 + 2.0 * px) {
    float z = sqrt(max(1.0 - r2, 0.0));
    zs = z;
    vec3 n = vec3(p, z);
    vec3 q = rotY(uAngle) * (rotX(0.32) * n);
    float ndl = dot(n, L);
    float lit = smoothstep(-0.08, 0.72, ndl);
    float h = 0.0;
    vec3 albedo = vec3(0.5);
    float oceanMask = 0.0;
    float landMask = 0.0;
    float cloudMask = 0.0;
    if (uKind == 0) {
      float f1 = fbm(q * 2.2);
      float f2 = fbm(q * 5.5 + 4.0);
      float dark = smoothstep(0.44, 0.62, fbm(q * 1.3 + 7.0));
      vec3 rust = mix(vec3(0.50, 0.20, 0.09), vec3(0.88, 0.52, 0.27), f1);
      albedo = mix(rust, vec3(0.20, 0.10, 0.07), dark * 0.78);
      albedo *= 0.72 + 0.56 * f2;
      float pole = smoothstep(0.84, 0.95, abs(q.y) + (f2 - 0.5) * 0.10);
      albedo = mix(albedo, vec3(0.93, 0.94, 0.97), pole);
      h = f1 * 0.6 + f2 * 0.4;
    } else if (uKind == 1 && uHasTex > 0.5) {
      vec3 t = sampleTex(q);
      albedo = pow(t, vec3(0.9)) * uGain;
      h = dot(t, vec3(0.30, 0.59, 0.11)) * 1.6;
    } else if (uKind == 1) {
      float mare = smoothstep(0.46, 0.60, fbm(q * 1.7 + 2.0));
      float c1 = cell(q * 4.2);
      float c2 = cell(q * 9.5 + 3.0);
      float c3 = cell(q * 22.0 + 9.0);
      float k1 = crater(c1, 0.10, 0.34);
      float k2 = crater(c2, 0.10, 0.30);
      float k3 = crater(c3, 0.08, 0.26);
      h = fbm(q * 6.0) * 0.30 + k1 * 0.65 + k2 * 0.40 + k3 * 0.22;
      albedo = vec3(0.64, 0.64, 0.66) * (0.74 + 0.5 * fbm(q * 9.0));
      albedo = mix(albedo, vec3(0.27, 0.28, 0.32), mare * 0.85);
      albedo *= 0.78 + 0.34 * (k1 * 0.5 + k2 * 0.3 + k3 * 0.2);
    } else if (uKind == 3) {
      float land = fbm(q * 2.0 + 5.0);
      float shore = smoothstep(0.50, 0.535, land);
      vec3 ocean = mix(vec3(0.015, 0.09, 0.27), vec3(0.04, 0.23, 0.55), fbm(q * 4.0));
      vec3 landC = mix(vec3(0.12, 0.30, 0.11), vec3(0.50, 0.42, 0.24), smoothstep(0.54, 0.78, land + (fbm(q * 7.0) - 0.5) * 0.3));
      float ice = smoothstep(0.80, 0.92, abs(q.y) + (fbm(q * 5.0) - 0.5) * 0.10);
      albedo = mix(ocean, landC, shore);
      albedo = mix(albedo, vec3(0.93, 0.95, 0.98), ice);
      vec3 qc = rotY(uAngle * 0.4) * q; // awan melayang sedikit lebih cepat dari permukaan
      float cloud = smoothstep(0.50, 0.74, fbm(qc * 3.2 + 9.0) + 0.22 * fbm(qc * 9.0));
      albedo = mix(albedo, vec3(1.0), cloud * 0.88);
      oceanMask = (1.0 - shore) * (1.0 - ice);
      landMask = shore * (1.0 - ice);
      cloudMask = cloud;
      h = shore * 0.22 + cloud * 0.12;
    } else {
      float w = fbm(vec3(q.x * 1.5, q.y * 8.0, q.z * 1.5)) * 2.0;
      float bands = 0.5 + 0.5 * sin(q.y * 15.0 + w * 2.6);
      vec3 deep = vec3(0.06, 0.18, 0.52);
      vec3 mid = vec3(0.17, 0.46, 0.80);
      vec3 pale = vec3(0.62, 0.88, 0.97);
      albedo = mix(deep, mid, bands);
      albedo = mix(albedo, pale, smoothstep(0.55, 1.0, bands) * 0.5 + 0.12 * fbm(q * vec3(3.0, 14.0, 3.0)));
      float lon = atan(q.x, q.z);
      float lt = asin(clamp(q.y, -1.0, 1.0));
      vec2 d = vec2((lon - 0.9) * 0.9, (lt + 0.35) * 1.9);
      albedo = mix(albedo, vec3(0.04, 0.12, 0.34), exp(-dot(d, d) * 9.0) * 0.8);
      h = bands * 0.10;
    }
    vec2 gH = vec2(dFdx(h), dFdy(h)) / px;
    float bumpK = (uKind == 1) ? ((uHasTex > 0.5) ? 0.0 : 0.55) : 0.20;
    float bump = clamp(dot(gH, vec2(-L.x, -L.y)) * bumpK, -0.45, 0.45);
    vec3 c = albedo * (0.04 + lit * (1.0 + bump));
    if (uKind == 3) {
      // kilau matahari di laut + lampu kota di sisi malam
      vec3 Rf = reflect(-L, n);
      c += vec3(1.0, 0.94, 0.82) * pow(max(Rf.z, 0.0), 70.0) * oceanMask * (1.0 - cloudMask) * 0.55;
      float malam = 1.0 - smoothstep(-0.05, 0.22, ndl);
      float kota = landMask * smoothstep(0.64, 0.82, fbm(q * 28.0)) * (1.0 - cloudMask);
      c += vec3(1.0, 0.72, 0.32) * kota * malam * 0.9;
    }
    float fres = pow(1.0 - z, 2.6);
    c += atm * fres * (0.22 + 0.95 * lit) * atmK;
    // bayangan terminator dingin
    c += vec3(0.02, 0.03, 0.06) * (1.0 - lit) * 0.6;
    planetCol = c;
  }

  // --- pendar di luar tepi
  float glow = exp(-(r - 1.0) * 5.2) * smoothstep(0.985, 1.02, r);
  float facing = 0.32 + 0.68 * smoothstep(-0.2, 0.9, dot(normalize(p + 1e-4), normalize(L.xy)));
  vec3 glowCol = atm * glow * facing * (0.42 + 0.50 * uHover) * (uKind == 1 ? 0.0 : 1.0);
  if (uKind == 1) {
    glowCol = vec3(0.70, 0.74, 0.86) * glow * facing * (0.10 + 0.22 * uHover);
  }
  vec4 base = vec4(glowCol, clamp(max(max(glowCol.r, glowCol.g), glowCol.b), 0.0, 1.0));
  vec4 planet = vec4(planetCol * disc, disc);

  // --- cincin (raksasa)
  vec4 ring = vec4(0.0);
  bool ringFront = true;
  if (uKind == 2) {
    float ta = 0.42;
    float sa = sin(ta);
    float ca = cos(ta);
    float zr = -p.y * ca / sa;
    vec3 P = vec3(p, zr);
    float rad = (length(P) - 1.38) / (2.25 - 1.38);
    if (rad > 0.0 && rad < 1.0) {
      float band = 0.45 + 0.55 * noise(vec3(rad * 55.0, 3.0, 1.0));
      band *= 0.7 + 0.3 * noise(vec3(rad * 12.0, 9.0, 4.0));
      float gap = 1.0 - smoothstep(0.0, 0.012, abs(rad - 0.62) - 0.03);
      float a = smoothstep(0.0, 0.05, rad) * (1.0 - smoothstep(0.90, 1.0, rad)) * band * (1.0 - gap * 0.92);
      float b2 = dot(P, L);
      float c2 = dot(P, P) - 1.0;
      float dsc = b2 * b2 - c2;
      float t0 = -b2 - sqrt(max(dsc, 0.0));
      float shadow = (dsc > 0.0 && t0 > 0.0) ? 0.14 : 1.0;
      float ringLit = 0.50 + 0.50 * clamp(abs(dot(vec3(0.0, ca, sa), L)) * 1.3, 0.0, 1.0);
      vec3 rc = mix(vec3(0.60, 0.70, 0.80), vec3(0.90, 0.88, 0.82), band) * ringLit * shadow;
      ring = vec4(rc * a * 0.92, a * 0.92);
    }
    ringFront = (r >= 1.0) || (zr > zs);
  }

  vec4 o;
  if (ringFront) {
    vec4 pl = planet + base * (1.0 - planet.a);
    o = ring + pl * (1.0 - ring.a);
  } else {
    vec4 rg = ring + base * (1.0 - ring.a);
    o = planet + rg * (1.0 - planet.a);
  }
  o.rgb += (hash(vec3(gl_FragCoord.xy, 3.0)) - 0.5) / 255.0 * o.a;
  outColor = vec4(o.rgb, clamp(o.a, 0.0, 1.0));
}`;

const UNIFORMS = ["uRes", "uAngle", "uHover", "uMouse", "uKind", "uRadius", "uTex", "uHasTex", "uGain"] as const;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

function link(gl: WebGL2RenderingContext) {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, "aPosition");
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  gl.deleteProgram(program);
  return null;
}

export function PlanetCanvas({ jenis, className = "" }: { jenis: JenisPlanet; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cfg = KONFIG[jenis];

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const host = canvas?.closest<HTMLElement>("a, button") ?? wrap;
    const gl = canvas?.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!wrap || !canvas || !host || !gl) return undefined;
    const program = link(gl);
    if (!program) return undefined;
    const u: Record<string, WebGLUniformLocation | null> = {};
    for (const name of UNIFORMS) u[name] = gl.getUniformLocation(program, name);
    const buffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    const hemat = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const st = { angle: cfg.sudut0, hover: 0, hoverTarget: 0, mx: 0, my: 0, mxT: 0, myT: 0, tekstur: 0, tekGagal: false };
    const perluTekstur = !!cfg.tekstur;
    let tex: WebGLTexture | null = null;
    let sudahMuat = false;
    let raf = 0;
    let last = 0;
    let visible = true;

    const draw = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      // Planet bertekstur: tunggu teksturnya (atau kegagalannya) supaya tidak ada kedipan bentuk prosedural.
      if (perluTekstur && !st.tekstur && !st.tekGagal) return;
      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(u.uTex, 0);
      gl.uniform1f(u.uHasTex, st.tekstur);
      gl.uniform1f(u.uGain, cfg.gain ?? 1);
      gl.uniform2f(u.uRes, canvas.width, canvas.height);
      gl.uniform1f(u.uAngle, st.angle);
      gl.uniform1f(u.uHover, st.hover);
      gl.uniform2f(u.uMouse, st.mx, st.my);
      gl.uniform1i(u.uKind, cfg.kind);
      gl.uniform1f(u.uRadius, cfg.radius);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      // ~30 bingkai/dtk: cukup mulus untuk rotasi pelan dan menghemat GPU (tiga planet sekaligus).
      if (last && now - last < 32) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 30;
      last = now;
      st.hover += (st.hoverTarget - st.hover) * (1 - Math.exp(-dt * 6));
      st.mx += (st.mxT - st.mx) * (1 - Math.exp(-dt * 8));
      st.my += (st.myT - st.my) * (1 - Math.exp(-dt * 8));
      st.angle += dt * cfg.kecepatan * (1 + 3 * st.hover);
      draw();
      raf = requestAnimationFrame(frame);
    };

    // Muat tekstur sekali, saat planet pertama kali terlihat (hemat unduhan bila di bawah lipatan).
    const muatTekstur = () => {
      if (!cfg.tekstur || sudahMuat) return;
      sudahMuat = true;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        st.tekstur = 1;
        draw();
        wrap.dataset.gl = "1";
      };
      img.onerror = () => {
        st.tekGagal = true;
        draw();
        wrap.dataset.gl = "1";
      };
      img.src = cfg.tekstur;
    };

    const mulai = () => {
      if (hemat || raf || !visible) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    const ukur = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const sisi = Math.max(2, Math.round(rect.width * ratio));
      canvas.width = sisi;
      canvas.height = sisi;
      draw();
      if (!perluTekstur) wrap.dataset.gl = "1";
    };

    const masuk = () => {
      if (!hemat) st.hoverTarget = 1;
    };
    const keluar = () => {
      st.hoverTarget = 0;
      st.mxT = 0;
      st.myT = 0;
    };
    const gerak = (e: PointerEvent) => {
      if (hemat) return;
      const rect = canvas.getBoundingClientRect();
      st.mxT = clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      st.myT = clamp(1 - ((e.clientY - rect.top) / rect.height) * 2, -1, 1);
    };

    const ro = new ResizeObserver(ukur);
    ro.observe(canvas);
    const io = new IntersectionObserver((entri) => {
      visible = entri.some((e) => e.isIntersecting);
      if (visible) {
        muatTekstur();
        mulai();
      }
    });
    io.observe(canvas);
    host.addEventListener("pointerenter", masuk);
    host.addEventListener("pointerleave", keluar);
    host.addEventListener("pointermove", gerak);
    host.addEventListener("focusin", masuk);
    host.addEventListener("focusout", keluar);
    ukur();
    mulai();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointerenter", masuk);
      host.removeEventListener("pointerleave", keluar);
      host.removeEventListener("pointermove", gerak);
      host.removeEventListener("focusin", masuk);
      host.removeEventListener("focusout", keluar);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      if (tex) gl.deleteTexture(tex);
    };
  }, [cfg]);

  return (
    <div ref={wrapRef} aria-hidden="true" className={`group/planet relative aspect-square w-full [&[data-gl]_.planet-cadangan]:opacity-0 ${className}`}>
      {/* Cadangan/placeholder: bola gradasi (SSR, sebelum WebGL siap, atau tanpa WebGL2). */}
      <span
        className="planet-cadangan absolute left-1/2 top-1/2 block aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-500"
        style={{ width: `${cfg.radius * 100}%`, background: cfg.gradasi }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 block size-full" />
    </div>
  );
}
