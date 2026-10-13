# 镜像源配置

## 官方源（清华大学）

镜像列表文件在 `/etc/pacman.d/mirrorlist`，越靠前的源优先级越高，先备份一份

```
sudo cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.bak
```

把清华源写到文件第一行（`$repo`、`$arch` 保持原样，不要替换）

```
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
```

一键写法：

```
sudo sed -i '1i Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch' /etc/pacman.d/mirrorlist
```

## archlinuxcn（清华）

archlinuxcn 是中文社区仓库，里面有 yay、fcitx5 相关的很多包。打开 `/etc/pacman.conf`，在末尾加上

```
[archlinuxcn]
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch
```

装完仓库配置后，必须导入签名密钥，否则安装包会报签名错误

```
sudo pacman -Syy
sudo pacman -S archlinuxcn-keyring
```

## 其他常用镜像站

官方源（`mirrorlist` 里用这行格式）：

```
Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
Server = https://mirrors.bfsu.edu.cn/archlinux/$repo/os/$arch
Server = https://mirrors.aliyun.com/archlinux/$repo/os/$arch
Server = https://mirrors.cloud.tencent.com/archlinux/$repo/os/$arch
```

archlinuxcn（`pacman.conf` 里用这行格式）：

```
Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
Server = https://mirrors.bfsu.edu.cn/archlinuxcn/$arch
```

## 刷新与生效

改完源之后刷新数据库并升级

```
sudo pacman -Syyu
```

## 签名报错的处理

如果装 archlinuxcn 的包时出现 `signature from ... is unknown trust`，重新导入密钥

```
sudo pacman -S archlinuxcn-keyring
```

还是不行就手动信任社区维护者的密钥

```
sudo pacman-key --lsign-key "ci@archlinuxcn.org"
```
