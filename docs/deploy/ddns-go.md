# ddns-go 动态域名

自动获取公网 IP，解析到域名，支持阿里云、腾讯云、Dnspod、Cloudflare 等多家服务商

https://github.com/jeessy2/ddns-go

## 令牌申请

配置前先在对应 DNS 服务商处申请 API 密钥：

| 服务商 | 令牌申请入口 | 说明 |
| --- | --- | --- |
| 阿里云 | https://ram.console.aliyun.com/manage/ak | 创建 AccessKey，记下 AccessKey ID 和 Secret |
| 腾讯云 / Dnspod | https://console.dnspod.cn/account/token/apikey | 创建 DNSPod Token，记下 ID 和 Token |
| Cloudflare | https://dash.cloudflare.com/profile/api-tokens | 用「Edit zone DNS」模板创建 Token |

## 二进制安装

从 [Releases](https://github.com/jeessy2/ddns-go/releases) 下载解压，安装为服务：

```bash
sudo ./ddns-go -s install
```

安装后访问 `http://<服务器IP>:9876` 进行初始化配置

卸载：

```bash
sudo ./ddns-go -s uninstall
```

### 常用启动参数

| 参数 | 说明 |
| --- | --- |
| `-l` | 监听地址 |
| `-f` | 同步间隔时间（秒） |
| `-c` | 自定义配置文件路径 |
| `-noweb` | 不启动 web 服务 |

示例，10 分钟同步一次并指定配置文件：

```bash
./ddns-go -s install -f 600 -c /root/.ddns_go_config.yaml
```

## Docker 部署

使用 host 网络模式：

```bash
docker run -d \
  --name ddns-go \
  --restart=always \
  --net=host \
  -v /opt/ddns-go:/root \
  jeessy/ddns-go
```

访问 `http://<Docker主机IP>:9876` 初始化配置

不使用 host 模式（端口映射）：

```bash
docker run -d \
  --name ddns-go \
  --restart=always \
  -p 9876:9876 \
  -v /opt/ddns-go:/root \
  jeessy/ddns-go
```
