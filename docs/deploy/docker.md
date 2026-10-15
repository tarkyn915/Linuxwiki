# Docker

https://www.docker.com/

## 安装

官方一键安装脚本：

```bash
curl -fsSL https://get.docker.com | bash -s docker
```

启动并设置开机自启：

```
sudo systemctl start docker
sudo systemctl enable docker
```

> 目前 Docker 已集成 Compose，无需额外安装。

## 镜像加速

### 毫秒镜像

https://1ms.run/

镜像地址 `docker.1ms.run`，ghcr 用 `ghcr.1ms.run`

编辑 `/etc/docker/daemon.json`：

```json
{
  "registry-mirrors": [
    "https://docker.1ms.run"
  ]
}
```

### 轩辕镜像

https://xuanyuan.cloud/

一键配置：

```bash
bash <(wget -qO- https://get.xuanyuan.cloud/docker.sh)
```

备用地址：

```bash
bash <(wget -qO- https://get.xuanyuan.me/docker.sh)
```

手动配置，镜像地址 `docker.xuanyuan.me`：

```json
{
  "registry-mirrors": [
    "https://docker.xuanyuan.me"
  ]
}
```

### 多源容灾

可同时配置多个源，Docker 会自动尝试可用的：

```json
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://docker.xuanyuan.me",
    "https://docker.m.daocloud.io"
  ]
}
```

配置完重启生效：

```
sudo systemctl daemon-reload
sudo systemctl restart docker
```

验证：

```
docker info | grep -A 1 "Registry Mirrors"
```

## 常用命令

镜像：

```
docker images                 # 查看本地镜像
docker pull <image>           # 拉取镜像
docker rmi <image>            # 删除镜像
docker image prune -a         # 清理未使用的镜像
```

容器：

```
docker run -d -p 宿主机端口:容器端口 --name 名称 <image>   # 后台启动并映射端口
docker ps -a                  # 查看所有容器
docker stop/start/restart <container>
docker rm -f <container>      # 强制删除容器
```

调试：

```
docker logs -f --tail 100 <container>   # 实时看日志
docker exec -it <container> bash        # 进入容器
docker inspect <container>              # 查看元数据
```

数据卷：

```
docker volume ls
docker volume inspect <volume_name>     # 查看宿主机实际路径
```

清理：

```
docker system prune -a --volumes   # 一键清理停止的容器、网络、镜像、卷
```

## Docker Compose

```
docker compose up -d                 # 后台启动所有服务
docker compose up --build -d         # 重建镜像后启动
docker compose down                  # 停止并销毁容器、网络
docker compose down -v               # 连同数据卷一起删
docker compose logs -f --tail 100    # 实时看日志
docker compose ps                    # 查看容器状态
docker compose exec <service> bash   # 进入服务容器
docker compose pull                  # 拉取最新镜像
```
