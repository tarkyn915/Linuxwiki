# magpie

magpie 是本机运行的模型网关（默认 `127.0.0.1:3425`），把 OpenAI、Anthropic、Gemini 三种协议互译，让 Codex、Claude Code、Gemini CLI、OpenCode、Hermes 等工具都能换成别家的模型或另一个订阅的账号。选完模型它会直接改写工具自己的配置文件，只动需要的那几项

- 官网：[usemagpie.ai](https://usemagpie.ai/)
- 中文文档：[usemagpie.ai/docs/zh/start](https://usemagpie.ai/docs/zh/start)
- 源码：[github.com/yetone/magpie](https://github.com/yetone/magpie)（MIT）
- 下载：[github.com/yetone/magpie-releases/releases](https://github.com/yetone/magpie-releases/releases)

## 安装

Arch / CachyOS 用 AUR 的 `magpie-bin`（桌面版，会带上 GTK 3 + WebKitGTK 4.1 依赖）：

```bash
yay -S magpie-bin
```

只要终端命令、不想装图形依赖时用 `magpie-cli-bin`，命令名是 `magpie-cli`，可以和桌面版共存

其他发行版走官方脚本，装到 `~/.local/bin` 并加入应用菜单：

```bash
curl -fsSL https://usemagpie.ai/install.sh | sh
```