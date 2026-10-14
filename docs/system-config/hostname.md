# 主机名

## 查看主机名

```bash
uname -a
hostnamectl
```

## 设置主机名

```bash
hostnamectl set-hostname newhostname
```

## 非 Systemd 系统

不用 Systemd 的话，直接改 `/etc/hostname`：

```
newhostname
```

## 同步 /etc/hosts

改完主机名后，要把新名字写进 `/etc/hosts`，否则 `sudo` 会报 `unable to resolve host` 警告：

```
127.0.0.1   localhost
127.0.1.1   newhostname
```
