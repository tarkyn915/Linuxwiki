<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

// 神秘空洞：只挡住随手点进来的人，内容本身不加密
const LOCKED_PREFIX = '/void/'
const EXPECTED = 'dGFvamlucWk=' // base64 的密码
const STORE_KEY = 'void-access'

const route = useRoute()
const mounted = ref(false)
const pass = ref('')
const error = ref('')

// 解锁状态存在 sessionStorage：同一标签页内刷新、换页都免密码，关掉网页才失效
const unlocked = ref(false)
const locked = computed(
  () => mounted.value && !unlocked.value && route.path.startsWith(LOCKED_PREFIX)
)

onMounted(() => {
  unlocked.value = sessionStorage.getItem(STORE_KEY) === 'ok'
  mounted.value = true
})

watch(
  () => route.path,
  () => {
    error.value = ''
    pass.value = ''
  }
)

function submit() {
  if (pass.value.trim() === atob(EXPECTED)) {
    sessionStorage.setItem(STORE_KEY, 'ok')
    unlocked.value = true
    error.value = ''
  } else {
    error.value = '密码不对'
    pass.value = ''
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="locked" class="void-gate">
      <form class="void-box" @submit.prevent="submit">
        <h1>神秘空洞</h1>
        <p class="void-tip">输入密码进入</p>
        <input
          v-model="pass"
          type="password"
          autocomplete="current-password"
          placeholder="密码"
          spellcheck="false"
          autofocus
        />
        <button type="submit">进入</button>
        <p class="void-err">{{ error }}</p>
      </form>
    </div>
  </Teleport>
</template>

<style>
.void-gate {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
}
.void-box {
  width: min(340px, 88vw);
  padding: 28px 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-alt);
}
.void-box h1 {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.06em;
}
.void-tip {
  margin: 0 0 20px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.void-box input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 16px;
  outline: none;
}
.void-box input:focus {
  border-color: var(--vp-c-brand-1);
}
.void-box button {
  margin-top: 12px;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-radius: 8px;
  background: var(--vp-c-brand-2);
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}
.void-box button:hover {
  background: var(--vp-c-brand-1);
}
.void-err {
  margin: 12px 0 0;
  min-height: 18px;
  font-size: 13px;
  color: var(--vp-c-danger-1, #e5484d);
}
</style>
