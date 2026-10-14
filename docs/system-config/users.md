# 用户和用户组

Linux 用户相关的信息分散在几个文件里：

```
/etc/passwd    用户及其属性信息
/etc/shadow    用户密码及其相关属性
/etc/group     组及其属性信息
/etc/gshadow   组密码及其相关属性
```

## 用户

### 创建用户

```
useradd -m -s /usr/bin/bash xnamex
```

`-m` 自动创建家目录，`-s` 指定登录 shell。

删除用户（`-r` 连同家目录一起删）：

```
userdel username -r
```

### 修改用户信息

改用户名：

```
usermod -l newname oldname
```

迁移家目录到新位置（`-m` 会移动现有文件）：

```
usermod -d /new/home -m username
```

锁定 / 解锁用户（锁定后无法登录）：

```
usermod -L username
usermod -U username
```

## 用户组

### 创建组

```
groupadd groupname
```

修改用户组属性：

```
groupmod groupname
```

删除用户组：

```
groupdel groupname
```

### 把用户加入组

追加到附加组（多个组用逗号分隔）：

```
usermod -aG group1,group2 username
```

> `-a` 表示追加（append），`-G` 指定附加组。不加 `-a` 会覆盖用户原来的附加组，务必带上 `-a`。

## sudo 权限

配置文件在 `/etc/sudoers`（用 `visudo` 编辑，会检查语法）。

方式一：把用户加到 sudo 组（推荐，方便维护）：

```
usermod -aG wheel 用户名
```

方式二：直接给单个用户加 sudo 权限：

```
xxx ALL=(ALL:ALL) ALL
```
