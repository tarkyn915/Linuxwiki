# OpenCode

OpenCode 是开源的 AI 编程助手，可以在项目目录里阅读代码、解释实现、修改文件和执行命令。它支持连接不同模型服务，提供终端界面、桌面应用和 Web 界面，适合代码问答、功能开发、排错与代码审查

- 官网：https://opencode.ai/
- v2 文档：https://opencode.ai/v2/docs/
- v1 文档：https://opencode.ai/docs/

::: info 版本说明
本文按 OpenCode v2 的官方文档编写。v1 和 v2 都使用 `opencode` 命令，默认不能以同名命令并存；v1 的 npm 包名是 `opencode-ai`，v2 是 `@opencode/cli`。已有 v1 时，先阅读[迁移指南](https://opencode.ai/v2/docs/migrate-v1/)，尤其注意插件 API、服务器 API 和终端配置的变化
:::

## 安装

Linux / macOS 使用 v2 官方安装脚本：

```bash
curl -fsSL https://opencode.ai/v2/install | bash
```

也可以通过 npm 安装，二选一即可：

```bash
npm install -g @opencode/cli
```

Arch Linux 用户也可以使用官方 v2 文档列出的 AUR 包：

```bash
paru -S opencode-beta
```

包管理器安装的 v1 应先通过对应包管理器卸载，再安装 v2；v2 安装脚本会替换已有的 v1 二进制。安装完成后可查看命令帮助：

```bash
opencode --help
```

如果提示找不到命令，检查安装输出中的可执行文件目录是否已加入 `PATH`，然后重新打开终端

## 连接模型

进入项目并启动终端界面：

```bash
cd ~/wiki
opencode
```

在 OpenCode 的输入框内运行：

```text
/connect
```

选择已有的模型服务，按提示输入 API Key 或完成服务支持的账号授权；然后运行：

```text
/models
```

选择要使用的模型。OpenCode Go 等官方服务是可选项，也可以使用自己的模型服务；实际费用取决于所连接的服务和模型

## 基本使用

直接用自然语言描述任务，并给出相关文件和预期结果。例如：

```text
解释这个项目的目录结构，以及文档站是怎样构建的
```

```text
检查 @docs/.vitepress/config.mts 的侧边栏配置，找出指向不存在页面的链接
```

输入 `@` 可以搜索并附加项目文件。需要先讨论方案时，用 `/agents` 选择合适的 Agent，明确要求先分析和规划；确认方案后，再让它执行修改

### 常用操作

下表中的斜杠命令在 OpenCode 界面内输入：

| 操作 | 命令 / 按键 |
| --- | --- |
| 连接模型服务 | `/connect` |
| 选择模型 | `/models` |
| 选择 Agent | `/agents` |
| 新建会话 | `/new` |
| 返回已有会话 | `/sessions` |
| 撤销最近一条用户消息及后续工作 | `/undo` |
| 恢复被撤销的工作 | `/redo` |
| 用外部编辑器编辑输入内容 | `/editor` |
| 打开命令面板 | `Ctrl+P` |
| 切换 Agent | `Shift+Tab` |
| 输入换行 | `Ctrl+J` |

`/undo` 与 `/redo` 涉及会话和文件变更恢复，仍应通过 Git 检查最终修改。常用检查命令：

```bash
git diff
git status --short
```

### 单次命令

在普通 Shell 中使用 `opencode run`，可以直接提交任务而不进入全屏界面：

```bash
opencode run "解释这个仓库的用途和构建步骤"
```

也可以继续最近一次会话：

```bash
opencode run --continue "再说明哪些文件负责导航和侧边栏"
```

## 配置文件

全局配置放在 `~/.config/opencode/opencode.json` 或 `opencode.jsonc`；项目配置可以放在项目根目录的同名文件中。JSONC 支持注释和尾随逗号

例如，连接 Anthropic 并确认模型可用后，可以设置默认模型：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5"
}
```

将模型值替换成自己实际可用的 `服务商ID/模型ID`。通常项目配置会覆盖全局配置中的同名设置，其他设置保留；系统管理配置具有更高优先级。完整规则见[配置文档](https://opencode.ai/v2/docs/config/)

### 自定义 OpenAI 兼容 API

如果服务没有内置在列表中，可以按 v2 格式添加自定义服务：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "myapi/my-model",
  "providers": {
    "myapi": {
      "name": "我的 API",
      "env": ["MY_API_KEY"],
      "package": "@opencode/ai/providers/openai-compatible",
      "settings": {
        "baseURL": "https://api.example.com/v1"
      },
      "models": {
        "my-model": {
          "name": "我的编程模型"
        }
      }
    }
  }
}
```

这是配置模板：将 `baseURL` 换成服务商提供的 API 地址，将 `my-model` 换成实际模型 ID，并让 OpenCode 服务进程能够读取 `MY_API_KEY` 环境变量。模型需要支持工具调用，才能完成编辑文件、执行命令等任务。服务商的接口兼容范围也会影响可用功能

v2 默认使用当前用户共享的后台服务器；已运行的服务器不会自动继承后来在终端设置的环境变量。首次验证环境变量配置时，可以在设置好变量的同一终端使用私有服务器：

```bash
opencode --standalone
```

v2 自定义服务使用 `providers`、`package` 和 `settings`；旧教程中的 `provider`、`npm`、`options` 属于 v1 格式。迁移支持范围以官方指南为准，修改时应保持单个服务配置的格式一致

## 配合 Herdr 使用

先完成 OpenCode 的安装和模型连接，再进入 [Herdr](herdr.md) 的终端窗格，在项目目录运行 `opencode`。可以在其他窗格中运行 Hermes、开发服务器或 Git 命令

Herdr 负责组织终端和工作区；OpenCode 的模型、项目配置和会话仍由 OpenCode 管理

## 参考资料

- [v2 安装与入口](https://opencode.ai/v2/docs/)
- [终端界面操作](https://opencode.ai/v2/docs/cli/tui/)
- [CLI 命令](https://opencode.ai/v2/docs/cli/commands/)
- [配置文件](https://opencode.ai/v2/docs/config/)
- [模型服务与自定义 API](https://opencode.ai/v2/docs/providers/)
- [v1 → v2 迁移](https://opencode.ai/v2/docs/migrate-v1/)
