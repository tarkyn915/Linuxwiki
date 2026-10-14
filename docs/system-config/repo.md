# 软件源

## Arch Linux

编辑 `/etc/pacman.d/mirrorlist`，把清华源放到最前面：

```
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
```

### archlinuxcn 源

在 `/etc/pacman.conf` 末尾追加：

```
[archlinuxcn]
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch
```

安装密钥并更新：

```
sudo pacman -Syy
sudo pacman -S archlinuxcn-keyring
```

## Debian

编辑 `/etc/apt/sources.list`，替换为清华源（以 bookworm 为例）：

```
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm main contrib non-free non-free-firmware
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-updates main contrib non-free non-free-firmware
deb https://mirrors.tuna.tsinghua.edu.cn/debian/ bookworm-backports main contrib non-free non-free-firmware
deb https://mirrors.tuna.tsinghua.edu.cn/debian-security bookworm-security main contrib non-free non-free-firmware
```

更新：

```
sudo apt update
```

## Ubuntu

编辑 `/etc/apt/sources.list`，替换为清华源（以 24.04 noble 为例）：

```
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ noble-security main restricted universe multiverse
```

更新：

```
sudo apt update
```

## Rocky Linux

编辑 `/etc/yum.repos.d/rocky.repo`，使用阿里云源（以 Rocky 9 为例）：

```
[baseos]
name=Rocky Linux $releasever - BaseOS
baseurl=https://mirrors.aliyun.com/rockylinux/$releasever/BaseOS/$basearch/os/
gpgcheck=1
enabled=1
gpgkey=https://mirrors.aliyun.com/rockylinux/RPM-GPG-KEY-rockyofficial

[appstream]
name=Rocky Linux $releasever - AppStream
baseurl=https://mirrors.aliyun.com/rockylinux/$releasever/AppStream/$basearch/os/
gpgcheck=1
enabled=1
gpgkey=https://mirrors.aliyun.com/rockylinux/RPM-GPG-KEY-rockyofficial
```

更新：

```
sudo dnf makecache
```
