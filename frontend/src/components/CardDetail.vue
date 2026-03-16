<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
          <button class="modal-close" @click="$emit('close')" aria-label="关闭">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <div class="card-detail">
            <!-- 左侧：卡图 -->
            <div class="card-preview-section">
              <div class="card-image-wrap">
                <img v-if="card.image" :src="cardImageUrl" :alt="card.name" class="card-img-large" />
                <div v-else class="card-placeholder-large"><span>{{ card.name?.charAt(0) }}</span></div>
              </div>
              <div class="rarity-display" :class="`rarity-${card.rarity?.toLowerCase()}`">
                <span class="rarity-label-text">稀有度</span>
                <span class="rarity-value-text">{{ rarityText }}</span>
              </div>
            </div>

            <!-- 右侧：信息 -->
            <div class="card-info-section">
              <h2 class="card-title">{{ card.name }}</h2>

              <div v-if="card.jpName || card.enName" class="card-names">
                <span v-if="card.jpName" class="alt-name jp">{{ card.jpName }}</span>
                <span v-if="card.enName" class="alt-name en">{{ card.enName }}</span>
              </div>

              <div class="card-meta">
                <div v-if="card.attribute" class="meta-item">
                  <span class="meta-label">属性</span>
                  <span class="meta-value">{{ card.attribute }}</span>
                </div>
                <div v-if="card.level && card.monsterType !== '链接'" class="meta-item">
                  <span class="meta-label">{{ card.monsterType === '超量' ? '阶级' : '等级' }}</span>
                  <span class="meta-value level-stars">{{ '★'.repeat(card.level) }}</span>
                </div>
                <div v-if="card.monsterType === '链接'" class="meta-item">
                  <span class="meta-label">链接值</span>
                  <span class="meta-value">LINK-{{ card.linkRating }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">类型</span>
                  <span class="meta-value">{{ cardTypeText }}</span>
                </div>
                <div v-if="card.race" class="meta-item">
                  <span class="meta-label">种族</span>
                  <span class="meta-value">{{ card.race }}</span>
                </div>
                <div v-if="card.pendulumScale != null" class="meta-item">
                  <span class="meta-label">灵摆刻度</span>
                  <span class="meta-value pendulum-scale">{{ card.pendulumScale }}</span>
                </div>
              </div>

              <div v-if="card.type === 'monster'" class="card-stats-large">
                <div class="stat-box atk">
                  <span class="stat-label">ATK</span>
                  <span class="stat-num">{{ card.atk ?? '?' }}</span>
                </div>
                <div v-if="card.monsterType !== '链接'" class="stat-box def">
                  <span class="stat-label">DEF</span>
                  <span class="stat-num">{{ card.def ?? '?' }}</span>
                </div>
              </div>

              <div v-if="card.pendulumEffect" class="effect-section pendulum">
                <h3 class="effect-title">灵摆效果</h3>
                <p class="effect-text">{{ card.pendulumEffect }}</p>
              </div>

              <div class="effect-section">
                <h3 class="effect-title">{{ card.type === 'monster' ? '怪兽效果' : '卡牌效果' }}</h3>
                <p class="effect-text">{{ card.effect || '无效果描述' }}</p>
              </div>

              <div v-if="showOwned" class="owned-info">
                <span class="owned-label">拥有数量</span>
                <span class="owned-value">{{ ownedCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  card: { type: Object, default: () => ({}) },
  showOwned: { type: Boolean, default: false },
  ownedCount: { type: Number, default: 0 }
})

defineEmits(['close'])

const cardImageUrl = computed(() => {
  const img = props.card.image
  if (!img) return ''
  if (img.startsWith('http')) return img
  return `/img/${img}`
})

const cardTypeText = computed(() => {
  if (props.card.type === 'monster') {
    const parts = []
    if (props.card.race) parts.push(props.card.race)
    if (props.card.monsterType) parts.push(props.card.monsterType)
    return parts.join(' / ') || '怪兽'
  }
  if (props.card.type === 'spell') return props.card.spellType ? `魔法卡 ${props.card.spellType}` : '魔法卡'
  if (props.card.type === 'trap') return props.card.trapType ? `陷阱卡 ${props.card.trapType}` : '陷阱卡'
  return '未知'
})

const rarityText = computed(() => {
  const t = { 'N': '普通', 'R': '稀有', 'SR': '超稀有', 'UR': '极稀有' }
  return t[props.card.rarity] || props.card.rarity
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: 20px;
}

.modal-content {
  position: relative;
  max-width: 920px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--color-bg-elevated);
  backdrop-filter: blur(24px);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(212, 175, 55, 0.15);
  box-shadow: 0 0 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(212, 175, 55, 0.05);
}

[data-theme="light"] .modal-content {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.08);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.25s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: var(--color-danger);
}

.card-detail {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 36px;
  padding: 36px;
}

/* 左侧 */
.card-preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.card-image-wrap {
  width: 260px;
  aspect-ratio: 0.686;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transition: transform 0.3s var(--ease-out-expo);
}

.card-image-wrap:hover { transform: scale(1.02); }

.card-img-large {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-placeholder-large {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e, #0d0d16);
  font-size: 4rem;
  font-family: var(--font-display);
  color: var(--color-gold);
}

/* Rarity display */
.rarity-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.rarity-label-text {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.rarity-value-text {
  font-family: var(--font-tech);
  font-size: 1rem;
  font-weight: 600;
}

.rarity-ur .rarity-value-text { color: var(--color-gold-light); text-shadow: 0 0 12px rgba(255,213,79,0.4); }
.rarity-sr .rarity-value-text { color: var(--color-purple-light); }
.rarity-r .rarity-value-text { color: var(--color-blue-light); }
.rarity-n .rarity-value-text { color: #999; }

/* 右侧信息 */
.card-info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 700;
  background: var(--gradient-gold-purple);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-names {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: -12px;
}

.alt-name {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.alt-name.en { font-style: italic; }

.card-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.meta-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.meta-value {
  font-size: 0.95rem;
  color: var(--color-text-primary);
}

.level-stars {
  color: #ffd700;
  text-shadow: 0 0 5px rgba(255,215,0,0.4);
}

.pendulum-scale {
  color: #7cfc00;
  font-weight: bold;
}

.card-stats-large {
  display: flex;
  gap: 16px;
}

.stat-box {
  flex: 1;
  padding: 14px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-md);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.stat-label {
  display: block;
  font-family: var(--font-tech);
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.stat-num {
  font-family: var(--font-tech);
  font-size: 1.6rem;
  font-weight: 700;
}

.stat-box.atk .stat-num { color: #ef4444; }
.stat-box.def .stat-num { color: #22d3ee; }

.effect-section {
  padding: 18px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.effect-section.pendulum {
  border-left: 3px solid #7cfc00;
}

.effect-title {
  font-size: 0.85rem;
  color: var(--color-gold);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.pendulum .effect-title { color: #7cfc00; }

.effect-text {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.owned-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(212, 175, 55, 0.06);
  border-radius: var(--radius-md);
  border: 1px solid rgba(212, 175, 55, 0.15);
}

.owned-label { color: var(--color-text-secondary); font-size: 0.9rem; }

.owned-value {
  font-family: var(--font-tech);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-gold);
}

/* 动画 */
.modal-enter-active, .modal-leave-active { transition: all 0.3s var(--ease-out-expo); }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-content, .modal-leave-to .modal-content {
  transform: scale(0.92) translateY(16px);
}

@media (max-width: 768px) {
  .card-detail {
    grid-template-columns: 1fr;
    padding: 24px;
  }
  .card-preview-section {
    max-width: 260px;
    margin: 0 auto;
  }
  .card-image-wrap { width: 100%; }
}
</style>