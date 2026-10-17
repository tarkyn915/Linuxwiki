# SmokePing

网络延迟监控，用图表展示各节点丢包率和延迟，支持 FPing 等探针。

镜像：https://hub.docker.com/r/linuxserver/smokeping

## Docker 部署

```yaml
services:
  smokeping:
    image: lscr.io/linuxserver/smokeping:latest
    container_name: smokeping
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
    volumes:
      - /opt/smoke/smokeping/config:/config
      - /opt/smoke/smokeping/data:/data
    ports:
      - 9090:80
    restart: unless-stopped
```

访问 `http://<服务器IP>:9090`。

监控目标配置写入 `/config/Targets`（容器内），改完重启容器生效。

## 三网监控模板

<details>
<summary>展开完整 Targets 模板</summary>

```
*** Targets ***

probe = FPing

menu = Top
title = Network Latency
remark = 三网+国际

+ Other
menu = 三网监控
title = 监控统计

++ CT
menu = 电信网络监控
title = 电信网络监控列表
host = /Other/CT/CT-HZ /Other/CT/CT-SH /Other/CT/CT-NB

+++ CT-HZ
menu = 杭州电信
title = 杭州电信
alerts = someloss
host = 122.225.217.219

+++ CT-SH
menu = 上海电信
title = 上海电信
alerts = someloss
host = 210.5.157.1

+++ CT-NB
menu = 宁波电信
title = 宁波电信
alerts = someloss
host = 115.231.32.10

++ CU
menu = 联通网络监控
title = 联通网络监控列表
host = /Other/CU/CU-BJ /Other/CU/CU-SH /Other/CU/CU-NB /Other/CU/CU-HZ

+++ CU-BJ
menu = 北京联通
title = 北京联通
alerts = someloss
host = 61.135.169.121

+++ CU-SH
menu = 上海联通
title = 上海联通
alerts = someloss
host = 211.95.52.116

+++ CU-NB
menu = 宁波联通
title = 宁波联通
alerts = someloss
host = 221.12.32.22

+++ CU-HZ
menu = 杭州联通
title = 杭州联通
alerts = someloss
host = 221.12.170.10

++ CMCC
menu = 移动网络监控
title = 移动网络监控列表
host = /Other/CMCC/CMCC-BJ /Other/CMCC/CMCC-SH /Other/CMCC/CMCC-HZ /Other/CMCC/CMCC-NB

+++ CMCC-BJ
menu = 北京移动
title = 北京移动
alerts = someloss
host = 221.130.33.52

+++ CMCC-SH
menu = 上海移动
title = 上海移动
alerts = someloss
host = 117.185.253.224

+++ CMCC-HZ
menu = 杭州移动
title = 杭州移动
alerts = someloss
host = 112.17.226.165

+++ CMCC-NB
menu = 宁波移动
title = 宁波移动
alerts = someloss
host = 39.188.192.10

+ global
menu = 国际
title = 监控统计
host = /global/cf /global/yt /global/gg /global/sbd

++ cf
menu = Cloudflare
title = Cloudflare
alerts = someloss
host = www.cloudflare.com

++ yt
menu = YouTube
title = YouTube
alerts = someloss
host = www.youTube.com

++ gg
menu = google
title = google
alerts = someloss
host = www.google.com

++ sbd
menu = 美国圣何塞
title = 美国圣何塞
alerts = someloss
host = 209.209.57.3
```

</details>
