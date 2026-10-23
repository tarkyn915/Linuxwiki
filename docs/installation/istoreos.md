# iStoreOS

iStoreOS 是 KoolCenter 基于 OpenWrt 的软路由系统，官网 https://www.istoreos.com

## 下载 X86_64 固件

UEFI 引导用 -efi 版本，地址 https://fw.koolcenter.com/iStoreOS/x86_64_efi/

当前版本 `istoreos-25.12.5-2026092410-x86-64-squashfs-combined-efi.img.gz`

解压后把 .img 上传到 PVE 的 local 存储，记下路径（下文用 `/var/lib/vz/template/iso/istoreos.img` 举例）

## 在 PVE 上安装

1. 新建虚拟机，OS 选「不使用任何介质」
2. 删除默认生成的硬盘
3. BIOS 选 UEFI，取消勾选 Pre-Enroll keys
4. CPU/内存按需，2c2g 足够

进 PVE 终端，把固件导入虚拟机：

```bash
qm importdisk 100 /var/lib/vz/template/iso/istoreos.img local-lvm
```

`100` 换成你的虚拟机 ID，路径换成你实际上传的位置

到 Hardware 里把刚导入的未使用硬盘启用为 scsi0，再到 Options → Boot Order 勾选这块硬盘并拖到第一位

启动进系统后输入：

```text
quickstart
```

选 `1 Change LAN IP`，输入：

```text
10.0.0.99
255.255.255.0
```

然后 `reboot` 重启

## OpenWrt 24.10 与 25.12

iStoreOS 25.12.5 基于 OpenWrt 25.12，包管理器已从 opkg 切到 Alpine 的 apk，装插件用 `apk` 而不是 `opkg`

## 安装 Nikki 透明代理

Nikki 是基于 mihomo 内核的 OpenWrt 透明代理，项目地址 https://github.com/nikkinikki-org/OpenWrt-nikki

下载 x86-64、25.12 版本，releases 页面的 `nikki_x86_64-openwrt-25.12.tar.gz` 解压后得到 4 个 apk：

- `mihomo-meta-1.19.32.apk` — 稳定版内核，不要选 alpha
- `nikki-2026.10.10-r1.apk` — 主程序
- `luci-app-nikki-1.26.2-r1.apk` — Web 界面
- `luci-i18n-nikki-zh-cn-26.283.34061~31339d5.apk` — 简体中文包

4 个 apk 用网页上传安装（LuCI → 系统 → 软件包 → 上传）

进 LuCI → 服务 → Nikki，填加速地址，混入选项 → GeoX 配置，保存并应用

GeoX 四个下载地址：

GeoSite：

```text
https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat
```

GeoIP(MMDB)：

```text
https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.metadb
```

GeoIP(DAT)：

```text
https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat
```

GeoIP(ASN)：

```text
https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/GeoLite2-ASN.mmdb
```

## 细节配置

Options → Start at boot 勾上，开机自启

Startup/Shutdown order 里 Order 填 1（数字越小越早启动），Startup delay 填 0 或 10 秒，让宿主机一开机就拉起软路由，避免其他虚拟机找不到网关

在 Snapshots 里建快照，方便回滚
