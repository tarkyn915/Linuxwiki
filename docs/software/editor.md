# 编辑器

## VS Code

https://github.com/microsoft/vscode

官方仓库里的是开源版（不含遥测和部分专有扩展）

```
sudo pacman -S code
```

需要微软官方构建（含 Marketplace 专有扩展）用 AUR

```
yay -S visual-studio-code-bin
```

## VSCodium

https://github.com/VSCodium/vscodium

VS Code 的完全开源构建，去掉了微软的遥测和专有组件

AUR安装

```
yay -S vscodium-bin
```

## Neovim

https://github.com/neovim/neovim

Vim 的重构分支，用 Lua 配置，配置目录 `~/.config/nvim`

```
sudo pacman -S neovim
```

## Zed

https://github.com/zed-industries/zed

Rust 写的编辑器，启动快、自带协作和 AI 功能

```
sudo pacman -S zed
```

## Sublime Text

https://www.sublimetext.com/

付费但可无限试用的轻量编辑器，大文件打开速度很快

AUR安装

```
yay -S sublime-text-4
```

## JetBrains Toolbox

https://www.jetbrains.com/toolbox-app/

JetBrains 全家桶（IDEA / PyCharm / Goland 等）的统一安装和版本管理工具

AUR安装

```
yay -S jetbrains-toolbox
```
