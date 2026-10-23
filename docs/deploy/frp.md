# FRP 内网穿透

将内网服务暴露到公网，客户端 frpc 主动连到服务端 frps

https://github.com/fatedier/frp

## 安装

到 [Releases](https://github.com/fatedier/frp/releases) 下载对应平台的压缩包，解压即可，无需安装：

```bash
# 以 linux amd64 为例
wget https://github.com/fatedier/frp/releases/download/v0.61.1/frp_0.61.1_linux_amd64.tar.gz
tar -zxvf frp_0.61.1_linux_amd64.tar.gz
```

解压后目录里有 `frps`（服务端）和 `frpc`（客户端）两个可执行文件，对应两份配置

## 服务端 frps

`frps.toml`：

```toml
# frps 服务监听的本机端口
bindPort = 55555
# frpc 客户端连接鉴权 token
auth.token = "your_token"
# frps 服务 web 界面配置
webServer.addr = "0.0.0.0"
webServer.port = 57001
webServer.user = "username"
webServer.password = "adminpass"
# 日志打印配置
log.to = "/opt/frp/logs"
log.level = "info"
log.maxDays = 7
```

启动：

```bash
./frps -c ./frps.toml
```

## 客户端 frpc

`frpc.toml`：

```toml
# 建立连接
serverAddr = "server address"
serverPort = 55555
auth.token = "your_token"
# 全局配置
transport.tls.enable = true
transport.tcpMux = true
transport.poolCount = 3

[[proxies]]
name = "tcp-ex"
type = "tcp"
localIP = "127.0.0.1"
localPort = 80
remotePort = 57002
transport.useCompression = true
```

启动：

```bash
./frpc -c ./frpc.toml
```

## 参数说明

**全局配置**（客户端到服务端的连接）：

| 参数 | 说明 |
| --- | --- |
| `transport.tls.enable = true` | 加密客户端到服务端 |
| `transport.tcpMux = true` | 开启多路复用 |
| `transport.poolCount = 3` | 提前准备工作连接 |

**连接参数**（单个代理）：

| 参数 | 说明 |
| --- | --- |
| `transport.useCompression = true` | 压缩隧道内容，节省带宽 |
