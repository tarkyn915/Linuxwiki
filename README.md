# My Linux Wiki

基于 [VitePress](https://vitepress.dev/) 的个人 Linux 知识库，记录我折腾 Linux 时遇到的问题、经验和常用配置，打开网页就能查方法。

## 环境要求

- Node.js ≥ 22.13（pnpm 要求）
- [pnpm](https://pnpm.io/) 包管理器

## 本地开发

```bash
pnpm install        # 安装依赖
pnpm docs:dev       # 启动开发服务器，默认 http://localhost:5173
pnpm docs:build     # 构建静态站点，输出到 docs/.vitepress/dist
pnpm docs:preview   # 本地预览构建产物
```

局域网访问开发服务器（监听所有网卡，其他设备可通过本机 IP 访问）：

```bash
pnpm run docs:dev --host 0.0.0.0
```

> `docs/.vitepress/dist` 是构建产物，已在 `.gitignore` 里排除，由 GitHub Actions 构建后同步到 VPS，不提交进仓库。

## 自动部署（GitHub Actions → VPS）

推送 `main` 后自动构建并同步到 VPS，本地不用再手动上传：

```
push main ──► pnpm install --frozen-lockfile && pnpm docs:build ──► rsync -avz --delete dist/ user@vps:网站目录
```

工作流文件：`.github/workflows/deploy.yml`，也可以在 Actions 页面手动 `Run workflow`。

> 部署目标是那台**云 VPS**（公网站点）。本机 `pnpm docs:dev` / 8080 端口上的那份只是局域网自用的预览副本，两者互不相干。

### 一次性配置

1. 生成一对**专用**部署密钥（在本机执行，别复用日常私钥）。私钥留给 GitHub secret，公钥要拷到云 VPS：

   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/linuxwiki_deploy -C "github-actions-deploy" -N ""
   ```

2. 把**公钥**装到云 VPS 的 `authorized_keys`，并在 VPS 上准备目录、确认装了 rsync：

   ```bash
   # 在本机执行：把公钥推到云 VPS（换成你的 IP/端口/用户）
   ssh-copy-id -i ~/.ssh/linuxwiki_deploy.pub -p 22 root@你的VPS

   # 如果 ssh-copy-id 不好用，就在本机 cat ~/.ssh/linuxwiki_deploy.pub 复制输出，
   # 然后在 VPS 上执行：
   echo 'ssh-ed25519 AAAA... github-actions-deploy' >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh
   mkdir -p /var/www/linuxwiki        # 云 VPS 上的网站目录，与 DEPLOY_PATH 保持一致
   command -v rsync || sudo apt install -y rsync
   ```

3. 仓库 `Settings → Secrets and variables → Actions`：

   | 类型 | 名称 | 值 |
   | --- | --- | --- |
   | Secret | `DEPLOY_SSH_KEY` | 私钥 `~/.ssh/linuxwiki_deploy` 的全部内容 |
   | Variable | `DEPLOY_HOST` | VPS IP 或域名 |
   | Variable | `DEPLOY_USER` | 登录用户，如 `root` |
   | Variable | `DEPLOY_PATH` | 网站目录，如 `/var/www/linuxwiki/` |
   | Variable | `DEPLOY_PORT` | SSH 端口，可省略（默认 22） |

4. 在 Actions 页面手动跑一次确认通了，之后每次 push 自动部署。

注意事项：

- 目标目录会被 `--delete` 镜像成构建产物，**别指向其它站点共用的目录**。
- 想改端口/路径等细节直接改 `.github/workflows/deploy.yml`，secrets 名称要保持一致。

## 换设备恢复

换机器后，从 GitHub 拉取并重建本地环境：

```bash
# 1. 克隆仓库
git clone https://github.com/tarkyn915/Linuxwiki.git
cd Linuxwiki

# 2. 安装依赖（需 Node.js ≥ 22.13，pnpm 要求）
pnpm install

# 3. 启动开发服务器
pnpm docs:dev
```

说明：

- 仓库已包含 `pnpm-lock.yaml`，`pnpm install` 会按锁文件还原一致的依赖版本。
- `node_modules/` 和 `docs/.vitepress/cache/` 已在 `.gitignore` 里排除，换设备后无需手动清理，`pnpm install` 会重新生成。
- `docs/.vitepress/dist/` 同样不再提交，克隆后跑一次 `pnpm docs:build` 即可本地生成（线上由 GitHub Actions 自动构建部署）。
- 若当前机器没有 pnpm，先用 `corepack enable`（或 `npm i -g pnpm`）安装。

## 目录结构

```
wiki/
├── package.json          # 依赖与命令
├── pnpm-lock.yaml        # 依赖锁定文件
└── docs/                 # 全部内容
    ├── index.md          # 首页
    ├── .vitepress/
    │   └── config.mts    # 站点配置：标题、顶部导航、侧边栏
    ├── installation/     # 安装指南（各发行版官网与版本）
    ├── system-config/    # 系统配置（主机名、软件源、用户、SSH、swap、BBR 等）
    ├── deploy/           # 应用部署（Docker、Nginx、FRP、监控、云盘等自托管应用）
    ├── ai/               # AI 工具与部署配置
    │   ├── index.md      # AI 章节概览
    │   └── hermes.md     # Hermes 技能同步、迁移与维护
    └── other/            # 其他零碎内容（常用脚本、小工具、命令）
```

## 如何新增 / 修改内容

1. **新增文章**：在对应章节目录下新建 `xxx.md`，标题用 `#`，正文直接写 Markdown。
2. **注册到侧边栏**：编辑 `docs/.vitepress/config.mts`，在对应分组的 `items` 里加一行：

   ```ts
   { text: '文章标题', link: '/章节名/xxx' }
   ```

   `link` 对应 `docs/` 下的路径，去掉 `.md` 后缀。
3. **改顶部导航**：编辑 `config.mts` 的 `nav`。
4. **改首页**：编辑 `docs/index.md`。

> 改文件夹名时，要同步改 `config.mts` 的 `nav`、`sidebar`、首页 `index.md` 的 features 三处 `link`，否则会 404。
