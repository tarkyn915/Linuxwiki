# FileBrowser Quantum

自托管 Web 文件管理器，是原版 filebrowser 的重度 fork，支持多源、OIDC/LDAP/2FA 登录、WebDAV、API Token 等

https://github.com/gtsteffaniak/filebrowser

https://filebrowserquantum.com/en/

## 部署参数概览

| 项 | 值 |
| --- | --- |
| 安装及配置路径 | `/opt/filebrowser/data` |
| 实际文件挂载路径 | `/opt/filebrowser/myfiles` |
| 外部访问端口 | `7788` |
| 默认管理员账号 | `admin` |
| 预设管理员密码 | `Admin123456`（可在 config 中自定义） |

## 完整安装步骤

### 1. 创建目录并配置权限

容器内部默认以 `1000:1000`（非 root 用户）运行，创建目录后需修改所有者权限，避免报 `permission denied`：

```bash
mkdir -p /opt/filebrowser/data /opt/filebrowser/myfiles
chown -R 1000:1000 /opt/filebrowser/data /opt/filebrowser/myfiles
cd /opt/filebrowser
```

### 2. 创建 config.yaml 配置文件

新版对 YAML 字段校验严格（无需在 `server` 下填写 `port` 字段），同时直接在 `auth` 中指定 `adminPassword` 以固定初始密码：

```yaml
server:
  cacheDir: /home/filebrowser/data/tmp
  sources:
    - path: "/myfiles"
      name: "我的文件"
      config:
        defaultEnabled: true
auth:
  adminUsername: admin
  adminPassword: "Admin123456"
frontend:
  name: "FileBrowser Quantum"
```

### 3. 创建 docker-compose.yaml 文件

容器内部默认监听 `80` 端口，映射到宿主机 `7788`：

```yaml
services:
  filebrowser:
    image: ghcr.io/gtsteffaniak/filebrowser:stable
    container_name: filebrowser-quantum
    restart: unless-stopped
    ports:
      - "7788:80"
    volumes:
      - /opt/filebrowser/data:/home/filebrowser/data
      - /opt/filebrowser/myfiles:/myfiles
    environment:
      - TZ=Asia/Shanghai
```

### 4. 启动服务

```bash
cd /opt/filebrowser
docker compose up -d
```

访问 `http://服务器IP:7788`，账号 `admin`，密码 `Admin123456`

## 关键说明

- **数据库** — v2.0.0 起用 SQLite，默认 `/home/filebrowser/data/database.sqlite`（随 `data` 卷持久化）
- **镜像变体** — 默认 `stable`（约 60MB，含 ffmpeg 预览），可选 `stable-slim`（15MB，仅核心功能，无媒体/文档预览）

## Nginx 反向代理

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name file.example.com;  # 替换为你的域名

    ssl_certificate      /path/to/cert/example.com.crt;
    ssl_certificate_key  /path/to/cert/example.com.key;

    # 核心优化 1：解除上传文件大小限制（0 表示无限制，防止上传大文件报 413 错误）
    client_max_body_size 0;

    # 核心优化 2：加长超时时间，防止大文件上传/下载或视频拖拽时断连
    proxy_connect_timeout 600s;
    proxy_send_timeout 600s;
    proxy_read_timeout 600s;

    location / {
        proxy_pass http://127.0.0.1:7788;

        # 传递真实客户端 IP 和协议头
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 核心优化 3：支持 WebSocket（Quantum 的实时索引状态与 UI 通知依赖此项）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # 核心优化 4：关闭代理缓冲，实现大文件直传与视频流秒开，不挤占 VPS 磁盘缓存
        proxy_buffering off;
        proxy_request_buffering off;
    }
}
```
