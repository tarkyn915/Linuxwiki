# Windows

## 下载

- 官方下载：https://www.microsoft.com/zh-cn/software-download/windows11
- 原版镜像：https://next.itellyou.cn/

## 跳过联网安装

`Shift + F10` 打开命令提示符窗口，部分笔记本需要用 `Fn + Shift + F10`

```
oobe\BypassNRO.cmd
```

回车后重启，网络选择页点 `我没有 Internet 连接`

## 使用本地账户

OOBE 登录微软账户那一步同样先 `Shift + F10` 开命令行，执行：

```
start ms-cxh:localonly
```

会弹出本地账户创建窗口，填用户名密码即可

## 激活

### MAS

MAS（Microsoft Activation Scripts）官网：https://massgrave.dev

PowerShell 里执行：

```powershell
irm https://get.activated.win | iex
```

根据菜单选择激活 Windows 或 Office

### Office Tool Plus

用 Office Tool Plus 下载和部署 Office：https://otp.landian.vip/zh-cn/

也可以直接用 MAS 激活已安装的 Office
