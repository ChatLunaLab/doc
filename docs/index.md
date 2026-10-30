---
layout: page
title: ChatLuna v2
description: ChatLuna v2：为 IM 平台深度设计的 Agent Harness，基于 Cordis 4 构建。涵盖安装部署、使用配置、系统架构与插件开发文档。
---

<script setup lang="ts">
import SessionLogDemo from './.vitepress/theme/components/SessionLogDemo.vue'
</script>

<div class="v2-home">
  <section class="home-hero" aria-labelledby="home-title">
    <div class="hero-copy">
      <div class="hero-brand"><img src="/logo.png" alt="" width="44" height="44" /><span>ChatLuna v2 <small>Alpha</small></span></div>
      <h1 id="home-title">让对话自然发生，<br />让过程清楚可见。</h1>
      <p class="hero-lead">为 IM 平台深度设计的 Agent Harness，基于 Cordis 4 构建。连接聊天平台与模型，用预设、工具和技能构建自己的机器人，再从会话记录中检查它如何工作。</p>
      <div class="hero-actions"><a class="action-primary" href="/manual/quickstart.html">即刻起步</a><a class="action-secondary" href="/manual/introduction.html">了解更多</a></div>
      <p class="hero-requirements">源码运行需 Node.js 24+ 与 Yarn 4，亦支持通过 Docker 部署。</p>
    </div>
    <SessionLogDemo />
  </section>

  <section class="entry-section" aria-labelledby="entry-title">
    <div class="section-heading"><h2 id="entry-title">按任务查阅文档</h2><a href="https://v1.chatluna.chat">正在使用 v1？查阅旧版文档</a></div>
    <div class="entry-list">
      <a class="entry-row" href="/manual/quickstart.html"><span class="entry-kind">使用手册</span><span class="entry-copy"><strong>连接首个模型与聊天平台</strong><small>安装启动、完成推理测试、接入平台并绑定主人身份。</small></span></a>
      <a class="entry-row" href="/manual/usage/webui.html"><span class="entry-kind">使用手册</span><span class="entry-copy"><strong>业务场景与行为配置</strong><small>配置场景规则、角色伪装、长期记忆与可用能力边界。</small></span></a>
      <a class="entry-row" href="/architecture/"><span class="entry-kind">架构</span><span class="entry-copy"><strong>理解对话执行全流程</strong><small>理清会话日志、Agent 循环与单次模型调用的协作边界。</small></span></a>
      <a class="entry-row" href="/guide/"><span class="entry-kind">开发指南</span><span class="entry-copy"><strong>编写自定义扩展插件</strong><small>从最小插件结构起步，扩展工具、提示词与管理页面。</small></span></a>
      <a class="entry-row" href="/api/"><span class="entry-kind">API 参考</span><span class="entry-copy"><strong>查阅服务、命令与默认值</strong><small>按服务接口、运行参数与配置来源查找准确的定义。</small></span></a>
      <a class="entry-row" href="/cookbook/"><span class="entry-kind">进阶</span><span class="entry-copy"><strong>排错、迁移与公网部署</strong><small>定位常见问题，从 v1 迁移，或将实例暴露到公网。</small></span></a>
    </div>
  </section>

  <section class="mechanisms" aria-label="框架的三个核心边界">
    <article><h2>日志与上下文解耦</h2><p>消息、控制标记与摘要切点按序追加；模型上下文由记录构建，分叉保留原历史。</p><a href="/architecture/sessions.html">会话机制</a></article>
    <article><h2>单次调用与循环解耦</h2><p>模型运行时负责一次调用，Agent 负责工具循环与输入调度。请求重建不调用模型。</p><a href="/architecture/agents.html">Agent 执行</a></article>
    <article><h2>能力与权限解耦</h2><p>插件注册工具与服务，权限系统独立判定调用许可；技能、MCP 与后台任务不隐式提权。</p><a href="/manual/usage/permissions.html">安全与权限</a></article>
  </section>
  <aside class="home-help"><p>已有 v1 实例？建议先在隔离环境中验证 v2，确认无误后再切换平台连接。</p><a href="/cookbook/migration.html">阅读迁移指南</a><a href="/cookbook/troubleshooting.html">遇到问题时排错</a></aside>
</div>

<style>
.v2-home { --home-surface: #f4f5f7; --home-ink: #1b1d24; --home-muted: #55606e; --home-primary: #45465e; --home-primary-hover: #6b798e; --home-accent: #9aa7b1; --home-on-primary: #fff; color: var(--home-ink); font-family: var(--vp-font-family-base); }
.dark .v2-home { --home-surface: #1e2027; --home-ink: #e8ebf0; --home-muted: #9aa7b1; --home-primary: #9aa7b1; --home-primary-hover: #b8c2cb; --home-on-primary: #23242e; }
.home-hero { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; gap: clamp(36px, 6vw, 84px); padding: 76px max(32px, calc((100% - 1152px) / 2)) 80px; background: var(--home-surface); }
.hero-copy { min-width: 0; }
.hero-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; font-size: 16px; font-weight: 600; }
.hero-brand img { border-radius: 10px; }
.hero-brand small { margin-left: 5px; color: var(--home-muted); font-size: 12px; font-weight: 400; }
.hero-copy h1 { margin: 0; font-size: 46px; font-weight: 700; line-height: 1.3; letter-spacing: 0; }
.hero-lead { max-width: 460px; margin: 22px 0 0; color: var(--home-muted); font-size: 16px; line-height: 1.9; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
.hero-actions a { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 10px 18px; border: 1px solid var(--home-primary); border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; }
.hero-actions .action-primary { background: var(--home-primary); color: var(--home-on-primary); }
.hero-actions .action-primary:hover { background: var(--home-primary-hover); border-color: var(--home-primary-hover); }
.hero-actions .action-secondary { color: var(--home-primary); }
.hero-actions .action-secondary:hover { background: var(--vp-c-brand-soft); }
.hero-requirements { max-width: 440px; margin: 20px 0 0; color: var(--home-muted); font-size: 12px; line-height: 1.7; }
.v2-home a:focus-visible { outline: 2px solid var(--home-primary); outline-offset: 5px; }
.entry-section { max-width: 1152px; margin: 0 auto; padding: 64px 32px 50px; }
.section-heading { display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 14px 24px; margin-bottom: 24px; }
.section-heading h2 { margin: 0; font-size: 26px; line-height: 1.4; font-weight: 650; }
.section-heading > a { color: var(--home-primary); font-size: 13px; text-decoration: underline; text-underline-offset: 4px; }
.entry-list { border-top: 1px solid var(--vp-c-divider); }
.entry-row { display: grid; grid-template-columns: 150px minmax(0, 1fr); align-items: center; gap: 20px; padding: 20px 0; border-bottom: 1px solid var(--vp-c-divider); color: inherit; text-decoration: none; }
.entry-kind { color: var(--home-primary); font-size: 13px; }
.entry-copy { display: grid; gap: 5px; }
.entry-copy strong { font-size: 16px; font-weight: 600; }
.entry-copy small { color: var(--vp-c-text-2); font-size: 14px; line-height: 1.6; }
.entry-row:hover .entry-copy strong { color: var(--home-primary); }
.mechanisms { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 40px; max-width: 1152px; margin: 0 auto; padding: 0 32px 54px; }
.mechanisms article { min-width: 0; }
.mechanisms h2 { margin: 0; font-size: 17px; font-weight: 600; line-height: 1.5; }
.mechanisms p { margin: 12px 0; color: var(--vp-c-text-2); font-size: 14px; line-height: 1.85; }
.mechanisms a, .home-help a { display: inline-flex; align-items: center; min-height: 44px; color: var(--home-primary); font-size: 13px; text-decoration: underline; text-underline-offset: 4px; }
.home-help { display: flex; flex-wrap: wrap; align-items: center; gap: 0 24px; max-width: 1088px; margin: 0 auto 40px; padding: 20px 0; border-top: 1px solid var(--vp-c-divider); }
.home-help p { flex: 1 1 400px; margin: 0; color: var(--vp-c-text-2); font-size: 13px; line-height: 1.8; }
@media (max-width: 960px) {
  .home-hero { grid-template-columns: minmax(0, 1fr); gap: 36px; padding: 48px 32px; }
  .hero-copy { max-width: 620px; }
  .hero-lead { max-width: 570px; }
  .home-hero .session-demo { max-width: 640px; }
  .home-help { margin-right: 32px; margin-left: 32px; }
}
@media (max-width: 640px) {
  .home-hero { padding: 36px 16px; }
  .hero-copy h1 { font-size: 34px; }
  .hero-lead { font-size: 15px; }
  .entry-section { padding: 40px 16px; }
  .section-heading h2 { font-size: 22px; }
  .entry-row { grid-template-columns: minmax(0, 1fr); gap: 6px; padding: 18px 0; }
  .mechanisms { grid-template-columns: minmax(0, 1fr); gap: 28px; padding: 0 16px 36px; }
  .home-help { margin: 0 16px 24px; }
}
</style>
