# 公网部署与反向代理

默认配置下，WebUI 仅监听本地回路地址 `127.0.0.1`。如果你需要进行远程访问，推荐在实例前端部署一层带鉴权的反向代理 (Reverse Proxy)，而不是直接将服务端口暴露在公网上。

## 部署前的安全检查

在将服务接入公网前，请按顺序检查并完成以下安全配置：

1. **设置固定强口令**：通过环境变量 `CHATLUNA_TOKEN` 或配置文件显式设置满足复杂度要求的口令。在公网环境下，切勿依赖文件模式生成的随机临时口令。
2. **评估 `allowRemote` 配置**：`@chatluna/server` 提供的 `allowRemote` 选项用于控制服务是否接受非本机来源的请求。在公网暴露服务时，你必须显式评估并配置该项。
3. **保护管理前缀 (`protectedPrefixes`)**：检查并确保 `/api` 与 `/console` 均已加入 `protectedPrefixes` 列表中。
4. **终止 TLS/HTTPS**：在反向代理层配置 SSL/TLS 证书，严禁让实例以明文 HTTP 协议直接监听公网。

::: danger
如果你的实例加载了 `server-console` 插件，但未将 `/console` 写入 `protectedPrefixes` 配置中，执行 `doctor config` 命令时将直接报错并判定检查失败。

控制台内置的插件市场具备安装任意 npm 包的能力，若在未开启鉴权的情况下直接向公网暴露，攻击者可通过该接口获取服务器的代码执行权。
:::

## 配置 Nginx 反向代理

WebUI 的通信依赖 Server-Sent Events (SSE) 与 WebSocket。在配置反向代理时，你必须正确转发 `Upgrade` 与 `Connection` 请求头，并关闭对流式响应的缓冲处理。

以下是完整的 Nginx 站点配置示例，将你的域名反向代理至本地运行的 ChatLuna 实例（默认端口以 `5028` 为例）：

```nginx
server {
    listen 443 ssl;
    server_name chatluna.example.com;

    # SSL 证书配置（根据你的证书路径配置）
    # ssl_certificate /path/to/fullchain.pem;
    # ssl_certificate_key /path/to/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:5028;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # WebSocket 与 SSE 必需的协议升级头
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # 禁用流式接口缓冲，避免长连接中断
        proxy_buffering off;
        proxy_read_timeout 3600s;
    }
}
```

修改完成后，测试并重载你的 Nginx 服务使其生效。

## 替代方案：通过 SSH 隧道临时访问

如果你仅需临时在远程机器上连接实例进行排错，无需配置公网域名和反向代理，可以通过 SSH 本地端口转发 (Local Port Forwarding) 将远程服务的端口映射到本地：

```sh
ssh -L 5028:127.0.0.1:5028 user@server
```

建立 SSH 连接后，在本地浏览器中打开 `http://127.0.0.1:5028` 即可直接访问远程 WebUI。

## 下一步

- [权限模式](/manual/usage/permissions)
- [排错与诊断](./troubleshooting)
