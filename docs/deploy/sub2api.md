# Sub2api

把 ChatGPT Plus / Claude Pro / Gemini 等网页订阅转换成标准 API，支持账号池调度、限流、计费。

https://github.com/Wei-Shaw/sub2api

## 部署

Docker Compose 一键部署（依赖 PostgreSQL + Redis）：

```bash
# Create deployment directory
mkdir -p sub2api-deploy && cd sub2api-deploy
# Download and run deployment preparation script
curl -sSL https://raw.githubusercontent.com/Wei-Shaw/sub2api/main/deploy/docker-deploy.sh | bash
# Start services
docker compose up -d
# View logs
docker compose logs -f sub2api
```

脚本会自动生成 `.env`（JWT 密钥、数据库密码等）并创建数据持久化目录。

## 限制内网访问

默认端口 `8080` 直接暴露公网，建议改成只绑定回环地址，配合 Nginx 反代对外：

```yaml
ports:
  - "127.0.0.1:${SERVER_PORT:-8080}:8080"
```

## 访问

访问 `http://<服务器IP>:8080`。

初始管理员账号密码在日志里：

```bash
docker logs sub2api 2>&1 | grep -i "admin password"
```

## Nginx 反向代理

```nginx
underscores_in_headers on;

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name ai.example.com;
    ssl_certificate /opt/cert/example.com.crt;
    ssl_certificate_key /opt/cert/example.com.key;
    location / {
        proxy_pass http://127.0.0.1:8080;
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

