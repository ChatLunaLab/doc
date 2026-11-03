---
layout: home
markdownStyles: false
title: ChatLuna v2
titleTemplate: 可组合的 Agent Harness，接入任何聊天平台
description: ChatLuna v2 是基于 Cordis 4 的可组合 Agent Harness。接入 QQ、Telegram、Discord 等主流聊天平台，在浏览器中直观配置模型、角色、场景规则与工具，每一次回复均有完整轨迹可查。
---

<script setup lang="ts">
import AppWindow from './.vitepress/theme/components/home/AppWindow.vue'
import HomeHero from './.vitepress/theme/components/home/HomeHero.vue'
import HomeLogo from './.vitepress/theme/components/home/HomeLogo.vue'
import HomeShot from './.vitepress/theme/components/home/HomeShot.vue'
import HomeSky from './.vitepress/theme/components/home/HomeSky.vue'
</script>

<HomeHero />

<section class="home-row" aria-labelledby="control-title">
<div class="home-row-text">
<h2 id="control-title" class="home-heading">WebUI 配置</h2>
<p>人设、模型、回复方式、记忆与能力：所有聊天的默认设置都集中在「快捷设置」页面，每个选项旁边都附有清晰说明。</p>
<div class="home-links"><a class="home-link" href="/manual/usage/webui.html">认识控制台</a></div>
</div>
<div class="home-panel">
<HomeSky class="home-panel-sky" tone="panel" />
<HomeShot page="control" path="/control" alt="控制台的快捷设置页面" />
</div>
</section>

<section class="home-row is-flipped" aria-labelledby="routing-title">
<div class="home-row-text">
<h2 id="routing-title" class="home-heading">场景规则</h2>
<p>同一个机器人，在不同的群和私聊里可以用不同的方式说话。想让某个群或某个人与众不同，只需在场景规则里单独设定回复方式、可用能力和安全选项即可。</p>
<div class="home-links"><a class="home-link" href="/manual/usage/rules.html">了解场景规则</a></div>
</div>
<div class="home-panel is-dusk">
<HomeSky class="home-panel-sky" tone="panel" />
<HomeShot page="routing" path="/routing" alt="控制台的场景规则页面" />
</div>
</section>

<section class="home-row" aria-labelledby="adapters-title">
<div class="home-row-text">
<h2 id="adapters-title" class="home-heading">接入模型与 IM</h2>
<p>支持 QQ、Telegram、Discord、飞书等主流平台的多个账号同时在线。DeepSeek、OpenAI、Anthropic、Google 等模型服务只需接入一次，切换模型时无需重新配置密钥。</p>
<div class="home-links"><a class="home-link" href="/manual/usage/adapters.html">接入聊天平台</a><a class="home-link" href="/manual/usage/models.html">配置模型</a></div>
</div>
<div class="home-panel">
<HomeSky class="home-panel-sky" tone="panel" />
<HomeShot page="adapters" path="/adapters" alt="控制台的聊天平台页面" />
</div>
</section>

<section class="home-row is-flipped" aria-labelledby="dashboard-title">
<div class="home-row-text">
<h2 id="dashboard-title" class="home-heading">可观测性</h2>
<p>机器人运行状态、当天用了多少 Token 和费用、有哪些需要你处理的事件，在仪表盘上一览便知。单次回复调用了哪些工具、每一步耗时多久，也能在轨迹中逐条展开查看。</p>
<div class="home-links"><a class="home-link" href="/manual/usage/observability.html">轨迹与用量</a></div>
</div>
<div class="home-panel is-dusk">
<HomeSky class="home-panel-sky" tone="panel" />
<HomeShot page="dashboard" path="/dashboard" alt="控制台的仪表盘页面" />
</div>
</section>

<section class="home-section" aria-labelledby="ability-title">
<div class="home-wrap">
<div class="home-intro is-wide">
<h2 id="ability-title" class="home-heading">完全控制</h2>
<p>各种能力按需加装；在什么场合开口、能够调用什么、在哪台机器上执行，完全由你决定。</p>
</div>
<div class="home-lists">
<ul class="home-list" aria-label="能力">
<li><a href="/manual/usage/tools.html"><span class="home-icon" style="--tint: #4d5a8c"><span class="i-ic-round-build"></span></span><span class="home-body"><span class="home-item"><strong>工具</strong><span>读写文件、执行命令、搜索网页，模型在需要时会自行调用。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/skills.html"><span class="home-icon" style="--tint: #6b5b95"><span class="i-ic-round-menu-book"></span></span><span class="home-body"><span class="home-item"><strong>技能</strong><span>把做事的方法写成指引，需要时才按需加载完整步骤。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/mcp.html"><span class="home-icon" style="--tint: #3d6f86"><span class="i-ic-round-hub"></span></span><span class="home-body"><span class="home-item"><strong>MCP</strong><span>轻松接入外部 MCP 服务，第三方工具和内置工具一样顺手。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/memory.html"><span class="home-icon" style="--tint: #7a5c8a"><span class="i-ic-round-psychology"></span></span><span class="home-body"><span class="home-item"><strong>长期记忆</strong><span>记住用户的喜好与约定，跨越不同会话按需检索。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/subagents.html"><span class="home-icon" style="--tint: #46658f"><span class="i-ic-round-account-tree"></span></span><span class="home-body"><span class="home-item"><strong>子代理</strong><span>将复杂繁琐的多步任务交给子代理，只把最终结论带回对话。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/automation.html"><span class="home-icon" style="--tint: #5d6b7f"><span class="i-ic-round-schedule"></span></span><span class="home-body"><span class="home-item"><strong>定时与后台任务</strong><span>按预设时间或条件触发任务，耗时的操作可转入后台继续执行。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
</ul>
<ul class="home-list" aria-label="分寸">
<li><a href="/manual/usage/rules.html"><span class="home-icon" style="--tint: #45465e"><span class="i-ic-round-alt-route"></span></span><span class="home-body"><span class="home-item"><strong>场景规则</strong><span>同一个机器人，在不同的群聊和私聊中可以用不同的方式说话。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/activation.html"><span class="home-icon" style="--tint: #6b798e"><span class="i-ic-round-forum"></span></span><span class="home-body"><span class="home-item"><strong>什么时候回复</strong><span>被 @ 时回复、话题相关时插话、冷场时主动搭话，均可独立开关。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/permissions.html"><span class="home-icon" style="--tint: #3f6a68"><span class="i-ic-round-shield"></span></span><span class="home-body"><span class="home-item"><strong>权限与安全</strong><span>调用工具与读写文件均需经过权限检查，危险操作会先征得确认。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/machines.html"><span class="home-icon" style="--tint: #54606f"><span class="i-ic-round-dns"></span></span><span class="home-body"><span class="home-item"><strong>机器与工作区</strong><span>命令在哪台机器上执行、模型能访问哪个工作目录，均由你明确指定。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
<li><a href="/manual/usage/observability.html"><span class="home-icon" style="--tint: #5a5687"><span class="i-ic-round-timeline"></span></span><span class="home-body"><span class="home-item"><strong>轨迹与用量</strong><span>遇到异常随时调取运行轨迹，资源消耗与成本一目了然。</span></span><span class="home-chevron i-ic-round-chevron-right" aria-hidden="true"></span></span></a></li>
</ul>
</div>
</div>
</section>

<section class="home-row" aria-labelledby="dev-title">
<div class="home-row-text">
<h2 id="dev-title" class="home-heading">写个插件，赋予它新能力</h2>
<p>ChatLuna 运行在 Cordis 4 上。工具、服务和控制台页面都由插件注册；停用或卸载插件时，它注册过的一切都会自动回收。</p>
<p>开头截图里查天气用的 <code>weather_forecast</code>，写成插件只需要这几行代码：</p>
<div class="home-links"><a class="home-link" href="/guide/develop/first-plugin.html">第一个插件</a><a class="home-link" href="/guide/extend/tools.html">工具开发</a><a class="home-link" href="/api/">API 参考</a></div>
</div>
<div class="home-panel is-code">
<HomeSky class="home-panel-sky" tone="panel" />
<AppWindow class="home-editor" title="weather.ts">
<div class="vp-doc">

```ts
import type { Context } from "cordis";
import { Schema } from "@chatluna/schema";
import { defineTool } from "@chatluna/tool";

export const name = "weather";
export const inject = ["tools"];

export function apply(ctx: Context) {
  ctx.tools.define(
    defineTool({
      name: "weather_forecast",
      description: "查询城市未来几天的天气",
      args: Schema.object({
        city: Schema.string().required(),
        days: Schema.number().default(3),
      }),
      async run({ city, days }) {
        const response = await fetch(
          `https://weather.example/v1?city=${city}&days=${days}`,
        );
        return await response.text();
      },
    }),
  );
}
```

</div>
</AppWindow>
</div>
</section>

<section class="home-row is-flipped" aria-labelledby="install-title">
<div class="home-row-text">
<h2 id="install-title" class="home-heading">即刻运行</h2>
<p>运行环境需要 Node.js 24 或更高版本。第一次运行 <code>chatluna</code> 会自动创建默认实例并启动，终端中会打印控制台的登录地址，默认为 <code>http://127.0.0.1:5028</code>。</p>
<p>在浏览器中打开它，按提示添加模型、接入聊天平台，机器人就可以在群里说话了。</p>
<div class="home-links"><a class="home-link" href="/manual/quickstart.html">跟着快速开始走一遍</a><a class="home-link" href="/manual/starter/">比较三种安装方式</a></div>
</div>
<div class="home-panel is-code is-dusk">
<HomeSky class="home-panel-sky" tone="panel" />
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
<HomeLogo class="home-logo" />
<h2 id="community-title" class="home-heading">来群里聊聊</h2>
<p>使用过程中遇到任何问题，或者想向大家展示你的机器人，都欢迎随时来群里交流。</p>
<div class="home-pills"><a class="home-pill" href="https://qm.qq.com/q/UPl46h6omI">QQ 交流群 282381753</a><a class="home-pill" href="https://qm.qq.com/q/NwwPwOrAoo">QQ 闲聊群 391122026</a><a class="home-pill" href="https://t.me/koishi_chatluna">Telegram 群组</a><a class="home-pill" href="https://t.me/koishi_chatluna_channel">Telegram 频道</a><a class="home-pill" href="https://github.com/ChatLunaLab/v2">GitHub</a></div>
<p class="home-note">还在用 v1？<a href="https://v1.chatluna.chat">v1 文档</a>仍可访问，升级前建议先阅读<a href="/cookbook/migration.html">迁移指南</a>。</p>
</div>
</section>
