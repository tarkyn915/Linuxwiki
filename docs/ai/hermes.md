# Hermes

## 当前配置

| 项目 | 配置 |
| --- | --- |
| 私有仓库 | [tarkyn915/hermes-skills](https://github.com/tarkyn915/hermes-skills) |
| 本地目录 | `~/hermes-skills` |
| 技能目录 | `skills.create_dir: ~/hermes-skills` |
| 长期记忆 | `~/.hermes/memories/` 中的 `MEMORY.md`、`USER.md` 链接到仓库的 `memories/` |
| 同步方式 | 技能和记忆一起通过 Git 提交、推送、拉取；也可以让 AI 帮忙操作 |

CachyOS 这台电脑已配置好，无需重复接入。现有技能是 `vitepress-deploy`（本地部署、VPS 自动部署和 wiki 维护）、`stow-dotfiles`；记忆更新直接保存到仓库文件，无需手动复制。

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

## 2. 同步我的技能和记忆

先装好 GitHub CLI 并在普通终端登录一次有私有仓库权限的账号：

```bash
sudo pacman -S github-cli    # Arch/CachyOS；其他系统用各自的包管理器
gh auth login                # 浏览器登录一次
```

**然后打开 Hermes，直接把下面这句发给 AI：**

> 帮我接入私有仓库 tarkyn915/hermes-skills，完成技能和记忆的接入，不同记忆合并并保留重要内容，然后自己检查。

## 3. 开始使用

接入完成后，退出并重新打开 Hermes，让它读入同步后的长期记忆：

```bash
hermes
```

可以先说：

> 检查我的自建技能能否加载，并确认长期记忆里是否有我的 wiki 项目地址。

之后按平时的方式使用，例如“帮我更新 wiki”“把这次操作的经验补充到技能里”。日常同步也可以直接交给 AI：

- 使用另一台设备前：“检查并拉取我的技能和记忆仓库，保留本地修改。”拉取完成后新开会话。
- 技能或记忆更新后：“检查我的技能和记忆仓库修改，提交并推送到 GitHub。”

## 几个小细节

- **本地保存自动，Git 同步需要操作。** 当前没有自动上传、下载；可以自己执行，也可以让 AI 做。
- **已有记忆不同，脚本会先停止。** 让 AI 比较合并后再接入；脚本会备份接入前的本机记忆。Git 冲突同样先保留双方内容再处理。
- **模型配置、API 密钥和聊天记录不在这个仓库里。** 每台设备单独配置授权；软件、服务和 wiki 仓库也要另外准备。
- **这些命令针对默认 profile。** 其他 profile 或不同克隆路径，让 AI 按实际位置调整。共享记忆里的系统和路径也要注明属于哪台设备。
- **不要直接删除本地仓库。** 长期记忆链接到里面的文件；需要搬家或取消接入时，让 AI 先处理链接并保留记忆。
