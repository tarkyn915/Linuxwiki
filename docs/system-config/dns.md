# DNS 配置

## 自定义 DNS

```
nameserver 8.8.8.8
nameserver 1.1.1.1
```

## 锁定 DNS 文件，防止被覆盖

其他网络工具可能覆盖修改 DNS，锁定可防止被改：

```bash
# 锁定文件
chattr +i /etc/resolv.conf
# 查看状态（有 i 标志表示已锁定）
lsattr /etc/resolv.conf
```

## 注意

如果 `/etc/resolv.conf` 是个符号链接（指向 NetworkManager 或 systemd-resolved 生成的文件），直接改它重启后会被覆盖。这时更简单的方式：

```bash
# 用 NetworkManager 设置（桌面环境常见）
nmcli connection modify "连接名" ipv4.dns "8.8.8.8 1.1.1.1"
nmcli connection up "连接名"
```

先查连接名：

```bash
nmcli connection show
```
