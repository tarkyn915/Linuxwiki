# PVE

## 下载

官网下载 ISO：https://www.proxmox.com/en/downloads

用 [Ventoy](ventoy.md) 或 Rufus 写入 U 盘

## 安装

U 盘启动，选 `Install Proxmox VE (Graphical)`

1. 选目标磁盘
2. 选国家、时区、键盘
3. 设 root 密码和邮箱
4. 配网络：管理 IP、网关、DNS

装完重启，拔掉 U 盘

## 访问

浏览器打开 `https://<管理IP>:8006`，账号 `root`，密码就是装的时候设的

## 解决更新报错

PVE 默认启用企业源，没订阅的话更新会报错，换成免费无订阅源

### 关闭默认的企业源

编辑 `/etc/apt/sources.list.d/pve-enterprise.sources`，在最后一行加

```text
Enabled: no
```

### 创建免费无订阅仓库

新建 `/etc/apt/sources.list.d/pve.sources`，PVE 9 对应 `trixie`

```text
Types: deb
URIs: http://download.proxmox.com/debian/pve
Suites: trixie
Components: pve-no-subscription
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
```

### 修改 Ceph 的软件仓库

编辑 `/etc/apt/sources.list.d/ceph.sources`

```text
Types: deb
URIs: http://download.proxmox.com/debian/ceph-squid
Suites: trixie
Components: no-subscription
Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg
```

最后更新并升级

```bash
apt update && apt full-upgrade
```

## 硬盘直通

获取机械硬盘的 ID，不要选带 `-part1` 分区后缀的

```bash
ls -l /dev/disk/by-id/ata-WDC_xxxxxxxxx
```

记得换成你自己的设备 ID，映射给虚拟机

```bash
qm set 100 -scsi1 /dev/disk/by-id/<你的硬盘ID完整名称>
```

弄错了可以取消映射

```bash
qm set 100 --delete scsi1
```
