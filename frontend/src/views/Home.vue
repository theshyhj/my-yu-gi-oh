<template>
  <div class="home-page">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-orb orb-1"></div>
        <div class="hero-orb orb-2"></div>
        <div class="hero-orb orb-3"></div>
        <div class="grid-lines"></div>
      </div>

      <div class="hero-content">
        <div class="hero-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          TRADING CARD GAME
        </div>
        <h1 class="hero-title">
          <span class="title-sub">决斗吧！</span>
          <span class="title-main">DUEL MASTERS</span>
        </h1>
        <p class="hero-desc">收集传说卡牌，组建最强卡组，成为决斗王</p>
        <div class="hero-actions">
          <router-link to="/gacha" class="btn btn-primary btn-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/>
            </svg>
            开始抽卡
          </router-link>
          <router-link to="/cards" class="btn btn-secondary btn-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            浏览图鉴
          </router-link>
        </div>
      </div>

      <!-- 浮动装饰卡牌 -->
      <div class="hero-cards" aria-hidden="true">
        <div class="floating-card fc-1"></div>
        <div class="floating-card fc-2"></div>
        <div class="floating-card fc-3"></div>
      </div>
    </section>

    <!-- 特性 -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">游戏特色</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="(f, i) in features" :key="i">
            <div class="feature-icon-wrap">
              <svg v-if="i === 0" class="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>
              <svg v-else-if="i === 1" class="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <svg v-else-if="i === 2" class="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <svg v-else class="feature-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            </div>
            <h3 class="feature-name">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 稀有度 -->
    <section class="rarity-section">
      <div class="container">
        <h2 class="section-title">稀有度系统</h2>
        <div class="rarity-grid">
          <div v-for="r in rarities" :key="r.name" class="rarity-card" :class="`rarity-${r.name.toLowerCase()}`">
            <div class="rarity-badge-lg">{{ r.name }}</div>
            <div class="rarity-label">{{ r.label }}</div>
            <div class="rarity-rate">{{ r.rate }}</div>
            <div class="rarity-bar"><div class="rarity-bar-fill" :style="{ width: r.rate }"></div></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const features = [
  { title: '抽卡系统', desc: '体验刺激的抽卡玩法，收集稀有卡牌' },
  { title: '卡牌图鉴', desc: '浏览全部卡牌，了解每张卡的详细信息' },
  { title: '收藏管理', desc: '管理你的卡牌收藏，查看拥有数量' },
  { title: '卡组构建', desc: '按照OCG规则组建你的专属卡组' }
]
const rarities = [
  { name: 'N', label: '普通', rate: '60%' },
  { name: 'R', label: '稀有', rate: '25%' },
  { name: 'SR', label: '超稀有', rate: '12%' },
  { name: 'UR', label: '极稀有', rate: '3%' }
]
</script>

<style scoped>
.home-page { min-height: 100vh; }

/* ===== Hero ===== */
.hero {
  position: relative;
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 80px 24px 60px;
}
.hero-bg { position: absolute; inset: 0; z-index: 0; }
.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}
.orb-1 { width: 500px; height: 500px; background: rgba(123,44,191,0.15); top: -10%; left: -5%; animation: float 20s ease-in-out infinite; }
.orb-2 { width: 400px; height: 400px; background: rgba(212,175,55,0.1); bottom: -10%; right: -5%; animation: float 25s ease-in-out infinite reverse; }
.orb-3 { width: 300px; height: 300px; background: rgba(99,102,241,0.08); top: 40%; left: 50%; animation: float 18s ease-in-out infinite 3s; }
.grid-lines {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(212,175,55,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
}
.hero-content { position: relative; z-index: 2; text-align: center; max-width: 800px; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 20px;
  background: rgba(212,175,55,0.08);
  border: 1px solid rgba(212,175,55,0.2);
  border-radius: var(--radius-full);
  font-family: var(--font-tech); font-size: 0.75rem; font-weight: 500;
  color: var(--color-gold); letter-spacing: 3px;
  margin-bottom: 28px;
  animation: fadeInUp 0.8s var(--ease-out-expo);
}
.hero-title { margin-bottom: 24px; animation: fadeInUp 0.8s var(--ease-out-expo) 0.1s both; }
.title-sub {
  display: block; font-family: var(--font-body); font-size: 1.3rem; font-weight: 400;
  color: var(--color-text-secondary); margin-bottom: 8px; letter-spacing: 4px;
}
.title-main {
  display: block; font-family: 'Cinzel', serif; font-size: 4.5rem; font-weight: 900;
  background: linear-gradient(135deg, #ffd54f 0%, #d4af37 25%, #ab47bc 60%, #7b2cbf 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  letter-spacing: 6px; line-height: 1.1;
  animation: gradient-shift 6s ease infinite;
  filter: drop-shadow(0 0 40px rgba(212,175,55,0.2));
}
.hero-desc {
  font-size: 1.15rem; color: var(--color-text-secondary);
  margin-bottom: 44px; animation: fadeInUp 0.8s var(--ease-out-expo) 0.2s both; letter-spacing: 1px;
}
.hero-actions {
  display: flex; gap: 16px; justify-content: center;
  animation: fadeInUp 0.8s var(--ease-out-expo) 0.3s both;
}

/* 浮动卡牌 */
.hero-cards { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
.floating-card {
  position: absolute; width: 100px; height: 145px;
  background: linear-gradient(145deg, rgba(20,20,32,0.8), rgba(14,14,22,0.9));
  border: 1px solid rgba(212,175,55,0.15);
  border-radius: var(--radius-md); opacity: 0.25;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}
.fc-1 { top: 18%; left: 8%; transform: rotate(-15deg); animation: float 7s ease-in-out infinite; }
.fc-2 { top: 22%; right: 10%; transform: rotate(18deg); animation: float 9s ease-in-out infinite 1.5s; }
.fc-3 { bottom: 18%; left: 14%; transform: rotate(8deg); animation: float 8s ease-in-out infinite 0.8s; }

/* ===== Features ===== */
.features {
  padding: 100px 0;
  background: linear-gradient(180deg, transparent 0%, rgba(123,44,191,0.04) 50%, transparent 100%);
}
.section-title {
  font-family: var(--font-display); font-size: 2.2rem; text-align: center; margin-bottom: 60px;
  background: var(--gradient-gold-purple);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}
.feature-card {
  padding: 36px 28px;
  background: var(--color-bg-glass);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: all 0.4s var(--ease-out-expo);
  cursor: pointer;
}
.feature-card:hover {
  transform: translateY(-8px);
  border-color: rgba(212,175,55,0.2);
  box-shadow: 0 20px 50px rgba(0,0,0,0.3), 0 0 30px rgba(212,175,55,0.08);
}
.feature-icon-wrap {
  width: 56px; height: 56px; margin: 0 auto 20px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(212,175,55,0.08);
  border: 1px solid rgba(212,175,55,0.15);
  border-radius: var(--radius-lg);
  color: var(--color-gold);
  transition: all 0.3s ease;
}
.feature-card:hover .feature-icon-wrap {
  background: rgba(212,175,55,0.15);
  box-shadow: var(--shadow-gold);
  transform: scale(1.1);
}
.feature-svg { width: 26px; height: 26px; }
.feature-name {
  font-size: 1.15rem; font-weight: 600;
  color: var(--color-text-primary); margin-bottom: 10px;
}
.feature-desc {
  font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.7;
}

/* ===== Rarity ===== */
.rarity-section { padding: 80px 0 120px; }
.rarity-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.rarity-card {
  padding: 36px 20px;
  background: var(--color-bg-glass);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: all 0.4s var(--ease-out-expo);
  cursor: pointer;
}
.rarity-card:hover {
  transform: translateY(-6px) scale(1.02);
  border-color: rgba(212,175,55,0.2);
}
.rarity-badge-lg {
  display: inline-block;
  padding: 8px 24px;
  font-family: var(--font-tech);
  font-size: 1.4rem; font-weight: 700;
  border-radius: var(--radius-md);
  margin-bottom: 14px;
}
.rarity-n .rarity-badge-lg { background: rgba(150,150,150,0.15); color: #999; }
.rarity-r .rarity-badge-lg { background: rgba(59,130,246,0.15); color: var(--color-blue-light); }
.rarity-sr .rarity-badge-lg { background: rgba(171,71,188,0.15); color: var(--color-purple-light); }
.rarity-ur .rarity-badge-lg {
  background: linear-gradient(135deg, rgba(255,213,79,0.2), rgba(212,175,55,0.2));
  color: var(--color-gold-light);
  text-shadow: 0 0 20px rgba(255,213,79,0.4);
  animation: pulse-glow 2.5s ease-in-out infinite;
}
.rarity-label {
  font-size: 1rem; color: var(--color-text-primary); margin-bottom: 6px;
}
.rarity-rate {
  font-family: var(--font-tech);
  font-size: 1.6rem; font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 14px;
}
.rarity-bar {
  width: 100%; height: 4px;
  background: rgba(255,255,255,0.06);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.rarity-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  background: var(--gradient-gold);
  transition: width 1s var(--ease-out-expo);
}
.rarity-n .rarity-bar-fill { background: #777; }
.rarity-r .rarity-bar-fill { background: var(--color-blue); }
.rarity-sr .rarity-bar-fill { background: var(--color-purple); }
.rarity-ur .rarity-bar-fill { background: var(--gradient-gold); }

/* Responsive */
@media (max-width: 768px) {
  .title-main { font-size: 2.8rem; letter-spacing: 3px; }
  .hero-actions { flex-direction: column; align-items: center; }
  .rarity-grid { grid-template-columns: repeat(2, 1fr); }
  .features-grid { grid-template-columns: 1fr; }
}
</style>