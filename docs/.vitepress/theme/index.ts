import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './custom.css'
import VoidGate from './VoidGate.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(VoidGate),
    })
  },
}
