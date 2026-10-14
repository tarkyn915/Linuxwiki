# swap 交换内存

swap 有两种主要形式：**swap 文件** 和 **swap 分区**。

查看当前已启用的 swap：

```
swapon -s
swapon --show
```

关闭 swap：

```
swapoff xxxx
```

## 启用 swap 分区

提前创建好 sda2 为 swap 分区：

```bash
mkswap /dev/sda2
swapon /dev/sda2
# 编辑 fstab
/dev/sda2 none swap defaults 0 0
```

## 创建 swap 文件

```bash
# 用三种方法创建都可以
dd if=/dev/zero of=/swapfile bs=1M count=2048
fallocate -l 2G /swapfile
mkswap -U clear --size 2G --file /swapfile

# 修改文件权限，避免其他用户误触
chmod 600 /swapfile

# 格式化为 swap 文件
mkswap /swapfile

# 启动 swap 文件
swapon /swapfile

# 添加到 fstab
/swapfile none swap defaults 0 0
```

## 配置 swappiness

swappiness 数字越大，越积极的把较少使用的匿名内存交换到 swap。

查看当前值（默认一般是 60）：

```
cat /proc/sys/vm/swappiness
```

服务器低延迟或 PC 桌面建议调低，尽可能使用物理内存，一般默认即可。

### 临时设置

```
sudo sysctl -w vm.swappiness=100
```

### 永久设置

```bash
sudo tee /etc/sysctl.d/99-swappiness.conf <<'EOF'
vm.swappiness=100
EOF
sudo sysctl --system
```

## zram 和 zswap

- **zram**：在内存里压缩数据，`/dev/zram0`
- **zswap**：在硬盘 swap 之前创建一个压缩缓冲

查看当前 swap 实时状态：

```
vmstat 1
```

### zram

安装 `systemd-zram-generator`，创建或编辑 `/etc/systemd/zram-generator.conf`：

```
[zram0]
zram-size = min(ram / 2, 4096)
compression-algorithm = zstd
swap-priority = 100
```

> 内存的一半，但不会超过 4G

```
[zram0]
zram-size = ram / 2
compression-algorithm = zstd
swap-priority = 100
```

> 内存的一半

重启后验证：

```
swapon --show
zramctl
free -h
```

### zswap + swapfile

先确认 swapfile 已启用 `swapon --show`，再添加内核参数到 GRUB（`/etc/default/grub` 的 `GRUB_CMDLINE_LINUX="..."`）：

```
zswap.enabled=1 zswap.compressor=zstd zswap.zpool=zsmalloc zswap.max_pool_percent=20
```

#### Debian 系列

```
update-grub
```

#### Red Hat 系列

```
grubby --update-kernel=ALL --args="zswap.enabled=1 zswap.compressor=zstd zswap.zpool=zsmalloc zswap.max_pool_percent=20"
```

查看默认内核启动项：

```
grubby --info=DEFAULT
```

删除：

```
grubby --update-kernel=ALL --remove-args="zswap.enabled zswap.compressor zswap.zpool zswap.max_pool_percent"
```

重启后检查：

```
cat /proc/cmdline
cat /sys/module/zswap/parameters/enabled
cat /sys/module/zswap/parameters/compressor
cat /sys/module/zswap/parameters/zpool
cat /sys/module/zswap/parameters/max_pool_percent
```
