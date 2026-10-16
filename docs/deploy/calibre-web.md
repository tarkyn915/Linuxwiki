# Calibre-Web

基于 Calibre 的电子书管理 Web 界面，支持在线阅读、格式转换、OPDS。

https://github.com/janeczku/calibre-web

镜像：https://hub.docker.com/r/linuxserver/calibre-web

## Docker 部署

```yaml
services:
  calibre-web:
    image: lscr.io/linuxserver/calibre-web:latest
    container_name: calibre-web
    environment:
      - PUID=0
      - PGID=0
      - TZ=Etc/UTC
      - DOCKER_MODS=linuxserver/mods:universal-calibre #optional
      - OAUTHLIB_RELAX_TOKEN_SCOPE=1 #optional
    volumes:
      - ./config:/config
      - ./books:/books
    ports:
      - 8083:8083
    restart: unless-stopped
```

访问 `http://<服务器IP>:8083`，默认账号密码：

```
admin / admin123
```

## 初始设置

首次登录后：

1. 修改默认账号密码
2. 启用上传功能（管理员 → 配置 → 允许上传）
3. 启用匿名用户访问

> `books` 目录需要有一个 `metadata.db`（Calibre 数据库）。若目录为空，首次启动时 Calibre-Web 会自动创建空库，也可以用 Calibre 桌面版生成后放入。

## Nginx 反向代理

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name books.example.com;
    ssl_certificate /path/to/cert/fullchain.pem;
    ssl_certificate_key /path/to/cert/privkey.pem;
    location / {
        proxy_pass http://127.0.0.1:8083;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 100M;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_buffering off;
        proxy_request_buffering off;
    }
}
```

> 配置反代后，需要在 Calibre-Web 管理后台把「基础配置」里的域名/端口改成反代的地址，否则 Cookie 和上传会有问题。

