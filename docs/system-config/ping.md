# 禁止 ping（ICMP）

## 通过防火墙控制

```bash
iptables -I INPUT -p icmp --icmp-type 8 -j DROP
```

## 通过内核参数

编辑 `/etc/sysctl.conf`：

```bash
net.ipv4.icmp_echo_ignore_all = 1
```

改完执行 `sysctl -p` 生效。
