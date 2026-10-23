# 哪吒监控

开源自托管服务器监控与运维平台，一个 Dashboard 管理多台 Agent

https://nezha.wiki/

## 安装 Dashboard

一键脚本：

```bash
curl -L https://raw.githubusercontent.com/nezhahq/scripts/refs/heads/main/install.sh -o nezha.sh
chmod +x nezha.sh
sudo ./nezha.sh
```

国内服务器用 gitee 镜像：

```bash
curl -L https://gitee.com/naibahq/scripts/raw/main/install.sh -o nezha.sh
chmod +x nezha.sh
sudo CN=true ./nezha.sh
```

安装过程按提示输入站点标题、暴露端口（默认 `8008`）、后台语言

## 访问

管理后台路径为 `/dashboard`：

```
http://<服务器IP>:8008/dashboard
```

默认用户名密码均为 `admin`，**安装后立即修改**

## Nginx 反向代理

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name nezha.example.com;
    ssl_certificate /path/to/cert/fullchain.pem;
    ssl_certificate_key /path/to/cert/privkey.pem;
    location / {
        proxy_pass http://127.0.0.1:8008;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # WebSocket 支持
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 300;
    }
}
```

> Agent 与 Dashboard 的通信走长连接，反代时需保证 WebSocket 正常，否则 Agent 会掉线

