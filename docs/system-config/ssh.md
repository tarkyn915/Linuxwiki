# SSH 配置

## 生成密钥

生成一个 ed25519 密钥，放入 `.ssh` 文件夹中：

```
ssh-keygen -t ed25519
```

把生成的公钥写入服务器的验证公钥文件：

```
cat ~/.ssh/id_ed25519.pub > ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

> 密钥权限必须是 `~/.ssh` 为 700、`authorized_keys` 为 600，否则 SSH 会因权限过宽而拒绝使用

## 修改 SSH 配置

编辑 `/etc/ssh/sshd_config`：

```
# 密码登录
PasswordAuthentication no    # 是否允许密码验证
PermitRootLogin yes          # 是否允许 root 直接登录

# 密钥登录
RSAAuthentication yes        # 启用 RSA 认证，默认为 yes
PubkeyAuthentication yes     # 启用公钥认证，默认为 yes
```

> `PasswordAuthentication no` 会关闭密码登录，改之前务必确认密钥已经配好、能正常登录，否则可能把自己锁在门外

改完重启 SSH 服务生效：

```
sudo systemctl restart ssh
```
