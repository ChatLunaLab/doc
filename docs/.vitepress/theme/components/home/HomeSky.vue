<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

// A calm color first, then five blobs that drift through the canvas, each keeping its own hue.
// `calm` fades the middle of the hero toward the calm color so the headline stays legible.
const palettes = {
  sky: {
    calm: 0.5,
    light: ['#f6f6ff', '#7f93ff', '#a88bff', '#93c4ff', '#d9cfff', '#fbfbff'],
    dark: ['#0b0d1f', '#2a3a9a', '#5532a8', '#1f4f9c', '#171a45', '#0d1030'],
  },
  panel: {
    calm: 0,
    light: ['#e4e6fb', '#6676ee', '#9375f0', '#7fb3ff', '#c3b6fb', '#eef0ff'],
    dark: ['#121530', '#3446b0', '#6040c0', '#2a5cb5', '#1c2058', '#101233'],
  },
}

const props = defineProps<{ tone?: 'sky' | 'panel' }>()

// A mesh gradient: five color points orbit slowly and blend by inverse distance, and two layers of
// simplex noise warp the coordinates so their borders swirl like liquid. The pointer drags a wake
// through it, and scrolling stirs the warp harder.
const fragment = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uSize;
uniform float uTime;
uniform float uStir;
uniform float uCalm;
uniform vec4 uPointer;
uniform vec3 uColors[6];

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float noise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g = vec3(a0.x * x0.x + h.x * x0.y, a0.yz * x12.xz + h.yz * x12.yw);
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  float aspect = uSize.x / uSize.y;
  vec2 p = (uv * 2.0 - 1.0) * vec2(aspect, 1.0);
  vec2 d = p - uPointer.xy;
  float fall = exp(-dot(d, d) * 3.0);
  p -= uPointer.zw * fall;
  p += vec2(-d.y, d.x) * fall * length(uPointer.zw) * 1.5;
  float t = uTime;
  float flow = 0.45 + uStir * 0.3;
  vec2 q = p + flow * vec2(noise(p * 0.9 + vec2(0.0, t * 0.35)), noise(p * 0.9 + vec2(5.2, -t * 0.3)));
  vec2 r = p + flow * vec2(noise(q * 1.3 + vec2(1.7, 9.2) + t * 0.2), noise(q * 1.3 + vec2(8.3, 2.8) - t * 0.25));
  vec3 color = vec3(0.0);
  float total = 0.0;
  for (int i = 1; i < 6; i++) {
    float f = float(i);
    vec2 center = vec2(sin(t * (0.21 + f * 0.05) + f * 1.7) * aspect * 0.8, cos(t * (0.17 + f * 0.04) + f * 2.3) * 0.75);
    float w = 1.0 / pow(distance(r, center) + 0.05, 3.0);
    color += uColors[i] * w;
    total += w;
  }
  color /= total;
  vec2 off = vec2((uv.x - 0.5) * aspect, uv.y - 0.6);
  float calm = exp(-(off.x * off.x * 1.6 + off.y * off.y * 9.0));
  color = mix(color, uColors[0], calm * uCalm);
  color += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.02;
  gl_FragColor = vec4(color, 1.0);
}
`

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const ready = ref(false)
const listeners = new AbortController()
let frame = 0

onMounted(() => {
  const board = canvas.value!
  const gl = board.getContext('webgl', { antialias: false, depth: false, stencil: false })
  if (!gl) return
  const root = document.documentElement
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches
  const pointer = { x: 0, y: 0, vx: 0, vy: 0, inside: false }
  // Each instance starts at its own point in the flow, so panels never match.
  const offset = Math.random() * 1e5
  let phase = 0
  let stir = 0
  let before = 0
  let visible = true
  let last = 0

  const program = gl.createProgram()!
  const attach = (type: number, source: string) => {
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    gl.attachShader(program, shader)
  }
  attach(gl.VERTEX_SHADER, 'attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }')
  attach(gl.FRAGMENT_SHADER, fragment)
  gl.linkProgram(program)
  gl.useProgram(program)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  const size = gl.getUniformLocation(program, 'uSize')
  const clock = gl.getUniformLocation(program, 'uTime')
  const stirring = gl.getUniformLocation(program, 'uStir')
  const touch = gl.getUniformLocation(program, 'uPointer')
  const colors = gl.getUniformLocation(program, 'uColors')
  gl.uniform1f(gl.getUniformLocation(program, 'uCalm'), palettes[props.tone ?? 'sky'].calm)

  // Half resolution: the gradient is soft, so the GPU cost drops by 4x without visible loss.
  function fit() {
    const scale = Math.min(devicePixelRatio, 2) * 0.5
    board.width = Math.round(board.clientWidth * scale)
    board.height = Math.round(board.clientHeight * scale)
    gl.viewport(0, 0, board.width, board.height)
    gl.uniform2f(size, board.width, board.height)
  }

  function theme() {
    const tone = palettes[props.tone ?? 'sky']
    const palette = root.classList.contains('dark') ? tone.dark : tone.light
    gl.uniform3fv(colors, palette.flatMap(hex => [1, 3, 5].map(i => Number.parseInt(hex.slice(i, i + 2), 16) / 255)))
  }

  // Stirred water runs faster, then both the stir and the pointer's wake settle.
  function paint(time: number) {
    phase += Math.min(time - before, 100) * (1 + stir * 4)
    before = time
    stir *= 0.92
    pointer.vx *= 0.9
    pointer.vy *= 0.9
    gl.uniform1f(clock, (phase + offset) * 0.0004)
    gl.uniform1f(stirring, stir)
    gl.uniform4f(touch, pointer.x, pointer.y, pointer.vx, pointer.vy)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    ready.value = true
  }

  function tick(time: number) {
    frame = 0
    if (!visible) return
    if (time - last > 32) {
      last = time
      paint(time)
    }
    frame = requestAnimationFrame(tick)
  }

  const resize = new ResizeObserver(() => {
    fit()
    if (still) paint(0)
  })
  resize.observe(board)
  const view = new IntersectionObserver((entries) => {
    visible = entries.some(entry => entry.isIntersecting)
    if (visible && !still) frame ||= requestAnimationFrame(tick)
  })
  view.observe(board)
  const scheme = new MutationObserver(() => {
    theme()
    if (still) paint(0)
  })
  scheme.observe(root, { attributes: true, attributeFilter: ['class'] })
  listeners.signal.addEventListener('abort', () => {
    resize.disconnect()
    view.disconnect()
    scheme.disconnect()
  })
  theme()

  if (still) return
  const cap = (value: number) => Math.max(-0.6, Math.min(0.6, value))
  // The canvas sits behind the hero copy, so it follows the pointer from the window.
  addEventListener('pointermove', (event) => {
    const box = board.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width
    const y = (event.clientY - box.top) / box.height
    if (x < 0 || x > 1 || y < 0 || y > 1) {
      pointer.inside = false
      return
    }
    const tx = (x * 2 - 1) * (box.width / box.height)
    const ty = 1 - y * 2
    if (pointer.inside) {
      pointer.vx = cap(pointer.vx + (tx - pointer.x) * 0.6)
      pointer.vy = cap(pointer.vy + (ty - pointer.y) * 0.6)
    }
    pointer.inside = true
    pointer.x = tx
    pointer.y = ty
  }, { passive: true, signal: listeners.signal })
  let scrolled = scrollY
  addEventListener('scroll', () => {
    stir = Math.min(2, stir + Math.abs(scrollY - scrolled) * 0.004)
    scrolled = scrollY
  }, { passive: true, signal: listeners.signal })
})

onBeforeUnmount(() => {
  listeners.abort()
  cancelAnimationFrame(frame)
})
</script>

<template>
  <canvas ref="canvas" class="sky" :class="{ 'is-ready': ready }" aria-hidden="true" />
</template>

<style scoped>
.sky {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.8s;
}

.sky.is-ready {
  opacity: 1;
}
</style>
