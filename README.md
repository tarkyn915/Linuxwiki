# Arch Linux Wiki

基于 [VitePress](https://vitepress.dev/) 的个人Arch知识库，记录我自己折腾过的 Arch Linux

##  环境要求

- Node.js ≥ 22.13（pnpm 要求）
- [pnpm](https://pnpm.io/) 包管理器

## 本地开发

```bash
pnpm install        # 安装依赖
pnpm docs:dev       # 启动开发服务器，默认 http://localhost:5173
pnpm docs:build     # 构建静态站点，输出到 docs/.vitepress/dist
pnpm docs:preview   # 本地预览构建产物
```

## 目录结构

```
wiki/
├── package.json          # 依赖与命令
├── pnpm-lock.yaml        # 依赖锁定文件
└── docs/                 # 全部内容
    ├── index.md          # 首页
    ├── .vitepress/
    │   └── config.mts    # 站点配置：标题、顶部导航、侧边栏
    ├── installation/     # 安装指南
    ├── system-config/    # 系统配置（Pacman、镜像源、AUR…）
    ├── software/         # 软件安装（浏览器、播放器、代理工具…）
    └── troubleshooting/  # 故障排查
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

