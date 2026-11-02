---
layout: home
markdownStyles: false
title: ChatLuna v2
titleTemplate: 可组合的 Agent Harness，接入任何聊天平台
description: ChatLuna v2 是基于 Cordis 4 的可组合 Agent Harness：接入 QQ、Telegram、Discord 等聊天平台，在浏览器里配置模型、角色、场景规则与工具，每一次回复都留有完整轨迹。
---

<script setup lang="ts">
import AppWindow from './.vitepress/theme/components/home/AppWindow.vue'
import HomeHero from './.vitepress/theme/components/home/HomeHero.vue'
import HomeShot from './.vitepress/theme/components/home/HomeShot.vue'
</script>

<HomeHero />

<section class="home-row" aria-labelledby="control-title">
<div class="home-row-text">
<h2 id="control-title" class="home-heading">设置都在浏览器里</h2>
<p>人设、模型、回复方式、记忆与能力：所有聊天的默认设置都在快捷设置这一页，选项旁边都附有说明。</p>
<div class="home-links"><a class="home-link" href="/manual/usage/webui.html">认识控制台</a></div>
</div>
<div class="home-panel">
<HomeShot page="control" path="/control" alt="控制台的快捷设置页面" />
</div>
</section>

<section class="home-row is-flipped" aria-labelledby="routing-title">
<div class="home-row-text">
<h2 id="routing-title" class="home-heading">每个群，各有各的规矩</h2>
<p>同一个机器人，在不同的群和私聊里可以用不同的方式说话。想让某个群或某个人不一样，就在场景规则里单独设定回复方式、能力和安全选项。</p>
<div class="home-links"><a class="home-link" href="/manual/usage/rules.html">了解场景规则</a></div>
</div>
<div class="home-panel is-dusk">
<HomeShot page="routing" path="/routing" alt="控制台的场景规则页面" />
</div>
</section>

<section class="home-row" aria-labelledby="adapters-title">
<div class="home-row-text">
<h2 id="adapters-title" class="home-heading">平台和模型，接上就能用</h2>
<p>QQ、Telegram、Discord、飞书等平台的多个账号可以同时在线。DeepSeek、OpenAI、Anthropic、Google 等模型服务接入一次，换模型不用重配密钥。</p>
<div class="home-links"><a class="home-link" href="/manual/usage/adapters.html">接入聊天平台</a><a class="home-link" href="/manual/usage/models.html">配置模型</a></div>
</div>
<div class="home-panel">
<HomeShot page="adapters" path="/adapters" alt="控制台的聊天平台页面" />
</div>
</section>

<section class="home-row is-flipped" aria-labelledby="dashboard-title">
<div class="home-row-text">
<h2 id="dashboard-title" class="home-heading">每一步都有迹可循</h2>
<p>哪个机器人在线、今天用了多少 token 和费用、有什么需要你处理，仪表盘上一眼就能看到。一次回复调用了哪些工具、每一步花了多久，都能在轨迹里逐条展开。</p>
<div class="home-links"><a class="home-link" href="/manual/usage/observability.html">轨迹与用量</a></div>
</div>
<div class="home-panel is-dusk">
<HomeShot page="dashboard" path="/dashboard" alt="控制台的仪表盘页面" />
</div>
</section>

<section class="home-section" aria-labelledby="ability-title">
<div class="home-wrap">
<div class="home-intro is-wide">
<h2 id="ability-title" class="home-heading">给它工具，也给它分寸</h2>
<p>能力按需加装；什么场合开口、能动用什么、在哪台机器上执行，由你决定。</p>
</div>
<div class="home-lists">
<ul class="home-list" aria-label="能力">
<li><a href="/manual/usage/tools.html"><span class="home-icon" style="--tint: #4d5a8c"><span class="i-ic-round-build"></span></span><span class="home-body"><span class="home-item"><strong>工具</strong><span>读写文件、执行命令、搜索网页，模型在需要时自己调用。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/skills.html"><span class="home-icon" style="--tint: #6b5b95"><span class="i-ic-round-menu-book"></span></span><span class="home-body"><span class="home-item"><strong>技能</strong><span>把做事的方法写成说明，需要时才加载完整步骤。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/mcp.html"><span class="home-icon" style="--tint: #3d6f86"><span class="i-ic-round-hub"></span></span><span class="home-body"><span class="home-item"><strong>MCP</strong><span>接入现成的 MCP 服务，它们的工具和内置工具一样用。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/memory.html"><span class="home-icon" style="--tint: #7a5c8a"><span class="i-ic-round-psychology"></span></span><span class="home-body"><span class="home-item"><strong>长期记忆</strong><span>记住谁喜欢什么、约定了什么，跨会话按需取回。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/subagents.html"><span class="home-icon" style="--tint: #46658f"><span class="i-ic-round-account-tree"></span></span><span class="home-body"><span class="home-item"><strong>子代理</strong><span>繁重的多步任务交给子代理，只把结论带回对话。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/automation.html"><span class="home-icon" style="--tint: #5d6b7f"><span class="i-ic-round-schedule"></span></span><span class="home-body"><span class="home-item"><strong>定时与后台任务</strong><span>按时间或条件触发任务，耗时的操作转入后台继续。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
</ul>
<ul class="home-list" aria-label="分寸">
<li><a href="/manual/usage/rules.html"><span class="home-icon" style="--tint: #45465e"><span class="i-ic-round-alt-route"></span></span><span class="home-body"><span class="home-item"><strong>场景规则</strong><span>同一个机器人，在不同的群和私聊里用不同的方式说话。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/activation.html"><span class="home-icon" style="--tint: #6b798e"><span class="i-ic-round-forum"></span></span><span class="home-body"><span class="home-item"><strong>什么时候回复</strong><span>被 @ 时回复、话题相关时插话、冷场时主动搭话，各自开关。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/permissions.html"><span class="home-icon" style="--tint: #3f6a68"><span class="i-ic-round-shield"></span></span><span class="home-body"><span class="home-item"><strong>权限与安全</strong><span>调用工具、读写文件都要经过权限判定，危险操作先征得同意。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/machines.html"><span class="home-icon" style="--tint: #54606f"><span class="i-ic-round-dns"></span></span><span class="home-body"><span class="home-item"><strong>机器与工作区</strong><span>命令在哪台机器上执行、模型能读写哪个目录，都由你指定。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/observability.html"><span class="home-icon" style="--tint: #5a5687"><span class="i-ic-round-timeline"></span></span><span class="home-body"><span class="home-item"><strong>轨迹与用量</strong><span>出了问题先看轨迹，算账时先看用量。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
</ul>
</div>
</div>
</section>

<section class="home-row" aria-labelledby="dev-title">
<div class="home-row-text">
<h2 id="dev-title" class="home-heading">写个插件，教它新本领</h2>
<p>ChatLuna 运行在 Cordis 4 上。工具、服务和控制台页面都由插件注册，插件卸载时，它注册过的一切都会自动回收。</p>
<p>开头截图里查天气用的 <code>weather_forecast</code>，写成插件只要这些代码。</p>
<div class="home-links"><a class="home-link" href="/guide/develop/first-plugin.html">第一个插件</a><a class="home-link" href="/guide/extend/tools.html">工具开发</a><a class="home-link" href="/api/">API 参考</a></div>
</div>
<div class="home-panel is-code">
<AppWindow class="home-editor" title="weather.ts">
<div class="vp-doc">

```ts
import type { Context } from 'cordis'
import { Schema } from '@chatluna/schema'
import { defineTool } from '@chatluna/tool'

export const name = 'weather'
export const inject = ['tools']

export function apply(ctx: Context) {
  ctx.tools.define(defineTool({
    name: 'weather_forecast',
    description: '查询城市未来几天的天气',
    args: Schema.object({
      city: Schema.string().required(),
      days: Schema.number().default(3),
    }),
    async run({ city, days }) {
      const response = await fetch(`https://weather.example/v1?city=${city}&days=${days}`)
      return await response.text()
    },
  }))
}
```

</div>
</AppWindow>
</div>
</section>

<section class="home-row is-flipped" aria-labelledby="install-title">
<div class="home-row-text">
<h2 id="install-title" class="home-heading">两行命令，跑起来</h2>
<p>需要 Node.js 24 或以上。第一次运行 <code>chatluna</code> 会创建默认实例并启动，终端里会打印控制台的登录地址，默认是 <code>http://127.0.0.1:5028</code>。</p>
<p>打开它，按提示添加模型、接入聊天平台，机器人就能在群里说话了。</p>
<div class="home-links"><a class="home-link" href="/manual/quickstart.html">跟着快速开始走一遍</a><a class="home-link" href="/manual/starter/">比较三种安装方式</a></div>
</div>
<div class="home-panel is-code is-dusk">
<div class="vp-doc home-code">

::: code-group

```sh [npm]
npm i -g chatluna
chatluna
```

```sh [Docker]
git clone https://github.com/ChatLunaLab/v2.git && cd v2
docker compose -f docker/compose.yml up -d chatluna
```

```sh [源码]
git clone https://github.com/ChatLunaLab/v2.git && cd v2
yarn install && yarn build
yarn chatluna start
```

:::

</div>
</div>
</section>

<section class="home-section home-community" aria-labelledby="community-title">
<div class="home-wrap home-center">
<img class="home-logo" src="/logo.png" alt="" width="64" height="64">
<h2 id="community-title" class="home-heading">来群里聊聊</h2>
<p>用的时候遇到问题，或者想给大家看看你的机器人，都欢迎来。</p>
<div class="home-pills"><a class="home-pill" href="https://qm.qq.com/q/UPl46h6omI">QQ 交流群 282381753</a><a class="home-pill" href="https://qm.qq.com/q/NwwPwOrAoo">QQ 闲聊群 391122026</a><a class="home-pill" href="https://t.me/koishi_chatluna">Telegram 群组</a><a class="home-pill" href="https://t.me/koishi_chatluna_channel">Telegram 频道</a><a class="home-pill" href="https://github.com/ChatLunaLab/v2">GitHub</a></div>
<p class="home-note">还在用 v1？<a href="https://v1.chatluna.chat">v1 文档</a>仍可访问，升级前请先读<a href="/cookbook/migration.html">迁移指南</a>。</p>
</div>
</section>
