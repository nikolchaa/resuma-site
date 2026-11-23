import { useTheme } from "@/context/themeProvider";
import { useEffect, useRef } from "preact/hooks";

/*
 * Animated fog behind the hero, drawn with raw WebGL instead of three.js +
 * Vanta (which added ~600 kB of JavaScript for one full-screen shader).
 *
 * The fragment shader is Vanta.js's FOG effect, unchanged apart from the
 * unused mouse uniform. It mirrors Vanta's setup so the look is identical:
 * hex colours are converted to linear values (as THREE.Color does), and the
 * canvas renders at 1/2 resolution (1/4 on touch devices), with iResolution
 * in CSS pixels divided by that scale.
 *
 * Vanta.js - Copyright 2020 Teng Bao - MIT License
 * https://github.com/tengbao/vanta/blob/master/LICENSE
 * Original effect by Patricio Gonzalez Vivo, https://thebookofshaders.com/13/
 */

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 iResolution;
uniform float iTime;

uniform float blurFactor;
uniform vec3 baseColor;
uniform vec3 lowlightColor;
uniform vec3 midtoneColor;
uniform vec3 highlightColor;
uniform float zoom;

float random (in vec2 _st) {
  return fract(sin(dot(_st.xy, vec2(0.129898,0.78233))) * 437.585453123);
}

float noise (in vec2 _st) {
  vec2 i = floor(_st);
  vec2 f = fract(_st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 6

float fbm (in vec2 _st) {
  float v = 0.0;
  float a = blurFactor;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
  for (int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * noise(_st);
    _st = rot * _st * 2.0 + shift;
    a *= (1. - blurFactor);
  }
  return v;
}

void main() {
  vec2 st = gl_FragCoord.xy / iResolution.xy*3.;
  st.x *= 0.7 * iResolution.x / iResolution.y;
  st *= zoom;

  vec3 color = vec3(0.0);

  vec2 q = vec2(0.);
  q.x = fbm( st + 0.00*iTime);
  q.y = fbm( st + vec2(1.0));

  vec2 dir = vec2(0.15,0.126);
  vec2 r = vec2(0.);
  r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ dir.x*iTime );
  r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ dir.y*iTime);

  float f = fbm(st+r);

  color = mix(baseColor, lowlightColor, clamp((f*f)*4.0,0.0,1.0));
  color = mix(color, midtoneColor, clamp(length(q),0.0,1.0));
  color = mix(color, highlightColor, clamp(length(r.x),0.0,1.0));

  vec3 finalColor = mix(baseColor, color, f*f*f+.6*f*f+.5*f);
  gl_FragColor = vec4(finalColor,1.0);
}`;

const BRAND = 0x00d9cb;
const BLUR_FACTOR = 0.65;
/** The fog drifts slowly, so 30 fps is indistinguishable from 60 and halves GPU work. */
const FRAME_INTERVAL_MS = 1000 / 30;

/** sRGB hex -> linear RGB, matching THREE.Color with colour management on. */
function hexToLinear(hex: number): [number, number, number] {
  const toLinear = (c: number) =>
    c < 0.04045 ? c * 0.0773993808 : Math.pow(c * 0.9478672986 + 0.0521327014, 2.4);
  return [
    toLinear(((hex >> 16) & 255) / 255),
    toLinear(((hex >> 8) & 255) / 255),
    toLinear((hex & 255) / 255),
  ];
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

type FogRenderer = {
  setDark: (dark: boolean) => void;
  destroy: () => void;
};

function createFog(canvas: HTMLCanvasElement, dark: boolean): FogRenderer | null {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  // One triangle that covers the whole viewport.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const uResolution = u("iResolution");
  const uTime = u("iTime");
  const uBase = u("baseColor");
  const uLowlight = u("lowlightColor");

  gl.uniform1f(u("blurFactor"), BLUR_FACTOR);
  gl.uniform1f(u("zoom"), 1);
  gl.uniform3fv(u("midtoneColor"), hexToLinear(BRAND));
  gl.uniform3fv(u("highlightColor"), hexToLinear(BRAND));

  const applyTheme = (isDark: boolean) => {
    const base = hexToLinear(isDark ? 0x000000 : 0xffffff);
    gl.uniform3fv(uBase, base);
    gl.uniform3fv(uLowlight, base);
  };
  applyTheme(dark);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scale = window.matchMedia("(pointer: coarse)").matches ? 4 : 2;

  let width = 0;
  let height = 0;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor((rect.width * dpr) / scale));
    height = Math.max(1, Math.floor((rect.height * dpr) / scale));
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.uniform2f(uResolution, rect.width / scale, rect.height / scale);
  };

  const start = performance.now();
  let raf = 0;
  let last = 0;
  let visible = true;
  let firstFrame = true;

  const draw = (now: number) => {
    gl.uniform1f(uTime, (now - start) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (firstFrame) {
      firstFrame = false;
      canvas.style.opacity = "1";
    }
  };

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (now - last < FRAME_INTERVAL_MS) return;
    last = now;
    draw(now);
  };

  const play = () => {
    if (reducedMotion) {
      draw(start);
      return;
    }
    if (!raf && visible) raf = requestAnimationFrame(loop);
  };
  const pause = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (reducedMotion || !raf) draw(performance.now());
  });
  resizeObserver.observe(canvas);

  // Stop rendering while the hero is scrolled out of view.
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) play();
    else pause();
  });
  visibilityObserver.observe(canvas);

  const onContextLost = (event: Event) => {
    event.preventDefault();
    pause();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  resize();
  play();

  return {
    setDark(isDark) {
      applyTheme(isDark);
      if (reducedMotion || !raf) draw(performance.now());
    },
    destroy() {
      pause();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

export function FogBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fogRef = useRef<FogRenderer | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Start after the first paint so the fog never competes with the hero text.
    let fog: FogRenderer | null = null;
    const id = requestAnimationFrame(() => {
      try {
        fog = createFog(canvas, document.documentElement.classList.contains("dark"));
      } catch {
        fog = null;
      }
      fogRef.current = fog;
    });

    return () => {
      cancelAnimationFrame(id);
      fog?.destroy();
      fogRef.current = null;
    };
  }, []);

  useEffect(() => {
    fogRef.current?.setDark(isDark);
  }, [isDark]);

  return (
    <div
      className='absolute inset-0 pointer-events-none bg-background -z-20'
      aria-hidden='true'
    >
      <canvas
        ref={canvasRef}
        className='absolute inset-0 bottom-1 -z-10 h-[calc(100%-0.25rem)] w-full opacity-0 transition-opacity duration-700'
      />
      <div className='absolute inset-0 -z-10 bg-gradient-to-t from-white to-white/0 dark:from-black dark:to-black/0' />
    </div>
  );
}
