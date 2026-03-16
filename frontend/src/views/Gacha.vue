<template>
  <div class="gacha-page">
    <div class="container">
      <h1 class="page-title">抽卡</h1>

      <!-- 抽卡区域 -->
      <div class="gacha-area">
        <div class="gacha-pack" :class="{ 'is-drawing': isDrawing }" @click="draw(1)">
          <div class="pack-glow"></div>
          <div class="pack-inner">
            <div class="pack-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" width="64" height="64" aria-hidden="true">
                <rect x="2" y="3" width="20" height="18" rx="3"/>
                <path d="M12 8v8M8 12h8" stroke-width="1.5"/>
                <path d="M2 9h20" opacity="0.3"/>
              </svg>
            </div>
            <div class="pack-text">点击抽卡</div>
            <div class="pack-shine"></div>
          </div>
          <div class="pack-particles" aria-hidden="true">
            <span v-for="i in 20" :key="i" class="particle"></span>
          </div>
        </div>

        <div class="draw-buttons">
          <button @click="draw(1)" class="btn btn-primary" :disabled="isDrawing || !userStore.isLoggedIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>
            单抽
          </button>
          <button @click="draw(10)" class="btn btn-secondary" :disabled="isDrawing || !userStore.isLoggedIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="1" y="4" width="16" height="16" rx="2"/><path d="M7 1h14a2 2 0 0 1 2 2v14"/></svg>
            十连抽
          </button>
        </div>

        <p v-if="!userStore.isLoggedIn" class="login-hint">
          请先 <router-link to="/login">登录</router-link> 后再抽卡
        </p>
      </div>

      <!-- 抽卡结果 -->
      <Transition name="result">
        <div v-if="showResult && drawnCards.length > 0" class="result-area">
          <h2 class="result-title">抽卡结果</h2>
          <div class="result-grid" :class="{ 'single': drawnCards.length === 1 }">
            <div
              v-for="(card, index) in drawnCards"
              :key="index"
              class="result-card"
              :class="`rarity-${card.rarity?.toLowerCase()}`"
              :style="{ animationDelay: `${index * 0.08}s` }"
              @click="openDetail(card)"
            >
              <img v-if="card.image" :src="getCardImageUrl(card.image)" :alt="card.name" class="card-image" @error="handleImageError" />
              <div v-else class="card-placeholder"><span>{{ card.name?.charAt(0) }}</span></div>
              <div v-if="card.isNew" class="new-badge">NEW</div>
              <div class="result-card-glow"></div>
            </div>
          </div>
          <button @click="closeResult" class="btn btn-secondary mt-4">确认</button>
        </div>
      </Transition>
    </div>

    <CardDetail :visible="showDetail" :card="selectedCard" @close="showDetail = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user'
import api from '../api'
import CardDetail from '../components/CardDetail.vue'

const userStore = useUserStore()
const isDrawing = ref(false)
const showResult = ref(false)
const drawnCards = ref([])
const showDetail = ref(false)
const selectedCard = ref({})

async function draw(count = 1) {
  if (isDrawing.value || !userStore.isLoggedIn) return
  isDrawing.value = true
  showResult.value = false
  try {
    const res = await api.post('/gacha/draw', { count })
    drawnCards.value = res.data.cards
    setTimeout(() => {
      isDrawing.value = false
      showResult.value = true
    }, 1500)
  } catch (e) {
    console.error('抽卡失败:', e)
    alert('抽卡失败: ' + (e.response?.data?.message || e.message))
    isDrawing.value = false
  }
}

function getCardImageUrl(image) {
  if (!image) return ''
  if (image.startsWith('http')) return image
  return `/img/${image}`
}

function handleImageError(e) { e.target.style.display = 'none' }
function openDetail(card) { selectedCard.value = card; showDetail.value = true }
function closeResult() { showResult.value = false; drawnCards.value = [] }
</script>

<style scoped>
.gacha-page {
  padding: 40px 0 80px;
  min-height: calc(100vh - 72px);
}

.gacha-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
}

/* 卡包 */
.gacha-pack {
  position: relative;
  width: 260px;
  height: 360px;
  cursor: pointer;
  transition: transform 0.3s var(--ease-out-expo);
}

.gacha-pack:hover:not(.is-drawing) {
  transform: scale(1.04);
}

.gacha-pack:hover:not(.is-drawing) .pack-glow {
  opacity: 1;
}

.pack-glow {
  position: absolute;
  inset: -6px;
  background: var(--gradient-gold-purple);
  border-radius: 20px;
  opacity: 0.4;
  filter: blur(16px);
  transition: opacity 0.4s ease;
  z-index: -1;
}

.pack-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, var(--color-bg-tertiary), var(--color-bg-secondary));
  border: 1px solid rgba(212,175,55,0.25);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
  overflow: hidden;
}

.pack-icon {
  color: var(--color-gold);
  filter: drop-shadow(0 0 20px rgba(212,175,55,0.4));
  transition: transform 0.3s ease;
}

.gacha-pack:hover .pack-icon {
  transform: scale(1.1);
}

.pack-text {
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--color-gold);
  letter-spacing: 2px;
}

.pack-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,213,79,0.05) 0%, transparent 50%, rgba(123,44,191,0.05) 100%);
  pointer-events: none;
}

/* 抽卡动画 */
.is-drawing {
  animation: shake 0.5s ease-in-out infinite;
}

.is-drawing .pack-glow {
  opacity: 1;
  animation: pulse-glow 0.5s ease-in-out infinite;
}

.is-drawing .particle {
  animation: particle-burst 1.5s ease-out forwards;
}

.pack-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--color-gold);
  border-radius: 50%;
  opacity: 0;
  top: 50%;
  left: 50%;
}

@keyframes shake {
  0%, 100% { transform: translateX(0) rotate(0); }
  25% { transform: translateX(-4px) rotate(-1.5deg); }
  75% { transform: translateX(4px) rotate(1.5deg); }
}

@keyframes particle-burst {
  0% { opacity: 1; transform: translate(-50%, -50%) scale(0); }
  100% { opacity: 0; transform: translate(calc(-50% + var(--x, 0) * 140px), calc(-50% + var(--y, 0) * 140px)) scale(1); }
}

.particle:nth-child(1) { --x: 0.5; --y: -0.8; }
.particle:nth-child(2) { --x: -0.7; --y: -0.5; }
.particle:nth-child(3) { --x: 0.9; --y: 0.2; }
.particle:nth-child(4) { --x: -0.3; --y: 0.9; }
.particle:nth-child(5) { --x: 0.1; --y: -0.95; }
.particle:nth-child(6) { --x: -0.9; --y: 0.1; }
.particle:nth-child(7) { --x: 0.6; --y: 0.7; }
.particle:nth-child(8) { --x: -0.5; --y: -0.8; }
.particle:nth-child(9) { --x: 0.8; --y: -0.4; }
.particle:nth-child(10) { --x: -0.2; --y: 0.95; }
.particle:nth-child(11) { --x: 0.95; --y: 0; }
.particle:nth-child(12) { --x: -0.8; --y: -0.5; }
.particle:nth-child(13) { --x: 0.3; --y: 0.9; }
.particle:nth-child(14) { --x: -0.6; --y: 0.7; }
.particle:nth-child(15) { --x: 0.7; --y: -0.6; }
.particle:nth-child(16) { --x: -0.95; --y: 0.2; }
.particle:nth-child(17) { --x: 0.4; --y: -0.85; }
.particle:nth-child(18) { --x: -0.4; --y: 0.85; }
.particle:nth-child(19) { --x: 0.85; --y: 0.4; }
.particle:nth-child(20) { --x: -0.85; --y: -0.3; }

/* 按钮区 */
.draw-buttons {
  display: flex;
  gap: 16px;
  margin-top: 36px;
}

.login-hint {
  margin-top: 20px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

/* 结果区 */
.result-area {
  margin-top: 60px;
  text-align: center;
}

.result-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--color-gold);
  margin-bottom: 28px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  max-width: 960px;
  margin: 0 auto;
}

.result-grid.single {
  max-width: 220px;
}

.result-card {
  position: relative;
  cursor: pointer;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-bg-card);
  transition: transform 0.3s var(--ease-out-expo), box-shadow 0.3s ease;
  animation: cardReveal 0.6s var(--ease-out-expo) backwards;
}

.result-card:hover {
  transform: translateY(-8px) scale(1.04);
  box-shadow: var(--shadow-card-hover);
  z-index: 10;
}

.result-card-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.result-card:hover .result-card-glow {
  opacity: 1;
}

.rarity-ur .result-card-glow {
  box-shadow: inset 0 0 30px rgba(255,213,79,0.15);
}

.rarity-sr .result-card-glow {
  box-shadow: inset 0 0 20px rgba(171,71,188,0.12);
}

.card-image {
  width: 100%;
  aspect-ratio: 0.686;
  object-fit: cover;
  display: block;
}

.card-placeholder {
  width: 100%;
  aspect-ratio: 0.686;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #0d0d16 100%);
  font-size: 3rem;
  font-weight: bold;
  color: var(--color-gold);
}

.rarity-ur { animation: cardRevealUR 0.8s var(--ease-out-expo) backwards; }

@keyframes cardReveal {
  0% { opacity: 0; transform: scale(0.5) rotateY(180deg); }
  100% { opacity: 1; transform: scale(1) rotateY(0); }
}

@keyframes cardRevealUR {
  0% { opacity: 0; transform: scale(0.3) rotateY(180deg); filter: brightness(3); }
  50% { filter: brightness(2); }
  100% { opacity: 1; transform: scale(1) rotateY(0); filter: brightness(1); }
}

.new-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 10px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-radius: var(--radius-full);
  color: #fff;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 1px;
  box-shadow: 0 2px 8px rgba(239,68,68,0.4);
  z-index: 5;
}

/* 过渡 */
.result-enter-active { transition: all 0.5s var(--ease-out-expo); }
.result-leave-active { transition: all 0.3s ease; }
.result-enter-from { opacity: 0; transform: translateY(24px); }
.result-leave-to { opacity: 0; }
</style>
