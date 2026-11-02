<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import HomeShot from './HomeShot.vue'

const command = 'npm i -g chatluna'
const copied = ref(false)
let reset: ReturnType<typeof setTimeout> | undefined

async function copy() {
  await navigator.clipboard.writeText(command)
  copied.value = true
  clearTimeout(reset)
  reset = setTimeout(() => (copied.value = false), 1800)
}

const hero = useTemplateRef<HTMLElement>('hero')
const sky = useTemplateRef<HTMLCanvasElement>('sky')
const actions = useTemplateRef<HTMLElement>('actions')
const shot = useTemplateRef<HTMLElement>('shot')

// The moon is the logo's halftone crescent at the scale of the sky: dot size is brightness.
const palettes = {
  light: { dot: 'rgb(96 75 160 / 52%)', halo: 'rgb(118 101 171 / 30%)', body: 'rgb(255 255 255 / 45%)' },
  dark: { dot: 'rgb(204 194 255 / 62%)', halo: 'rgb(118 101 171 / 55%)', body: 'rgb(10 11 30 / 62%)' },
}

// Maria on the visible cap, as longitude and latitude in radians.
const maria = [
  { lon: -1.1, lat: -0.62, size: 0.12, depth: 0.55 },
  { lon: -0.45, lat: -0.88, size: 0.09, depth: 0.5 },
  { lon: 0.2, lat: -0.7, size: 0.15, depth: 0.45 },
  { lon: 0.85, lat: -0.95, size: 0.08, depth: 0.6 },
  { lon: 1.4, lat: -0.55, size: 0.13, depth: 0.5 },
  { lon: 2.3, lat: -0.8, size: 0.11, depth: 0.55 },
  { lon: 3.1, lat: -0.6, size: 0.14, depth: 0.45 },
  { lon: -2.2, lat: -0.9, size: 0.1, depth: 0.5 },
  { lon: -2.9, lat: -0.5, size: 0.12, depth: 0.55 },
]

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const listeners = new AbortController()
let frame = 0
let scrolling = 0

onMounted(() => {
  const area = hero.value!
  const board = sky.value!
  const context = board.getContext('2d')!
  const root = document.documentElement
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches
  const pointer = { x: -1e4, y: -1e4 }
  let palette = palettes.light
  let width = 0
  let height = 0
  let limb = 0
  let end = 1
  let rise = 0
  let visible = true
  let last = 0

  // Offsets rather than client rects, so the entrance animation does not skew the layout.
  function measure() {
    const ratio = Math.min(devicePixelRatio, 2)
    width = board.clientWidth
    height = board.clientHeight
    board.width = Math.round(width * ratio)
    board.height = Math.round(height * ratio)
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    limb = actions.value!.offsetTop + actions.value!.offsetHeight + 44
    end = Math.max(1, area.getBoundingClientRect().top + scrollY + shot.value!.offsetTop - innerHeight * 0.12)
    palette = root.classList.contains('dark') ? palettes.dark : palettes.light
  }

  function paint(time: number) {
    const gap = width < 768 ? 11 : 13
    const largest = gap * 0.46
    const radius = Math.max(width * 0.62, 340)
    const cx = width / 2
    const cy = limb + radius - rise * radius * 0.05
    const spin = time * 0.000015
    const swing = Math.sin(time / 9000) * 0.4
    const norm = Math.hypot(swing, 0.8, 0.45)
    const lx = swing / norm
    const ly = -0.8 / norm
    const lz = 0.45 / norm
    const spots = maria
      .map(mare => ({ x: Math.sin(mare.lon + spin) * Math.cos(mare.lat), y: Math.sin(mare.lat), spread: mare.size ** 2, depth: mare.depth * Math.max(0, Math.cos(mare.lon + spin)) }))
      .filter(spot => spot.depth > 0.01)

    context.clearRect(0, 0, width, height)
    const halo = context.createRadialGradient(cx, cy, radius * 0.96, cx, cy, radius * 1.4)
    halo.addColorStop(0, palette.halo)
    halo.addColorStop(1, 'transparent')
    context.fillStyle = halo
    context.fillRect(0, 0, width, height)
    context.fillStyle = palette.body
    context.beginPath()
    context.arc(cx, cy, radius, 0, Math.PI * 2)
    context.fill()

    context.fillStyle = palette.dot
    context.beginPath()
    for (let y = gap / 2; y < height; y += gap) {
      for (let x = (width % gap) / 2; x < width; x += gap) {
        const dx = (x - cx) / radius
        const dy = (y - cy) / radius
        const d2 = dx * dx + dy * dy
        let value: number
        if (d2 < 1) {
          const nz = Math.sqrt(1 - d2)
          const light = Math.max(0, dx * lx + dy * ly + nz * lz)
          const shade = spots.reduce((sum, spot) => sum + spot.depth * Math.exp(-((dx - spot.x) ** 2 + (dy - spot.y) ** 2) / spot.spread), 0)
          value = 0.08 + light * 0.8 * (1 - Math.min(shade, 0.7)) + (1 - nz) ** 3 * 0.5
        } else {
          value = Math.max(0.5 * Math.exp((1 - Math.sqrt(d2)) * 22), 0.03 + 0.05 * (y / height))
        }
        const near = Math.hypot(x - pointer.x, y - pointer.y)
        if (near < 130) value += (1 - near / 130) ** 2 * 0.55
        const r = largest * Math.sqrt(Math.min(value, 1))
        context.moveTo(x + r, y)
        context.arc(x, y, r, 0, Math.PI * 2)
      }
    }
    context.fill()
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

  function start() {
    if (still) return paint(0)
    frame ||= requestAnimationFrame(tick)
  }

  function scroll() {
    scrolling = 0
    const progress = clamp(scrollY / end)
    rise = progress * progress * (3 - 2 * progress)
    shot.value!.style.setProperty('--rise', rise.toFixed(4))
  }

  const resize = new ResizeObserver(() => {
    measure()
    scroll()
    if (still) paint(0)
  })
  resize.observe(area)
  const view = new IntersectionObserver((entries) => {
    visible = entries.some(entry => entry.isIntersecting)
    if (visible) start()
  })
  view.observe(area)
  const theme = new MutationObserver(() => {
    palette = root.classList.contains('dark') ? palettes.dark : palettes.light
    if (still) paint(0)
  })
  theme.observe(root, { attributes: true, attributeFilter: ['class'] })
  listeners.signal.addEventListener('abort', () => {
    resize.disconnect()
    view.disconnect()
    theme.disconnect()
  })

  if (still) return
  addEventListener('scroll', () => {
    scrolling ||= requestAnimationFrame(scroll)
  }, { passive: true, signal: listeners.signal })
  area.addEventListener('pointermove', (event) => {
    const box = board.getBoundingClientRect()
    pointer.x = event.clientX - box.left
    pointer.y = event.clientY - box.top
  }, { passive: true, signal: listeners.signal })
  area.addEventListener('pointerleave', () => {
    pointer.x = -1e4
    pointer.y = -1e4
  }, { signal: listeners.signal })
})

onBeforeUnmount(() => {
  listeners.abort()
  cancelAnimationFrame(frame)
  cancelAnimationFrame(scrolling)
})
</script>

<template>
  <section ref="hero" class="hero" aria-labelledby="hero-title">
    <div class="hero-sky" aria-hidden="true">
      <canvas ref="sky" class="hero-canvas" />
    </div>

    <div class="hero-copy">
      <img class="hero-icon" src="/logo.png" alt="" width="88" height="88">
      <h1 id="hero-title" class="hero-title">
        <span>可组合的 <span class="hero-nowrap"><span lang="en">Agent Harness</span>，</span></span>
        <span>接入任何聊天平台。</span>
      </h1>
      <p class="hero-tagline" lang="en">A composable agent harness for any chat platform.</p>
      <div ref="actions" class="hero-actions">
        <a class="hero-start" href="/manual/quickstart.html">快速开始</a>
        <button class="hero-command" type="button" aria-label="复制安装命令" @click="copy">
          <span class="hero-dollar" aria-hidden="true">$</span>
          <code>{{ command }}</code>
          <span class="hero-copy-icon" :class="copied ? 'i-ic-round-check' : 'i-ic-round-content-copy'" aria-hidden="true" />
        </button>
        <span class="visually-hidden" aria-live="polite">{{ copied ? '已复制安装命令' : '' }}</span>
      </div>
    </div>

    <div ref="shot" class="hero-shot">
      <HomeShot class="hero-window" page="trace" path="/traces" alt="ChatLuna 控制台的轨迹页：一段群聊里每次回复调用的工具、token 用量与耗时" eager />
    </div>
  </section>
</template>

<style scoped>
.hero {
  --hero-width: min(1200px, 100vw - 48px);
  position: relative;
  isolation: isolate;
  margin-top: calc(var(--vp-nav-height) * -1);
  padding: calc(var(--vp-nav-height) + clamp(48px, 9vh, 104px)) 24px 0;
}

/* The sky ends behind the middle of the console window and fades into the page. */
.hero-sky {
  position: absolute;
  inset: 0 0 calc(var(--hero-width) * 0.3 + 20px);
  z-index: -1;
  background:
    radial-gradient(48% 42% at 0% 6%, rgb(125 143 232 / 34%), transparent 72%),
    radial-gradient(46% 40% at 100% 0%, rgb(169 159 240 / 38%), transparent 72%),
    linear-gradient(180deg, #f5f4ff, #ecebfe 55%, #e3e1fb);
  -webkit-mask-image: linear-gradient(180deg, #000 calc(100% - 180px), transparent);
  mask-image: linear-gradient(180deg, #000 calc(100% - 180px), transparent);
}

.dark .hero-sky {
  background:
    radial-gradient(48% 42% at 0% 6%, rgb(52 66 140 / 50%), transparent 72%),
    radial-gradient(46% 40% at 100% 0%, rgb(96 80 168 / 42%), transparent 72%),
    linear-gradient(180deg, #0c0d22, #13153a 55%, #1b1e48);
}

.hero-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.hero-copy {
  display: grid;
  justify-items: center;
  text-align: center;
}

.hero-icon {
  width: 88px;
  height: 88px;
  margin-bottom: 32px;
  filter: drop-shadow(0 14px 30px rgb(96 75 155 / 38%));
}

.hero-title {
  margin: 0;
  font-size: clamp(38px, 5.4vw, 78px);
  font-weight: 600;
  line-height: 1.16;
  letter-spacing: -0.01em;
  color: #1b1a33;
}

.dark .hero-title {
  color: #f3f2ff;
}

.hero-title > span {
  display: block;
}

.hero-nowrap {
  white-space: nowrap;
}

.hero-tagline {
  margin: 22px 0 0;
  font-size: clamp(16px, 1.5vw, 20px);
  line-height: 1.5;
  color: rgb(27 26 51 / 62%);
}

.dark .hero-tagline {
  color: rgb(236 235 255 / 62%);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 36px;
}

.hero-start {
  display: inline-flex;
  align-items: center;
  height: 48px;
  padding: 0 28px;
  border-radius: 999px;
  background: #1b1a33;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s;
}

.hero-start:hover {
  background: #4f3f8f;
}

.dark .hero-start {
  background: #f3f2ff;
  color: #1b1a33;
}

.dark .hero-start:hover {
  background: #fff;
}

.hero-command {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 18px 0 22px;
  border: 1px solid rgb(27 26 51 / 10%);
  border-radius: 999px;
  background: rgb(255 255 255 / 62%);
  color: #1b1a33;
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  cursor: pointer;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  transition: background-color 0.2s, border-color 0.2s;
}

.hero-command:hover {
  border-color: rgb(27 26 51 / 18%);
  background: rgb(255 255 255 / 85%);
}

.dark .hero-command {
  border-color: rgb(255 255 255 / 16%);
  background: rgb(255 255 255 / 8%);
  color: #ecebff;
}

.dark .hero-command:hover {
  border-color: rgb(255 255 255 / 28%);
  background: rgb(255 255 255 / 13%);
}

.hero-command code {
  font: inherit;
}

.hero-dollar {
  opacity: 0.45;
}

.hero-copy-icon {
  min-width: 0;
  width: 16px;
  height: 16px;
  opacity: 0.6;
}

.hero-start:focus-visible,
.hero-command:focus-visible {
  outline: 2px solid #6b58b5;
  outline-offset: 3px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/* The console leans back on the moon's horizon and stands up as the page scrolls. */
.hero-shot {
  width: var(--hero-width);
  margin: clamp(120px, 18vh, 200px) auto 0;
  perspective: 1400px;
}

.hero-window {
  --app-bar-height: 44px;
  --app-radius: 16px;
  transform: rotateX(calc((1 - var(--rise, 0)) * 24deg)) scale(calc(0.92 + var(--rise, 0) * 0.08));
  will-change: transform;
}

.hero-window.app-window {
  box-shadow:
    0 0 0 0.5px rgb(27 26 51 / 14%),
    0 50px 120px -30px rgb(60 48 120 / 45%);
}

.dark .hero-window.app-window {
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 10%),
    0 50px 120px -30px rgb(0 0 0 / 75%);
}

@media (prefers-reduced-motion: no-preference) {
  .hero-copy > * {
    animation: hero-in 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
  }

  .hero-title {
    animation-delay: 0.08s;
  }

  .hero-tagline {
    animation-delay: 0.16s;
  }

  .hero-actions {
    animation-delay: 0.24s;
  }

  .hero-shot {
    animation: hero-in 1.2s 0.3s cubic-bezier(0.2, 0.7, 0.2, 1) backwards;
  }
}

@keyframes hero-in {
  from {
    opacity: 0;
    translate: 0 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-window {
    transform: none;
  }
}

@media (max-width: 767px) {
  .hero {
    --hero-width: calc(100vw - 32px);
    padding-right: 16px;
    padding-left: 16px;
  }

  .hero-icon {
    width: 72px;
    height: 72px;
    margin-bottom: 24px;
  }

  .hero-shot {
    margin-top: 88px;
  }

  .hero-window {
    --app-bar-height: 30px;
    --app-radius: 10px;
    transform: rotateX(calc((1 - var(--rise, 0)) * 16deg)) scale(calc(0.94 + var(--rise, 0) * 0.06));
  }
}
</style>
