# ArchiSteamFarm (ASF)

Steam 挂机工具，自动挂卡、领取掉落物、玩游戏时间。

https://github.com/JustArchiNET/ArchiSteamFarm

## 创建运行用户

配置 ASF 前先建一个普通用户，方便后面的守护进程：

```bash
adduser asf   # 新建 asf 用户，记得选择连接到 home 文件夹
```

给 asf 用户加 sudo 权限（推荐用 `visudo`，直接 `chmod 777` 会让 sudoers 权限变成 world-writable 导致 sudo 报错）：

```bash
visudo
```

在文件里添加：

```
# User privilege specification
root    ALL=(ALL:ALL) ALL
asf     ALL=(ALL:ALL) NOPASSWD:ALL
```

> 之后的操作用 `su asf` 切到 asf 用户下完成，这样文件权限都会落在 asf 名下，后面配置守护进程不会出权限问题。

## 下载安装

检查所需依赖（[安装指南](https://github.com/JustArchiNET/ArchiSteamFarm/wiki/Setting-up)），没问题就从[下载页](https://github.com/JustArchiNET/ArchiSteamFarm/releases)下载对应版本，解压：

```bash
unzip ASF-linux-x64.zip
```

## 配置文件

用 [ASF 配置文件生成器](https://justarchi.net/ArchiSteamFarm/zh-cn/) 生成配置，下面是一个快速模板：

```json
{
  "SteamLogin": "user",
  "SteamPassword": "password",
  "Enabled": true,
  "AcceptGifts": false,
  "CustomGamePlayedWhileIdle": "原神启动",
  "CustomGamePlayedWhileFarming": "原神启动"
}
```

机器人配置文件自己取好名字，例如 `xxx1.json`，放进 `config` 文件夹。

## 测试运行

配置好后先直接运行测试，登录 Steam 没问题再设守护进程：

```bash
./ArchiSteamFarm
```

## 守护进程

> 需要先登录过一次再配置。

先确认目录是 asf 用户权限，不是的话执行：

```bash
chown -hR asf:asf /home/asf/ArchiSteamFarm
```

创建服务软链接（跟随软件更新而更新）：

```bash
cd /etc/systemd/system
sudo ln -s /home/asf/ArchiSteamFarm/ArchiSteamFarm\@.service .
```

刷新守护进程：

```bash
sudo systemctl daemon-reload
```

确认 systemd 能识别服务（返回 `Loaded: loaded` 即成功）：

```bash
systemctl status ArchiSteamFarm@asf
```

常用管理命令：

```bash
systemctl start ArchiSteamFarm@asf    # 启动
systemctl stop ArchiSteamFarm@asf     # 停止
systemctl status ArchiSteamFarm@asf   # 查看状态
journalctl -r                         # 查看日志
```
