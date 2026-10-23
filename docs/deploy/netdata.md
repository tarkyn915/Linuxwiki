# Netdata

实时服务器监控，自带 Web 仪表盘，CPU/内存/网络/磁盘等指标开箱即用，支持 Prometheus 导出

https://github.com/netdata/netdata

## 部署目录

```bash
mkdir -p ~/monitor/netdata && cd ~/monitor/netdata
```

## netdata.conf

启动容器前先建好 `netdata.conf`（不提前建好文件就直接挂载，Docker 会把它创建成同名空文件夹导致报错）：

```ini
[db]
    mode = dbengine
    storage tiers = 3
    # Tier 0 (每秒精度)：从默认 1024MB 缩减为 256MB
    dbengine tier 0 disk space MB = 256
    # Tier 1 (每分钟精度)：从默认 1024MB 缩减为 128MB
    dbengine tier 1 disk space MB = 128
    # Tier 2 (每小时精度)：从默认 1024MB 缩减为 64MB
    dbengine tier 2 disk space MB = 64

[web]
    # 默认监听所有地址；如需只允许本机或反代访问，可改为 bind to = 127.0.0.1
    bind to = *
```

> 三层存储磁盘占用从默认的 3×1024MB 缩减到 256+128+64MB，避免吃满 VPS 磁盘

## docker-compose.yml

```yaml
services:
  netdata:
    image: netdata/netdata:stable
    container_name: netdata
    pid: host
    network_mode: host
    restart: unless-stopped
    cap_add:
      - SYS_PTRACE
      - SYS_ADMIN
    security_opt:
      - apparmor:unconfined
    volumes:
      # 将当前目录的 netdata.conf 直接映射进容器
      - ./netdata.conf:/etc/netdata/netdata.conf:ro
      # 其他内部配置、数据与缓存使用命名卷持久化
      - netdataconfig:/etc/netdata
      - netdatalib:/var/lib/netdata
      - netdatacache:/var/cache/netdata
      # 挂载宿主机系统信息（只读）以供采集
      - /:/host/root:ro,rslave
      - /etc/passwd:/host/etc/passwd:ro
      - /etc/group:/host/etc/group:ro
      - /etc/localtime:/etc/localtime:ro
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /etc/os-release:/host/etc/os-release:ro
      - /var/log:/host/var/log:ro
      # 挂载 docker.sock 以监控宿主机上的其他 Docker 容器状态
      - /var/run/docker.sock:/var/run/docker.sock:ro

volumes:
  netdataconfig:
  netdatalib:
  netdatacache:
```

## 启动

```bash
docker compose up -d
docker compose ps   # 确认状态 Up / healthy
```

访问 `http://服务器IP:19999`，在欢迎页左侧表格的 `Disk -> Configured` 列能看到三个 `1 GB` 已变成 `256 MB`、`128 MB`、`64 MB`

## Prometheus 导出

```bash
curl -s "http://127.0.0.1:19999/api/v1/allmetrics?format=prometheus" | head -n 20
```

输出以 `# COMMENT` 和 `netdata_` 开头的指标文本，即可被 Prometheus 抓取
