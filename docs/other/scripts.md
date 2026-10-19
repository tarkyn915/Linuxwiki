# 常用脚本

> 一键脚本集合，按用途分类。跑之前先大致看一眼脚本来源，尤其是 DD 系统和 Warp 这类会改动系统的东西。

## 性能测试

### 融合怪

https://github.com/spiritLHLS/ecs

```bash
curl -L https://gitlab.com/spiritysdx/za/-/raw/main/ecs.sh -o ecs.sh && chmod +x ecs.sh && bash ecs.sh
```

### NodeQuality

```bash
bash <(curl -sL https://run.NodeQuality.com)
```

### YABS

https://github.com/masonr/yet-another-bench-script

```bash
curl -sL https://yabs.sh | bash
```

## 路由测试

### NextTrace

https://github.com/nxtrace/NTrace-core

```bash
curl nxtrace.org/nt | bash
```

## Warp

https://gitlab.com/fscarmen/warp

```bash
wget -N https://gitlab.com/fscarmen/warp/-/raw/main/menu.sh && bash menu.sh [option] [lisence/url/token]
```

## DD 系统

> 重装系统的脚本，会清空整台机器，别在生产环境上随手跑。

### Tools

https://github.com/leitbogioro/Tools

```bash
wget https://raw.githubusercontent.com/leitbogioro/Tools/master/Linux_reinstall/InstallNET.sh && chmod a+x InstallNET.sh && bash InstallNET.sh -debian 13 -pwd 'fJ;v1Dg0oD7-1Y' -port 22
```

### reinstall

https://github.com/bin456789/reinstall

```bash
bash reinstall.sh debian 13
```

常用参数：`--password` 设密码、`--ssh-port` 改端口、`--username` 设用户名。