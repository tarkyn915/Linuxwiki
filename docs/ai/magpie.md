# magpie

magpie 是本机运行的模型网关（默认 `127.0.0.1:3425`），把 OpenAI、Anthropic、Gemini 三种协议互译，让 Codex、Claude Code、Gemini CLI、OpenCode、Hermes 等工具都能换成别家的模型或另一个订阅的账号。选完模型它会直接改写工具自己的配置文件，只动需要的那几项

- 官网：**[usemagpie.ai](https://usemagpie.ai/)**
- 中文文档：**[usemagpie.ai/docs/zh/start](https://usemagpie.ai/docs/zh/start)**

## 桌面

直接下载对应的桌面客户端

[usemagpie.ai/zh](https://usemagpie.ai/zh/)

Linux 可以下载 `magpie-linux-amd64` 运行 GUI

[github.com/yetone/magpie-releases/releases](https://github.com/yetone/magpie-releases/releases)

Arch 发新版可以直接用 AUR

```bash
yay -S magpie-bin
```

## 终端

```bash
curl -fsSL https://usemagpie.ai/install.sh | sh
```

只要终端版、不要桌面版（装了 WebKitGTK 4.1 的机器上脚本默认给桌面版）：

```bash
MAGPIE_CLI=1 curl -fsSL https://usemagpie.ai/install.sh | sh
```

### 配置网页

用网页管理

```bash
magpie daemon install --web --lan
```

`--web` 让服务同时提供网页，`--lan` 把 3425（网关）和 3430（网页）绑到 `0.0.0.0`

打印网页地址和 key

```bash
magpie daemon status
```

让用户驻留

```bash
sudo loginctl enable-linger $USER
```

### 日常管理

```bash
systemctl --user status magpie
journalctl --user -u magpie -f
magpie daemon restart
magpie daemon web off   # 只留网关，关掉网页
magpie daemon uninstall # 停服务并删掉 unit
```

### 更换网页 key

```bash
openssl rand -hex 16
nano ~/.config/systemd/user/magpie.service   # 改 Environment="MAGPIE_WEB_KEY=…
systemctl --user daemon-reload && systemctl --user restart magpie
magpie daemon status
```

## 数据目录

```
~/.config/magpie/providers.json   供应商与 API key
~/.config/magpie/logins.json      订阅登录
~/.config/magpie/settings.json    设置，含局域网共享开关
~/.config/magpie/routing/         路由记录
~/.config/magpie/usage.jsonl      用量
```
