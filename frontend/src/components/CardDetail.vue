<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
          <button class="modal-close" @click="$emit('close')">✕</button>

          <div class="card-detail">
            <!-- 左侧：卡牌图片 -->
            <div class="card-preview-section">
              <div class="yugioh-card-large">
                <div class="card-border-large">
                  <div class="card-content-large">
                    <img v-if="card.image" :src="cardImageUrl" :alt="card.name" />
                    <div v-else class="card-placeholder-large">
                      <span>{{ card.name?.charAt(0) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 稀有度显示 -->
              <div class="rarity-display" :class="`rarity-${card.rarity?.toLowerCase()}`">
                <span class="rarity-label">稀有度</span>
                <span class="rarity-value">{{ rarityText }}</span>
              </div>
            </div>

            <!-- 右侧：详细信息 -->
            <div class="card-info-section">
              <h2 class="card-title">{{ card.name }}</h2>

              <!-- 多语言名称 -->
              <div v-if="card.jpName || card.enName" class="card-names">
                <span v-if="card.jpName" class="alt-name jp">{{ card.jpName }}</span>
                <span v-if="card.enName" class="alt-name en">{{ card.enName }}</span>
              </div>

              <div class="card-meta">
                <div v-if="card.attribute" class="meta-item">
                  <span class="meta-label">属性</span>
                  <span class="meta-value attr">{{ card.attribute }}</span>
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
                  <span class="stat-value">{{ card.atk ?? '?' }}</span>
                </div>
                <div v-if="card.monsterType !== '链接'" class="stat-box def">
                  <span class="stat-label">DEF</span>
                  <span class="stat-value">{{ card.def ?? '?' }}</span>
                </div>
              </div>

              <!-- 灵摆效果 -->
              <div v-if="card.pendulumEffect" class="card-effect-section pendulum-effect">
                <h3 class="effect-title">灵摆效果</h3>
                <p class="effect-text">{{ card.pendulumEffect }}</p>
              </div>

              <div class="card-effect-section">
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

// 卡图URL
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
  if (props.card.type === 'spell') {
    return props.card.spellType ? `魔法卡 ${props.card.spellType}` : '魔法卡'
  }
  if (props.card.type === 'trap') {
    return props.card.trapType ? `陷阱卡 ${props.card.trapType}` : '陷阱卡'
  }
  return '未知'
})

const rarityText = computed(() => {
  const texts = { 'N': '普通', 'R': '稀有', 'SR': '超稀有', 'UR': '极稀有' }
  return texts[props.card.rarity] || props.card.rarity
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  position: relative;
  max-width: 950px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  background: linear-gradient(145deg, #1a1a25 0%, #12121a 100%);
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.1);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: var(--color-text-secondary);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
}

.card-detail {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 40px;
  padding: 40px;
}

/* 左侧卡牌预览 */
.card-preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* 卡牌图片展示 */
.yugioh-card-large {
  width: 280px;
  aspect-ratio: 0.686;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;
}

.yugioh-card-large:hover {
  transform: scale(1.02);
}

.card-border-large {
  width: 100%;
  height: 100%;
}

.card-content-large {
  width: 100%;
  height: 100%;
}

.card-content-large img {
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
  background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
  font-size: 4rem;
  font-family: 'Cinzel', serif;
  color: #d4af37;
  text-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
}

/* 稀有度显示 */
.rarity-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.rarity-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.rarity-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
}

.rarity-ur .rarity-value {
  color: var(--color-gold);
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.rarity-sr .rarity-value { color: #b19cd9; }
.rarity-r .rarity-value { color: #6bb3e0; }
.rarity-n .rarity-value { color: #aaa; }

/* 卡牌类型样式 - 大卡 */
.card-effect-monster .card-border-large {
  background: linear-gradient(145deg, #d97b3d 0%, #c96a2d 50%, #a85520 100%);
}
.card-effect-monster .card-content-large {
  background: linear-gradient(180deg, #f4a460 0%, #e89050 30%, #d87840 100%);
}

.card-normal .card-border-large {
  background: linear-gradient(145deg, #d4a84b 0%, #c9a227 50%, #a08030 100%);
}
.card-normal .card-content-large {
  background: linear-gradient(180deg, #f5deb3 0%, #e8d4a0 30%, #dcc890 100%);
}

.card-spell .card-border-large {
  background: linear-gradient(145deg, #1e8b6e 0%, #0d7a5c 50%, #006048 100%);
}
.card-spell .card-content-large {
  background: linear-gradient(180deg, #1e9b7e 0%, #0d8a6c 30%, #007858 100%);
}
.card-spell .card-name-large,
.card-spell .card-type-text-large {
  color: #f0f0f0;
}
.card-spell .card-desc-box-large {
  background: linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 100%);
}
.card-spell .card-stats-row-large {
  background: linear-gradient(180deg, #c8e6c9 0%, #a5d6a7 100%);
}

.card-trap .card-border-large {
  background: linear-gradient(145deg, #b8508a 0%, #a04078 50%, #803060 100%);
}
.card-trap .card-content-large {
  background: linear-gradient(180deg, #c86098 0%, #b05088 30%, #984078 100%);
}
.card-trap .card-name-large,
.card-trap .card-type-text-large {
  color: #f0f0f0;
}
.card-trap .card-desc-box-large {
  background: linear-gradient(180deg, #fce4ec 0%, #f8bbd9 100%);
}
.card-trap .card-stats-row-large {
  background: linear-gradient(180deg, #f8bbd9 0%, #f48fb1 100%);
}

.card-ritual .card-border-large {
  background: linear-gradient(145deg, #4a7dc4 0%, #3a6db4 50%, #2a5d9a 100%);
}
.card-ritual .card-content-large {
  background: linear-gradient(180deg, #6a9dd4 0%, #5a8dc4 30%, #4a7db4 100%);
}
.card-ritual .card-name-large {
  color: #f0f0f0;
}
.card-ritual .card-desc-box-large {
  background: linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%);
}
.card-ritual .card-stats-row-large {
  background: linear-gradient(180deg, #bbdefb 0%, #90caf9 100%);
}

.card-fusion .card-border-large {
  background: linear-gradient(145deg, #9060b0 0%, #8050a0 50%, #604080 100%);
}
.card-fusion .card-content-large {
  background: linear-gradient(180deg, #a070c0 0%, #9060b0 30%, #8050a0 100%);
}
.card-fusion .card-name-large {
  color: #f0f0f0;
}
.card-fusion .card-desc-box-large {
  background: linear-gradient(180deg, #f3e5f5 0%, #e1bee7 100%);
}
.card-fusion .card-stats-row-large {
  background: linear-gradient(180deg, #e1bee7 0%, #ce93d8 100%);
}

.card-synchro .card-border-large {
  background: linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 50%, #c8c8c8 100%);
}
.card-synchro .card-content-large {
  background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 30%, #ebebeb 100%);
}
.card-synchro .card-desc-box-large {
  background: linear-gradient(180deg, #fafafa 0%, #f0f0f0 100%);
}
.card-synchro .card-stats-row-large {
  background: linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%);
}

.card-xyz .card-border-large {
  background: linear-gradient(145deg, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%);
}
.card-xyz .card-content-large {
  background: linear-gradient(180deg, #2a2a2a 0%, #202020 30%, #181818 100%);
}
.card-xyz .card-name-large,
.card-xyz .card-type-text-large {
  color: #f0f0f0;
  text-shadow: none;
}
.card-xyz .card-desc-box-large {
  background: linear-gradient(180deg, #303030 0%, #282828 100%);
}
.card-xyz .card-desc-large {
  color: #d0d0d0;
}
.card-xyz .card-stats-row-large {
  background: linear-gradient(180deg, #282828 0%, #202020 100%);
}
.card-xyz .stat-atk-large,
.card-xyz .stat-def-large,
.card-xyz .card-id-large {
  color: #d0d0d0;
}

.card-pendulum .card-border-large {
  background: linear-gradient(180deg, #d97b3d 0%, #c96a2d 40%, #1e8b6e 60%, #0d7a5c 100%);
}
.card-pendulum .card-content-large {
  background: linear-gradient(180deg, #f4a460 0%, #e89050 35%, #1e9b7e 65%, #0d8a6c 100%);
}
.card-pendulum .card-desc-box-large {
  background: linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 100%);
}
.card-pendulum .card-stats-row-large {
  background: linear-gradient(180deg, #c8e6c9 0%, #a5d6a7 100%);
}

.card-link .card-border-large {
  background: linear-gradient(145deg, #2060a0 0%, #1050a0 50%, #004080 100%);
}
.card-link .card-content-large {
  background: linear-gradient(180deg, #1868b0 0%, #1058a0 30%, #004890 100%);
}
.card-link .card-name-large,
.card-link .card-type-text-large {
  color: #f0f0f0;
}
.card-link .card-desc-box-large {
  background: linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%);
}
.card-link .card-stats-row-large {
  background: linear-gradient(180deg, #bbdefb 0%, #90caf9 100%);
}
.card-link .stat-link-large {
  color: #0066cc;
  font-weight: 800;
}

.rarity-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.rarity-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.rarity-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
}

.rarity-ur .rarity-value {
  color: var(--color-gold);
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
}

.rarity-sr .rarity-value { color: #b19cd9; }
.rarity-r .rarity-value { color: #6bb3e0; }
.rarity-n .rarity-value { color: #aaa; }

/* 右侧信息区域 */
.card-info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card-title {
  font-family: 'Cinzel', 'Noto Sans SC', serif;
  font-size: 2rem;
  font-weight: 700;
  background: var(--gradient-gold-purple);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.meta-value {
  font-size: 1rem;
  color: var(--color-text-primary);
}

.meta-value.attr {
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-stats-large {
  display: flex;
  gap: 20px;
}

.stat-box {
  flex: 1;
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-label {
  display: block;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.stat-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
}

.stat-box.atk .stat-value { color: #ff6b6b; }
.stat-box.def .stat-value { color: #4ecdc4; }

.card-effect-section {
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.effect-title {
  font-size: 0.9rem;
  color: var(--color-gold);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.effect-text {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.owned-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.owned-label {
  color: var(--color-text-secondary);
}

.owned-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-gold);
}

/* 多语言名称 */
.card-names {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: -16px;
}

.alt-name {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.alt-name.jp {
  font-family: 'Noto Sans JP', sans-serif;
}

.alt-name.en {
  font-style: italic;
}

/* 星级样式 */
.level-stars {
  color: #ffd700;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
}

/* 灵摆刻度 */
.pendulum-scale {
  color: #7cfc00;
  font-weight: bold;
}

/* 灵摆效果区域 */
.pendulum-effect {
  border-left: 3px solid #7cfc00;
}

.pendulum-effect .effect-title {
  color: #7cfc00;
}

/* 动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
}

@media (max-width: 768px) {
  .card-detail {
    grid-template-columns: 1fr;
    padding: 24px;
  }

  .card-preview-section {
    max-width: 280px;
    margin: 0 auto;
  }

  .yugioh-card-large {
    width: 100%;
  }
}
</style>
