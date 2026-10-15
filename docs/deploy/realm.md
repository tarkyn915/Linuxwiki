# Realm 端口转发

高性能的 TCP/UDP 端口转发工具，用 Rust 编写。

https://github.com/zhboner/realm

## 安装

下载运行文件：

```bash
wget -O realm.tar.gz https://github.com/zhboner/realm/releases/download/v2.9.4/realm-x86_64-unknown-linux-gnu.tar.gz
tar -xvf realm.tar.gz
chmod +x realm
```

## 配置文件

`config.toml`：

```toml
[[endpoints]]
listen = "0.0.0.0:39999"
remote = "103.240.6.30:58650"

[[endpoints]]
listen = "[::]:40000"
remote = "[xxxx.xxxx.xxxx.xxxx]:45678"
```

## systemd 服务

`/etc/systemd/system/realm.service`：

```ini
[Unit]
Description=realm
After=network-online.target
Wants=network-online.target systemd-networkd-wait-online.service

[Service]
Type=simple
User=root
Restart=on-failure
RestartSec=5s
DynamicUser=true
WorkingDirectory=/root
ExecStart=/root/realm -c /root/config.toml

[Install]
WantedBy=multi-user.target
```

> 记得把 `WorkingDirectory` 和 `ExecStart` 的路径改成 realm 文件实际所在目录。

## 启动服务

```bash
systemctl daemon-reload
systemctl enable realm
systemctl restart realm
systemctl status realm
```
