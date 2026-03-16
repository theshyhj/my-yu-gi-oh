<template>
  <div class="auth-page">
    <div class="auth-bg" aria-hidden="true">
      <div class="auth-orb orb-a"></div>
      <div class="auth-orb orb-b"></div>
    </div>
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 class="auth-title">登录</h1>
          <p class="auth-subtitle">欢迎回来，决斗者</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="login-user" class="form-label">用户名</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input id="login-user" v-model="username" type="text" class="input-field input-with-icon" placeholder="请输入用户名" required autocomplete="username" />
            </div>
          </div>

          <div class="form-group">
            <label for="login-pass" class="form-label">密码</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input id="login-pass" v-model="password" type="password" class="input-field input-with-icon" placeholder="请输入密码" required autocomplete="current-password" />
            </div>
          </div>

          <div v-if="error" class="msg msg-error">{{ error }}</div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            <svg v-if="loading" class="btn-spinner" viewBox="0 0 24 24" width="18" height="18"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="50" stroke-linecap="round"/></svg>
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <div class="auth-footer">
          <span>还没有账号？</span>
          <router-link to="/register">立即注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await userStore.login(username.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.message || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  position: relative;
  overflow: hidden;
}

.auth-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.auth-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.orb-a {
  width: 400px;
  height: 400px;
  background: rgba(123, 44, 191, 0.12);
  top: -15%;
  right: -10%;
}

.orb-b {
  width: 350px;
  height: 350px;
  background: rgba(212, 175, 55, 0.08);
  bottom: -15%;
  left: -10%;
}

.auth-container {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.6s var(--ease-out-expo);
}

.auth-card {
  background: var(--color-bg-glass);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-xl);
  padding: 48px 40px;
  box-shadow: var(--shadow-xl), 0 0 80px rgba(212, 175, 55, 0.03);
}

[data-theme="light"] .auth-card {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(0, 0, 0, 0.06);
  box-shadow: var(--shadow-lg);
}

.auth-header {
  text-align: center;
  margin-bottom: 36px;
}

.auth-icon-wrap {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: var(--radius-lg);
  color: var(--color-gold);
}

.auth-title {
  font-family: var(--font-display);
  font-size: 2rem;
  background: var(--gradient-gold-purple);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.auth-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.input-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
  transition: color 0.2s ease;
}

.input-with-icon {
  padding-left: 44px;
}

.input-wrap:focus-within .input-icon {
  color: var(--color-gold);
}

.msg {
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  text-align: center;
}

.msg-error {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--color-danger);
}

.btn-spinner {
  animation: spin 0.8s linear infinite;
}

.auth-footer {
  margin-top: 28px;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.88rem;
}

.auth-footer a {
  color: var(--color-gold);
  margin-left: 6px;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
