# 字体

## Noto Sans CJK

https://github.com/notofonts/noto-cjk

中文显示最常用的字体，官方仓库直接安装（思源黑体的别名）

```
sudo pacman -S noto-fonts-cjk
```

## 文泉驿

https://github.com/wqy

老牌开源中文字体，正黑体积小巧

```
sudo pacman -S wqy-zenhei wqy-microhei
```

## Nerd Fonts

https://github.com/ryanoasis/nerd-fonts

给终端和编辑器用的图标字体，JetBrains Mono 补丁版

AUR安装

```
yay -S ttf-jetbrains-mono-nerd
```

## Microsoft 字体

AUR 安装，安装脚本会从微软官网下载字体文件，补齐 Word / 网页里的 Windows 字体

```
yay -S ttf-ms-win11-auto
```

## 安装字体后刷新缓存

```
fc-cache -fv
```
