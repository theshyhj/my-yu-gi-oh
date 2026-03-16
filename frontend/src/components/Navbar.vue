<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="navbar-container">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand">
        <div class="brand-icon">
          <svg viewBox="0 0 100 100" class="millennium-eye" aria-hidden="true">
            <defs>
              <linearGradient id="navGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ffd54f"/>
                <stop offset="50%" style="stop-color:#d4af37"/>
                <stop offset="100%" style="stop-color:#b8960b"/>
              </linearGradient>
            </defs>
            <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="url(#navGoldGrad)" stroke-width="3"/>
            <circle cx="50" cy="50" r="18" fill="none" stroke="url(#navGoldGrad)" stroke-width="2.5"/>
            <circle cx="50" cy="50" r="7" fill="url(#navGoldGrad)"/>
            <line x1="50" y1="32" x2="50" y2="20" stroke="url(#navGoldGrad)" stroke-width="2"/>
          </svg>
        </div>
        <span class="brand-text">DUEL MASTERS</span>
      </router-link>

      <!-- 导航菜单 -->
      <div class="navbar-menu" :class="{ 'menu-open': menuOpen }">
        <router-link to="/cards" class="nav-link" @click="menuOpen = false">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          卡牌图鉴
        </router-link>
        <router-link to="/gacha" class="nav-link" @click="menuOpen = false">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M12 8v8M8 12h8"/>
          </svg>
          抽卡
        </router-link>
        <router-link v-if="userStore.isLoggedIn" to="/collection" class="nav-link" @click="menuOpen = false">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          我的收藏
        </router-link>
        <router-link v-if="userStore.isLoggedIn" to="/decks" class="nav-link" @click="menuOpen = false">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          </svg>
          卡组管理
        </router-link>
        <router-link v-if="userStore.isAdmin" to="/admin/cards" class="nav-link nav-admin" @click="menuOpen = false">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          后台管理
        </router-link>
      </div>

      <!-- 右侧操作区 -->
      <div class="navbar-actions">
        <button @click="themeStore.toggleTheme()" class="theme-toggle" :aria-label="themeStore.theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'">
          <svg v-if="themeStore.theme === 'dark'" class="theme-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else class="theme-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <template v-if="userStore.isLoggedIn">
          <div class="user-badge">
            <div class="user-avatar">{{ userStore.user.username?.charAt(0)?.toUpperCase() }}</div>
            <span class="user-name">{{ userStore.user.username }}</span>
          </div>
          <button @click="handleLogout" class="btn-logout" aria-label="退出登录">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </template>
        <template v-else>
          <router-link to="/login" class="btn btn-secondary btn-sm">登录</router-link>
          <router-link to="/register" class="btn btn-primary btn-sm">注册</router-link>
        </template>

        <!-- 移动端菜单按钮 -->
        <button class="menu-toggle" @click="menuOpen = !menuOpen" aria-label="菜单">
          <span class="hamburger" :class="{ 'is-open': menuOpen }">
            <span></span><span></span><span></span>
          </span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useThemeStore } from '../stores/theme'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()

const isScrolled = ref(false)
const menuOpen = ref(false)

function onScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

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
  height: 72px;
  background: rgba(6, 6, 12, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  z-index: var(--z-navbar);
  transition: all 0.4s var(--ease-out-expo);
}

.navbar-scrolled {
  background: rgba(6, 6, 12, 0.9);
  border-bottom-color: rgba(212, 175, 55, 0.12);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

[data-theme="light"] .navbar {
  background: rgba(248, 247, 244, 0.7);
  border-bottom-color: rgba(0, 0, 0, 0.06);
}

[data-theme="light"] .navbar-scrolled {
  background: rgba(248, 247, 244, 0.95);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

/* Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  flex-shrink: 0;
}

.brand-icon {
  width: 38px;
  height: 38px;
  filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.3));
  transition: filter 0.3s ease;
}

.navbar-brand:hover .brand-icon {
  filter: drop-shadow(0 0 14px rgba(212, 175, 55, 0.6));
}

.millennium-eye {
  width: 100%;
  height: 100%;
}

.brand-text {
  font-family: 'Cinzel', serif;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffd54f 0%, #d4af37 50%, #b8960b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}

/* Nav Menu */
.navbar-menu {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all 0.25s var(--ease-out-expo);
  position: relative;
}

.nav-svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.25s ease;
}

.nav-link:hover {
  color: var(--color-gold);
  background: rgba(212, 175, 55, 0.08);
}

.nav-link:hover .nav-svg {
  opacity: 1;
}

.nav-link.router-link-active {
  color: var(--color-gold);
  background: rgba(212, 175, 55, 0.1);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 2px;
  background: var(--gradient-gold);
  border-radius: 2px;
}

.nav-admin {
  color: var(--color-purple-light);
}

.nav-admin:hover {
  color: var(--color-purple-light);
  background: rgba(171, 71, 188, 0.1);
}

/* Actions */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.theme-toggle {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.3s var(--ease-out-expo);
  color: var(--color-text-secondary);
}

.theme-toggle:hover {
  background: rgba(212, 175, 55, 0.12);
  border-color: rgba(212, 175, 55, 0.3);
  color: var(--color-gold);
  transform: rotate(15deg);
}

.theme-svg {
  width: 18px;
  height: 18px;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: var(--radius-full);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--gradient-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0a0a0f;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-gold);
}

.btn-logout {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  cursor: pointer;
  color: var(--color-text-muted);
  transition: all 0.25s ease;
}

.btn-logout:hover {
  color: var(--color-danger);
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.08);
}

/* Mobile menu toggle */
.menu-toggle {
  display: none;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 20px;
}

.hamburger span {
  display: block;
  height: 2px;
  background: var(--color-text-secondary);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger.is-open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.is-open span:nth-child(2) {
  opacity: 0;
}

.hamburger.is-open span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Responsive */
@media (max-width: 900px) {
  .menu-toggle {
    display: flex;
  }

  .navbar-menu {
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    background: rgba(6, 6, 12, 0.95);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 16px;
    gap: 4px;
    border-bottom: 1px solid rgba(212, 175, 55, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: all 0.35s var(--ease-out-expo);
  }

  .navbar-menu.menu-open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  [data-theme="light"] .navbar-menu {
    background: rgba(248, 247, 244, 0.95);
  }

  .nav-link {
    width: 100%;
    padding: 12px 16px;
    border-radius: var(--radius-md);
  }

  .brand-text {
    font-size: 1.1rem;
  }

  .user-name {
    display: none;
  }
}
</style>
