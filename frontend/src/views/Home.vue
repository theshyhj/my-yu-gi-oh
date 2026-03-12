<template>
  <div class="home-page">
    <!-- 英雄区域 -->
    <section class="hero">
      <div class="hero-bg">
        <div class="particles"></div>
        <div class="grid-lines"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">TRADING CARD GAME</div>
        <h1 class="hero-title">
          <span class="title-line">决斗吧！</span>
          <span class="title-main">DUEL MASTERS</span>
        </h1>
        <p class="hero-subtitle">收集传说卡牌，组建最强卡组，成为决斗王！</p>
        <div class="hero-actions">
          <router-link to="/gacha" class="btn btn-primary btn-lg">
            <span class="btn-icon">🎴</span>
            开始抽卡
          </router-link>
          <router-link to="/cards" class="btn btn-secondary btn-lg">
            <span class="btn-icon">📚</span>
            浏览图鉴
          </router-link>
        </div>
      </div>
      <div class="hero-cards">
        <div class="floating-card card-1"></div>
        <div class="floating-card card-2"></div>
        <div class="floating-card card-3"></div>
      </div>
    </section>

    <!-- 特性介绍 -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">游戏特色</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="(feature, index) in features" :key="index">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 稀有度说明 -->
    <section class="rarity-section">
      <div class="container">
        <h2 class="section-title">稀有度系统</h2>
        <div class="rarity-grid">
          <div class="rarity-card" v-for="rarity in rarities" :key="rarity.name" :class="`rarity-${rarity.name.toLowerCase()}`">
            <div class="rarity-badge-large">{{ rarity.name }}</div>
            <div class="rarity-name">{{ rarity.label }}</div>
            <div class="rarity-rate">{{ rarity.rate }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const features = [
  { icon: '🎴', title: '抽卡系统', desc: '体验刺激的抽卡玩法，收集稀有卡牌' },
  { icon: '📚', title: '卡牌图鉴', desc: '浏览全部卡牌，了解每张卡的详细信息' },
  { icon: '💎', title: '收藏管理', desc: '管理你的卡牌收藏，查看拥有数量' },
  { icon: '🃏', title: '卡组构建', desc: '按照OCG规则组建你的专属卡组' }
]

const rarities = [
  { name: 'N', label: '普通', rate: '60%' },
  { name: 'R', label: '稀有', rate: '25%' },
  { name: 'SR', label: '超稀有', rate: '12%' },
  { name: 'UR', label: '极稀有', rate: '3%' }
]
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* 英雄区域 */
.hero {
  position: relative;
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 60px 24px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.particles {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(2px 2px at 20px 30px, rgba(212,175,55,0.3), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(123,44,191,0.3), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(212,175,55,0.2), transparent),
    radial-gradient(2px 2px at 130px 80px, rgba(157,78,221,0.3), transparent),
    radial-gradient(1px 1px at 160px 120px, rgba(212,175,55,0.2), transparent);
  background-size: 200px 200px;
  animation: float 20s ease-in-out infinite;
}

.grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
}

.hero-badge {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(212,175,55,0.1);
  border: 1px solid rgba(212,175,55,0.3);
  border-radius: 30px;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.8rem;
  color: var(--color-gold);
  letter-spacing: 3px;
  margin-bottom: 24px;
  animation: fadeInUp 0.8s ease;
}

.hero-title {
  margin-bottom: 24px;
  animation: fadeInUp 0.8s ease 0.1s both;
}

.title-line {
  display: block;
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.title-main {
  display: block;
  font-family: 'Cinzel', serif;
  font-size: 4rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffd700 0%, #d4af37 30%, #9d4edd 70%, #7b2cbf 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 4px;
  text-shadow: none;
  filter: drop-shadow(0 0 30px rgba(212,175,55,0.3));
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  margin-bottom: 40px;
  animation: fadeInUp 0.8s ease 0.2s both;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  animation: fadeInUp 0.8s ease 0.3s both;
}

.btn-lg {
  padding: 16px 36px;
  font-size: 1.1rem;
}

.btn-icon {
  font-size: 1.3rem;
}

/* 浮动卡牌装饰 */
.hero-cards {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.floating-card {
  position: absolute;
  width: 120px;
  height: 170px;
  background: linear-gradient(145deg, #1a1a25, #12121a);
  border: 2px solid rgba(212,175,55,0.3);
  border-radius: 8px;
  opacity: 0.4;
}

.card-1 {
  top: 15%;
  left: 10%;
  transform: rotate(-15deg);
  animation: float 6s ease-in-out infinite;
}

.card-2 {
  top: 20%;
  right: 12%;
  transform: rotate(20deg);
  animation: float 8s ease-in-out infinite 1s;
}

.card-3 {
  bottom: 15%;
  left: 15%;
  transform: rotate(10deg);
  animation: float 7s ease-in-out infinite 0.5s;
}

/* 特性区域 */
.features {
  padding: 100px 0;
  background: linear-gradient(180deg, transparent 0%, rgba(123,44,191,0.05) 50%, transparent 100%);
}

.section-title {
  font-family: 'Cinzel', 'Noto Sans SC', serif;
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 60px;
  background: var(--gradient-gold-purple);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  padding: 40px 30px;
  background: rgba(20, 20, 30, 0.6);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  text-align: center;
  transition: all 0.4s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  border-color: rgba(212,175,55,0.3);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(212,175,55,0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-title {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-gold);
  margin-bottom: 12px;
}

.feature-desc {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* 稀有度区域 */
.rarity-section {
  padding: 100px 0;
}

.rarity-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.rarity-card {
  padding: 40px 20px;
  background: rgba(20, 20, 30, 0.6);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  text-align: center;
  transition: all 0.4s ease;
}

.rarity-card:hover {
  transform: scale(1.05);
}

.rarity-badge-large {
  display: inline-block;
  padding: 8px 24px;
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  border-radius: 6px;
  margin-bottom: 16px;
}

.rarity-n .rarity-badge-large {
  background: rgba(150,150,150,0.2);
  color: #aaa;
}

.rarity-r .rarity-badge-large {
  background: rgba(70,130,180,0.2);
  color: #6bb3e0;
}

.rarity-sr .rarity-badge-large {
  background: rgba(147,112,219,0.2);
  color: #b19cd9;
}

.rarity-ur .rarity-badge-large {
  background: linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,165,0,0.3));
  color: #ffd700;
  text-shadow: 0 0 20px rgba(255,215,0,0.5);
  animation: pulse-glow 2s ease-in-out infinite;
}

.rarity-name {
  font-size: 1.1rem;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.rarity-rate {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .title-main {
    font-size: 2.5rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .rarity-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
