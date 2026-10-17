# NFS 共享

NFS（Network File System）网络文件系统，让服务器之间通过网络共享目录。

## 服务端

### 安装

```bash
sudo pacman -S nfs-utils          # Arch Linux
sudo apt install nfs-kernel-server # Debian / Ubuntu
sudo yum install nfs-utils         # CentOS / RHEL
```

创建共享目录：

```bash
sudo mkdir -p /mnt/nfs_share
sudo chmod 777 /mnt/nfs_share
```

### 配置共享规则

编辑 `/etc/exports`，添加共享规则（若没有 exports 文件，启动一下 nfs 或手动创建）：

```
/mnt/nfs_share 192.168.1.0/24(rw,sync,no_root_squash,no_subtree_check)
```

参数说明：

| 参数 | 说明 |
| --- | --- |
| `192.168.1.0/24` | 允许整个 192.168.1.x 网段访问 |
| `rw` | 允许读写 |
| `sync` | 确保数据写入后才返回 |
| `no_root_squash` | 客户端 root 拥有 root 权限（不想让客户端 root 有 root 权限就去掉） |
| `no_subtree_check` | 关闭子目录检查，提高性能 |

### 应用并启动

```bash
sudo exportfs -arv                       # 应用配置
sudo systemctl enable --now nfs-server   # 启动并开机自启
sudo exportfs -v                         # 检查共享状态
```

## 客户端

### 安装

```bash
sudo pacman -S nfs-utils      # Arch Linux
sudo apt install nfs-common   # Debian / Ubuntu
sudo yum install nfs-utils    # CentOS / RHEL
```

### 查看服务端共享

```bash
showmount -e <服务器IP>
```

### 手动挂载

```bash
sudo mkdir -p /mnt/nfs
sudo mount -t nfs <服务器IP>:/mnt/nfs_share /mnt/nfs
```

### 开机自动挂载

编辑 `/etc/fstab`，添加：

```
<服务器IP>:/mnt/nfs_share /mnt/nfs nfs defaults 0 0
```

> 若网络可能不稳定，建议加 `nofail` 避免挂载失败卡开机：
> `<服务器IP>:/mnt/nfs_share /mnt/nfs nfs defaults,nofail 0 0`

然后验证：

```bash
sudo mount -a
```

### 取消挂载

```bash
sudo umount /mnt/nfs
```
