# Firefox 配置

官网下载：https://www.mozilla.org/firefox/

## 修改新标签页背景图片

打开 `about:profiles`，打开默认配置文件的根目录

在这个文件夹下创建 `chrome` 文件夹，新建一个 `userContent.css`，再把壁纸图片放进去

编辑 `userContent.css`，把最后的 `url(img.jpg)` 改成自己的图片名

::: details userContent.css
```css
@-moz-document url(about:home), url(about:newtab), url(about:privatebrowsing) {
  .top-site-button .title, .context-menu-button {
    color: #fff !important ;
    text-shadow: 2px 2px 2px #222 !important ;
  }

  .logo-and-wordmark {
    display: none !important;
  }

  body {
    --newtab-topsites-outer-card-hover:rgba(255, 255, 255, 0.4) !important;
    --newtab-element-hover-color: rgba(255, 255, 255, 0.3) !important;
  }

  body::before {
    content: "" ;
    z-index: -1 ;
    position: fixed ;
    top: 0 ;
    left: 0 ;
    background:radial-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.75)), no-repeat url(img.jpg) center ;
    background-size: cover ;
    width: 100vw ;
    height: 100vh ;
  }
}
```
:::

访问 `about:config`，搜索 `toolkit.legacyUserProfileCustomizations.stylesheets` 并改为 `true`

之后重启浏览器

## 全屏黑色延迟

`about:config` 下面两个默认值 `200 200` 都改成 `0 0`

```text
full-screen-api.warning.timeout 3000 # 这个是关闭全屏的弹窗提醒，可以不关闭
full-screen-api.transition-duration.enter 0 0
full-screen-api.transition-duration.leave 0 0
```

## 输入栏跳转地址栏

`about:config` 改为 `false`

```text
browser.newtabpage.activity-stream.improvesearch.handoffToAwesomebar
```

## 启用最新 nova 界面

`about:config` 中启用 `browser.nova.enabled`

## 打开 VPN

地址栏打开 `about:support`，找到「配置文件文件夹」，点击「打开文件夹」，创建 `user.js` 文件

```js
user_pref("browser.ipProtection.enabled", true);
```

`vpn.mozilla.org`、`*.firefox.com` 得走代理
