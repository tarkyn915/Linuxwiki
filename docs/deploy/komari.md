# Komari

轻量自托管服务器监控，实时查看服务器状态，通过轻量 Agent 采集数据。

https://github.com/komari-monitor/komari

文档：https://www.komari.wiki/

## Docker 部署

```bash
mkdir -p ./data
docker run -d \
  -p 25774:25774 \
  -v $(pwd)/data:/app/data \
  --name komari \
  --restart unless-stopped \
  ghcr.io/komari-monitor/komari:latest
```

初始账号密码从日志里看：

```bash
docker logs komari
```

也可以启动时用环境变量自定义：

```bash
-e ADMIN_USERNAME=admin -e ADMIN_PASSWORD=你的密码
```

访问 `http://<服务器IP>:25774`。

## 一键脚本

适用于 systemd 发行版（Ubuntu、Debian 等）：

```bash
curl -fsSL https://raw.githubusercontent.com/komari-monitor/komari/main/install-komari.sh -o install-komari.sh
chmod +x install-komari.sh
sudo ./install-komari.sh
```

安装完成后终端会显示登录地址、用户名和密码。

## Nginx 反向代理

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name komari.example.com;
    ssl_certificate /path/to/cert/fullchain.pem;
    ssl_certificate_key /path/to/cert/privkey.pem;
    location / {
        proxy_pass http://127.0.0.1:25774;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # WebSocket 支持（实时监控数据）
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300;
    }
}
```
