# Hermes

## 当前配置

| 项目 | 配置 |
| --- | --- |
| 私有仓库 | [tarkyn915/hermes-skills](https://github.com/tarkyn915/hermes-skills) |
| 本地目录 | `~/hermes-skills` |
| 技能目录 | `skills.create_dir: ~/hermes-skills` |
| 长期记忆 | `~/.hermes/memories/` 中的 `MEMORY.md`、`USER.md` 链接到仓库的 `memories/` |
| 同步方式 | 技能和记忆一起通过 Git 提交、推送、拉取；也可以让 AI 帮忙操作 |

CachyOS 这台电脑已配置好，无需重复接入。现有技能是 `vitepress-deploy`、`vitepress-vps-deploy`、`stow-dotfiles`；记忆更新直接保存到仓库文件，无需手动复制。

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

先在普通终端登录有私有仓库权限的 GitHub 账号：

```bash
gh auth login
gh auth setup-git
```

**接下来可以直接打开 Hermes，让 AI 帮忙完成：**

> 帮我接入私有仓库 tarkyn915/hermes-skills，克隆到 ~/hermes-skills，设置默认 profile 的技能目录，并用仓库里的 scripts/link-memory.py 接入长期记忆。已有克隆先检查并拉取；已有不同记忆先比较合并，保留本机重要内容。完成后检查技能和记忆是否接入成功。

也可以先关闭 Hermes 会话，在普通终端手动执行：

```bash
gh repo clone tarkyn915/hermes-skills ~/hermes-skills
hermes config set skills.create_dir '~/hermes-skills'
python3 ~/hermes-skills/scripts/link-memory.py --hermes-home ~/.hermes
```

已有 `~/hermes-skills` 就不用再克隆，检查并保存本地修改后执行 `git -C ~/hermes-skills pull --ff-only`，再配置和接入即可。

## 3. 开始使用

接入完成后，退出并重新打开 Hermes，让它读入同步后的长期记忆：

```bash
hermes
```

可以先说：

> 检查我的三个自建技能能否加载，并确认长期记忆里是否有我的 wiki 项目地址。

之后按平时的方式使用，例如“帮我更新 wiki”“把这次操作的经验补充到技能里”。日常同步也可以直接交给 AI：

- 使用另一台设备前：“检查并拉取我的技能和记忆仓库，保留本地修改。”拉取完成后新开会话。
- 技能或记忆更新后：“检查我的技能和记忆仓库修改，提交并推送到 GitHub。”

## 几个小细节

- **本地保存自动，Git 同步需要操作。** 当前没有自动上传、下载；可以自己执行，也可以让 AI 做。
- **已有记忆不同，脚本会先停止。** 让 AI 比较合并后再接入；脚本会备份接入前的本机记忆。Git 冲突同样先保留双方内容再处理。
- **模型配置、API 密钥和聊天记录不在这个仓库里。** 每台设备单独配置授权；软件、服务和 wiki 仓库也要另外准备。
- **这些命令针对默认 profile。** 其他 profile 或不同克隆路径，让 AI 按实际位置调整。共享记忆里的系统和路径也要注明属于哪台设备。
- **不要直接删除本地仓库。** 长期记忆链接到里面的文件；需要搬家或取消接入时，让 AI 先处理链接并保留记忆。
