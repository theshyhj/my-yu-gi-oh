<template>
  <div class="gacha-page">
    <div class="container">
      <h1 class="page-title">抽卡</h1>

      <!-- 抽卡区域 -->
      <div class="gacha-area">
        <div class="gacha-pack" :class="{ 'is-drawing': isDrawing }" @click="draw">
          <div class="pack-glow"></div>
          <div class="pack-inner">
            <div class="pack-icon">🎴</div>
            <div class="pack-text">点击抽卡</div>
          </div>
          <div class="pack-particles">
            <span v-for="i in 20" :key="i" class="particle"></span>
          </div>
        </div>

        <div class="draw-buttons">
          <button @click="draw(1)" class="btn btn-primary" :disabled="isDrawing || !userStore.isLoggedIn">
            单抽
          </button>
          <button @click="draw(10)" class="btn btn-secondary" :disabled="isDrawing || !userStore.isLoggedIn">
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
              :style="{ animationDelay: `${index * 0.1}s` }"
              @click="openDetail(card)"
            >
              <img
                v-if="card.image"
                :src="getCardImageUrl(card.image)"
                :alt="card.name"
                class="card-image"
                @error="handleImageError"
              />
              <div v-else class="card-placeholder">
                <span>{{ card.name?.charAt(0) }}</span>
              </div>
              <div v-if="card.isNew" class="new-badge">
                <span class="new-text">NEW</span>
                <span class="new-shine"></span>
              </div>
            </div>
          </div>
          <button @click="closeResult" class="btn btn-secondary mt-4">确认</button>
        </div>
      </Transition>
    </div>

    <!-- 卡牌详情 -->
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

    // 延迟显示结果，配合动画
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

function handleImageError(e) {
  e.target.style.display = 'none'
}

function openDetail(card) {
  selectedCard.value = card
  showDetail.value = true
}

function closeResult() {
  showResult.value = false
  drawnCards.value = []
}
</script>

<style scoped>
.gacha-page {
  padding: 40px 0 80px;
  min-height: calc(100vh - 70px);
}

.gacha-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
}

/* 卡包样式 */
.gacha-pack {
  position: relative;
  width: 280px;
  height: 380px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gacha-pack:hover:not(.is-drawing) {
  transform: scale(1.05);
}

.gacha-pack:hover:not(.is-drawing) .pack-glow {
  opacity: 1;
}

.pack-glow {
  position: absolute;
  inset: -4px;
  background: var(--gradient-gold-purple);
  border-radius: 16px;
  opacity: 0.6;
  filter: blur(10px);
  transition: opacity 0.3s ease;
  z-index: -1;
}

.pack-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(145deg, #1a1a25 0%, #12121a 100%);
  border: 2px solid rgba(212,175,55,0.4);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
  overflow: hidden;
}

.pack-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,215,0,0.05) 0%, transparent 50%, rgba(123,44,191,0.05) 100%);
}

.pack-icon {
  font-size: 6rem;
  filter: drop-shadow(0 0 20px rgba(212,175,55,0.5));
}

.pack-text {
  font-family: 'Cinzel', serif;
  font-size: 1.3rem;
  color: var(--color-gold);
  letter-spacing: 2px;
}

/* 抽卡动画 */
.is-drawing {
  animation: shake 0.5s ease-in-out infinite;
}

.is-drawing .pack-glow {
  opacity: 1;
  animation: pulse-glow 0.5s ease-in-out infinite;
}

.is-drawing .pack-particles .particle {
  animation: particle-burst 1.5s ease-out forwards;
}

.pack-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--color-gold);
  border-radius: 50%;
  opacity: 0;
  top: 50%;
  left: 50%;
}

@keyframes shake {
  0%, 100% { transform: translateX(0) rotate(0); }
  25% { transform: translateX(-5px) rotate(-2deg); }
  75% { transform: translateX(5px) rotate(2deg); }
}

@keyframes particle-burst {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0);
  }
  100% {
    opacity: 0;
    transform: translate(
      calc(-50% + var(--x, 0) * 150px),
      calc(-50% + var(--y, 0) * 150px)
    ) scale(1);
  }
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

/* 按钮区域 */
.draw-buttons {
  display: flex;
  gap: 20px;
  margin-top: 40px;
}

.login-hint {
  margin-top: 20px;
  color: var(--color-text-secondary);
}

/* 结果区域 */
.result-area {
  margin-top: 60px;
  text-align: center;
}

.result-title {
  font-family: 'Cinzel', serif;
  font-size: 1.8rem;
  color: var(--color-gold);
  margin-bottom: 30px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.result-grid.single {
  max-width: 250px;
}

.result-card {
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(20, 20, 30, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: cardReveal 0.6s ease-out backwards;
}

.result-card:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.3);
  z-index: 10;
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
  background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
  font-size: 3rem;
  font-weight: bold;
  color: #d4af37;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}



.result-card.rarity-ur {
  animation: cardRevealUR 0.8s ease-out backwards;
}

@keyframes cardReveal {
  0% {
    opacity: 0;
    transform: scale(0.5) rotateY(180deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotateY(0);
  }
}

@keyframes cardRevealUR {
  0% {
    opacity: 0;
    transform: scale(0.3) rotateY(180deg);
    filter: brightness(3);
  }
  50% {
    filter: brightness(2);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotateY(0);
    filter: brightness(1);
  }
}

.new-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #ff3333 0%, #cc0000 100%);
  border: 1.5px solid #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(255, 0, 0, 0.6), 0 0 15px rgba(255, 0, 0, 0.3);
  z-index: 10;
  overflow: hidden;
  animation: newBadgePulse 1.5s ease-in-out infinite;
}

.new-text {
  position: relative;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 1px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  z-index: 2;
}

.new-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: newShine 2s ease-in-out infinite;
}

@keyframes newBadgePulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(255, 0, 0, 0.6), 0 0 15px rgba(255, 0, 0, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 3px 12px rgba(255, 0, 0, 0.8), 0 0 20px rgba(255, 0, 0, 0.5);
  }
}

@keyframes newShine {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 200%;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* 过渡动画 */
.result-enter-active {
  transition: all 0.5s ease;
}

.result-leave-active {
  transition: all 0.3s ease;
}

.result-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.result-leave-to {
  opacity: 0;
}
</style>
