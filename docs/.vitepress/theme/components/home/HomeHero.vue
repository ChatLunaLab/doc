<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import HomeLogo from './HomeLogo.vue'
import HomeShot from './HomeShot.vue'
import HomeSky from './HomeSky.vue'

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
const shot = useTemplateRef<HTMLElement>('shot')

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const listeners = new AbortController()
let scrolling = 0

onMounted(() => {
  const area = hero.value!
  let end = 1

  function scroll() {
    scrolling = 0
    const progress = clamp(scrollY / end)
    shot.value!.style.setProperty('--rise', (progress * progress * (3 - 2 * progress)).toFixed(4))
  }

  // Offsets rather than client rects, so the entrance animation does not skew the layout.
  const resize = new ResizeObserver(() => {
    end = Math.max(1, area.getBoundingClientRect().top + scrollY + shot.value!.offsetTop - innerHeight * 0.12)
    scroll()
  })
  resize.observe(area)
  listeners.signal.addEventListener('abort', () => resize.disconnect())

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  addEventListener('scroll', () => {
    scrolling ||= requestAnimationFrame(scroll)
  }, { passive: true, signal: listeners.signal })
})

onBeforeUnmount(() => {
  listeners.abort()
  cancelAnimationFrame(scrolling)
})
</script>

<template>
  <section ref="hero" class="hero" aria-labelledby="hero-title">
    <div class="hero-sky">
      <HomeSky />
    </div>

    <div class="hero-copy">
      <HomeLogo class="hero-logo" />
      <h1 id="hero-title" class="hero-title">
        <span>可组合的 <span lang="en">Agent Harness</span></span>
        <span class="hero-sub">接入任何聊天平台</span>
      </h1>
      <p class="hero-tagline" lang="en">A composable agent harness for any chat platform.</p>
      <div class="hero-actions">
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
  padding: var(--vp-nav-height) 24px 0;
}

/* The sky ends behind the middle of the console window and fades into the page.
   Its gradient shows until the shader's first frame, and stays when WebGL is unavailable. */
.hero-sky {
  position: absolute;
  inset: 0 0 calc(var(--hero-width) * 0.3 + 20px);
  z-index: -1;
  background:
    radial-gradient(45% 45% at 10% 25%, rgb(127 147 255 / 70%), transparent 72%),
    radial-gradient(40% 40% at 90% 30%, rgb(168 139 255 / 65%), transparent 72%),
    radial-gradient(55% 45% at 50% 95%, rgb(147 196 255 / 70%), transparent 72%),
    #f6f6ff;
  -webkit-mask-image: linear-gradient(180deg, #000 calc(100% - 180px), transparent);
  mask-image: linear-gradient(180deg, #000 calc(100% - 180px), transparent);
}

.dark .hero-sky {
  background:
    radial-gradient(45% 45% at 10% 25%, #2a3a9a, transparent 72%),
    radial-gradient(40% 40% at 90% 30%, #5532a8, transparent 72%),
    radial-gradient(55% 45% at 50% 95%, #1f4f9c, transparent 72%),
    #0b0d1f;
}

/* The first screen is all fluid and copy; only the window's top edge peeks in to invite a scroll. */
.hero-copy {
  display: grid;
  align-content: center;
  justify-items: center;
  min-height: calc(100svh - var(--vp-nav-height) - 56px);
  padding-bottom: 32px;
  text-align: center;
}

.hero-logo {
  margin-bottom: 36px;
  font-size: 28px;
}

.hero-title {
  margin: 0;
  font-size: clamp(34px, 5vw, 68px);
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: #1b1a33;
}

.dark .hero-title {
  color: #f3f2ff;
}

.hero-title > span {
  display: block;
}

/* Latin glyphs sit optically smaller than CJK at the same size. */
.hero-title [lang="en"] {
  font-size: 1.04em;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.hero-sub {
  margin-top: 0.5em;
  font-size: 0.42em;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.08em;
  color: rgb(27 26 51 / 68%);
}

.dark .hero-sub {
  color: rgb(236 235 255 / 70%);
}

.hero-tagline {
  margin: 14px 0 0;
  font-size: clamp(14px, 1.2vw, 16px);
  line-height: 1.5;
  color: rgb(27 26 51 / 50%);
}

.dark .hero-tagline {
  color: rgb(236 235 255 / 50%);
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
  margin: 0 auto;
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

  .hero-logo {
    margin-bottom: 28px;
    font-size: 24px;
  }

  .hero-window {
    --app-bar-height: 30px;
    --app-radius: 10px;
    transform: rotateX(calc((1 - var(--rise, 0)) * 16deg)) scale(calc(0.94 + var(--rise, 0) * 0.06));
  }
}
</style>
