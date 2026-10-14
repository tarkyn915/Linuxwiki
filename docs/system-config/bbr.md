# BBR 拥塞控制

对于丢包高延迟的机器效果十分显著

## 创建配置文件

数字越大优先级越高，用 `nano`（或 `vim`）新建配置文件：

```
nano /etc/sysctl.d/99-bbr.conf
```

## FQ + BBR 稳妥版

把下面内容粘进去保存：

```
# 队列与拥塞控制
net.core.default_qdisc = fq
net.ipv4.tcp_congestion_control = bbr

# 文件与 inotify
fs.file-max = 1048576
fs.inotify.max_user_instances = 8192

# TCP 基础
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_timestamps = 1
net.ipv4.tcp_ecn = 2
net.ipv4.tcp_fin_timeout = 30

# 端口与连接队列
net.ipv4.ip_local_port_range = 1024 65535
net.ipv4.tcp_max_syn_backlog = 16384
net.core.somaxconn = 16384
net.core.netdev_max_backlog = 16384

# 新版内核默认通常就是 2：仅允许 loopback TIME_WAIT 重用
net.ipv4.tcp_tw_reuse = 2

# SYN 重传：不要设得过激进
net.ipv4.tcp_syn_retries = 5
net.ipv4.tcp_synack_retries = 2
```

## 生效与验证

加载所有配置文件：

```
sudo sysctl --system
```

检查 bbr 是否载入：

```
lsmod | grep bbr
```

能看到 `tcp_bbr` 说明已经生效。
