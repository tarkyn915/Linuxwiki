# Navidrome

自托管音乐流媒体服务器，兼容 Subsonic API。

https://www.navidrome.org/

镜像：https://hub.docker.com/r/deluan/navidrome

## Docker 部署

```yaml
services:
  navidrome:
    image: deluan/navidrome:latest
    ports:
      - "4533:4533"
    restart: unless-stopped
    environment:
      # 默认语言
      ND_DEFAULTLANGUAGE: en
      # 默认主题
      ND_DEFAULTTHEME: Spotify-ish
      # 扫描计划，0 为关闭自动扫描
      ND_SCANSCHEDULE: 0
      # 日志级别
      ND_LOGLEVEL: info
      # 会话超时 24 小时
      ND_SESSIONTIMEOUT: 24h
      ND_BASEURL: ""
    volumes:
      - "/opt/navidrome:/data"
      - "/opt/navidrome/music:/music:ro"
```

访问 `http://<服务器IP>:4533`，首次会要求创建管理员账号。

## 外部集成

Navidrome 通过 agents 获取艺术家简介、图片、相似艺人等元数据，默认顺序 `deezer,lastfm,listenbrainz`，某个失败自动降级到下一个。

### Deezer

公共 API 免密钥，**默认已启用，无需任何配置**。

### Last.fm

需要申请免费 API 账号：https://www.last.fm/api/account/create

创建后拿到 API Key 和 Shared Secret，加到环境变量：

```yaml
environment:
  ND_LASTFM_APIKEY: "你的APIKey"
  ND_LASTFM_SECRET: "你的SharedSecret"
  # 检索语言，简体中文为 zh
  ND_LASTFM_LANGUAGE: zh
```

> 旧版用 `ND_SPOTIFY_ID` / `ND_SPOTIFY_SECRET` 做 Spotify 集成，**自 0.61.0 起已移除**，不再支持。

## Nginx 反向代理

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name music.example.com;
    ssl_certificate /path/to/cert/fullchain.pem;
    ssl_certificate_key /path/to/cert/privkey.pem;
    location / {
        proxy_pass http://127.0.0.1:4533;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        # 音乐流媒体需要即时传输，务必关闭缓冲
        proxy_buffering off;
        proxy_request_buffering off;
    }
}
```

> 如果反代到子路径（如 `/music`），需要同时设置环境变量 `ND_BASEURL=/music`，否则静态资源会加载失败。


