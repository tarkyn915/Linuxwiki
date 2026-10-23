# TeamSpeak

自托管语音服务器，支持多人语音聊天

https://teamspeak.com/en/

镜像：https://hub.docker.com/_/teamspeak

图标库：https://tsicons.com/

## Docker 部署

```yaml
services:
  ts1:
    image: teamspeak
    restart: always
    ports:
      - 9987:9987/udp
      - 10011:10011
      - 30033:30033
    environment:
      TS3SERVER_DB_PLUGIN: ts3db_mariadb
      TS3SERVER_DB_SQLCREATEPATH: create_mariadb
      TS3SERVER_DB_HOST: db1
      TS3SERVER_DB_USER: root
      TS3SERVER_DB_PASSWORD: example
      TS3SERVER_DB_NAME: teamspeak1
      TS3SERVER_DB_WAITUNTILREADY: 30
      TS3SERVER_LICENSE: accept
  db1:
    image: mariadb
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: teamspeak1
```

## 多开

可以通过修改端口来多开，但是无法使用 icon：

```
- 9988:9987/udp   # 改变端口
- 10012:10011     # 改变端口
- 30034:30033     # 改变端口
```

## 音乐机器人

TS 音乐播放机器人，支持网易云、QQ 音乐、酷狗、B 站等音源

https://github.com/ZHANGTIANYAO1/teamspeak-music-bot

### Docker 部署

```bash
git clone https://github.com/ZHANGTIANYAO1/teamspeak-music-bot.git
cd teamspeak-music-bot/scripts/docker
```

```bash
docker compose pull
docker compose up -d
```

访问 `http://<服务器IP>:3000` 即可

### 脚本安装

```bash
git clone https://github.com/ZHANGTIANYAO1/teamspeak-music-bot.git
cd teamspeak-music-bot
chmod +x scripts/install.sh
sudo ./scripts/install.sh
```

管理服务：

```bash
sudo systemctl status tsmusicbot
sudo systemctl restart tsmusicbot
sudo systemctl stop tsmusicbot
journalctl -u tsmusicbot -f
```

### 首次配置

访问 WebUI（默认 `3000` 端口）后：

1. 首次会跳转 `/first-run` 引导创建管理员账号
2. 在「设置 → 机器人管理」里创建机器人实例，填 TS 服务器地址（默认端口 `9987`）、昵称等
3. 音源（网易云/QQ/酷狗/B 站）可扫码登录，登录后可播放 VIP 曲目
