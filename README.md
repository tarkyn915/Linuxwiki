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
    ├── software/         # 软件（浏览器、播放器、终端、编辑器等）
    ├── scripts/          # 脚本（性能测试、路由测试、DD 系统等）
    └── other/            # 其他零碎内容
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
