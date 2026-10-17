import{_ as n,o as a,c as p,a2 as l}from"./chunks/framework.D66Xq0Kv.js";const d=JSON.parse('{"title":"SmokePing","description":"","frontmatter":{},"headers":[],"relativePath":"deploy/smokeping.md","filePath":"deploy/smokeping.md","lastUpdated":null}'),e={name:"deploy/smokeping.md"};function i(t,s,c,h,o,r){return a(),p("div",null,[...s[0]||(s[0]=[l(`<h1 id="smokeping" tabindex="-1">SmokePing <a class="header-anchor" href="#smokeping" aria-label="Permalink to &quot;SmokePing&quot;">​</a></h1><p>网络延迟监控，用图表展示各节点丢包率和延迟，支持 FPing 等探针。</p><p>镜像：<a href="https://hub.docker.com/r/linuxserver/smokeping" target="_blank" rel="noreferrer">https://hub.docker.com/r/linuxserver/smokeping</a></p><h2 id="docker-部署" tabindex="-1">Docker 部署 <a class="header-anchor" href="#docker-部署" aria-label="Permalink to &quot;Docker 部署&quot;">​</a></h2><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">services</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  smokeping</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    image</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">lscr.io/linuxserver/smokeping:latest</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    container_name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">smokeping</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    environment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">PUID=1000</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">PGID=1000</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">TZ=Asia/Shanghai</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    volumes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/opt/smoke/smokeping/config:/config</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/opt/smoke/smokeping/data:/data</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    ports</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">9090:80</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    restart</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">unless-stopped</span></span></code></pre></div><p>访问 <code>http://&lt;服务器IP&gt;:9090</code>。</p><p>监控目标配置写入 <code>/config/Targets</code>（容器内），改完重启容器生效。</p><h2 id="三网监控模板" tabindex="-1">三网监控模板 <a class="header-anchor" href="#三网监控模板" aria-label="Permalink to &quot;三网监控模板&quot;">​</a></h2><details><summary>展开完整 Targets 模板</summary><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>*** Targets ***</span></span>
<span class="line"><span></span></span>
<span class="line"><span>probe = FPing</span></span>
<span class="line"><span></span></span>
<span class="line"><span>menu = Top</span></span>
<span class="line"><span>title = Network Latency</span></span>
<span class="line"><span>remark = 三网+国际</span></span>
<span class="line"><span></span></span>
<span class="line"><span>+ Other</span></span>
<span class="line"><span>menu = 三网监控</span></span>
<span class="line"><span>title = 监控统计</span></span>
<span class="line"><span></span></span>
<span class="line"><span>++ CT</span></span>
<span class="line"><span>menu = 电信网络监控</span></span>
<span class="line"><span>title = 电信网络监控列表</span></span>
<span class="line"><span>host = /Other/CT/CT-HZ /Other/CT/CT-SH /Other/CT/CT-NB</span></span>
<span class="line"><span></span></span>
<span class="line"><span>+++ CT-HZ</span></span>
<span class="line"><span>menu = 杭州电信</span></span>
<span class="line"><span>title = 杭州电信</span></span>
<span class="line"><span>alerts = someloss</span></span>
<span class="line"><span>host = 122.225.217.219</span></span>
<span class="line"><span></span></span>
<span class="line"><span>+++ CT-SH</span></span>
<span class="line"><span>menu = 上海电信</span></span>
<span class="line"><span>title = 上海电信</span></span>
<span class="line"><span>alerts = someloss</span></span>
<span class="line"><span>host = 210.5.157.1</span></span>
<span class="line"><span></span></span>
<span class="line"><span>+++ CT-NB</span></span>
<span class="line"><span>menu = 宁波电信</span></span>
<span class="line"><span>title = 宁波电信</span></span>
<span class="line"><span>alerts = someloss</span></span>
<span class="line"><span>host = 115.231.32.10</span></span>
<span class="line"><span></span></span>
<span class="line"><span>++ CU</span></span>
<span class="line"><span>menu = 联通网络监控</span></span>
<span class="line"><span>title = 联通网络监控列表</span></span>
<span class="line"><span>host = /Other/CU/CU-BJ /Other/CU/CU-SH /Other/CU/CU-NB /Other/CU/CU-HZ</span></span>
<span class="line"><span></span></span>
<span class="line"><span>+++ CU-BJ</span></span>
<span class="line"><span>menu = 北京联通</span></span>
<span class="line"><span>title = 北京联通</span></span>
<span class="line"><span>alerts = someloss</span></span>
<span class="line"><span>host = 61.135.169.121</span></span>
<span class="line"><span></span></span>
<span class="line"><span>+++ CU-SH</span></span>
<span class="line"><span>menu = 上海联通</span></span>
<span class="line"><span>title = 上海联通</span></span>
<span class="line"><span>alerts = someloss</span></span>
<span class="line"><span>host = 211.95.52.116</span></span>
<span class="line"><span></span></span>
<span class="line"><span>+++ CU-NB</span></span>
<span class="line"><span>menu = 宁波联通</span></span>
<span class="line"><span>title = 宁波联通</span></span>
<span class="line"><span>alerts = someloss</span></span>
<span class="line"><span>host = 221.12.32.22</span></span>
<span class="line"><span></span></span>
<span class="line"><span>+++ CU-HZ</span></span>
<span class="line"><span>menu = 杭州联通</span></span>
<span class="line"><span>title = 杭州联通</span></span>
<span class="line"><span>alerts = someloss</span></span>
<span class="line"><span>host = 221.12.170.10</span></span>
<span class="line"><span></span></span>
<span class="line"><span>++ CMCC</span></span>
<span class="line"><span>menu = 移动网络监控</span></span>
<span class="line"><span>title = 移动网络监控列表</span></span>
<span class="line"><span>host = /Other/CMCC/CMCC-BJ /Other/CMCC/CMCC-SH /Other/CMCC/CMCC-HZ /Other/CMCC/CMCC-NB</span></span>
<span class="line"><span></span></span>
<span class="line"><span>+++ CMCC-BJ</span></span>
<span class="line"><span>menu = 北京移动</span></span>
<span class="line"><span>title = 北京移动</span></span>
<span class="line"><span>alerts = someloss</span></span>
<span class="line"><span>host = 221.130.33.52</span></span>
<span class="line"><span></span></span>
<span class="line"><span>+++ CMCC-SH</span></span>
<span class="line"><span>menu = 上海移动</span></span>
<span class="line"><span>title = 上海移动</span></span>
<span class="line"><span>alerts = someloss</span></span>
<span class="line"><span>host = 117.185.253.224</span></span>
<span class="line"><span></span></span>
<span class="line"><span>+++ CMCC-HZ</span></span>
<span class="line"><span>menu = 杭州移动</span></span>
<span class="line"><span>title = 杭州移动</span></span>
<span class="line"><span>alerts = someloss</span></span>
<span class="line"><span>host = 112.17.226.165</span></span>
<span class="line"><span></span></span>
<span class="line"><span>+++ CMCC-NB</span></span>
<span class="line"><span>menu = 宁波移动</span></span>
<span class="line"><span>title = 宁波移动</span></span>
<span class="line"><span>alerts = someloss</span></span>
<span class="line"><span>host = 39.188.192.10</span></span>
<span class="line"><span></span></span>
<span class="line"><span>+ global</span></span>
<span class="line"><span>menu = 国际</span></span>
<span class="line"><span>title = 监控统计</span></span>
<span class="line"><span>host = /global/cf /global/yt /global/gg /global/sbd</span></span>
<span class="line"><span></span></span>
<span class="line"><span>++ cf</span></span>
<span class="line"><span>menu = Cloudflare</span></span>
<span class="line"><span>title = Cloudflare</span></span>
<span class="line"><span>alerts = someloss</span></span>
<span class="line"><span>host = www.cloudflare.com</span></span>
<span class="line"><span></span></span>
<span class="line"><span>++ yt</span></span>
<span class="line"><span>menu = YouTube</span></span>
<span class="line"><span>title = YouTube</span></span>
<span class="line"><span>alerts = someloss</span></span>
<span class="line"><span>host = www.youTube.com</span></span>
<span class="line"><span></span></span>
<span class="line"><span>++ gg</span></span>
<span class="line"><span>menu = google</span></span>
<span class="line"><span>title = google</span></span>
<span class="line"><span>alerts = someloss</span></span>
<span class="line"><span>host = www.google.com</span></span>
<span class="line"><span></span></span>
<span class="line"><span>++ sbd</span></span>
<span class="line"><span>menu = 美国圣何塞</span></span>
<span class="line"><span>title = 美国圣何塞</span></span>
<span class="line"><span>alerts = someloss</span></span>
<span class="line"><span>host = 209.209.57.3</span></span></code></pre></div></details>`,9)])])}const g=n(e,[["render",i]]);export{d as __pageData,g as default};
