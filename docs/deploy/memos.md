# Memos

轻量自托管的碎片笔记 / 微博客服务，支持 Markdown、标签、待办、代码块和多用户。

https://github.com/usememos/memos

文档：https://usememos.com/docs

镜像：https://hub.docker.com/r/neosmemo/memos

## Docker Compose 部署

```yaml
services:
  memos:
    image: neosmemo/memos:stable
    container_name: memos
    restart: unless-stopped
    ports:
      # 只监听本机，由 Nginx 反代对外
      - "127.0.0.1:5230:5230"
    volumes:
      - ./data:/var/opt/memos
    environment:
      MEMOS_PORT: 5230
      MEMOS_DRIVER: sqlite
      MEMOS_INSTANCE_URL: https://memos.example.com
```

```bash
docker compose up -d
docker compose logs -f
```

数据全部在 `./data` 下：`memos_prod.db`（SQLite）和 `assets/`（上传的图片附件）。

## Nginx 反向代理

```nginx
# memos
server {
  listen 443 ssl;
  listen [::]:443 ssl;
  http2 on;

  server_name memos.example.com;

  ssl_certificate      /path/to/cert/fullchain.pem;
  ssl_certificate_key  /path/to/cert/privkey.pem;

  location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Range $http_range;
    proxy_set_header If-Range $http_if_range;
    proxy_redirect off;
    proxy_pass http://127.0.0.1:5230;
    proxy_http_version 1.1;
    # 上传文件大小上限
    client_max_body_size 500m;
  }
}
```

`nginx -t && nginx -s reload`，然后访问 `https://memos.example.com`。

## 升级与备份

```bash
# 升级（data 目录不动）
docker compose pull && docker compose up -d
```

备份直接打包数据目录（SQLite 建议停容器再拷，或用 `.backup` 在线备份）：

```bash
docker compose stop
tar -czf memos-$(date +%Y%m%d).tar.gz data
docker compose start

# 容器运行中在线备份
sqlite3 data/memos_prod.db ".backup data/memos_backup.db"
```
