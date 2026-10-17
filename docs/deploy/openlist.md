# OpenList

网盘聚合程序，是 AList 的开源分支（AList 被收购后由原贡献者发起），去掉商业化限制、重构 API，兼容夸克/百度/天翼等主流网盘。

https://github.com/OpenListTeam/OpenList

## 一键脚本安装

```bash
curl -fsSL https://res.oplist.org/script/v4.sh > install-openlist-v4.sh
sudo bash install-openlist-v4.sh
```

按提示完成安装，安装完成后会输出访问地址、账号和初始密码。

常用管理命令：

```bash
openlist server                # 启动服务
openlist admin set NEW_PASSWORD # 重置管理员密码
```

## Docker 部署

```yaml
services:
  openlist:
    image: openlistteam/openlist:latest
    container_name: openlist
    restart: unless-stopped
    ports:
      - "5244:5244"
    volumes:
      - ./data:/opt/openlist/data
```

```bash
docker compose up -d

# 查看初始密码
docker logs openlist 2>&1 | grep -i password
```

默认账号 `admin`，密码从日志里获取（搜 `Password is:` 或 `password`）。

## Nginx 反向代理

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name list.example.com;

    ssl_certificate      /opt/cert/example.com.crt;
    ssl_certificate_key  /opt/cert/example.com.key;

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Range $http_range;
        proxy_set_header If-Range $http_if_range;
        proxy_redirect off;
        proxy_pass http://127.0.0.1:5244;
        proxy_http_version 1.1;

        # 上传文件大小上限
        client_max_body_size 20000m;
    }
}
```

`Range` / `If-Range` 两个头是关键，网盘的断点续传、视频拖动、大文件流式传输都依赖它们，不能省。
