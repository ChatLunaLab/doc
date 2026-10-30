# 公网部署

::: tip
本节介绍如何安全地将实例暴露到公网，包括反向代理 (Reverse Proxy)、HTTPS 加密、口令凭据与访问控制 (Access Control)。
:::

默认部署状态下，WebUI 仅绑定在本地回路地址 `127.0.0.1`。如果你需要进行远程访问，推荐的做法是在实例前端部署一层带鉴权的反向代理，而不是直接放开公网端口监听。

## 部署前的安全检查

在将服务接入公网前，请依次确认以下安全项：

- **设置强口令**：通过环境变量 `CHATLUNA_TOKEN` 或配置文件显式配置满足强度要求的固定口令。不要在公网环境依赖文件模式生成的随机临时口令。
- **评估 `allowRemote`**：`@chatluna/server` 的 `allowRemote` 选项控制服务是否接受非本机来源的请求。在公网暴露时必须显式评估该配置项。
- **保护管理前缀 (`protectedPrefixes`)**：确保 `/api` 与 `/console` 已列入 `protectedPrefixes`。
- **终止 TLS/HTTPS**：在反向代理层配置证书并终止 TLS，禁止让实例以明文 HTTP 协议直接监听公网。

::: danger
如果加载了 `server-console` 插件，但未将 `/console` 包含在 `protectedPrefixes` 中，运行 `doctor config` 会直接报错判定失败。
控制台的插件市场具备安装任意 npm 包的能力，未配置鉴权直接暴露相当于将服务器的代码执行权交出。
:::

## 配置反向代理

WebUI 通信依赖 Server-Sent Events (SSE) 与 WebSocket。配置反向代理时，必须正确转发 `Upgrade` 与 `Connection` 协议头。

以 Nginx 为例，将域名解析并代理至本地服务端口：

```nginx
server {
    listen 443 ssl;
    server_name chatluna.example.com;

    # SSL 证书配置略

    location / {
        proxy_pass http://127.0.0.1:5028;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # WebSocket 与 SSE 必须的协议切换支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

配置完成后，重载 Nginx 配置以生效。

## 使用 SSH 隧道进行临时访问

如果你只需要临时从远端连接实例进行调试，无需配置公网反向代理与域名，可以使用 SSH 本地端口转发将远程端口映射到本地：

```sh
ssh -L 5028:127.0.0.1:5028 user@server
```

建立连接后，直接在本地浏览器访问 `http://127.0.0.1:5028` 即可。

## 下一步

- [权限与安全](../usage/permissions)
- [排错与诊断](/cookbook/troubleshooting)
