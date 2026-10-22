# Odoo

开源 ERP / 企业管理套件，模块化覆盖销售、采购、库存、财务、项目、CRM、制造、电商等，社区版免费开源

https://www.odoo.com/zh_CN

镜像：https://hub.docker.com/_/odoo

## Docker Compose 部署

```bash
mkdir -p /opt/odoo-lab && cd /opt/odoo-lab
```

新建 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  web:
    image: odoo:18.0
    container_name: odoo_web
    depends_on:
      - db
    # 认 Nginx 传的 X-Forwarded-* 头，反代时必须开；没有反代时删掉这行
    command: odoo --proxy-mode
    ports:
      # 只监听本机，由 Nginx 反向代理对外；不走反代时改成 "8069:8069"
      - "127.0.0.1:8069:8069"
    environment:
      - HOST=db
      - USER=odoo
      - PASSWORD=odoo_pwd
    volumes:
      - odoo-web-data:/var/lib/odoo
    restart: unless-stopped

  db:
    image: postgres:16
    container_name: odoo_db
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_USER=odoo
      - POSTGRES_PASSWORD=odoo_pwd
    volumes:
      - odoo-db-data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  odoo-web-data:
  odoo-db-data:
```

启动容器：

```bash
docker compose up -d
docker compose logs -f web
```

浏览器打开 Odoo：本机 `http://127.0.0.1:8069`，已配好 Nginx 则访问反代域名，未建库时进入 Database Creation 页面

## 创建数据库

在 Database Creation 页面依次填写：

1. **Master Password**：页面顶部已自动填好一串随机密码，**复制保存到本地**（数据库主控密码，后续整库备份、恢复、删库都要它）
2. **Database Name**：填 `demo_corp`（或任意英文字母，代表公司账套名）
3. **Email / Password**：管理员登录账号与密码，例如 `admin@test.com` / `admin123`
4. **Language**：`Chinese (Simplified) / 简体中文`
5. **Country**：`China`
6. **Demo data**：勾选
7. 点最下方 **Create database**，等 1~2 分钟写完基础表结构，自动跳转并登录主界面

勾选 Demo data 后会自动生成测试产品、客户、供应商与历史单据，不用从零录基础数据

## 安装进销存模块

登录后进入应用市场（Apps）网格界面：

1. 找到 **库存（Inventory）** 卡片，点 **激活（Activate）**
2. 页面刷新后，点左上角「应用」菜单，找到 **采购（Purchase）**，点 **激活**
3. 同样找到 **销售（Sales）**，点 **激活**

验证：点左上角主菜单图标（九个小方块），下拉里能看到 讨论、日历、联系人、销售、采购、库存、设置 等完整应用列表，说明三个模块都装好了

## Nginx 反向代理

```nginx
# odoo
server {
  listen 443 ssl;
  listen [::]:443 ssl;
  http2 on;

  server_name odoo.example.com;

  ssl_certificate      /path/to/cert/fullchain.pem;
  ssl_certificate_key  /path/to/cert/privkey.pem;

  # 上传附件、导出报表
  client_max_body_size 100m;

  location / {
    proxy_pass http://127.0.0.1:8069;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 720s;
    proxy_send_timeout 720s;
  }

  # 实时通知走 WebSocket；workers=0 时由 8069 自己处理 upgrade
  location /websocket {
    proxy_pass http://127.0.0.1:8069;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 720s;
  }
}
```

`nginx -t && nginx -s reload`，访问 `https://odoo.example.com`

反代必须配合 `command: odoo --proxy-mode`（等价于 odoo.conf 里的 `proxy_mode = True`），否则 Odoo 不认 `X-Forwarded-Proto`，仍认为自己跑在 HTTP 上：QWeb 模板、报表、邮件里的绝对链接会生成 `http://`；管理员登录时还会把系统参数 `web.base.url` 覆盖成 http 地址（除非 `web.base.url.freeze` 为真），这个开关只在有可信反代时开

登录后到「设置 → 技术 → 参数 → 系统参数」，把 `web.base.url` 固定成 `https://odoo.example.com`

`workers = 0`（镜像默认）时 websocket 由 8069 自己处理 upgrade，上面这样写就够；改成多 worker（`workers > 0`，gevent）后 websocket 挪到 8072，`/websocket` 的 `proxy_pass` 要改成 `http://127.0.0.1:8072`

## 升级与备份

改 `docker-compose.yml` 里的镜像 tag 后升级，跨大版本（如 18.0 → 19.0）先做备份：

```bash
docker compose pull
docker compose up -d
```

跨大版本还需要更新库内所有模块：

```bash
docker compose run --rm web odoo -u all -d demo_corp --stop-after-init
```

备份数据库：

```bash
docker compose exec db pg_dump -U odoo -Fc demo_corp > demo_corp-$(date +%Y%m%d).dump
```

备份附件 filestore（卷名 = 目录名 + 卷名，这里是 `odoo-lab_odoo-web-data`）：

```bash
docker run --rm -v odoo-lab_odoo-web-data:/data -v "$PWD":/backup alpine \
  tar czf /backup/filestore-$(date +%Y%m%d).tar.gz -C /data filestore
```

恢复时先建空库再导入：

```bash
docker compose exec db createdb -U odoo demo_corp_restore
docker compose exec -T db pg_restore -U odoo -d demo_corp_restore --no-owner < demo_corp-20260101.dump
```

## 数据库快照与容灾备份

访问数据库管理入口：`https://odoo.example.com/web/database/manager`（本机直连 `http://127.0.0.1:8069/web/database/manager`）

1. 在 `demo_corp` 账套旁边点 **Backup**
2. 输入保存的 Master Password，备份格式选 **zip (includes filestore)**，点下载

得到一个 zip，里面是数据库完整 SQL 转储加上附件静态文件；换一台新机器把服务部署好，在同一个页面点 **Restore Database** 上传即可一键恢复
