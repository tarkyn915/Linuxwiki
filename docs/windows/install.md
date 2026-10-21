# 安装与本地账户

## 跳过联网安装

`Shift + F10` 打开命令提示符窗口，部分笔记本需要用 `Fn + Shift + F10`。

```
oobe\BypassNRO.cmd
```

回车后重启，网络选择页点 `我没有 Internet 连接`。

## 使用本地账户

OOBE 登录微软账户那一步同样先 `Shift + F10` 开命令行，执行：

```
start ms-cxh:localonly
```

会弹出本地账户创建窗口，填用户名密码即可。
