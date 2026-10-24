# Sunshine 串流

## 目标端（有公网的被控游戏机）

1. 安装 Sunshine
2. 进光猫/主路由后台，配置端口转发（Port Forwarding），将公网流量映射至被控主机的内网 IP

   TCP 端口：

   ```text
   47984, 47989, 48010
   ```

   UDP 端口：

   ```text
   47998, 47999, 48000, 48002, 48010
   ```

3. 在 Sunshine Web 管理面板中设置：
   - **Encoder**：开启 GPU 硬件加速编码（NVENC / AMF / VA-API）
   - **Resolution / FPS**：设置为 1920x1080，帧率开放到 120 FPS
4. （可选）如果公网 IP 是动态的（家用宽带动态公网），配合免费的 DDNS 服务（如 Cloudflare DDNS 等）绑定域名

## 本地控制端

1. 安装 Moonlight 客户端
2. 点击右上角添加设备，直接填入目标端的公网 IP（或 DDNS 域名）
3. 输入屏幕上弹出的 4 位 PIN 码，在 Sunshine 面板完成安全配对
4. 客户端设置：
   - 分辨率选 1080P，帧率拉到 120 FPS
   - 码率（Bitrate）推到 40 Mbps ~ 60 Mbps（20ms 延迟配合几十兆码率体验最丝滑）
   - 视频解码选**硬件解码（强制开启）**，优先选择 AV1 或 HEVC (H.265)

## 遇到的问题

### 让两边都能听到声音

1. 在 Sunshine 面板的 **Audio/Video** 里把 **Audio Sink** 填成音频设备的 ID，不是设备名

   设备 ID 用 Sunshine 自带的工具查，在安装目录下执行

   ```bash
   tools\audio-info.exe
   ```

   输出里找到要采集的那个设备，ID 形如

   ```text
   {0.0.0.00000000}.{02734d72-51c0-4a56-aa5d-f3f2035d6305}
   ```

   ![Sunshine 的 Audio Sink 填设备 ID](/images/sunshine/audio-sink.png)

2. 在 Moonlight 客户端音频设置里关掉「流式传输启动时将目标计算机的扬声器静音」

   ![Moonlight 音频设置](/images/sunshine/audio-settings.png)
