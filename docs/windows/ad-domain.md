# AD 域搭建

## 安装域服务

进入 Windows Server，配置好 IP 和网关

服务器管理器 → 添加角色和功能，勾选「Active Directory 域服务」并安装

![添加角色和功能，勾选 Active Directory 域服务](/images/ad/add-role.png)

装完点服务器管理器顶部的旗帜通知 → 将此服务器提升为域控制器

![部署后配置，将此服务器提升为域控制器](/images/ad/promote-dc.png)

设置默认密码

```text
Passworld123
```

提示 Administrator 没有密码时，先给本地管理员设一个

```bash
net user Administrator Passworld123
```

一路安装完，重启后退出默认账户，用管理员账户登录

```text
Administrator
Passworld123
```

## 修改管理员密码

工具 → Active Directory 用户和计算机，找到刚刚的域 → Users → Administrator，修改密码

![Users 里的 Administrator，右键重置密码](/images/ad/reset-password.png)

之后就可以用域控的管理员账户登录

```text
JD\Administrator
```

## 创建用户

在 Active Directory 用户和计算机的 Users 里创建新员工用户

## 新电脑开通

先把新电脑的 DNS 指向域控服务器的 IP，然后登录域控里创建的用户

## 普通用户提权

在客户机上用域控管理员账户登录

```text
JD\Administrator
```

Win + X → 计算机管理 → 本地用户和组 → 组 → Administrators → 添加，输入要提权的用户比如 wang，点「检查名称」，出现类似 `JD\wang` 后添加即可，然后重启

同时也可以删除系统默认创建的用户
