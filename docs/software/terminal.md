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

## nohup

后台运行命令，关掉终端也不中断：

```
nohup command &
```

用 `jobs` 可以查看后台执行的任务。

## screen

启动新的 `screen` 会话：

```
screen -S 会话名
```

恢复会话（也可以用 ID）：

```
screen -r 会话名
```

查看所有会话：

```
screen -ls
```

常用快捷键：

- `Ctrl-a` + `d`：暂时分离当前会话，返回命令行
- `Ctrl-a` + `c`：创建一个新窗口
- `Ctrl-a` + `n`：切换到下一个窗口
- `Ctrl-a` + `p`：切换到前一个窗口
- `Ctrl-a` + `0..9`：切换到指定编号的窗口

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

## 历史记录

清除当前 shell 会话的历史记录：

```
history -c
```

永久禁用历史记录，添加到 `~/.bashrc` 并 `source ~/.bashrc`：

```
unset HISTFILE
HISTSIZE=0
HISTFILESIZE=0
```

