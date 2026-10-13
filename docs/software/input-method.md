# 输入法

## Fcitx 5

https://github.com/fcitx/fcitx5

官方仓库直接安装，主体 + 中文引擎（拼音/双拼）+ 图形配置工具

```
sudo pacman -S fcitx5 fcitx5-chinese-addons fcitx5-configtool
```

GTK / Qt 程序里要能输入，还需要装对应的输入法模块

```
sudo pacman -S fcitx5-gtk fcitx5-qt
```

## Fcitx 5 配置

在 `~/.config/environment.d/` 下新建配置文件，让所有程序都能识别

```
mkdir -p ~/.config/environment.d
```

`~/.config/environment.d/im.conf` 内容：

```
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
SDL_IM_MODULE=fcitx
```

改完注销重新登录生效。

## IBus

https://github.com/ibus/ibus

另一套输入法框架，GNOME 桌面默认自带

```
sudo pacman -S ibus ibus-libpinyin
```

## Rime（中州韵）

https://github.com/rime/home

需要自定义词库、双拼方案时用这个引擎，作为 Fcitx 5 的一个引擎运行

```
sudo pacman -S fcitx5-rime
```
