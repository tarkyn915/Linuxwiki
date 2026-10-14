# 终端

## Alacritty

https://github.com/alacritty/alacritty

GPU 加速的轻量终端，配置写在 `~/.config/alacritty/alacritty.toml`

```
sudo pacman -S alacritty
```

## Kitty

https://github.com/kovidgoyal/kitty

同样 GPU 加速，功能比 Alacritty 多一些（标签页、远程控制、 kitten 插件）

```
sudo pacman -S kitty
```

## WezTerm

https://github.com/wez/wezterm

用 Lua 配置的 GPU 终端，自带分屏和串行端口支持，Windows / macOS 也能用

```
sudo pacman -S wezterm
```

## tmux

https://github.com/tmux/tmux

终端复用器，SSH 断开后会话不中断，配置文件 `~/.tmux.conf`

```
sudo pacman -S tmux
```

## Zsh

https://www.zsh.org/

默认的 bash 之外的另一个 shell，插件生态丰富（oh-my-zsh）

```
sudo pacman -S zsh
```

设为默认 shell：

```
chsh -s /usr/bin/zsh
```

## Starship

https://github.com/starship/starship

终端提示符工具，显示 git 分支、语言版本等信息，需要配合 Nerd Fonts

```
sudo pacman -S starship
```

## Shell 补全（bash-completion）

安装 `bash-completion` 包即可，大部分场景会自动生效，无需手动配置。

安装后，多数包管理器会在 `/etc/profile.d/` 里创建自动加载脚本；若未自动生效，再手动编辑 `~/.bashrc` 并重载 `source ~/.bashrc`。

手动加载的写法（仅在自动加载失效时用）：

```
# enable bash completion in interactive shells
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi
```

