# CachyOS

**官网**：https://cachyos.org

**当前版本**：滚动发布（基于 Arch Linux）

基于 Arch 的滚动发行版，主打高性能：默认使用优化过的内核（Cachy 内核）、x86-64-v3/v4 编译优化，安装简单、驱动自动配置。适合想要 Arch 但不想手动折腾安装的用户。

- 下载：https://cachyos.org/download
- 特点：BORE/Cachy 内核、游戏优化、图形化安装器、自带 Shelly 包管理器

## 安装后：关闭默认防火墙

无论终端安装还是图形化安装，系统默认都启用了 UFW 防火墙，需要手动关闭：

```bash
sudo ufw disable
```

> 装完记得用 `sudo ufw status` 确认状态。
