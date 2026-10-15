# Uptime Kuma

自托管的服务监控工具，支持 HTTP/TCP/DNS 等多种探活方式。

https://github.com/louislam/uptime-kuma

## host 模式

如需监控 IPv6 地址，用 host 模式最省事（之前测试配 v6 把地址搞没了，还是用 host 吧）：

```yaml
services:
  uptime-kuma:
    image: louislam/uptime-kuma:2
    restart: unless-stopped
    network_mode: host
    volumes:
      - ./data:/app/data
```

> 简单方便，但无法隔离。

## 配置 v6 模式

如果不用 host 模式，也可以给 Docker 配置 IPv6 让容器拿到 v6 地址。

在 `/etc/docker/daemon.json` 配置 v6：

```json
{
  "ipv6": true,
  "fixed-cidr-v6": "fd80::/64",
  "ip6tables": true
}
```

```yaml
services:
  uptime-kuma:
    image: louislam/uptime-kuma:2
    restart: unless-stopped
    volumes:
      - ./data:/app/data
    ports:
      - "3001:3001"
    networks:
      - uptime-kuma-network

networks:
  uptime-kuma-network:
    driver: bridge
    enable_ipv6: true
    ipam:
      config:
        - subnet: "fd00:1234:5678::/64"
```

参考：https://www.ioioi.cn/posts/modify-docker-composite-to-enable-uptime-kuma-to-support-ipv6.html

## 访问

默认端口 `3001`，访问 `http://<服务器IP>:3001`，首次登录创建管理员账号。
