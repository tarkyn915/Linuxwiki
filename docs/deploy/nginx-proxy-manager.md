# Nginx Proxy Manager

基于 Web 的 Nginx 反向代理管理面板，自带 Let's Encrypt 证书申请。

https://github.com/NginxProxyManager/nginx-proxy-manager

## 安装

Docker Compose：

```yaml
services:
  app:
    image: 'docker.io/jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

启动：

```bash
docker compose up -d
```

## 访问

管理面板端口 `81`，默认账号：

```
邮箱    admin@example.com
密码    changeme
```

首次登录后会要求修改。
