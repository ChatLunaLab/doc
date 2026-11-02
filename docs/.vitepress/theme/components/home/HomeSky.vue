<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

// The base color first, then the four colors that flow over it, all within the logo's navy-to-violet range
// so neighbouring hues never mix into grey. Panels are deeper than the hero sky.
const palettes = {
  sky: {
    light: ['#f7f7fe', '#dfe3fb', '#e7e2f8', '#d3dcfb', '#c6c0f1'],
    dark: ['#0b0d1f', '#1c2352', '#272258', '#18295c', '#363083'],
  },
  panel: {
    light: ['#dadcf8', '#9ca8ef', '#c2bdf1', '#b2c2f7', '#8d86e0'],
    dark: ['#141836', '#2c3778', '#3a3275', '#24306a', '#4d43a0'],
  },
}

const props = defineProps<{ tone?: 'sky' | 'panel' }>()

// Layered sine warps give the liquid flow; the warped coordinates then pick the color weights.
// The pointer drags a swirling wake through the water, and scrolling stirs it into larger waves.
const fragment = `
precision mediump float;
uniform vec2 uSize;
uniform float uTime;
uniform float uStir;
uniform vec4 uPointer;
uniform vec3 uColors[5];

void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  vec2 p = (uv * 2.0 - 1.0) * vec2(uSize.x / uSize.y, 1.0) * 1.1;
  vec2 d = p - uPointer.xy;
  float fall = exp(-dot(d, d) * 3.0);
  p -= uPointer.zw * fall;
  p += vec2(-d.y, d.x) * fall * length(uPointer.zw) * 1.5;
  float t = uTime;
  float wave = 0.32 + uStir * 0.22;
  for (float i = 1.0; i < 6.0; i++) {
    p.x += wave / i * sin(i * 1.9 * p.y + t + i * 1.3);
    p.y += wave * 0.88 / i * cos(i * 1.6 * p.x + t * 0.8 + i * 0.7);
  }
  float a = 0.5 + 0.5 * sin(p.x * 1.2 + t * 0.6);
  float b = 0.5 + 0.5 * cos(p.y * 1.4 - t * 0.5);
  float c = 0.5 + 0.5 * sin((p.x + p.y) * 0.9 + t * 0.9);
  vec3 color = uColors[0];
  color = mix(color, uColors[1], smoothstep(0.15, 0.95, a) * 0.9);
  color = mix(color, uColors[2], smoothstep(0.3, 1.0, b) * 0.8);
  color = mix(color, uColors[3], smoothstep(0.45, 1.0, c) * 0.7);
  color = mix(color, uColors[4], smoothstep(0.55, 1.0, a * b) * 0.75);
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
    gl.uniform1f(clock, (phase + offset) * 0.0002)
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
    const tx = (x * 2 - 1) * (box.width / box.height) * 1.1
    const ty = (1 - y * 2) * 1.1
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
