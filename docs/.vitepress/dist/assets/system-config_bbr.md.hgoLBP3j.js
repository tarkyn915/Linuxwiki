import{_ as a,o as n,c as p,a2 as e}from"./chunks/framework.D66Xq0Kv.js";const h=JSON.parse('{"title":"BBR 拥塞控制","description":"","frontmatter":{},"headers":[],"relativePath":"system-config/bbr.md","filePath":"system-config/bbr.md","lastUpdated":1791990988000}'),t={name:"system-config/bbr.md"};function i(l,s,c,o,r,d){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="bbr-拥塞控制" tabindex="-1">BBR 拥塞控制 <a class="header-anchor" href="#bbr-拥塞控制" aria-label="Permalink to &quot;BBR 拥塞控制&quot;">​</a></h1><p>对于丢包高延迟的机器效果十分显著</p><h2 id="创建配置文件" tabindex="-1">创建配置文件 <a class="header-anchor" href="#创建配置文件" aria-label="Permalink to &quot;创建配置文件&quot;">​</a></h2><p>数字越大优先级越高，用 <code>nano</code>（或 <code>vim</code>）新建配置文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>nano /etc/sysctl.d/99-bbr.conf</span></span></code></pre></div><h2 id="fq-bbr-稳妥版" tabindex="-1">FQ + BBR 稳妥版 <a class="header-anchor" href="#fq-bbr-稳妥版" aria-label="Permalink to &quot;FQ + BBR 稳妥版&quot;">​</a></h2><p>把下面内容粘进去保存：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 队列与拥塞控制</span></span>
<span class="line"><span>net.core.default_qdisc = fq</span></span>
<span class="line"><span>net.ipv4.tcp_congestion_control = bbr</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 文件与 inotify</span></span>
<span class="line"><span>fs.file-max = 1048576</span></span>
<span class="line"><span>fs.inotify.max_user_instances = 8192</span></span>
<span class="line"><span></span></span>
<span class="line"><span># TCP 基础</span></span>
<span class="line"><span>net.ipv4.tcp_syncookies = 1</span></span>
<span class="line"><span>net.ipv4.tcp_timestamps = 1</span></span>
<span class="line"><span>net.ipv4.tcp_ecn = 2</span></span>
<span class="line"><span>net.ipv4.tcp_fin_timeout = 30</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 端口与连接队列</span></span>
<span class="line"><span>net.ipv4.ip_local_port_range = 1024 65535</span></span>
<span class="line"><span>net.ipv4.tcp_max_syn_backlog = 16384</span></span>
<span class="line"><span>net.core.somaxconn = 16384</span></span>
<span class="line"><span>net.core.netdev_max_backlog = 16384</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 新版内核默认通常就是 2：仅允许 loopback TIME_WAIT 重用</span></span>
<span class="line"><span>net.ipv4.tcp_tw_reuse = 2</span></span>
<span class="line"><span></span></span>
<span class="line"><span># SYN 重传：不要设得过激进</span></span>
<span class="line"><span>net.ipv4.tcp_syn_retries = 5</span></span>
<span class="line"><span>net.ipv4.tcp_synack_retries = 2</span></span></code></pre></div><h2 id="生效与验证" tabindex="-1">生效与验证 <a class="header-anchor" href="#生效与验证" aria-label="Permalink to &quot;生效与验证&quot;">​</a></h2><p>加载所有配置文件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>sudo sysctl --system</span></span></code></pre></div><p>检查 bbr 是否载入：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>lsmod | grep bbr</span></span></code></pre></div><p>能看到 <code>tcp_bbr</code> 说明已经生效。</p>`,14)])])}const _=a(t,[["render",i]]);export{h as __pageData,_ as default};
