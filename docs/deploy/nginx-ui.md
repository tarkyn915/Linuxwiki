# Nginx UI

Nginx 的图形化管理面板，基于 Web，可直接管理 Nginx 配置。

https://github.com/0xJacky/nginx-ui

## 安装

### 一键脚本

```bash
bash -c "$(curl -L https://cloud.nginxui.com/install.sh)" @ install
```

安装为 systemd 服务，默认监听端口 `9000`，HTTP Challenge 端口 `9180`。端口冲突时改 `/usr/local/etc/nginx-ui/app.ini`，再 `systemctl restart nginx-ui`。

### Docker

```bash
docker run -dit \
  --name=nginx-ui \
  --restart=always \
  -e TZ=Asia/Shanghai \
  -v /mnt/user/appdata/nginx:/etc/nginx \
  -v /mnt/user/appdata/nginx-ui:/etc/nginx-ui \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -p 8080:80 -p 8443:443 \
  uozi/nginx-ui:latest
```

Docker Compose：

```yaml
services:
  nginx-ui:
    stdin_open: true
    tty: true
    container_name: nginx-ui
    restart: always
    environment:
      - TZ=Asia/Shanghai
    volumes:
      - '/mnt/user/appdata/nginx:/etc/nginx'
      - '/mnt/user/appdata/nginx-ui:/etc/nginx-ui'
      - '/var/www:/var/www'
      - '/var/run/docker.sock:/var/run/docker.sock'
    ports:
      - 8080:80
      - 8443:443
    image: 'uozi/nginx-ui:latest'
```

首次访问 `http://<服务器IP>:8080/install` 完成初始化。

## 注意

- Nginx UI 遵循 Debian 的站点组织规范：站点配置放 `sites-available/`，启用的站点软链接到 `sites-enabled/`。
- 非 Debian / Ubuntu 系统需要在 `nginx.conf` 里手动加上：

```nginx
http {
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```
