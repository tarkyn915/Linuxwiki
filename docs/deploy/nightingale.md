# 夜莺 Nightingale

开源监控告警中心，单机内置 SQLite + MiniRedis 即可运行（无需 MySQL/Redis），对接 Prometheus 做告警与可视化。

https://github.com/ccfos/nightingale

## 单容器部署

```bash
mkdir -p ~/monitor/nightingale/data && cd ~/monitor/nightingale
chmod 777 ./data
```

创建 `docker-compose.yml`：

```yaml
services:
  nightingale:
    image: flashcatcloud/nightingale:latest
    container_name: nightingale
    network_mode: host
    restart: unless-stopped
    working_dir: /app
    # 关键修复：覆盖官方镜像默认带 -h 的入口点，直接启动 n9e 服务
    entrypoint: ["/app/n9e"]
    volumes:
      - ./data:/app/data
```

> 核心避坑：官方镜像默认 ENTRYPOINT 是 `["/app/n9e"]` 且默认参数为 `-h`（打印帮助即退出）。不能用 `command: ["/app/n9e"]`（会拼成 `/app/n9e /app/n9e` 报错），必须用 `entrypoint: ["/app/n9e"]` 覆盖。

启动并验证端口：

```bash
docker compose up -d
ss -tulpn | grep 17000   # 确认 17000 端口 LISTEN
```

## 初始化与对接 Prometheus

访问 `http://服务器IP:17000`，默认账号 `root`，默认密码 `root.2020`。

1. 点击左下角 `Admin (root)` 旁的设置（齿轮图标），语言切换为「简体中文」
2. 左侧导航进入「集成中心 / 系统配置 -> 数据源」
3. 添加 Prometheus，名称填 `local-prometheus`，URL 填 `http://127.0.0.1:9090`，点击「测试并保存」

## 告警规则三大避坑

在「告警管理 -> 告警规则」中创建规则时，注意以下三个细节：

### 避坑 1：区分 Categraf 与 Node Exporter 指标名

夜莺内置的通用 Linux 模板默认用自家采集器 Categraf 的指标名（如 `cpu_usage_active`、`mem_used_percent`）。若底层用的是 Node Exporter，必须导入标注 Node Exporter 的模板，或手动用 `node_` 开头的 PromQL：

```
# 系统 1 分钟负载
node_load1 > 2（测试时可设为 > 0）

# CPU 使用率（%）
100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80

# 内存使用率（%）
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85

# 根分区磁盘使用率（%）
(1 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"})) * 100 > 85
```

### 避坑 2：「持续时长（For）」防抖机制

规则的「持续时长」默认 60s~180s，表示指标必须连续超标指定时间才触发，防止瞬时毛刺误报。测试告警链路时，可把「执行频率」设 15 秒、「持续时长」设 0 秒，删除多余的空条件框，保存后 15 秒即可在「活跃告警」中看到触发记录。

### 避坑 3：数据源与启用开关

弹窗里的「数据预览」数据源仅用于临时测试，必须在规则编辑页的「步骤 2（数据源配置）」中正式选中 `local-prometheus`，并在规则列表页确认右侧「启用开关」处于开启状态。
