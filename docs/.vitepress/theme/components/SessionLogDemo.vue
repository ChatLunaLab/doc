<script setup lang="ts">
import { nextTick, ref, useId, useTemplateRef } from 'vue'

type View = 'log' | 'request'

const view = ref<View>('log')
const id = useId()
const logTab = useTemplateRef<HTMLButtonElement>('logTab')
const requestTab = useTemplateRef<HTMLButtonElement>('requestTab')

const entries = [
  { n: 0, kind: 'message', label: 'user', text: '帮我整理这次更新的重点。' },
  { n: 1, kind: 'mark', label: 'prompt', text: '记录 system、模型和工具配置' },
  { n: 2, kind: 'message', label: 'assistant', text: '调用 release_search 查找更新记录' },
  { n: 3, kind: 'message', label: 'tool', text: 'release_search 返回 3 条结果' },
  { n: 4, kind: 'message', label: 'assistant', text: '这次更新主要涉及会话、模型与扩展。' },
]

const messages = [
  { role: 'system', text: '你是 ChatLuna。需要更新信息时使用提供的工具。' },
  { role: 'user', text: '帮我整理这次更新的重点。' },
  { role: 'assistant', text: 'tool call: release_search' },
  { role: 'tool', text: '3 条更新记录' },
]

async function navigate(event: KeyboardEvent) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  view.value = event.key === 'Home' ? 'log'
    : event.key === 'End' ? 'request'
      : view.value === 'log' ? 'request' : 'log'
  await nextTick()
  if (view.value === 'log') logTab.value?.focus()
  else requestTab.value?.focus()
}
</script>

<template>
  <section class="session-demo" aria-label="会话日志与请求重建示意">
    <header class="demo-heading">
      <h2>看见回复背后的过程</h2>
      <span>交互示意</span>
    </header>
    <div class="demo-tabs" role="tablist" aria-label="切换会话数据视图" @keydown="navigate">
      <button :id="`${id}-log-tab`" ref="logTab" type="button" role="tab"
        :aria-controls="`${id}-log-panel`" :aria-selected="view === 'log'"
        :tabindex="view === 'log' ? 0 : -1" @click="view = 'log'">会话日志</button>
      <button :id="`${id}-request-tab`" ref="requestTab" type="button" role="tab"
        :aria-controls="`${id}-request-panel`" :aria-selected="view === 'request'"
        :tabindex="view === 'request' ? 0 : -1" @click="view = 'request'">重建请求</button>
    </div>
    <div :id="`${id}-log-panel`" v-show="view === 'log'" class="demo-panel" role="tabpanel"
      :aria-labelledby="`${id}-log-tab`" tabindex="0">
      <div class="log-columns" aria-hidden="true"><span>n</span><span>条目与内容</span></div>
      <ol class="entry-log">
        <li v-for="entry in entries" :key="entry.n" :class="{ 'is-mark': entry.kind === 'mark' }">
          <span class="entry-n">{{ entry.n }}</span>
          <div><div class="entry-meta"><code>{{ entry.kind }}</code><span>{{ entry.label }}</span></div><p>{{ entry.text }}</p></div>
        </li>
      </ol>
      <p class="demo-note">日志按 n 追加。message、mark 和 cut 共同构成会话记录。</p>
    </div>
    <div :id="`${id}-request-panel`" v-show="view === 'request'" class="demo-panel" role="tabpanel"
      :aria-labelledby="`${id}-request-tab`" tabindex="0">
      <p class="request-boundary">在 n = 4 的最终回复之前</p>
      <dl class="request-messages">
        <div v-for="message in messages" :key="message.role"><dt>{{ message.role }}</dt><dd>{{ message.text }}</dd></div>
      </dl>
      <p class="demo-note">结合 n = 0–3 的记录与 prompt 标记重建输入，不调用模型，也不重新执行工具。</p>
    </div>
    <footer class="demo-footnote">内容与工具名仅为示意，不是实时运行数据。</footer>
  </section>
</template>

<style scoped>
.session-demo { width: 100%; max-width: 540px; min-width: 0; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg); color: var(--vp-c-text-1); text-align: left; box-shadow: 0 12px 32px rgb(23 25 28 / 6%); }
.demo-heading { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 16px; padding: 22px 24px 15px; }
.demo-heading h2 { margin: 0; font-size: 19px; line-height: 1.5; font-weight: 650; }
.demo-heading > span { color: var(--vp-c-text-2); font-size: 12px; }
.demo-tabs { display: flex; gap: 24px; padding: 0 24px; border-bottom: 1px solid var(--vp-c-divider); }
.demo-tabs button { position: relative; min-height: 44px; padding: 9px 0; color: var(--vp-c-text-2); font-size: 14px; font-weight: 500; cursor: pointer; }
.demo-tabs button[aria-selected="true"] { color: var(--vp-c-brand-1); }
.demo-tabs button[aria-selected="true"]::after { position: absolute; right: 0; bottom: -1px; left: 0; height: 2px; background: var(--vp-c-brand-1); content: ''; }
.demo-tabs button:focus-visible, .demo-panel:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 4px; border-radius: 2px; }
.demo-panel { min-height: 362px; padding: 18px 24px; overflow-wrap: anywhere; }
.log-columns { display: grid; grid-template-columns: 26px 1fr; gap: 14px; margin-bottom: 8px; color: var(--vp-c-text-2); font-size: 11px; }
.entry-log { margin: 0; padding: 0; list-style: none; }
.entry-log li { display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 14px; padding: 9px 0; }
.entry-n { padding-top: 1px; color: var(--vp-c-text-2); font-family: var(--vp-font-family-mono); font-size: 12px; }
.entry-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; line-height: 1.4; }
.entry-meta code { color: var(--vp-c-text-1); font-family: var(--vp-font-family-mono); font-size: 12px; font-weight: 600; }
.entry-meta > span { color: var(--vp-c-text-2); font-size: 12px; }
.is-mark .entry-meta code, .is-mark .entry-meta > span { color: var(--vp-c-brand-1); }
.entry-log p { margin: 3px 0 0; color: var(--vp-c-text-2); font-size: 13px; line-height: 1.6; }
.demo-note { margin: 14px 0 0; color: var(--vp-c-text-2); font-size: 12px; line-height: 1.7; }
.request-boundary { margin: 0 0 13px; color: var(--vp-c-brand-1); font-size: 12px; }
.request-messages { display: grid; gap: 10px; margin: 0; }
.request-messages > div { display: grid; grid-template-columns: 72px minmax(0, 1fr); gap: 12px; padding: 11px 12px; border-left: 2px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); }
.request-messages dt { color: var(--vp-c-brand-1); font-family: var(--vp-font-family-mono); font-size: 11px; line-height: 1.7; }
.request-messages dd { margin: 0; font-size: 12px; line-height: 1.7; }
.demo-footnote { padding: 13px 24px; border-top: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); font-size: 11px; line-height: 1.6; }
@media (max-width: 640px) {
  .demo-heading { padding: 18px 16px 12px; }
  .demo-heading h2 { font-size: 17px; }
  .demo-tabs { padding: 0 16px; }
  .demo-panel { min-height: 390px; padding: 16px; }
  .demo-footnote { padding: 12px 16px; }
  .request-messages > div { grid-template-columns: 1fr; gap: 3px; }
}
</style>
