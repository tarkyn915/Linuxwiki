# Herdr

Herdr 是面向 AI 编程工具的终端管理工具，可以在一个界面里管理多个项目、终端窗格和 AI 会话。它通过后台服务器承载终端，支持 Claude Code、Codex、OpenCode、Hermes 等工具，并在侧边栏显示 Agent 的工作、等待输入、空闲等状态

- 官网：https://herdr.dev/
- 文档：https://herdr.dev/docs/
- GitHub：https://github.com/herdrdev/herdr

## 安装

Linux / macOS 使用官方安装脚本：

```bash
curl -fsSL https://herdr.dev/install.sh | sh
```

安装后运行：

```bash
herdr
```

如果提示找不到命令，重新打开终端，并确认安装目录在 `PATH` 中。其他安装方式见[官方安装文档](https://herdr.dev/docs/install/)

AI 工具需要事先单独安装并配置好模型或账号授权，再在 Herdr 的窗格里运行各自的命令

## 基本使用

进入项目目录后启动 Herdr：

```bash
cd ~/wiki
herdr
```

首次启动会创建工作区；之后运行 `herdr` 会连接到已有的默认后台会话。在窗格中按平时的方式启动 AI，例如：

```bash
hermes
```

也可以在其他窗格里运行 `claude`、`codex` 或 `opencode`，旁边再开一个窗格运行开发服务器、查看日志等。不同项目可以放到不同工作区

鼠标可以切换工作区、标签页和窗格，拖动分隔线调整大小，右键菜单可以分屏或新建标签页

### 常用快捷键

默认前缀键是 `Ctrl+b`：先按前缀键，松开后再按下表中的操作键

| 操作 | 按键 |
| --- | --- |
| 向右分屏 | `Ctrl+b` → `v` |
| 向下分屏 | `Ctrl+b` → `-` |
| 新建标签页 | `Ctrl+b` → `c` |
| 下一个 / 上一个标签页 | `Ctrl+b` → `n` / `p` |
| 选择工作区 | `Ctrl+b` → `w` |
| 新建工作区 | `Ctrl+b` → `Shift+n` |
| 脱离客户端，保留后台会话 | `Ctrl+b` → `q` |
| 查看快捷键 | `Ctrl+b` → `?` |

## 配合 Hermes 使用

先按 [Hermes](hermes.md) 页面完成安装和初始化，再安装 Herdr 的官方集成：

```bash
herdr integration install hermes
herdr integration status
```

集成会在 Hermes 主目录下写入 `plugins/herdr-agent-state/`，并在对应的 `config.yaml` 中启用插件。默认主目录为 `~/.hermes`；使用其他 profile 或自定义目录时，应先确认 `HERMES_HOME` 指向目标目录

安装后退出并重新启动 Hermes，让插件加载。在 Herdr 窗格中运行的 Hermes 会上报可恢复的会话 ID，Herdr 可据此在服务器重启后尝试恢复对应的对话

## 退出与会话恢复

暂时离开时，按 `Ctrl+b` → `q` 脱离客户端，之后运行 `herdr` 重新连接。只要承载会话的主机和 Herdr 后台服务器保持运行，窗格中的 AI、开发服务器和其他命令就会继续执行

关闭终端窗口也会保留后台会话。主机休眠、关机或 Herdr 服务器停止时，正在执行的进程无法继续运行；服务器重启后的恢复分为：

- **布局恢复**：还原工作区、标签页、窗格和工作目录
- **AI 对话恢复**：对已安装相应集成、已上报有效会话引用的 Agent，尝试恢复其原生对话

普通 Shell 命令、测试和开发服务器不会因为布局恢复就自动接着执行。详见[会话状态与恢复](https://herdr.dev/docs/session-state/)

需要结束默认后台会话及其中的窗格进程时，执行：

```bash
herdr server stop
```

## 连接远程机器

可以把保持运行的服务器加入 Herdr，统一查看本地和远程的工作区。先配置好普通 SSH 访问；下面的 `workbox` 是示例 SSH 主机别名，使用时换成自己的目标：

```bash
# 先确认普通 SSH 能登录
ssh workbox
```

退出 SSH，回到本地终端后添加机器：

```bash
herdr machine add workbox
herdr
```

添加过程会检查远程 Herdr 环境，必要时询问是否安装或替换。连接后可在侧边栏切换机器；网络断开时，只要远程主机和 Herdr 服务器仍在运行，远程任务就会继续

每台机器保留自己的软件、模型授权和配置，Herdr 不会自动把本地凭据、技能或配置同步过去。详见[连接多台机器](https://herdr.dev/docs/connecting-machines/)

## 更新

通过官方脚本安装的版本可以执行：

```bash
herdr update
```

使用 Homebrew、mise 或 Nix 安装的版本，应通过对应包管理器更新。各台远程机器需要分别更新；服务端功能的生效和重启方式见[官方更新说明](https://herdr.dev/docs/install/#update)
