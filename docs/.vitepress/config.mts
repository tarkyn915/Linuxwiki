import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'my wiki',
  description: '我的个人wiki',
  lang: 'zh-CN',

  // 让文档里直接写的裸网址（如 https://...）自动变成可点击链接
  markdown: {
    linkify: true,
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '安装指南', link: '/installation/' },
      { text: '系统配置', link: '/system-config/' },
      { text: '应用部署', link: '/deploy/' },
      { text: '脚本', link: '/scripts/' },
      { text: '其他', link: '/other/' },
    ],

    sidebar: [
      {
        text: '安装指南',
        collapsed: true,
        items: [
          { text: '章节概览', link: '/installation/' },
          { text: 'Debian', link: '/installation/debian' },
          { text: 'Ubuntu', link: '/installation/ubuntu' },
          { text: 'Rocky Linux', link: '/installation/rocky' },
          { text: 'Fedora', link: '/installation/fedora' },
          { text: 'Arch Linux', link: '/installation/arch' },
          { text: 'CachyOS', link: '/installation/cachyos' },
        ],
      },
      {
        text: '系统配置',
        collapsed: true,
        items: [
          { text: '章节概览', link: '/system-config/' },
          { text: '主机名', link: '/system-config/hostname' },
          { text: '软件源', link: '/system-config/repo' },
          { text: '用户和用户组', link: '/system-config/users' },
          { text: 'SSH 配置', link: '/system-config/ssh' },
          { text: 'DNS 配置', link: '/system-config/dns' },
          { text: '禁止 ping', link: '/system-config/ping' },
          { text: 'swap 交换内存', link: '/system-config/swap' },
          { text: 'BBR 拥塞控制', link: '/system-config/bbr' },
          { text: '终端与 Shell', link: '/system-config/terminal' },
        ],
      },
      {
        text: '应用部署',
        collapsed: true,
        items: [
          { text: '章节概览', link: '/deploy/' },
          { text: 'Docker', link: '/deploy/docker' },
          { text: 'Nginx', link: '/deploy/nginx' },
          { text: 'Nginx UI', link: '/deploy/nginx-ui' },
          { text: 'Nginx Proxy Manager', link: '/deploy/nginx-proxy-manager' },
          { text: 'FRP 内网穿透', link: '/deploy/frp' },
          { text: 'Realm 端口转发', link: '/deploy/realm' },
          { text: 'ddns-go 动态域名', link: '/deploy/ddns-go' },
          { text: 'Sub2api', link: '/deploy/sub2api' },
          { text: 'Uptime Kuma', link: '/deploy/uptime-kuma' },
          { text: 'TeamSpeak', link: '/deploy/teamspeak' },
        ],
      },
      {
        text: '脚本',
        collapsed: true,
        items: [
          { text: '章节概览', link: '/scripts/' },
          { text: '性能测试', link: '/scripts/performance' },
          { text: '路由测试', link: '/scripts/route' },
          { text: 'Warp', link: '/scripts/warp' },
          { text: 'DD 系统', link: '/scripts/dd' },
        ],
      },
      {
        text: '其他',
        collapsed: true,
        items: [
          { text: '章节概览', link: '/other/' },
          { text: '终端查询天气预报', link: '/other/weather' },
          { text: '监控测试 IP', link: '/other/monitor-ip' },
        ],
      },
    ],

    outline: { label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdated: { text: '最后更新', formatOptions: { dateStyle: 'short' } },
    search: { provider: 'local' },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
})
