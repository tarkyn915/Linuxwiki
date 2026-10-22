# Hermes

桌面客户端：[官方安装文档](https://hermes-agent.nousresearch.com/)

## 当前配置

| 项目 | 配置 |
| --- | --- |
| 技能目录 | `skills.create_dir: ~/hermes-skills` |
| 长期记忆 | `~/.hermes/memories/` 中的 `MEMORY.md`、`USER.md` 链接到仓库的 `memories/` |

## 常用命令

```bash
hermes                # 交互对话
hermes --tui          # 终端界面
hermes chat -q "问题"  # 单次提问
hermes skills list    # 查看已加载的技能
hermes model          # 切换模型和供应商
hermes doctor         # 健康检查
```

## 1. 新设备安装并初始化 Hermes

以下步骤适用于 Linux、macOS、WSL，使用默认 profile。先准备 Git、curl、Python 3 和 GitHub CLI（`gh`），再按[官方安装说明](https://hermes-agent.nousresearch.com/docs/getting-started/installation)执行：

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

安装后重新打开终端。若安装过程中尚未完成初始化，运行：

```bash
hermes setup
```

按提示配置这台设备的模型和授权，确认运行 `hermes` 后可以正常对话。

## 2. 配置好自定义的 API

安装时跳过了模型配置，或者想换供应商，直接运行：

```bash
hermes model
```

按提示选供应商和模型，填入对应的 API 密钥

## 3. 同步我的技能和记忆

先装好 GitHub CLI，在普通终端登录一次有私有仓库权限的账号；也可以不自己装，直接把下面那句发给 AI，让它自己装好 GitHub CLI 并带你登录：

```bash
sudo pacman -S github-cli    # Arch/CachyOS；其他系统用各自的包管理器
gh auth login                # 浏览器登录一次
```

**然后打开 Hermes，直接把下面这句发给 AI：**

> 帮我接入私有仓库 tarkyn915/hermes-skills，完成技能和记忆的接入，不同记忆合并并保留重要内容，然后自己检查。
