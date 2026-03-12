<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-icon">🔐</div>
          <h1 class="auth-title">登录</h1>
          <p class="auth-subtitle">欢迎回来，决斗者</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label class="form-label">用户名</label>
            <input v-model="username" type="text" class="input-field" placeholder="请输入用户名" required />
          </div>

          <div class="form-group">
            <label class="form-label">密码</label>
            <input v-model="password" type="password" class="input-field" placeholder="请输入密码" required />
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
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
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-card {
  background: linear-gradient(145deg, rgba(26,26,37,0.9), rgba(18,18,26,0.95));
  border: 1px solid rgba(212,175,55,0.2);
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.05);
}

.auth-header {
  text-align: center;
  margin-bottom: 36px;
}

.auth-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.auth-title {
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  background: var(--gradient-gold-purple);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.auth-subtitle {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
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
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.btn-block {
  width: 100%;
  margin-top: 8px;
}

.error-message {
  padding: 12px;
  background: rgba(255,107,107,0.1);
  border: 1px solid rgba(255,107,107,0.3);
  border-radius: 6px;
  color: #ff6b6b;
  font-size: 0.9rem;
  text-align: center;
}

.auth-footer {
  margin-top: 28px;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.auth-footer a {
  color: var(--color-gold);
  margin-left: 8px;
}
</style>
