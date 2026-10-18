# Prometheus + Grafana

Prometheus 采集指标，Grafana 可视化展示，配合 Node Exporter 监控主机。

## 创建目录与 prometheus.yml

```bash
mkdir -p ~/monitor/prom-grafana && cd ~/monitor/prom-grafana
```

创建 `prometheus.yml`：

```yaml
global:
  scrape_interval: 15s     # 每 15 秒抓取一次数据
  evaluation_interval: 15s # 每 15 秒评估一次规则

scrape_configs:
  # 1. 监控 Prometheus 自身
  - job_name: 'prometheus'
    static_configs:
      - targets: ['127.0.0.1:9090']

  # 2. 监控标准 Linux 主机指标 (Node Exporter)
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['127.0.0.1:9100']
        labels:
          instance: 'my-vps'

  # 3. (可选) 联动抓取本机 Netdata 暴露的 Prometheus 格式指标
  - job_name: 'netdata'
    metrics_path: '/api/v1/allmetrics'
    params:
      format: ['prometheus']
    static_configs:
      - targets: ['127.0.0.1:19999']
        labels:
          instance: 'my-vps'

  # 4. blackbox_exporter 做 ICMP 网络质量监控（严格注意缩进）
  - job_name: '宁波移动'
    metrics_path: /probe
    params:
      module: [icmp]
    static_configs:
      - targets:
        - 39.188.192.10
        labels:
          instance: '宁波移动'
    relabel_configs:
    - source_labels: [__address__]
      target_label: __param_target
    - target_label: __address__
      replacement: 127.0.0.1:9115

  - job_name: '宁波联通'
    metrics_path: /probe
    params:
      module: [icmp]
    static_configs:
      - targets:
        - 221.12.32.22
        labels:
          instance: '宁波联通'
    relabel_configs:
    - source_labels: [__address__]
      target_label: __param_target
    - target_label: __address__
      replacement: 127.0.0.1:9115

  - job_name: '宁波电信'
    metrics_path: /probe
    params:
      module: [icmp]
    static_configs:
      - targets:
        - 218.75.80.26
        labels:
          instance: '宁波电信'
    relabel_configs:
    - source_labels: [__address__]
      target_label: __param_target
    - target_label: __address__
      replacement: 127.0.0.1:9115
```

## docker-compose.yml

> 避坑：Grafana 镜像用标准名 `grafana/grafana:latest`，避免部分国内镜像源因未同步 `grafana/grafana-oss:latest` 而报 not found。

```yaml
services:
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    network_mode: host
    pid: host
    restart: unless-stopped
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'

  blackbox-exporter:
    image: prom/blackbox-exporter:latest
    container_name: blackbox-exporter
    network_mode: host
    restart: unless-stopped
    command:
      - '--config.file=/etc/blackboxexporter/config.yml'

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    network_mode: host
    restart: unless-stopped
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=15d'      # 数据保留 15 天
      - '--storage.tsdb.retention.size=3GB'      # 数据最多占 3GB，防撑爆硬盘
      - '--web.enable-lifecycle'                 # 允许热重载配置
      - '--web.enable-remote-write-receiver'     # 开启 Remote Write 接收端

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    network_mode: host
    restart: unless-stopped
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  prometheus_data:
  grafana_data:
```

启动：

```bash
docker compose up -d
```

## 验证与 Grafana 配置

**验证 Prometheus 抓取状态**：访问 `http://服务器IP:9090/targets`，确认 node-exporter、prometheus（以及 netdata）的 State 均为绿色 `UP`。

**配置 Grafana 数据源**：访问 `http://服务器IP:3000`（默认账号密码 `admin` / `admin`）。

1. 左侧菜单进入 Connections -> Data sources -> Add new data source，选择 Prometheus
2. Prometheus server URL 填入 `http://127.0.0.1:9090`
3. 拉到底部点击 Save & test

## 数据配置选项

| 参数 | 说明 | 默认 |
| --- | --- | --- |
| `--storage.tsdb.path` | 数据库写入位置 | `data/` |
| `--storage.tsdb.retention.time` | 样本保留时长（单位 y/w/d/h/m/s/ms） | `15d` |
| `--storage.tsdb.retention.size` | 保留的最大字节数（单位 B/KB/MB/GB/TB/PB/EB） | `0`（禁用） |

建议把 `retention.size` 设为分配给 Prometheus 磁盘空间的 80-85%，防止数据把硬盘撑爆。

## Grafana 模板

配置完数据源后，可直接导入现成仪表盘，省得手搓面板。在 Grafana 左侧 Dashboards -> New -> Import 填入 ID：

| 用途 | 模板 ID | 链接 |
| --- | --- | --- |
| Node Exporter 主机指标 | `1860` | https://grafana.com/grafana/dashboards/1860-node-exporter-full/ |
| blackbox ICMP 网络质量 | `22441` | https://grafana.com/grafana/dashboards/22441-blackbox-ping/ |
| VPS 综合信息 | `22403` | https://grafana.com/grafana/dashboards/22403-node-information/ |

## 二进制安装（可选）

不想套 Docker 时，可从下载页获取预编译二进制，用 systemd 管理。exporter 同理。

https://prometheus.io/download/

Prometheus systemd 服务（`/etc/systemd/system/prometheus.service`，记得改文件路径）：

```ini
[Unit]
Description=Prometheus Service
After=network.target

[Service]
ExecStart=/opt/prometheus/prometheus \
--config.file=/opt/prometheus/prometheus.yml \
--web.read-timeout=5m  \
--web.max-connections=10 \
--storage.tsdb.retention.time=3d \
--storage.tsdb.retention.size=3GB \
--storage.tsdb.path=/opt/prometheus/data \
--query.max-concurrency=20 \
--query.timeout=2m

User=root

[Install]
WantedBy=multi-user.target
```

node_exporter 服务（`/etc/systemd/system/node-exporter.service`）：

```ini
[Unit]
Description=Prometheus Node Exporter
After=network.target

[Service]
ExecStart=/opt/prometheus/node-exporter/node_exporter

User=root

[Install]
WantedBy=multi-user.target
```

blackbox_exporter 服务（`/etc/systemd/system/blackbox.service`）：

```ini
[Unit]
Description=Prometheus blackbox
After=network.target

[Service]
ExecStart=/opt/blackbox/blackbox_exporter \
--config.file=/opt/blackbox/blackbox.yml

User=root

[Install]
WantedBy=multi-user.target
```
