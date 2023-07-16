import{_ as t,o as d,c as e,V as o}from"./chunks/framework.d3b95951.js";const y=JSON.parse('{"title":"配置项","description":"","frontmatter":{},"headers":[],"relativePath":"guide/useful-configurations.md","filePath":"guide/useful-configurations.md","lastUpdated":1689510097000}'),a={name:"guide/useful-configurations.md"},s=o(`<h1 id="配置项" tabindex="-1">配置项 <a class="header-anchor" href="#配置项" aria-label="Permalink to &quot;配置项&quot;">​</a></h1><p>本章节介绍了 ChatHub 插件的配置项，包括它们的含义、类型、默认值和可选值。</p><p>有关配置项，可查看 <a href="https://koishi.chat/zh-CN/manual/console/market.html#%E9%85%8D%E7%BD%AE%E6%8F%92%E4%BB%B6" target="_blank" rel="noreferrer">配置插件</a></p><p>配置项可以在 Koishi 控制台的插件配置中设置，也可以在资源管理器的 <a href="https://en.wikipedia.org/wiki/YAML" target="_blank" rel="noreferrer">YAML</a> 配置文件中使用 <code>chathub</code> 字段进行设置，例如：</p><div class="language-yaml"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;"># Koishi.yml</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 全局设置</span></span>
<span class="line"><span style="color:#F07178;">host</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">localhost</span></span>
<span class="line"><span style="color:#F07178;">port</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">5140</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;"># 插件列表</span></span>
<span class="line"><span style="color:#F07178;">plugins</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;"># ...</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;font-style:italic;"># 这里是 chathub 插件</span></span>
<span class="line"><span style="color:#A6ACCD;">  @</span><span style="color:#F07178;">dingyi222666/chathub</span><span style="color:#89DDFF;">:</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;"># 在这里写入配置项</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;"># 以缩进的方式显示插件的配置项</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">botName</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">香草</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">isNickname</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">true</span></span>
<span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;"># ...</span></span></code></pre></div><h2 id="bot-配置" tabindex="-1">bot 配置 <a class="header-anchor" href="#bot-配置" aria-label="Permalink to &quot;bot 配置&quot;">​</a></h2><p>这一部分的配置项主要涉及到 bot 配置的基本信息和新闻。</p><table><thead><tr><th>配置项</th><th>类型</th><th>默认值</th><th>含义</th></tr></thead><tbody><tr><td><code>botName</code></td><td><code>string</code></td><td><code>&#39;香草&#39;</code></td><td>bot 的姓名，用于在回复中显示或引发回复</td></tr><tr><td><code>isNickname</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否允许 bot 配置中的昵称引发回复</td></tr></tbody></table><h2 id="回复选项" tabindex="-1">回复选项 <a class="header-anchor" href="#回复选项" aria-label="Permalink to &quot;回复选项&quot;">​</a></h2><p>这一部分的配置项主要涉及到插件的回复方式和效果。</p><table><thead><tr><th>配置项</th><th>类型</th><th>默认值</th><th>含义</th></tr></thead><tbody><tr><td><code>allowPrivate</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否允许私聊</td></tr><tr><td><code>allowAtReply</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否允许 at 回复</td></tr><tr><td><code>isReplyWithAt</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否在回复时引用原消息</td></tr><tr><td><code>isForwardMsg</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否将消息以转发消息的形式发送</td></tr><tr><td><code>privateChatWithoutCommand</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否允许私聊不调用命令直接和 bot 聊天</td></tr><tr><td><code>msgCooldown</code></td><td><code>number</code> (秒)</td><td><code>5</code></td><td>全局消息冷却时间，防止适配器调用过于频繁</td></tr><tr><td><code>outputMode</code></td><td><code>&#39;raw&#39; | &#39;text&#39; | &#39;image&#39; | &#39;voice&#39; | &#39;mixed-image&#39; | &#39;mixed-voice&#39;</code></td><td><code>&#39;text&#39;</code></td><td>消息回复的渲染输出模式，具体含义如下： <ul><li><code>raw</code>: 原始（直接输出，不做任何处理）</li><li><code>text</code>: 文本（把回复当成 markdown 渲染）</li><li><code>image</code>: 图片（需要 puppeteer 服务）</li><li><code>voice</code>: 语音（需要 vits 服务）</li><li><code>mixed-image</code>: 混合（图片和文本）</li><li><code>mixed-voice</code>: 混合（语音和文本）</li></ul></td></tr><tr><td><code>splitMessage</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否分割消息发送（看起来更像普通水友（并且会不支持引用消息），不支持原始模式和图片模式）</td></tr><tr><td><code>sendThinkingMessage</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否发送思考中的消息</td></tr><tr><td><code>sendThinkingMessageTimeout</code></td><td><code>number</code>(毫秒)</td><td><code>15000</code></td><td>当请求多少毫秒后未响应时发送思考中的消息</td></tr><tr><td><code>thinkingMessage</code></td><td><code>string</code></td><td><code>&#39;我还在思考中呢，稍等一下哦~&#39;</code></td><td>思考中的消息内容</td></tr><tr><td><code>randomReplyFrequency</code></td><td>百分比 (<code>0-1</code>)</td><td><code>0.0</code></td><td>随机回复频率</td></tr></tbody></table><h2 id="对话选项" tabindex="-1">对话选项 <a class="header-anchor" href="#对话选项" aria-label="Permalink to &quot;对话选项&quot;">​</a></h2><p>这一部分的配置项主要涉及到 bot 的对话模式和历史。</p><table><thead><tr><th>配置项</th><th>类型</th><th>默认值</th><th>含义</th></tr></thead><tbody><tr><td>chatMode</td><td>\`chat</td><td>plugin</td><td>browsing\`</td></tr><tr><td>longMemory</td><td><code>boolean</code></td><td><code>false</code></td><td>是否开启长期记忆（需要提供向量数据库和 Embeddings 服务的支持）</td></tr><tr><td>conversationIsolationGroup</td><td><code>string[]</code></td><td><code>[]</code></td><td>对话隔离群组，开启后群组内对话将隔离到个人级别（填入群组在 Koishi 里的 ID）</td></tr><tr><td>blackList</td><td><code>boolean</code> | <code>any</code> (隐藏)</td><td><code>false</code></td><td>黑名单列表 (请只对需要拉黑的用户或群开启，其他（如默认）请不要打开，否则会导致全部聊天都会被拉黑无法回复)</td></tr><tr><td>blockText</td><td><code>string</code></td><td><code>&#39;哎呀(ｷ｀ﾟДﾟ´)!!，你怎么被拉入黑名单了呢？要不你去问问我的主人吧。&#39;</code></td><td>黑名单回复内容</td></tr><tr><td>censor</td><td><code>boolean</code></td><td><code>false</code></td><td>是否开启文本审核服务（需要安装 censor 服务)</td></tr><tr><td>historyMode</td><td><code>&#39;default&#39; | &#39;summary&#39;</code></td><td><code>&#39;default&#39;</code></td><td>聊天历史模式，具体含义如下： <ul><li><code>default</code>: 保存最近几轮的对话</li><li><code>summary</code>: 保存对话的摘要</li></ul></td></tr></tbody></table><h2 id="模型选项" tabindex="-1">模型选项 <a class="header-anchor" href="#模型选项" aria-label="Permalink to &quot;模型选项&quot;">​</a></h2><p>这一部分的配置项主要涉及到插件使用的嵌入模型和向量数据库（即为 <a href="/guide/useful-commands.html#嵌入模型和向量数据库管理">嵌入模型和向量数据库管理</a> 命令的可视化管理）。</p><table><thead><tr><th>配置项</th><th>类型</th><th>默认值</th><th>含义</th></tr></thead><tbody><tr><td>defaultEmbeddings</td><td><code>&#39;embeddings&#39;</code></td><td>无</td><td>默认使用的嵌入模型</td></tr><tr><td>defaultVectorStore</td><td><code>&#39;vector-store&#39;</code></td><td>无</td><td>默认使用的向量数据库</td></tr></tbody></table><h2 id="杂项" tabindex="-1">杂项 <a class="header-anchor" href="#杂项" aria-label="Permalink to &quot;杂项&quot;">​</a></h2><p>这一部分的配置项主要涉及到插件些其他设置。</p><table><thead><tr><th>配置项</th><th>类型</th><th>默认值</th><th>含义</th></tr></thead><tbody><tr><td>isProxy</td><td><code>boolean</code></td><td><code>false</code></td><td>是否使用代理，开启后会为相关插件的网络服务使用代理</td></tr><tr><td>isLog</td><td><code>boolean</code></td><td><code>false</code></td><td>是否开始调试模式输出 Log，调试用</td></tr></tbody></table><h2 id="代理设置" tabindex="-1">代理设置 <a class="header-anchor" href="#代理设置" aria-label="Permalink to &quot;代理设置&quot;">​</a></h2><p>如果需要使用代理，可在这一部分进行设置。</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>请注意，这一部分的配置项只有在 <code>isProxy</code> 设置为 <code>true</code> 时才会生效。</p></div><table><thead><tr><th>配置项</th><th>类型</th><th>默认值</th><th>含义</th></tr></thead><tbody><tr><td>proxyAddress</td><td><code>string</code></td><td>空字符串 (<code>&#39;&#39;</code>)</td><td>插件网络请求的代理地址，填写后 chathub 相关插件的网络服务都将使用该代理地址。如不填写会尝试使用 Koishi 的全局配置里的代理设置。</td></tr></tbody></table>`,24),c=[s];function l(n,r,i,p,h,b){return d(),e("div",null,c)}const m=t(a,[["render",l]]);export{y as __pageData,m as default};
