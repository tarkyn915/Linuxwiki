# My Linux Wiki

基于 VitePress 的个人 Linux 知识库

## 环境要求

- Node.js 22
- pnpm 10
- Git

## 本地开发

```bash
pnpm install --frozen-lockfile   # 安装依赖
pnpm docs:dev                    # 开发服务器，默认 http://localhost:5173
pnpm docs:build                  # 构建到 docs/.vitepress/dist
pnpm docs:preview                # 预览构建产物
```

局域网访问开发服务器：

```bash
pnpm run docs:dev --host 0.0.0.0
```

## 换设备恢复

```bash
git clone https://github.com/tarkyn915/Linuxwiki.git ~/wiki
cd ~/wiki
pnpm install --frozen-lockfile
pnpm docs:build
```

装好 Node 22 和 pnpm 10，克隆仓库、装依赖、构建即可，产物在 `docs/.vitepress/dist`

## 让 AI 部署

把下面这句直接发给 AI：

> 帮我部署 wiki：克隆 tarkyn915/Linuxwiki 到 ~/wiki，装 Node 22 和 pnpm 10，pnpm install --frozen-lockfile 后 pnpm docs:build，再用 systemd --user 起本地预览（127.0.0.1:8080），最后自检
