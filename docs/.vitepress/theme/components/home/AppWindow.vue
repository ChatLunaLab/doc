<script setup lang="ts">
defineProps<{ title?: string, url?: string }>()
</script>

<template>
  <div class="app-window">
    <div class="app-bar">
      <span class="app-lights" aria-hidden="true"><span /><span /><span /></span>
      <span v-if="url" class="app-url">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm0 1.2c.7 0 1.6 1.5 1.9 4.1H6.1C6.4 4.2 7.3 2.7 8 2.7ZM2.8 8.8h2.1c.1 1.6.4 3 1 4A5.3 5.3 0 0 1 2.8 8.8Zm0-1.6a5.3 5.3 0 0 1 3.1-4c-.6 1-.9 2.4-1 4H2.8Zm5.2 6.1c-.7 0-1.6-1.5-1.9-4.5h3.8c-.3 3-1.2 4.5-1.9 4.5Zm2.1-.5c.6-1 .9-2.4 1-4h2.1a5.3 5.3 0 0 1-3.1 4Zm1-5.6c-.1-1.6-.4-3-1-4a5.3 5.3 0 0 1 3.1 4h-2.1Z" /></svg>
        {{ url }}
      </span>
      <span v-else class="app-title">{{ title }}</span>
    </div>
    <div class="app-body"><slot /></div>
  </div>
</template>

<style scoped>
.app-window {
  --app-bar: var(--app-bar-height, 40px);
  overflow: hidden;
  border-radius: var(--app-radius, 14px);
  background: #fff;
  box-shadow:
    0 0 0 0.5px rgb(0 0 0 / 16%),
    0 2px 6px rgb(16 18 40 / 8%),
    0 30px 80px -24px rgb(16 18 40 / 34%);
}

.dark .app-window {
  background: #1f2027;
  box-shadow:
    0 0 0 0.5px rgb(255 255 255 / 12%),
    0 30px 80px -24px rgb(0 0 0 / 70%);
}

.app-bar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  height: var(--app-bar);
  padding: 0 calc(var(--app-bar) * 0.4);
  border-bottom: 0.5px solid rgb(0 0 0 / 8%);
  background: #f5f5f7;
}

.dark .app-bar {
  border-bottom-color: rgb(0 0 0 / 50%);
  background: #2a2b33;
}

.app-lights {
  display: flex;
  gap: calc(var(--app-bar) * 0.2);
}

.app-lights > span {
  width: calc(var(--app-bar) * 0.3);
  height: calc(var(--app-bar) * 0.3);
  border-radius: 50%;
  background: #ff5f57;
  box-shadow: inset 0 0 0 0.5px rgb(0 0 0 / 12%);
}

.app-lights > span:nth-child(2) {
  background: #febc2e;
}

.app-lights > span:nth-child(3) {
  background: #28c840;
}

.app-title {
  font-family: var(--vp-font-family-mono);
  font-size: calc(var(--app-bar) * 0.32);
  color: rgb(0 0 0 / 55%);
}

.dark .app-title {
  color: rgb(255 255 255 / 55%);
}

.app-url {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45em;
  min-width: min(22em, 46vw);
  height: calc(var(--app-bar) * 0.62);
  padding: 0 1em;
  border-radius: 0.6em;
  background: rgb(0 0 0 / 5%);
  font-size: calc(var(--app-bar) * 0.32);
  color: rgb(0 0 0 / 58%);
}

.dark .app-url {
  background: rgb(255 255 255 / 8%);
  color: rgb(255 255 255 / 60%);
}

.app-url svg {
  width: 1.05em;
  height: 1.05em;
  fill: currentColor;
  opacity: 0.7;
}
</style>
