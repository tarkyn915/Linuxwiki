# Cloudreve

私有云盘系统，底层支持多种云存储平台，可搭建个人网盘 / 文件分享系统

https://github.com/cloudreve/Cloudreve

> **社区版 vs Pro 版**：社区版免费开源（GPL-3.0），无限用户、含全部基础功能，个人/小团队够用；Pro 商业版按域名付费，多了分布式节点、Office 协作、付费变现等企业功能。个人自用选社区版即可，无用户数/存储上限等硬性限制

## 二进制部署

从 Releases 下载对应平台的压缩包：

https://github.com/cloudreve/Cloudreve/releases

```bash
# 解压主程序
tar -zxvf cloudreve_xxx.tar.gz

# 赋予执行权限
chmod +x ./cloudreve

# 启动 Cloudreve
./cloudreve
```

默认监听 `5212` 端口，首次启动时会在终端输出管理员账号密码（仅显示一次）

> 若忘记密码，删除 `cloudreve.db` 后重启即可重新初始化管理员账户

## systemd 服务

创建 `/usr/lib/systemd/system/cloudreve.service`：

```ini
[Unit]
Description=Cloudreve
Documentation=https://docs.cloudreve.org
After=network.target
After=mysqld.service
Wants=network.target

[Service]
WorkingDirectory=/opt/cloudreve
ExecStart=/opt/cloudreve/cloudreve
Restart=on-abnormal
RestartSec=5s
KillMode=mixed
StandardOutput=null
StandardError=syslog

[Install]
WantedBy=multi-user.target
```

> `WorkingDirectory` / `ExecStart` 路径要跟实际解压位置一致

启动并开机自启：

```bash
systemctl daemon-reload
systemctl start cloudreve
systemctl enable cloudreve
```

访问 `http://服务器IP:5212`
