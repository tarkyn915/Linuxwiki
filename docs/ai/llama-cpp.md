# llama.cpp 模型部署

https://github.com/ggml-org/llama.cpp

使用 Vulkan 后端调用 AMD RX 9060 XT 16GB 显卡，分别记录 Windows 和 Arch / CachyOS 下的部署方式

## Windows

### 下载与验证显卡

在 [Releases](https://github.com/ggml-org/llama.cpp/releases) 中选择 Windows x64 的 Vulkan 预编译包，文件名包含 `win-vulkan-x64`，解压后打开 PowerShell

使用 Vulkan 后端无需配置 ROCm，需要先安装好 AMD 显卡驱动

```powershell
.\llama-cli.exe --list-devices
```

显卡识别结果示例，空闲显存会随运行状态变化

```text
Vulkan0: AMD Radeon RX 9060 XT (16304 MiB, 15419 MiB free)
```

### 下载 GGUF 模型

选择 llama.cpp 支持的 GGUF 模型，文件包含量化权重、词表和对话模板，部分多模态模型还需要单独下载对应的投影文件

以这份笔记中的 9B 模型为例，具体大小以模型文件列表为准

| 量化档位 | 大约体积 | 选择 |
| --- | --- | --- |
| Q4_K_M | 5.6 GB | 体积更小，适合显存紧张时使用 |
| Q8_0 | 9.5 GB | 量化误差通常更小，16GB 显存可优先尝试，还需给上下文和其他运行开销留空间 |

不要直接 `git clone` 整个 GGUF 仓库，仓库通常同时包含多个量化版本，Git LFS 可能一并下载几十 GB 的模型文件

在魔搭 ModelScope 或 HF-Mirror 网页的模型文件列表中，只下载目标 `.gguf` 文件

也可以在已安装 ModelScope CLI 的情况下，指定文件过滤下载，把 `<仓库名>` 换成实际模型仓库

```powershell
modelscope download --model <仓库名> --include "*Q8_0.gguf" --local_dir E:\AI\models
```

已经误下载整仓库时，清理不需要的量化文件，并确认隐藏的 `.git` 中是否还保留了 Git LFS 缓存

### 启动服务

`--flash-attn` 显式指定 `on`、`off` 或 `auto`，这里使用 `on`

采样参数使用 `--temp 0.6 --top-p 0.95`，效果还取决于模型本身和提示词

多模态模型需要 llama.cpp 支持其架构，并通过 `--mmproj` 加载匹配的投影文件，纯文本模型删除该参数

在 `llama-server.exe` 所在目录新建 `start_server.bat`，以下沿用模型文件名示例，路径和文件名按实际下载情况修改

```bat
@echo off
cd /d "%~dp0"
.\llama-server.exe -m "E:\AI\models\DeepSeek-V4-Pro-Qwen3.5-9B-MTP-GGUF\DeepSeek-V4-Pro-Qwen3.5-9B-MTP-Q8_0.gguf" --mmproj "E:\AI\models\DeepSeek-V4-Pro-Qwen3.5-9B-MTP-GGUF\mmproj-F32.gguf" -ngl 99 -c 16384 --flash-attn on --temp 0.6 --top-p 0.95 --host 127.0.0.1 --port 8080
pause
```

启动后访问 http://127.0.0.1:8080

## Linux（Arch / CachyOS）

### 安装 Vulkan 驱动与 llama.cpp

安装 AMD Vulkan 驱动和检测工具

```bash
sudo pacman -S --needed vulkan-radeon vulkan-tools
```

下面两种安装方式二选一

#### 软件包安装

Arch 官方仓库当前包名为 `llama-cpp`，Vulkan 后端单独安装 `ggml-vulkan`

```bash
sudo pacman -S --needed llama-cpp ggml-vulkan
```

#### 源码编译

```bash
sudo pacman -S --needed base-devel cmake git shaderc vulkan-headers spirv-headers vulkan-icd-loader
git clone https://github.com/ggml-org/llama.cpp.git ~/llama.cpp
cd ~/llama.cpp
cmake -B build -DGGML_VULKAN=ON
cmake --build build --config Release -j$(nproc)
```

编译后的程序位于 `~/llama.cpp/build/bin/`，当前终端先加入搜索路径，再执行下文命令

```bash
export PATH="$HOME/llama.cpp/build/bin:$PATH"
```

### 验证显卡识别

```bash
llama-cli --list-devices
```

确认输出包含 `Vulkan0: AMD Radeon RX 9060 XT`

### 下载单文件模型并启动

建立模型目录，把下载直链换成所选模型的单文件地址，下面以 `Qwen3.5-9B-Q8_0.gguf` 为例

```bash
mkdir -p ~/ai/models
cd ~/ai/models
curl -L -C - -o Qwen3.5-9B-Q8_0.gguf "<单文件下载直链>"
```

启动服务

```bash
llama-server \
  -m ~/ai/models/Qwen3.5-9B-Q8_0.gguf \
  -ngl 99 \
  -c 16384 \
  --flash-attn on \
  --temp 0.6 \
  --top-p 0.95 \
  --host 127.0.0.1 \
  --port 8080
```

访问 http://127.0.0.1:8080，需要视觉输入时另外下载与模型匹配的投影文件并加入 `--mmproj` 参数

### systemd 用户级后台服务

创建用户服务目录

```bash
mkdir -p ~/.config/systemd/user
```

新建 `~/.config/systemd/user/llama-server.service`，以下使用软件包安装后的程序路径

::: details llama-server.service
```ini
[Unit]
Description=Local llama.cpp Inference Server (Vulkan)
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/llama-server \
  -m %h/ai/models/Qwen3.5-9B-Q8_0.gguf \
  -ngl 99 \
  -c 16384 \
  --flash-attn on \
  --temp 0.6 \
  --top-p 0.95 \
  --host 127.0.0.1 \
  --port 8080
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```
:::

源码安装时，将 `ExecStart` 的 `/usr/bin/llama-server` 改为 `%h/llama.cpp/build/bin/llama-server`，模型路径也按实际文件修改

关闭前台运行的 `llama-server` 后，再启动后台服务，避免占用同一个端口和重复加载模型

```bash
systemctl --user daemon-reload
systemctl --user start llama-server      # 立即启动
systemctl --user status llama-server     # 查看状态与模型加载日志
systemctl --user stop llama-server       # 玩游戏前释放模型占用的显存
```
