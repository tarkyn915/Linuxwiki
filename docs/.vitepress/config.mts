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
      { text: '软件安装和配置', link: '/software/' },
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
          { text: 'Arch Linux', link: '/installation/arch' },
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
        ],
      },
      {
        text: '软件安装和配置',
        collapsed: true,
        items: [
          { text: '章节概览', link: '/software/' },
          { text: '浏览器', link: '/software/browser' },
          { text: '音乐播放器', link: '/software/music' },
          { text: '视频播放器', link: '/software/video' },
          { text: '输入法', link: '/software/input-method' },
          { text: '字体', link: '/software/fonts' },
          { text: '终端', link: '/software/terminal' },
          { text: '编辑器', link: '/software/editor' },
          { text: '开发工具', link: '/software/dev' },
          { text: '代理工具', link: '/software/proxy' },
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
