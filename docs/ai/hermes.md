# Hermes

[Hermes Agent](https://github.com/NousResearch/hermes-agent) 是 Nous Research 开发的 AI Agent，可以在终端里调用工具、操作文件、运行命令，并把可复用的经验保存为技能（Skills）。它支持多种模型和提供商，模型配置与技能文件分别管理。

本文记录个人技能库的 GitHub 同步方案，以及换设备后的恢复步骤。

## 当前配置

| 项目 | 配置 |
| --- | --- |
| 技能仓库 | [tarkyn915/hermes-skills](https://github.com/tarkyn915/hermes-skills)，私有仓库，需登录有权限的 GitHub 账号 |
| 本地仓库目录 | `~/hermes-skills` |
| Hermes 创建技能的位置 | `skills.create_dir: ~/hermes-skills` |
| 同步方式 | 手动 Git 提交、推送和拉取 |
| 迁入的技能 | `vitepress-deploy`、`vitepress-vps-deploy`、`stow-dotfiles` |

这套方案已经把三个自建技能的完整目录迁入仓库。内置 `hermes-agent` 仍由 Hermes 在默认目录管理。

## 原理

GitHub 保存技能的历史版本；每台设备各自克隆一份本地仓库，Hermes 读取并修改本机的那一份。

```text
电脑 A 的 ~/hermes-skills
        │ 提交并推送（git commit / git push）
        ▼
GitHub 私有仓库 tarkyn915/hermes-skills
        │ 拉取（git pull）
        ▼
电脑 B 的 ~/hermes-skills
```

`skills.create_dir` 填的是本地路径，不是 GitHub 网址。这个设置有两个作用：

- Hermes 新建技能时，直接写进指定目录。
- Hermes 会扫描这个目录，里面的技能可以正常加载、使用和修改。

设置本身不会自动执行 Git 提交、上传或下载；两台设备之间的同步仍需 `push` 和 `pull`。电脑没有网络时，已经在本地的技能依然能用。

## 技能目录里保存什么

```text
~/hermes-skills/
├── .gitignore
├── README.md
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

每个技能是一个完整目录。`SKILL.md` 是主体，`references/` 是参考说明，`scripts/` 是脚本，`templates/` 是模板；迁移和备份时要一起保存。

以下内容保留在本机，不放进技能仓库：

- Hermes 内置技能及其更新记录 `.bundled_manifest`。
- `.usage.json`、`.curator_state`、`.curator_ledger.jsonl` 等本机维护状态。
- `.locks/`、`.hub/` 等锁和管理文件。
- API 密钥、OAuth 凭据、`.env`、`auth.json`、完整 `config.yaml`。

本仓库只同步技能，不同步聊天记录、记忆、模型凭据、已安装的软件和服务。技能中提到的路径、命令和依赖需要在新设备上重新检查。

## 首次搭建过程

本节是已执行配置的复现记录，当前设备无需重复运行。已有仓库的其他设备直接看后面的“换设备恢复”。

先安装 Git、GitHub CLI 和 Hermes，并登录 GitHub。Hermes 的安装方法见[官方快速入门](https://hermes-agent.nousresearch.com/docs/)。

```bash
gh auth login
gh auth setup-git
```

### 1. 先备份自建技能

备份三个完整技能目录，保存在本机：

```bash
mkdir -p ~/.hermes/backups
tar -czf ~/.hermes/backups/custom-skills-before-git.tar.gz \
  -C ~/.hermes/skills \
  devops/vitepress-deploy \
  devops/vitepress-vps-deploy \
  devops/stow-dotfiles
```

再次运行前先换一个备份文件名，保留已有备份。

### 2. 迁移到本地仓库

确认 `~/hermes-skills` 尚不存在后执行：

```bash
mkdir -p ~/hermes-skills/devops
mv ~/.hermes/skills/devops/vitepress-deploy ~/hermes-skills/devops/
mv ~/.hermes/skills/devops/vitepress-vps-deploy ~/hermes-skills/devops/
mv ~/.hermes/skills/devops/stow-dotfiles ~/hermes-skills/devops/
git init -b main ~/hermes-skills
```

迁移时搬走旧目录，避免保留同名副本。默认目录 `~/.hermes/skills/` 的技能优先于 `create_dir`，若两边都有同名技能，仓库里的版本会被覆盖隐藏。

### 3. 配置 Hermes

使用配置命令，避免手动修改 YAML 时破坏缩进：

```bash
hermes config set skills.create_dir '~/hermes-skills'
hermes config get skills.create_dir
hermes skills list --source all
```

技能列表里应能看到三个技能，来源为 `create_dir`。新开一个 Hermes 会话后，让 AI 加载任意一个技能，还可以确认实际读取位置。

已有技能不会因为这个设置自动搬家，仍在各自原位置更新；之后新建的技能会直接进入 `~/hermes-skills`。

### 4. 建立私有 GitHub 仓库并首次推送

在本地仓库准备好 `README.md`、忽略本机状态和凭据的 `.gitignore` 后执行：

```bash
gh repo create tarkyn915/hermes-skills --private \
  --source ~/hermes-skills --remote origin
cd ~/hermes-skills
git status --short
git add .gitignore README.md devops
git diff --cached
git commit -m "skills: 迁入个人技能库"
git push -u origin main
```

检查暂存差异，确认只包含准备同步的技能和说明。若 Git 提示缺少提交身份，可只在本仓库设置：

```bash
git config user.name tarkyn915
git config user.email tarkyn915@users.noreply.github.com
```

私有仓库也不应保存明文凭据。公开 wiki 只记录配置方法，不复制私有技能正文或密钥。

## 日常怎么同步

### 换电脑使用前：先拉取

```bash
cd ~/hermes-skills
git status --short
git pull --ff-only
```

如果本地存在未提交修改，先检查并保存，再拉取；不要为了同步直接丢弃修改。

### 更新技能后：提交并推送

可以直接让 AI 更新技能，例如：

> 把这次部署遇到的问题补充到 vitepress-deploy，并检查有没有重复内容。

确认修改后执行：

```bash
cd ~/hermes-skills
git status --short
git diff
git add devops
git diff --cached
git commit -m "skills: 更新部署经验"
git push
```

`git add devops` 覆盖当前三个技能；以后新建了其他分类，需要显式加入对应路径。没有修改时无需提交。

也可以直接告诉 AI：

> 检查技能仓库的修改，确认没有凭据或无关文件，然后提交并同步到 GitHub。

另一台电脑执行 `git pull --ff-only` 后获得更新。建议保持“先拉取 → 修改 → 提交 → 推送”的顺序，避免两台设备同时改同一份内容。

### 遇到冲突

如果 `git pull --ff-only` 提示无法快进，或推送被拒绝，说明本地和远端可能各有新提交。保留当前修改，让 AI 检查 `git status` 和提交历史后协助合并，不要直接 `git push --force` 或丢弃本地文件。

## 换设备恢复：需要自己操作的部分

1. 安装 Git、GitHub CLI 和 Hermes。
2. 在新设备上登录有权限访问私有仓库的 GitHub 账号。
3. 配置该设备使用的模型和 API / OAuth 凭据。
4. 克隆技能仓库、设置本地路径并验证。

登录 GitHub 并恢复技能：

```bash
gh auth login
gh auth setup-git
gh repo clone tarkyn915/hermes-skills ~/hermes-skills
hermes config set skills.create_dir '~/hermes-skills'
hermes config get skills.create_dir
hermes skills list --source all
```

Hermes 初次使用可运行 `hermes setup`；已有配置时用 `hermes model` 选择或配置模型。凭据通过相应的授权流程设置，不从技能仓库恢复。

确认技能列表正常后，新开 Hermes 会话，让 AI 加载一个技能。要在新设备提交技能修改，还需要配置 Git 提交身份；可使用前面的仓库级命令。

目录不必与旧设备完全相同：如果克隆到了其他路径，把 `skills.create_dir` 设置为那台设备上的实际路径即可。若新设备已有同名技能，应先备份并比较，再决定迁移，避免两份不同版本并存。

## Curator 与主动维护的区别

Curator 是 Hermes 的后台技能维护功能，用于检查使用情况、标记长期未用技能、归档符合条件的技能。可选的 AI 整理还能合并重复内容；这部分默认关闭，普通使用情况检查与归档不调用模型。

方案 A 中，curator 继续维护默认目录，**不会自动整理 `skills.create_dir` 下的仓库技能**。这不影响正常使用，也不影响主动让 AI 修改技能：

- 合并重复的技能。
- 补充新经验，更新过时命令和步骤。
- 整理参考文档、脚本和模板。
- 重命名、拆分或删除技能。

主动修改后，再提交并推送到 GitHub 即可。需要查看本机 curator 状态时运行：

```bash
hermes curator status
```

## 检查与排错

```bash
# 查看配置和实际发现的技能
hermes config get skills.create_dir
hermes skills list --source all

# 查看仓库修改、同步目标
git -C ~/hermes-skills status --short --branch
git -C ~/hermes-skills remote -v

# Hermes 自检
hermes doctor
```

- 列表没有技能：确认目录存在、技能目录含 `SKILL.md`，并检查当前使用的 Hermes profile。本文配置的是默认 profile，其他 profile 需要各自设置。
- 加载到旧内容：检查默认技能目录是否还留有同名副本，并新开会话。
- GitHub 提示没有权限：确认 `gh auth status` 的账号有权访问私有仓库。
- GitHub 已更新但本地没变：执行 `git pull --ff-only`，配置目录不会自动拉取更新。
- 换机器后命令不可用：技能同步只带来操作说明和附带文件，仍需检查新机器上的软件依赖、路径和服务。

## 官方文档

- [Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [Curator](https://hermes-agent.nousresearch.com/docs/user-guide/features/curator)
- [Hermes Agent 源码](https://github.com/NousResearch/hermes-agent)
