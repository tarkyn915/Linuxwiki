# Hermes

[Hermes Agent](https://github.com/NousResearch/hermes-agent) 是 Nous Research 开发的 AI Agent，可在终端调用工具、修改文件、运行命令，把可复用经验保存为技能，并把长期事实和偏好保存为记忆。

本文记录个人技能与长期记忆的 GitHub 同步方案，以及换设备后的接入步骤。

## 当前配置

| 项目 | 配置 |
| --- | --- |
| 私有仓库 | [tarkyn915/hermes-skills](https://github.com/tarkyn915/hermes-skills)，需登录有权限的 GitHub 账号 |
| 本地仓库 | `~/hermes-skills` |
| 技能创建和加载目录 | `skills.create_dir: ~/hermes-skills` |
| 长期记忆 | `~/.hermes/memories/MEMORY.md`、`USER.md` 软链接到仓库的 `memories/` |
| 同步方式 | 技能和记忆统一手动 Git 提交、推送和拉取 |
| 已迁入技能 | `vitepress-deploy`、`vitepress-vps-deploy`、`stow-dotfiles` |

当前设备已接入三个完整技能目录和两个记忆文件。Hermes 更新记忆时直接修改仓库文件，不需要每次手动复制。内置 `hermes-agent` 仍由 Hermes 在默认目录管理。

## 原理与目录

GitHub 保存版本；每台设备运行自己的本地克隆，Hermes 读取并修改本机的文件：

```text
电脑 A 的 ~/hermes-skills
        │ 提交并推送（git commit / git push）
        ▼
GitHub 私有仓库 tarkyn915/hermes-skills
        │ 拉取（git pull）
        ▼
电脑 B 的 ~/hermes-skills
```

`skills.create_dir` 填本地目录，不填 GitHub 网址。新建技能直接写到这里，Hermes 也会扫描这个目录。配置本身不会执行 Git 上传和下载；没有网络时，本地已有的技能和记忆仍可使用。

```text
~/hermes-skills/
├── .gitignore
├── README.md
├── memories/
│   ├── MEMORY.md
│   └── USER.md
├── scripts/
│   └── link-memory.py
└── devops/
    ├── vitepress-deploy/
    │   ├── SKILL.md
    │   ├── references/
    │   ├── scripts/
    │   └── templates/
    ├── vitepress-vps-deploy/
    │   ├── SKILL.md
    │   └── templates/
    └── stow-dotfiles/
        └── SKILL.md
```

技能应保存完整目录，包括 `SKILL.md`、参考文件、脚本和模板。记忆只跟踪两个 Markdown 文件，锁、临时文件和备份不入库。

以下内容仍由各台设备分别管理：Hermes 内置技能、本机使用统计和 curator 状态、锁和缓存、聊天记录、模型配置与 API/OAuth 凭据、软件和服务。wiki 仓库也要另外克隆。私有仓库也不应提交密码、密钥或验证码。

## 长期记忆如何接入

`MEMORY.md` 保存跨会话的长期事实，`USER.md` 保存个人资料和偏好。当前默认 profile 使用两个文件软链接：

```text
~/.hermes/memories/MEMORY.md → <仓库实际路径>/memories/MEMORY.md
~/.hermes/memories/USER.md   → <仓库实际路径>/memories/USER.md
```

本机已检查 Hermes 的原子写入实现，并通过真实记忆工具验证：写入保留链接、直接更新仓库文件。记忆更新自动保存本地；要送到其他设备，仍需 Git 提交、推送和拉取。

仓库的 `scripts/link-memory.py` 负责接入。它先检查两个文件，已有普通文件先备份到所选 Hermes home 的 `backups/memories-before-git-<时间戳>-<编号>/`，再建立链接。重复执行可识别已接入状态；本机非空记忆与仓库不同时，默认停止并保留双方内容。锁文件继续保留在本机原目录。

脚本适用于 Linux、macOS 和 WSL，需要 Python 3；Windows 原生环境需另外处理文件链接。它不执行 Git 上传、下载或自动合并。

共享记忆中的系统、桌面、软件和路径应注明属于哪台设备。当前记忆已明确哪些信息属于 CachyOS 主机，另一台机器仍需现场检查环境。AI 可以知道 wiki 的仓库和线上地址，但不能因此假定本机已经克隆或启动了站点。

长期记忆在会话开始时读入。目标设备应先拉取，再新开 Hermes 会话；已经运行的会话不会实时刷新启动时的记忆快照。两个文件保持 Hermes 的 `§` 分隔条目格式，优先通过 memory 工具维护。

## 日常同步

### 使用另一台设备前：先拉取

```bash
cd ~/hermes-skills
git status --short
git pull --ff-only
```

如果有本地修改，先检查并保存，再拉取，不要为了同步丢弃修改。拉取完成后新开 Hermes 会话。

### 技能或记忆更新后：一起提交并推送

可以直接让 AI 维护技能和长期记忆，例如：

> 把这次部署的经验补充到 vitepress-deploy；把项目地址保存到长期记忆。

检查差异后统一提交：

```bash
cd ~/hermes-skills
git status --short
git diff
git add devops memories/MEMORY.md memories/USER.md
git diff --cached
git commit -m "sync: 更新技能和长期记忆"
git push
```

暂存命令覆盖当前三个技能及两个记忆文件；新增技能分类或修改说明和脚本时，显式加入对应路径。没有修改时无需提交。

也可以直接让 AI：

> 检查 Hermes 仓库的技能和记忆修改，确认没有凭据或无关文件，然后提交并推送到 GitHub。

另一台电脑执行 `git pull --ff-only` 后获得更新。保持“先拉取 → 修改 → 提交并推送”的顺序，尽量避免两台同时修改同一条记忆。

### 遇到冲突

如果拉取无法快进，或推送被拒绝，本地和远端可能各有提交。保留当前修改，让 AI 检查工作区和提交历史，再协助合并；不要直接强制推送、硬重置或丢弃本地文件。

## 新设备或已有设备接入

### 1. 安装和登录

需要安装 Python 3、Git、GitHub CLI 和 Hermes。Hermes 安装见[官方文档](https://hermes-agent.nousresearch.com/docs/)。

新装 Hermes 可运行 `hermes setup`；已有配置用 `hermes model` 配置模型。模型和 API/OAuth 凭据通过各设备自己的授权流程设置，不从仓库恢复。

先关闭准备接入的 profile 的 Hermes 会话，在普通终端执行：

```bash
gh auth login
gh auth setup-git
gh repo clone tarkyn915/hermes-skills ~/hermes-skills
```

若设备已有这个克隆，检查并保存本地修改，再执行 `git -C ~/hermes-skills pull --ff-only`，无需重新克隆。

### 2. 配置技能并连接记忆

下面接入默认 profile：

```bash
hermes config set skills.create_dir '~/hermes-skills'
python3 ~/hermes-skills/scripts/link-memory.py --hermes-home ~/.hermes
hermes config get skills.create_dir
hermes skills list --source all
ls -l ~/.hermes/memories/MEMORY.md ~/.hermes/memories/USER.md
```

两个文件应显示为链接，技能列表应包含三个自建技能，来源为 `create_dir`。接入完成后新开 Hermes 会话，让 AI 加载一个技能，并确认它知道 wiki 的项目地址。

如果设备已使用过 Hermes，已有非空记忆与仓库不同时，脚本会停止。先让 AI 比较本机文件与仓库的 `memories/`，合并重要内容。若确认采用仓库版本，再运行：

```bash
python3 ~/hermes-skills/scripts/link-memory.py --hermes-home ~/.hermes --replace-existing
```

此选项先备份本机原文，再接入仓库版本，不会自动合并。重要记忆优先合并后再接入。

首次通过 AI 更新记忆后，可再次检查链接，并执行 `git -C ~/hermes-skills diff -- memories`，确认更新进入仓库。建议使用当前版本的 Hermes；旧版写入行为若不同，先保留双方内容，升级后再合并接入。

### 3. 设置 Git 提交身份

若新设备没有配置 Git 身份，可以只对这个仓库设置：

```bash
git -C ~/hermes-skills config user.name tarkyn915
git -C ~/hermes-skills config user.email tarkyn915@users.noreply.github.com
```

### 路径与 profile 差异

仓库不必放在相同路径；把 `skills.create_dir` 改为实际克隆路径，使用该路径里的接入脚本即可。脚本默认使用自己所在的仓库路径，链接会指向当前设备的实际位置。

其他 profile 需要在对应 profile 下设置技能目录，并把 `--hermes-home` 改成其实际目录。仅接入希望共享的 profile；不要把独立 profile 都接到同一份记忆，除非确实希望共享。已有同名技能时先备份比较，避免默认技能目录的副本遮蔽仓库版本。

## 首次搭建记录

本节是已完成配置的复现说明，当前设备无需重复执行；其他设备按上面的接入步骤操作。

技能迁移前先备份完整目录，搬到 `~/hermes-skills/devops/`，通过 `hermes config set skills.create_dir '~/hermes-skills'` 设置位置。默认 `~/.hermes/skills/` 不能留同名有效副本，因为其优先级高于 `create_dir`。

创建仓库时使用私有可见性：

```bash
git init -b main ~/hermes-skills
gh repo create tarkyn915/hermes-skills --private \
  --source ~/hermes-skills --remote origin
```

准备好忽略本机状态和凭据的 `.gitignore`，检查暂存差异后首次提交并推送。当前仓库已存在，不要重复创建。

首次迁入记忆时，在仓库准备好接入脚本及忽略规则，然后运行：

```bash
python3 ~/hermes-skills/scripts/link-memory.py --hermes-home ~/.hermes --seed-from-local
```

`--seed-from-local` 用本地原文创建仓库缺少的记忆文件，并保留接入前备份。它仅用于首次迁入；其他设备应采用仓库版本接入，或先合并已有内容。检查链接和记忆工具写入正常后，把两个记忆文件、脚本和说明一起提交推送。

## Curator 与主动维护

Curator 检查技能使用情况，标记长期未用技能，并归档符合条件的技能。普通检查和归档不调用模型；可选的 AI 合并默认关闭。

本方案下，curator 继续维护默认技能目录，**不会自动整理 `skills.create_dir` 下的仓库技能**。仍可主动让 AI 合并重复内容、更新命令、补充经验、调整脚本和模板，再提交推送。查看本机状态可运行 `hermes curator status`。

## 检查与回退

```bash
hermes config get skills.create_dir
hermes skills list --source all
git -C ~/hermes-skills status --short --branch
git -C ~/hermes-skills remote -v
ls -l ~/.hermes/memories/MEMORY.md ~/.hermes/memories/USER.md
git -C ~/hermes-skills diff -- memories
hermes doctor
```

- 没有技能：检查实际路径、`SKILL.md` 和当前 profile。
- 加载到旧技能：检查默认技能目录是否有同名副本，并新开会话。
- GitHub 没权限：确认 GitHub 登录账号有私有仓库访问权限。
- GitHub 更新后本地没变：需要执行 `git pull --ff-only`。
- 另一台设备记忆没变：源设备先提交推送，目标设备拉取后新开会话。
- 记忆没进入仓库：确认两个文件仍为软链接；若旧版本把链接替换成普通文件，先保留双方内容，升级并合并后重新接入。
- 换设备后命令不可用：检查软件、路径和服务；同步不会自动安装它们。

取消记忆接入时先关闭相关会话，把两个软链接替换成当前仓库记忆的普通文件，即可保留最新内容。若要恢复接入前状态，从脚本打印的备份目录恢复两个普通文件。取消前不要直接删除仓库，否则链接会失效。

## 官方文档

- [Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [Persistent Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)
- [Curator](https://hermes-agent.nousresearch.com/docs/user-guide/features/curator)
- [Hermes Agent 源码](https://github.com/NousResearch/hermes-agent)
