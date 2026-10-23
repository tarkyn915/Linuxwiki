# Fast Note Sync

高性能笔记同步服务，配合 Obsidian 插件实现多设备笔记实时同步

服务端：https://github.com/haierkeys/fast-note-sync-service

客户端：Obsidian 社区插件市场搜索 `Fast Note Sync` 安装即可

## 部署

### 一键脚本

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/haierkeys/fast-note-sync-service/master/scripts/quest_install.sh)
```

国内用 cnb.cool 镜像：

```bash
bash <(curl -fsSL https://cnb.cool/haierkeys/fast-note-sync-service/-/git/raw/master/scripts/quest_install.sh) --cnb
```

### Docker

```yaml
services:
  fast-note-sync-service:
    image: haierkeys/fast-note-sync-service:latest
    container_name: fast-note-sync-service
    restart: always
    ports:
      - "9000:9000"
    volumes:
      - ./storage:/fast-note-sync/storage
      - ./config:/fast-note-sync/config
```

访问 `http://<服务器IP>:9000`，首次访问注册账号，然后在后台「Copy API Config」复制配置到 Obsidian 插件里

## Nginx 反向代理

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name note.example.com;
    client_max_body_size 50m;
    proxy_max_temp_file_size 0;
    proxy_buffering off;
    ssl_certificate /path/to/cert/fullchain.pem;
    ssl_certificate_key /path/to/cert/privkey.pem;
    location / {
        proxy_pass http://127.0.0.1:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    location /api/user/sync {
        proxy_pass http://127.0.0.1:9000/api/user/sync;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

> `/api/user/sync` 是 WebSocket 接口，必须单独配 `Upgrade` / `Connection`，否则笔记无法实时同步
