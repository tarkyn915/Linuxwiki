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
      { text: '故障排查', link: '/troubleshooting/' },
    ],

    sidebar: [
      {
        text: '安装指南',
        collapsed: false,
        items: [
          { text: '章节概览', link: '/installation/' },
          { text: '安装准备', link: '/installation/preparation' },
          { text: '磁盘分区', link: '/installation/partitioning' },
          { text: '网络配置', link: '/installation/network' },
          { text: '引导安装', link: '/installation/bootloader' },
        ],
      },
      {
        text: '系统配置',
        collapsed: false,
        items: [
          { text: '章节概览', link: '/system-config/' },
            { text: 'Pacman', link: '/system-config/pacman' },
            { text: '镜像源', link: '/system-config/mirror' },
            { text: 'AUR', link: '/system-config/aur' },
          { text: 'Systemd', link: '/system-config/systemd' },
          { text: 'DNS', link: '/system-config/dns' },
          { text: '用户管理', link: '/system-config/users' },
        ],
      },
      {
        text: '软件安装和配置',
        collapsed: false,
        items: [
          { text: '章节概览', link: '/software/' },
          { text: '浏览器', link: '/software/browser' },
          { text: '音乐播放器', link: '/software/music' },
          { text: '输入法', link: '/software/input-method' },
          { text: '字体', link: '/software/fonts' },
          { text: '终端', link: '/software/terminal' },
          { text: '编辑器', link: '/software/editor' },
          { text: '开发工具', link: '/software/dev' },
          { text: '代理工具', link: '/software/proxy' },
        ],
      },
      {
        text: '故障排查',
        collapsed: false,
        items: [
          { text: '章节概览', link: '/troubleshooting/' },
          { text: '错误信息', link: '/troubleshooting/errors' },
          { text: '解决方法', link: '/troubleshooting/solutions' },
          { text: '配置备份', link: '/troubleshooting/backup' },
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
