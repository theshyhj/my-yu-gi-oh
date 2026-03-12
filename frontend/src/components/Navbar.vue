<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-brand">
        <div class="brand-icon">
          <svg viewBox="0 0 100 100" class="millennium-eye">
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ffd700"/>
                <stop offset="100%" style="stop-color:#d4af37"/>
              </linearGradient>
            </defs>
            <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="url(#goldGrad)" stroke-width="3"/>
            <circle cx="50" cy="50" r="20" fill="none" stroke="url(#goldGrad)" stroke-width="2"/>
            <circle cx="50" cy="50" r="8" fill="url(#goldGrad)"/>
          </svg>
        </div>
        <span class="brand-text">DUEL MASTERS</span>
      </router-link>

      <div class="navbar-menu">
        <router-link to="/cards" class="nav-link">
          <span class="nav-icon">📚</span>
          卡牌图鉴
        </router-link>
        <router-link to="/gacha" class="nav-link">
          <span class="nav-icon">🎴</span>
          抽卡
        </router-link>
        <router-link v-if="userStore.isLoggedIn" to="/collection" class="nav-link">
          <span class="nav-icon">💎</span>
          我的收藏
        </router-link>
        <router-link v-if="userStore.isLoggedIn" to="/decks" class="nav-link">
          <span class="nav-icon">🃏</span>
          卡组管理
        </router-link>
        <router-link v-if="userStore.isAdmin" to="/admin/cards" class="nav-link nav-admin">
          <span class="nav-icon">⚙️</span>
          后台管理
        </router-link>
      </div>

      <div class="navbar-auth">
        <button @click="themeStore.toggleTheme()" class="theme-toggle" :title="themeStore.theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'">
          <span v-if="themeStore.theme === 'dark'" class="theme-icon">☀️</span>
          <span v-else class="theme-icon">🌙</span>
        </button>
        <template v-if="userStore.isLoggedIn">
          <span class="user-name">{{ userStore.user.username }}</span>
          <button @click="handleLogout" class="btn-logout">退出</button>
        </template>
        <template v-else>
          <router-link to="/login" class="btn btn-secondary btn-sm">登录</router-link>
          <router-link to="/register" class="btn btn-primary btn-sm">注册</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useThemeStore } from '../stores/theme'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()

function handleLogout() {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: var(--color-bg-primary);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  z-index: 1000;
  transition: background-color 0.3s ease;
}

[data-theme="light"] .navbar {
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(184, 134, 11, 0.2);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.brand-icon {
  width: 40px;
  height: 40px;
}

.millennium-eye {
  width: 100%;
  height: 100%;
  animation: pulse-glow 3s ease-in-out infinite;
}

.brand-text {
  font-family: 'Cinzel', serif;
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffd700 0%, #d4af37 50%, #b8860b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--color-gold);
  background: rgba(212, 175, 55, 0.1);
}

.nav-link.router-link-active {
  color: var(--color-gold);
  background: rgba(212, 175, 55, 0.15);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: var(--gradient-gold-purple);
}

.nav-icon {
  font-size: 1.1rem;
}

.nav-admin {
  color: var(--color-purple-light);
}

.nav-admin:hover {
  color: var(--color-purple-light);
  background: rgba(157, 78, 221, 0.15);
}

.navbar-auth {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-toggle {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: var(--color-gold);
  transform: rotate(20deg) scale(1.1);
}

.theme-icon {
  font-size: 1.2rem;
  display: block;
}

.user-name {
  color: var(--color-gold);
  font-weight: 500;
}

.btn-logout {
  padding: 8px 16px;
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-text-muted);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  color: #ff6b6b;
  border-color: #ff6b6b;
}

.btn-sm {
  padding: 8px 18px;
  font-size: 0.9rem;
}

@keyframes pulse-glow {
  0%, 100% { filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.5)); }
  50% { filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.8)); }
}
</style>
