// 构建后把 dist/void 下的页面压成独立静态页并加密成密码门禁页
// 密码来自环境变量 VOID_PASSWORD（本地 export，CI 用仓库 secret）
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const DIST = path.resolve('docs/.vitepress/dist')
const SECTION = 'void'
const ITERATIONS = 310000

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : []
  })
}

function encrypt(html, password) {
  const salt = crypto.randomBytes(16)
  const iv = crypto.randomBytes(12)
  const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256')
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const ct = Buffer.concat([
    cipher.update(Buffer.from(html, 'utf8')),
    cipher.final(),
    cipher.getAuthTag(),
  ])
  return { salt: salt.toString('base64'), iv: iv.toString('base64'), ct: ct.toString('base64') }
}

// 去掉 VitePress 的客户端运行时，只留生成好的正文和样式表，
// 这样页面内容既不会进站内路由的 JS chunk，也不需要 hydration
function standalone(origHtml, label) {
  const styles = [...origHtml.matchAll(/<link[^>]+rel="(?:preload stylesheet|stylesheet)"[^>]*>/g)]
    .map((m) => m[0])
    .join('\n')
  const title = (origHtml.match(/<title>([\s\S]*?)<\/title>/) || [, label])[1]
  const main = (origHtml.match(/(<main class="main"[\s\S]*?<\/main>)/) || [, ''])[1]
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${title}</title>
${styles}
<script id="check-dark-mode">(()=>{const e=localStorage.getItem("vitepress-theme-appearance")||"dark",a=window.matchMedia("(prefers-color-scheme: dark)").matches;(!e||e==="auto"?a:e==="dark")&&document.documentElement.classList.add("dark")})();</script>
<style>
body{margin:0;background:var(--vp-c-bg);color:var(--vp-c-text-1);font-family:var(--vp-font-family-base)}
.void-wrap{max-width:760px;margin:0 auto;padding:40px 24px 96px}
.void-top{display:flex;justify-content:space-between;align-items:center;gap:16px;
padding-bottom:18px;margin-bottom:32px;border-bottom:1px solid var(--vp-c-divider);font-size:14px}
.void-top span{color:var(--vp-c-text-2);letter-spacing:.08em}
.void-top a{color:var(--vp-c-brand-1);text-decoration:none}
.void-top a:hover{text-decoration:underline}
</style>
</head>
<body>
<div class="void-wrap">
<div class="void-top"><span>神秘空洞</span><a href="/">← 返回 wiki</a></div>
${main}
</div>
</body>
</html>
`
}

function gate(payload) {
  return `<!DOCTYPE html>
<html lang="zh-CN" data-void-gate>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>神秘空洞</title>
<style>
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
background:#1b1b1f;color:#dfdfd6;font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif}
.box{width:min(340px,88vw);padding:28px 24px;border:1px solid #2e2e32;border-radius:14px;background:#202127}
h1{margin:0 0 6px;font-size:20px;letter-spacing:.06em;font-weight:600}
p.tip{margin:0 0 20px;font-size:13px;color:#8d8d94}
input{width:100%;padding:10px 12px;border-radius:8px;border:1px solid #3a3a42;background:#161618;color:#dfdfd6;font-size:16px;outline:none}
input:focus{border-color:#7c86ff}
button{margin-top:12px;width:100%;padding:10px 12px;border:0;border-radius:8px;background:#3c4166;color:#fff;font-size:15px;cursor:pointer}
button:hover{background:#4a5080}
#e{margin:12px 0 0;min-height:18px;font-size:13px;color:#ff8b8b}
</style>
</head>
<body>
<div class="box">
<h1>神秘空洞</h1>
<p class="tip">输入密码进入</p>
<form id="f">
<input id="p" type="password" autocomplete="current-password" autofocus spellcheck="false" placeholder="密码">
<button type="submit">进入</button>
</form>
<p id="e"></p>
</div>
<script type="application/json" id="void-data">${JSON.stringify(payload)}</script>
<script>
(function(){
  var d=JSON.parse(document.getElementById('void-data').textContent);
  var el=document.getElementById('p'),msg=document.getElementById('e');
  function b64(s){var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
  async function unlock(pw){
    msg.style.color='#8d8d94';msg.textContent='解密中…';
    try{
      var km=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveKey']);
      var key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:b64(d.salt),iterations:d.iterations,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['decrypt']);
      var pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64(d.iv),tagLength:128},key,b64(d.ct));
      var html=new TextDecoder().decode(pt);
      document.open();document.write(html);document.close();
    }catch(err){
      msg.style.color='#ff8b8b';msg.textContent='密码不对';
      el.value='';el.focus();
    }
  }
  document.getElementById('f').addEventListener('submit',function(ev){
    ev.preventDefault();
    if(el.value.trim())unlock(el.value.trim());
  });
})();
</script>
</body>
</html>
`
}

const files = walk(path.join(DIST, SECTION))
if (files.length) {
  const password = process.env.VOID_PASSWORD
  if (!password) {
    console.error(`✗ 发现 ${files.length} 个待加密页面，但没有设置 VOID_PASSWORD，拒绝发布明文`)
    process.exit(1)
  }
  let n = 0
  for (const file of files) {
    const orig = fs.readFileSync(file, 'utf8')
    if (orig.includes('data-void-gate')) continue
    const name = path.relative(path.join(DIST, SECTION), file).replace(/\.html$/, '') || 'index'
    const page = standalone(orig, `神秘空洞 - ${name}`)
    const payload = { ...encrypt(page, password), iterations: ITERATIONS }
    fs.writeFileSync(file, gate(payload))
    n++
  }
  // 正文还被打进了每页的 JS chunk（客户端路由用），专栏靠整页加载所以整批删掉
  const assets = path.join(DIST, 'assets')
  let removed = 0
  for (const f of fs.readdirSync(assets)) {
    if (f.startsWith(`${SECTION}_`) && /\.md\.[^.]+(\.lean)?\.js$/.test(f)) {
      fs.rmSync(path.join(assets, f))
      removed++
    }
  }
  console.log(`✓ 已加密 ${n} 个页面，清掉 ${removed} 个客户端 chunk（${SECTION}/**）`)
}
