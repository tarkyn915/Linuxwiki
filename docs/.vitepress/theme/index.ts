import DefaultTheme from 'vitepress/theme'
import './custom.css'

// 神秘空洞专栏的页面在服务端是密码门禁页，不能用站内路由跳转
const LOCKED = '/void/'

export default {
  extends: DefaultTheme,
  setup() {
    if (typeof window === 'undefined' || (window as any).__voidRouterGuard) return
    ;(window as any).__voidRouterGuard = true
    document.addEventListener(
      'click',
      (e) => {
        const el = e.target as HTMLElement | null
        const a = el?.closest?.('a') as HTMLAnchorElement | null
        if (!a) return
        const href = a.getAttribute('href') || ''
        if (!href.startsWith('/void') && !href.startsWith('void')) return
        if (a.target && a.target !== '_self') return
        e.preventDefault()
        e.stopImmediatePropagation()
        window.location.assign(href)
      },
      true
    )
  },
}
