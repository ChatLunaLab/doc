import{_ as t,c as d,o as r,V as e}from"./chunks/framework.hLR1SBQA.js";const f=JSON.parse('{"title":"错误码表","description":"","frontmatter":{},"headers":[],"relativePath":"guide/faq/error_code.md","filePath":"guide/faq/error_code.md","lastUpdated":1703658135000}'),a={name:"guide/faq/error_code.md"},o=e('<h1 id="错误码表" tabindex="-1">错误码表 <a class="header-anchor" href="#错误码表" aria-label="Permalink to &quot;错误码表&quot;">​</a></h1><p>本节会将 ChatHub 里的常见错误码列出，并给出某些可能的解决方案。</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>如果尝试了下面的解决方案后仍然无效，请联系开发者以解决问题（需要提供错误日志）。</p></div><table><thead><tr><th>错误码</th><th>含义</th><th>可能的解决方案</th></tr></thead><tbody><tr><td>1</td><td>网络错误</td><td>检查代理配置，网络连接是否正常、</td></tr><tr><td>2</td><td>不支持的代理协议</td><td>检查代理配置，是否选择了正确的协议 (只支持 http/sock5)</td></tr><tr><td>3</td><td>队列溢出</td><td>大量请求！难得 ChatHub 能被这么多人用呢。。</td></tr><tr><td>4</td><td>渲染出错</td><td>根据房间的渲染模式，检查 Puppeteer 浏览器渲染配置，语音服务等</td></tr><tr><td>100</td><td>API KEY 无效</td><td>检查 API KEY 是否可用。</td></tr><tr><td>101</td><td>请求时需要验证码</td><td>手动登录相关网页过验证码。</td></tr><tr><td>102</td><td>请求超时</td><td>检查网络连接和代理配置是否正常，检查 API KEY 是否可用。</td></tr><tr><td>103</td><td>API 请求失败</td><td>检查网络连接和代理配置是否正常，检查 API KEY 是否可用。</td></tr><tr><td>104</td><td>不安全的请求内容</td><td>和模型聊天时使用了不安全的词语，尝试清除聊天记录后重试。</td></tr><tr><td>300</td><td>模型适配器未找到</td><td>检查模型适配器是否有启用。</td></tr><tr><td>301</td><td>模型未找到</td><td>检查模型是否可用，模型适配器是否初始化成功。</td></tr><tr><td>302</td><td>预设未找到</td><td>检查预设是否存在。</td></tr><tr><td>303</td><td>模型初始化失败</td><td>检查模型配置是否正确，检查网络和代码配置是否正常。</td></tr><tr><td>304</td><td>嵌入模型初始化失败</td><td>检查模型配置是否正确，检查网络和代码配置是否正常。</td></tr><tr><td>305</td><td>向量数据库加载失败</td><td>检查向量数据库配置是否正确，检查网络和代码配置是否正常。</td></tr><tr><td>306</td><td>聊天记录初始化失败</td><td>检查是否正确配置了 Koishi 的数据库。</td></tr><tr><td>307</td><td>没有可用的配置</td><td>检查所有的模型，嵌入模型，向量数据库配置是否正确。</td></tr><tr><td>308</td><td>初始化会话加载失败</td><td>同 101, 103。</td></tr><tr><td>309</td><td>模型返回为空</td><td>同 101, 103，并且还需要对话内容与检查预设是否有不合适的内容，对于不合适的内容模型可能不会生成回复。</td></tr><tr><td>310</td><td>模型关闭异常</td><td>同 309，如果按 309 无解决需要上报给开发者。</td></tr><tr><td>311</td><td>预设加载失败</td><td>检查预设是否存在，检查预设语法相关是否正确。</td></tr><tr><td>400</td><td>成员不在房间</td><td>检查成员是否在房间，或邀请他进入房间。</td></tr><tr><td>401</td><td>未加入房间</td><td>加入房间，或使用已经加入了的房间。</td></tr><tr><td>402</td><td>房间里没有找到房主</td><td>删除房间，或者转让房间给其他人 （注意需要 Koishi 的 3 级权限）。</td></tr><tr><td>403</td><td>模版房间错误</td><td>检查模版房间配置，把所有模版房间的配置项，都选择一次并保存。</td></tr><tr><td>404</td><td>有多个房间使用了同一个名字</td><td>使用房间的 id 调用，或修改房间的名字。</td></tr><tr><td>405</td><td>房间不存在</td><td>检查房间是否存在,或创建一个新房间。</td></tr><tr><td>406</td><td>初始化模版房间</td><td>一般情况下重新聊天问题即可解决，如果未解决请反馈给开发者。</td></tr><tr><td>500</td><td>知识库配置错误</td><td>检查你的知识库配置文件。</td></tr><tr><td>501</td><td>知识库未找到文档</td><td>检查报错 log，检查知识库配置里引用的文档是否存在。</td></tr><tr><td>502</td><td>知识库配置文件循环引用</td><td>检查你的知识库配置语法文件。</td></tr><tr><td>503</td><td>不支持上传到知识库的文件类型</td><td>检查你上传的文件类型是否支持，或者切换到其他支持的文件类型。</td></tr><tr><td>504</td><td>知识库上传的文件已存在</td><td>如需继续上传可以尝试强制上传或者先删除原文件后再上传。</td></tr><tr><td>505</td><td>知识库对应的向量数据库未找到</td><td>检查配置里引用的向量数据库是否存在。</td></tr><tr><td>600</td><td>授权用户未找到</td><td>直接问开发者。</td></tr><tr><td>601</td><td>配额组未找到</td><td>切换到其他配额组，或询问开发者。</td></tr><tr><td>602</td><td>配额组未加入</td><td>加入该配额组，或询问开发者。</td></tr><tr><td>603</td><td>配额组已经加入了</td><td>都加入了当前配额组，就别在重复加入了。</td></tr><tr><td>999</td><td>未知错误</td><td>附上 log 直接反馈给开发者。</td></tr></tbody></table>',4),s=[o];function c(_,i,h,l,n,p){return r(),d("div",null,s)}const m=t(a,[["render",c]]);export{f as __pageData,m as default};