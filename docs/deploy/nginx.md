# Nginx

https://nginx.org/

## 安装

```bash
sudo pacman -S nginx        # Arch
sudo apt install nginx      # Debian / Ubuntu
sudo dnf install nginx      # Rocky / Fedora
```

启动并开机自启：

```
sudo systemctl start nginx
sudo systemctl enable nginx
```

配置目录 `/etc/nginx/`，改完配置先测试再重载：

```
nginx -t
sudo systemctl reload nginx
nginx -s reload
```

### 各发行版默认配置差异

| | Debian / Ubuntu | Rocky / Fedora | Arch Linux |
| --- | --- | --- | --- |
| 站点配置目录 | `sites-available/` + `sites-enabled/`（软链接） | `conf.d/` | `conf.d/` |
| 默认站点文件 | `sites-available/default` | `conf.d/default.conf` | 直接写在 `nginx.conf` |
| 默认站点根目录 | `/var/www/html` | `/usr/share/nginx/html` | `/usr/share/nginx/html` |

- Debian / Ubuntu 用软链接启用站点：`ln -s /etc/nginx/sites-available/xxx.conf /etc/nginx/sites-enabled/`
- Rocky / Fedora / Arch 没有 `sites-enabled`，站点直接放 `conf.d/`，禁用改成 `.disabled` 后缀即可

## HTTP 跳转 HTTPS

```nginx
server {
    listen 80;
    listen [::]:80;
    # 只要是 xxx.com 结尾的域名，统统适用
    server_name .example.com;
    # $host 会自动识别
    return 301 https://$host$request_uri;
}
```

## 静态网站

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name example.com;
    root /var/www/site;
    index index.html index.htm;
    ssl_certificate /path/to/cert/fullchain.pem;
    ssl_certificate_key /path/to/cert/privkey.pem;
    location / {
        try_files $uri $uri/ =404;
    }
}
```

## 反向代理

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name example.com;
    ssl_certificate /path/to/cert/fullchain.pem;
    ssl_certificate_key /path/to/cert/privkey.pem;
    location / {
        proxy_pass http://127.0.0.1:9999;
        proxy_set_header Host $host;
        client_max_body_size 100M;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
    }
}
```
