import{_ as e,o as a,c as o,Q as i}from"./chunks/framework.4719a631.js";const b=JSON.parse('{"title":"配置项","description":"","frontmatter":{},"headers":[],"relativePath":"guide/useful-configurations.md","filePath":"guide/useful-configurations.md","lastUpdated":1699274201000}'),l={name:"guide/useful-configurations.md"},t=i('<h1 id="配置项" tabindex="-1">配置项 <a class="header-anchor" href="#配置项" aria-label="Permalink to &quot;配置项&quot;">​</a></h1><p>本节介绍了主插件(<code>@dingyi222666/chathub</code>)可用的配置项。对于其他插件或适配器的配置项，请参考对应的文档。</p><h2 id="bot-配置" tabindex="-1">Bot 配置 <a class="header-anchor" href="#bot-配置" aria-label="Permalink to &quot;Bot 配置&quot;">​</a></h2><h3 id="botname" tabindex="-1">botName <a class="header-anchor" href="#botname" aria-label="Permalink to &quot;botName&quot;">​</a></h3><ul><li>类型：<code>string</code></li><li>默认值：<code>香草</code></li></ul><p>Bot 的昵称，该昵称可用于下方的<a href="#isnickname">关键词唤醒</a>对话。</p><h3 id="isnickname" tabindex="-1">isNickName <a class="header-anchor" href="#isnickname" aria-label="Permalink to &quot;isNickName&quot;">​</a></h3><ul><li>类型：<code>boolean</code></li><li>默认值：<code>false</code></li></ul><p>是否可从昵称唤醒对话。当开启后，如发出的消息开头含有 <a href="#botname">BotName</a> 属性，将自动触发对话。</p><h2 id="回复选项" tabindex="-1">回复选项 <a class="header-anchor" href="#回复选项" aria-label="Permalink to &quot;回复选项&quot;">​</a></h2><h3 id="allowprivate" tabindex="-1">allowPrivate <a class="header-anchor" href="#allowprivate" aria-label="Permalink to &quot;allowPrivate&quot;">​</a></h3><ul><li>类型：<code>boolean</code></li><li>默认值：<code>true</code></li></ul><p>是否能在私聊中调用 ChatHub，开启后将可以在私聊中通过命令调用 ChatHub。</p><h3 id="allowatreply" tabindex="-1">allowAtReply <a class="header-anchor" href="#allowatreply" aria-label="Permalink to &quot;allowAtReply&quot;">​</a></h3><ul><li>类型：<code>boolean</code></li><li>默认值：<code>true</code></li></ul><p>当 @Bot 时是否响应回复，开启后将会在 @Bot 时触发回复。</p><h3 id="isreplywithat" tabindex="-1">isReplyWithAt <a class="header-anchor" href="#isreplywithat" aria-label="Permalink to &quot;isReplyWithAt&quot;">​</a></h3><ul><li>类型: <code>boolean</code></li><li>默认值：<code>false</code></li></ul><p>Bot 回复时是否引用原消息回复。开启后 Bot 的回复都会引用原触发消息。</p><h3 id="isforwardmsg" tabindex="-1">isForwardMsg <a class="header-anchor" href="#isforwardmsg" aria-label="Permalink to &quot;isForwardMsg&quot;">​</a></h3><ul><li>类型: <code>boolean</code></li><li>默认值：<code>false</code></li></ul><p>是否让消息以转发消息的形式发送。开启后，当 Bot 回复时，将会回复一个转发消息组。</p><div class="warning custom-block"><p class="custom-block-title">警告</p><p>目前支持该功能的聊天平台可能很少或接近没有，在未来我们可能会删除该配置</p></div><h3 id="privatechatwithoutcommand" tabindex="-1">privateChatWithoutCommand <a class="header-anchor" href="#privatechatwithoutcommand" aria-label="Permalink to &quot;privateChatWithoutCommand&quot;">​</a></h3><ul><li>类型：<code>boolean</code></li><li>默认值：<code>false</code></li></ul><p>是否能直接不调用任何命令在私聊里和 Bot 对话。</p><p>开启后，在私聊里的其他非命令调用都会被识别成和 Bot 对话，触发对话。</p><h3 id="msgcooldown" tabindex="-1">msgCooldown <a class="header-anchor" href="#msgcooldown" aria-label="Permalink to &quot;msgCooldown&quot;">​</a></h3><ul><li>类型：<code>number</code></li><li>默认值：<code>5</code></li><li>最小值：<code>1</code></li><li>最大值：<code>3600</code></li><li>单位：<code>秒(s)</code></li></ul><p>全局冷却时间，开启后，在该时间内，Bot 不会响应任何消息。</p><h3 id="outputmode" tabindex="-1">outputMode <a class="header-anchor" href="#outputmode" aria-label="Permalink to &quot;outputMode&quot;">​</a></h3><ul><li><p>类型：<code>&#39;raw&#39;|&#39;text&#39;|&#39;image&#39;|&#39;voice&#39;|&#39;mixed-image&#39;|&#39;mixed-voice&#39;</code></p></li><li><p>插件会把模型生成的回复文本基于选中的输出格式进行渲染。下面是每个选项的介绍:</p><ul><li><p><code>raw</code>：输出模型生成的原始文本。</p></li><li><p><code>text</code>：将模型生成的文本渲染成 Koishi 支持的 Markdown 格式后发送</p></li><li><p><code>image</code>：将模型生成的文本渲染成图片后发送（图片里为模型原文本）</p><pre><code>该选项需要你的 Koishi 在运行提供了 puppeteer 服务的插件。我们需要 puppeteer 渲染 html 文件。\n</code></pre></li><li><p><code>voice</code>：将模型生成的文本转化成语音后发送（语音里为模型原文本）</p><pre><code>该选项需要你的 Koishi 在运行提供了 vits 服务的插件。我们需要 vits 服务将文本转化成语音文件。\n</code></pre></li><li><p><code>mixed-image</code>: 基于 Markdown 语法识别，对于某些 Markdown 语法（如列表，代码块）会渲染图片，其他的某些 Markdown 语法（如纯文本的自然段）会直接作为文本发送。</p><pre><code>和 `image` 选项一样，该选项需要你的 Koishi 在运行提供了 puppeteer 服务的插件。\n</code></pre></li><li><p><code>mixed-voice</code>: 将模型生成的文本同时渲染成 Markdown 格式和语音后发送。</p><pre><code>和 `voice` 选项一样，该选项需要你的 Koishi 在运行提供了 vits 服务的插件。\n</code></pre></li></ul></li><li><p>默认值：<code>&#39;text&#39;</code></p></li></ul><div class="warning custom-block"><p class="custom-block-title">警告</p><p>如你开启了<a href="#bot-配置">流式传输</a>，那么输出格式请直接选择默认的 <code>text</code>。 否则可能出现意想不到的渲染结果。</p></div><h3 id="splitmessage" tabindex="-1">splitMessage <a class="header-anchor" href="#splitmessage" aria-label="Permalink to &quot;splitMessage&quot;">​</a></h3><ul><li>类型：<code>boolean</code></li><li>默认值：<code>false</code></li></ul><p>切割消息发送。</p><p>开启后会将模型生成的文本基于 Markdown 语法切割成多块文本和，发送成多条消息。 配合<a href="#bot-配置">流式传输</a>使用，可实现更优的体验。</p><div class="tip custom-block"><p class="custom-block-title">提示</p><p>本选项开启后，<a href="#outputmode">outputMode</a> 选项只推荐设置为 <code>text</code>。 并且引用消息回复可能会无效。</p></div><h3 id="censor" tabindex="-1">censor <a class="header-anchor" href="#censor" aria-label="Permalink to &quot;censor&quot;">​</a></h3><ul><li>类型：<code>boolean</code></li><li>默认值：<code>false</code></li></ul><p>文本审核。</p><p>开启后会对模型生成的文本进行文本审核，基于 Koishi 的 <a href="https://censor.koishi.chat" target="_blank" rel="noreferrer">censor</a>服务。</p><h3 id="sendthinkingmessage" tabindex="-1">sendThinkingMessage <a class="header-anchor" href="#sendthinkingmessage" aria-label="Permalink to &quot;sendThinkingMessage&quot;">​</a></h3><ul><li>类型：<code>boolean</code></li><li>默认值：<code>true</code></li></ul><p>当模型生成耗时过长时发送一条消息。</p><p>这能提示用户模型正在生成回复，同时也能知道前方队列的排队情况。</p><h3 id="sendthinkingmessagetimeout" tabindex="-1">sendThinkingMessageTimeout <a class="header-anchor" href="#sendthinkingmessagetimeout" aria-label="Permalink to &quot;sendThinkingMessageTimeout&quot;">​</a></h3><ul><li>类型：<code>number</code></li><li>默认值：<code>15000</code></li><li>单位：毫秒（ms）</li></ul><p>当经过该时间后模型仍在生成时，基于<a href="#sendthinkingmessage"><code>sendThinkingMessage</code></a> 选项的开启发送一条消息。</p><p>消息的内容基于下面<a href="#thinkingmessage">thinkingMessage</a>设定的内容。</p><h3 id="thinkingmessage" tabindex="-1">thinkingMessage <a class="header-anchor" href="#thinkingmessage" aria-label="Permalink to &quot;thinkingMessage&quot;">​</a></h3><ul><li>类型：<code>string</code></li><li>默认值：<code>我还在思考中，前面还有 {count} 条消息等着我回复呢，稍等一下哦~</code></li></ul><p>耗时过长的消息发送提示内容。</p><p>对于 <code>{count}</code> 占位符，会自动替换成当前队列中等待回复的消息数量。</p><h3 id="randomreplyfrequency" tabindex="-1">randomReplyFrequency <a class="header-anchor" href="#randomreplyfrequency" aria-label="Permalink to &quot;randomReplyFrequency&quot;">​</a></h3><ul><li>类型：<code>number</code></li><li>默认值：<code>0.0</code></li><li>最大值：<code>1.0</code></li></ul><p>随机回复频率。</p><p>插件会对每条消息，生成一个随机数，当该随机数小于该频率时，会触发随机回复。</p>',58),d=[t];function c(r,n,s,h,p,u){return a(),o("div",null,d)}const g=e(l,[["render",c]]);export{b as __pageData,g as default};
