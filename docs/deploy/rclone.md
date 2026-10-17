# Rclone

云盘同步 / 挂载工具，把 WebDAV、网盘等挂载成本地目录。

https://rclone.org/

## 安装

需要先安装 `fuse3`：

```bash
# Debian / Ubuntu
sudo apt install fuse3

# Rocky / Fedora
sudo dnf install fuse3

# Arch
sudo pacman -S fuse3
```

一键脚本安装：

```bash
sudo -v ; curl https://rclone.org/install.sh | sudo bash
```

## 配置

创建配置文件：

```bash
rclone config
```

交互式配置流程（以连接 alist 的 WebDAV 为例）：

1. `n` — 新建一个 config
2. 输入名称，例如 `yidong`
3. 选择挂载类型，找到 **WebDAV** 选择（版本更新后编号会变）
4. 填写 alist 地址，**末尾一定要加 `/dav`**，例如 `https://xxx.xxx/dav`
5. 类型选 `other`（如果后续支持了 alist 可以直接选）
6. 输入 alist 用户名和密码（中途需输入一次 `y` 确认输入密码）
7. 后面几项直接回车跳过

配置成功后测试是否连通，**记住带个冒号 `:`**：

```bash
rclone lsd yidong:
```

配置文件默认位置：`/root/.config/rclone/rclone.conf`

## 挂载网盘

以挂载 `yidong` 盘到 `/yidong` 目录为例：

```bash
rclone mount yidong: /yidong --config /root/.config/rclone/rclone.conf --header "Referer:" --multi-thread-streams 8 --buffer-size 128M --vfs-fast-fingerprint --no-modtime --file-perms 0777 --copy-links --allow-other --allow-non-empty --umask 000 --daemon
```

### 常用参数

| 参数 | 说明 |
| --- | --- |
| `--buffer-size 128M` | 内存缓冲区大小 |
| `--vfs-fast-fingerprint` | 快速文件指纹计算，提高性能 |
| `--no-modtime` | 不保存文件修改时间 |
| `--multi-thread-streams 4` | 线程数，降低系统负载 |
| `--allow-non-empty` | 允许挂载到非空目录 |
| `--daemon` | 以守护进程启动 |
| `--allow-other` | 允许其他用户访问 |
| `--umask 000` | 权限掩码 |

### 日志参数

| 参数 | 说明 |
| --- | --- |
| `--log-file /var/log/rclone.log` | 日志文件路径 |
| `--log-level INFO` | 日志级别 |

### 缓存模式

| 参数 | 说明 |
| --- | --- |
| `--cache-dir /path/disk/cache` | 指定缓存目录 |
| `--vfs-cache-mode full` | 完整 VFS 缓存，全部缓存到本地（默认在 `.cache` 目录） |
| `--vfs-cache-mode writes` | 仅写操作时缓存文件 |
| `--vfs-cache-mode off` | 关闭缓存（默认） |
| `--vfs-cache-max-size 1G` | 指定缓存大小 |

## 取消挂载

```bash
fusermount -u /yidong
```
