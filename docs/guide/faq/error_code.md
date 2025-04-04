# 错误码表

本节会将 ChatLuna 里的常见错误码列出，并给出某些可能的解决方案。

:::warning 警告
如果尝试了下面的解决方案后仍然无效，请联系开发者以解决问题（需要提供错误日志）。
:::

| 错误码  | 含义                         |     可能的解决方案    |
|--------|-----------------------------|---------------------|
| 1      | 网络错误                      | 检查代理配置，网络连接是否正常、 |
| 2      | 不支持的代理协议               | 检查代理配置，是否选择了正确的协议 (只支持 http/sock5) |
| 3      | 队列溢出               | 大量请求！难得 ChatLuna 能被这么多人用呢。。 |
| 4      | 渲染出错               | 根据房间的渲染模式，检查 Puppeteer 浏览器渲染配置，语音服务等。 |
| 5      | 请求被中断               | 一般是用户手动调用 `chatluna.chat.stop` 中断的，无需处理 |
| 100    | API KEY 无效                 | 检查 API KEY 是否可用。 |
| 101    | 请求时需要验证码               | 手动登录相关网页过验证码。 |
| 102    | 请求超时               | 检查网络连接和代理配置是否正常，检查 API KEY 是否可用。 |
| 103    | API 请求失败               | 检查网络连接和代理配置是否正常，检查 API KEY 是否可用。 |
| 104 | 不安全的请求内容 | 和模型聊天时使用了不安全的词语，尝试清除聊天记录后重试。 |
| 300    | 模型适配器未找到               | 检查模型适配器是否有启用。|
| 301    | 模型未找到                     | 检查模型是否可用，模型适配器是否初始化成功。|
| 302    | 预设未找到                   | 检查房间的目标预设是否存在，检测预设格式是否正确。|
| 303    | 模型初始化失败                 | 检查模型配置是否正确，检查网络和代码配置是否正常。|
| 304    | 嵌入模型初始化失败             | 检查模型配置是否正确，检查网络和代码配置是否正常。 |
| 305    | 向量数据库加载失败                   | 检查向量数据库配置是否正确，检查网络和代码配置是否正常。 |
| 306    | 聊天记录初始化失败                   | 检查是否正确配置了 Koishi 的数据库。 |
| 307    | 没有可用的配置                   | 检查所有的模型，嵌入模型，向量数据库配置是否正确。 |
| 308    | 初始化会话加载失败                   | 同 101, 103。 |
| 309    | 模型返回为空                   | 同 101, 103，并且还需要对话内容与检查预设是否有不合适的内容，对于不合适的内容模型可能不会生成回复。 |
| 310 | 模型关闭异常 | 同 309，如果按 309 无解决需要上报给开发者。 |
| 311 | 预设加载失败 | 检查预设是否存在，检查预设语法相关是否正确。 |
| 400 | 成员不在房间 | 检查成员是否在房间，或邀请他进入房间。 |
| 401 | 未加入房间 | 加入房间，或使用已经加入了的房间。 |
| 402 | 房间里没有找到房主 | 删除房间，或者转让房间给其他人 （注意需要 Koishi 的 3 级权限）。|
| 403 | 模版房间错误 | 检查模版房间配置，把所有模版房间的配置项，都选择一次并保存。 |
| 404 | 有多个房间使用了同一个名字 | 使用房间的 id 调用，或修改房间的名字。 |
| 405 | 房间不存在 | 检查房间是否存在,或创建一个新房间。 |
| 406 | 初始化模版房间 | 一般情况下重新聊天问题即可解决，如果未解决请反馈给开发者。 |
| 500 | 知识库配置错误 | 检查你的知识库配置文件。 |
| 501 | 知识库未找到文档 | 检查报错 log，检查知识库配置里引用的文档是否存在。 |
| 502 | 知识库配置文件循环引用 | 检查你的知识库配置语法文件。 |
| 503 | 不支持上传到知识库的文件类型 | 检查你上传的文件类型是否支持，或者切换到其他支持的文件类型。 |
| 504 | 知识库上传的文件已存在 | 如需继续上传可以尝试强制上传或者先删除原文件后再上传。|
| 505 | 知识库对应的向量数据库未找到 | 检查配置里引用的向量数据库是否存在。 |
| 600 | 授权用户未找到 | 直接问开发者。 |
| 601 | 配额组未找到 | 切换到其他配额组，或询问开发者。 |
| 602 | 配额组未加入 | 加入该配额组，或询问开发者。 |
| 603 | 配额组已经加入了 | 都加入了当前配额组，就别在重复加入了。 |
| 999 | 未知错误 | 附上 log 直接反馈给开发者。 |
