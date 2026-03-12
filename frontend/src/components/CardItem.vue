<template>
  <div
    class="card-item"
    :class="[`rarity-${card.rarity?.toLowerCase()}`, cardStyleClass, { 'is-owned': owned }]"
    @click="$emit('click', card)"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="yugioh-card">
      <!-- 卡牌外边框 -->
      <div class="card-border">
        <!-- 卡牌内部 -->
        <div class="card-content">
          <!-- 卡名区域 -->
          <div class="card-name-row">
            <span class="card-name">{{ card.name }}</span>
            <span v-if="card.attribute" class="card-attribute">
              <img :src="attributeIconUrl" :alt="card.attribute" class="attr-icon" />
            </span>
            <span v-else-if="card.type === 'spell'" class="card-attribute spell-attr">
              <span class="spell-icon">✦</span>
            </span>
            <span v-else-if="card.type === 'trap'" class="card-attribute trap-attr">
              <span class="trap-icon">⚠</span>
            </span>
          </div>

          <!-- 星级/阶级行 (怪兽卡) -->
          <div v-if="card.type === 'monster' && card.monsterType !== '链接'" class="card-level-row" :class="{ 'rank-row': card.monsterType === '超量' }">
            <template v-if="card.monsterType === '超量'">
              <span v-for="n in card.level" :key="n" class="rank-star">★</span>
            </template>
            <template v-else>
              <span v-for="n in card.level" :key="n" class="level-star">★</span>
            </template>
          </div>

          <!-- 卡图区域 -->
          <div class="card-artwork-frame">
            <div class="card-artwork">
              <img
                v-if="card.image"
                :src="cardImageUrl"
                :alt="card.name"
                @error="handleImageError"
              />
              <div v-else class="card-placeholder">
                <span>{{ card.name?.charAt(0) }}</span>
              </div>
            </div>
            <!-- 链接箭头 (链接怪兽) -->
            <div v-if="card.monsterType === '链接'" class="link-arrows">
              <div v-for="arrow in linkArrows" :key="arrow" :class="['link-arrow', `arrow-${arrow}`]"></div>
            </div>
          </div>

          <!-- 卡牌类型行 -->
          <div class="card-type-row">
            <span class="card-type-text">【{{ cardTypeText }}】</span>
          </div>

          <!-- 效果描述区域 -->
          <div class="card-desc-box">
            <p class="card-desc">{{ truncatedEffect }}</p>
          </div>

          <!-- 攻防/LINK值 -->
          <div v-if="card.type === 'monster'" class="card-stats-row">
            <span class="card-id-text">{{ card.id || '' }}</span>
            <div class="stats-right">
              <span class="stat-atk">ATK/{{ card.atk ?? '?' }}</span>
              <span v-if="card.monsterType !== '链接'" class="stat-def">DEF/{{ card.def ?? '?' }}</span>
              <span v-else class="stat-link">LINK-{{ card.linkRating ?? '?' }}</span>
            </div>
          </div>
          <div v-else class="card-stats-row spell-trap-row">
            <span class="card-id-text">{{ card.id || '' }}</span>
          </div>
        </div>
      </div>

      <!-- 稀有度标识 -->
      <div class="rarity-badge">{{ card.rarity }}</div>

      <!-- 拥有数量 -->
      <div v-if="showCount && count > 0" class="owned-count">×{{ count }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  card: { type: Object, required: true },
  owned: { type: Boolean, default: false },
  count: { type: Number, default: 0 },
  showCount: { type: Boolean, default: false }
})

defineEmits(['click'])

const isHovered = ref(false)

// 属性图标URL
const attributeIconUrl = computed(() => {
  const attrMap = {
    '暗': 'dark', '光': 'light', '地': 'earth',
    '水': 'water', '火': 'fire', '风': 'wind', '神': 'divine'
  }
  const attr = attrMap[props.card.attribute] || 'dark'
  return `/img/attribute/${attr}.png`
})

// 卡图URL（支持CDN和本地）
const cardImageUrl = computed(() => {
  const img = props.card.image
  if (!img) return ''
  if (img.startsWith('http')) return img
  return `/img/${img}`
})

// 链接箭头位置
const linkArrows = computed(() => {
  const arrows = props.card.linkArrows || []
  return arrows.length > 0 ? arrows : ['top', 'bottom-left', 'bottom-right']
})

// 根据卡片类型返回样式类
const cardStyleClass = computed(() => {
  const type = props.card.type
  const monsterType = props.card.monsterType

  if (type === 'spell') return 'card-spell'
  if (type === 'trap') return 'card-trap'

  if (type === 'monster') {
    switch (monsterType) {
      case '链接': return 'card-link'
      case '超量': return 'card-xyz'
      case '同调': return 'card-synchro'
      case '融合': return 'card-fusion'
      case '仪式': return 'card-ritual'
      case '灵摆': return 'card-pendulum'
      case '效果': return 'card-effect'
      case '通常': return 'card-normal'
      default: return 'card-effect'
    }
  }
  return 'card-normal'
})

const cardTypeText = computed(() => {
  if (props.card.type === 'monster') {
    const parts = []
    if (props.card.race) parts.push(props.card.race)
    if (props.card.monsterType) parts.push(props.card.monsterType)
    return parts.join(' / ') || '怪兽'
  } else if (props.card.type === 'spell') {
    return props.card.spellType ? `魔法卡 ${props.card.spellType}` : '魔法卡'
  } else if (props.card.type === 'trap') {
    return props.card.trapType ? `陷阱卡 ${props.card.trapType}` : '陷阱卡'
  }
  return ''
})

const truncatedEffect = computed(() => {
  const effect = props.card.effect || ''
  return effect.length > 60 ? effect.slice(0, 60) + '...' : effect
})

function handleImageError(e) {
  e.target.style.display = 'none'
}
</script>

<style scoped>
/* ============ 游戏王卡牌样式 ============ */
.card-item {
  position: relative;
  cursor: pointer;
  transition: transform 0.4s ease, z-index 0s 0.4s;
}

.card-item:hover {
  transform: translateY(-10px) scale(1.03);
  z-index: 10;
  transition: transform 0.4s ease, z-index 0s;
}

.yugioh-card {
  position: relative;
  width: 100%;
  aspect-ratio: 0.686;
  border-radius: 8px;
  overflow: hidden;
}

/* 卡牌外边框 */
.card-border {
  position: absolute;
  inset: 0;
  padding: 6px;
  border-radius: 8px;
  background: linear-gradient(145deg, #c9a227 0%, #8b7355 100%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  transition: box-shadow 0.3s ease;
}

.card-item:hover .card-border {
  box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4), 0 0 20px rgba(212, 175, 55, 0.2);
}

/* 卡牌内容区域 */
.card-content {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 卡名行 */
.card-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 100%);
  border-bottom: 1px solid rgba(0,0,0,0.2);
}

.card-name {
  font-family: 'Noto Sans SC', 'SimHei', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 30px);
  text-shadow: 0 1px 0 rgba(255,255,255,0.3);
}

.card-attribute {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.attr-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
}

.spell-attr, .trap-attr {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
}

.spell-icon {
  color: #1a5c1a;
  font-size: 1rem;
}

.trap-icon {
  color: #8b008b;
  font-size: 0.9rem;
}

/* 星级行 */
.card-level-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 2px 6px;
  min-height: 16px;
  gap: 1px;
}

.card-level-row.rank-row {
  justify-content: flex-start;
}

.level-star, .rank-star {
  color: #ffd700;
  font-size: 0.65rem;
  text-shadow: 0 0 3px rgba(255, 215, 0, 0.8), 0 1px 1px rgba(0,0,0,0.5);
  line-height: 1;
}

/* 卡图区域 */
.card-artwork-frame {
  position: relative;
  flex: 1;
  margin: 4px 6px;
  border: 2px solid #8b7355;
  background: #0a0a0f;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
  overflow: hidden;
}

.card-artwork {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-artwork img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2a2a3a 0%, #1a1a25 100%);
  font-size: 2.5rem;
  font-family: 'Cinzel', serif;
  color: #d4af37;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
}

/* 链接箭头 */
.link-arrows {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.link-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;
}

.link-arrow.arrow-top {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: #ff0000;
  border-top: none;
}

.link-arrow.arrow-bottom {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  border-top-color: #ff0000;
  border-bottom: none;
}

.link-arrow.arrow-left {
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: #ff0000;
  border-left: none;
}

.link-arrow.arrow-right {
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: #ff0000;
  border-right: none;
}

.link-arrow.arrow-top-left {
  top: 4px;
  left: 4px;
  border-bottom-color: #ff0000;
  border-right-color: #ff0000;
  border-top: none;
  border-left: none;
}

.link-arrow.arrow-top-right {
  top: 4px;
  right: 4px;
  border-bottom-color: #ff0000;
  border-left-color: #ff0000;
  border-top: none;
  border-right: none;
}

.link-arrow.arrow-bottom-left {
  bottom: 4px;
  left: 4px;
  border-top-color: #ff0000;
  border-right-color: #ff0000;
  border-bottom: none;
  border-left: none;
}

.link-arrow.arrow-bottom-right {
  bottom: 4px;
  right: 4px;
  border-top-color: #ff0000;
  border-left-color: #ff0000;
  border-bottom: none;
  border-right: none;
}

/* 卡牌类型行 */
.card-type-row {
  padding: 3px 6px;
  background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%);
}

.card-type-text {
  font-family: 'Noto Sans SC', 'SimHei', sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  color: #1a1a1a;
}

/* 效果描述区域 */
.card-desc-box {
  flex: 0 0 auto;
  min-height: 45px;
  max-height: 55px;
  padding: 4px 6px;
  background: linear-gradient(180deg, #f5f0e1 0%, #e8e0c8 100%);
  border-top: 1px solid rgba(0,0,0,0.1);
  overflow: hidden;
}

.card-desc {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 0.5rem;
  line-height: 1.3;
  color: #1a1a1a;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 攻防行 */
.card-stats-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 6px;
  background: linear-gradient(180deg, #e8e0c8 0%, #d4c8a8 100%);
  border-top: 1px solid rgba(0,0,0,0.1);
}

.card-stats-row.spell-trap-row {
  justify-content: flex-start;
}

.card-id-text {
  font-family: 'Courier New', monospace;
  font-size: 0.45rem;
  color: #666;
}

.stats-right {
  display: flex;
  gap: 8px;
}

.stat-atk, .stat-def, .stat-link {
  font-family: 'Arial', sans-serif;
  font-size: 0.55rem;
  font-weight: 700;
  color: #1a1a1a;
}

/* 稀有度标识 */
.rarity-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  padding: 2px 6px;
  font-family: 'Arial', sans-serif;
  font-size: 0.55rem;
  font-weight: 700;
  border-radius: 2px;
  z-index: 10;
  background: rgba(0,0,0,0.6);
  color: #fff;
}

/* 稀有度样式 */
.rarity-n .rarity-badge {
  background: rgba(100, 100, 100, 0.8);
  color: #ddd;
}

.rarity-r .rarity-badge {
  background: rgba(30, 90, 150, 0.9);
  color: #7ec8ff;
}

.rarity-sr .rarity-badge {
  background: rgba(120, 60, 180, 0.9);
  color: #d4a5ff;
}

.rarity-ur .rarity-badge {
  background: linear-gradient(135deg, rgba(255,200,0,0.95), rgba(255,150,0,0.95));
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  animation: ur-glow 2s ease-in-out infinite;
}

@keyframes ur-glow {
  0%, 100% { box-shadow: 0 0 5px rgba(255,215,0,0.5); }
  50% { box-shadow: 0 0 15px rgba(255,215,0,0.8), 0 0 25px rgba(255,165,0,0.4); }
}

/* 拥有数量 */
.owned-count {
  position: absolute;
  bottom: 4px;
  right: 4px;
  padding: 2px 8px;
  background: rgba(212, 175, 55, 0.95);
  color: #000;
  font-family: 'Arial', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 3px;
  z-index: 10;
}

/* ============ 卡片类型样式 ============ */

/* 通常怪兽 - 黄褐色 */
.card-normal .card-border {
  background: linear-gradient(145deg, #d4a84b 0%, #c9a227 50%, #a08030 100%);
}
.card-normal .card-content {
  background: linear-gradient(180deg, #f5deb3 0%, #e8d4a0 30%, #dcc890 100%);
}
.card-normal .card-artwork-frame {
  border-color: #b8960b;
}

/* 效果怪兽 - 橙色 */
.card-effect .card-border {
  background: linear-gradient(145deg, #d97b3d 0%, #c96a2d 50%, #a85520 100%);
}
.card-effect .card-content {
  background: linear-gradient(180deg, #f4a460 0%, #e89050 30%, #d87840 100%);
}
.card-effect .card-artwork-frame {
  border-color: #a85520;
}

/* 魔法卡 - 青绿色 */
.card-spell .card-border {
  background: linear-gradient(145deg, #1e8b6e 0%, #0d7a5c 50%, #006048 100%);
}
.card-spell .card-content {
  background: linear-gradient(180deg, #1e9b7e 0%, #0d8a6c 30%, #007858 100%);
}
.card-spell .card-name,
.card-spell .card-type-text {
  color: #f0f0f0;
}
.card-spell .card-desc-box {
  background: linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 100%);
}
.card-spell .card-stats-row {
  background: linear-gradient(180deg, #c8e6c9 0%, #a5d6a7 100%);
}
.card-spell .card-artwork-frame {
  border-color: #004d40;
}

/* 陷阱卡 - 粉紫色 */
.card-trap .card-border {
  background: linear-gradient(145deg, #b8508a 0%, #a04078 50%, #803060 100%);
}
.card-trap .card-content {
  background: linear-gradient(180deg, #c86098 0%, #b05088 30%, #984078 100%);
}
.card-trap .card-name,
.card-trap .card-type-text {
  color: #f0f0f0;
}
.card-trap .card-desc-box {
  background: linear-gradient(180deg, #fce4ec 0%, #f8bbd9 100%);
}
.card-trap .card-stats-row {
  background: linear-gradient(180deg, #f8bbd9 0%, #f48fb1 100%);
}
.card-trap .card-artwork-frame {
  border-color: #6a1b4d;
}

/* 仪式怪兽 - 蓝色 */
.card-ritual .card-border {
  background: linear-gradient(145deg, #4a7dc4 0%, #3a6db4 50%, #2a5d9a 100%);
}
.card-ritual .card-content {
  background: linear-gradient(180deg, #6a9dd4 0%, #5a8dc4 30%, #4a7db4 100%);
}
.card-ritual .card-name {
  color: #f0f0f0;
}
.card-ritual .card-artwork-frame {
  border-color: #1a4d8a;
}
.card-ritual .card-desc-box {
  background: linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%);
}
.card-ritual .card-stats-row {
  background: linear-gradient(180deg, #bbdefb 0%, #90caf9 100%);
}

/* 融合怪兽 - 紫色 */
.card-fusion .card-border {
  background: linear-gradient(145deg, #9060b0 0%, #8050a0 50%, #604080 100%);
}
.card-fusion .card-content {
  background: linear-gradient(180deg, #a070c0 0%, #9060b0 30%, #8050a0 100%);
}
.card-fusion .card-name {
  color: #f0f0f0;
}
.card-fusion .card-artwork-frame {
  border-color: #4a2070;
}
.card-fusion .card-desc-box {
  background: linear-gradient(180deg, #f3e5f5 0%, #e1bee7 100%);
}
.card-fusion .card-stats-row {
  background: linear-gradient(180deg, #e1bee7 0%, #ce93d8 100%);
}

/* 同调怪兽 - 白色 */
.card-synchro .card-border {
  background: linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 50%, #c8c8c8 100%);
}
.card-synchro .card-content {
  background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 30%, #ebebeb 100%);
}
.card-synchro .card-artwork-frame {
  border-color: #a0a0a0;
}
.card-synchro .card-desc-box {
  background: linear-gradient(180deg, #fafafa 0%, #f0f0f0 100%);
}
.card-synchro .card-stats-row {
  background: linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%);
}

/* 超量怪兽 - 黑色 */
.card-xyz .card-border {
  background: linear-gradient(145deg, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%);
}
.card-xyz .card-content {
  background: linear-gradient(180deg, #2a2a2a 0%, #202020 30%, #181818 100%);
}
.card-xyz .card-name,
.card-xyz .card-type-text {
  color: #f0f0f0;
  text-shadow: none;
}
.card-xyz .card-artwork-frame {
  border-color: #4a4a4a;
}
.card-xyz .card-desc-box {
  background: linear-gradient(180deg, #303030 0%, #282828 100%);
}
.card-xyz .card-desc {
  color: #d0d0d0;
}
.card-xyz .card-stats-row {
  background: linear-gradient(180deg, #282828 0%, #202020 100%);
}
.card-xyz .stat-atk,
.card-xyz .stat-def,
.card-xyz .card-id-text {
  color: #d0d0d0;
}
.card-xyz .rank-star {
  color: #ffd700;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.8);
}

/* 灵摆怪兽 - 上半橙色下半绿色渐变 */
.card-pendulum .card-border {
  background: linear-gradient(180deg, #d97b3d 0%, #c96a2d 40%, #1e8b6e 60%, #0d7a5c 100%);
}
.card-pendulum .card-content {
  background: linear-gradient(180deg, #f4a460 0%, #e89050 35%, #1e9b7e 65%, #0d8a6c 100%);
}
.card-pendulum .card-artwork-frame {
  border-color: #8b6914;
}
.card-pendulum .card-desc-box {
  background: linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 100%);
}
.card-pendulum .card-stats-row {
  background: linear-gradient(180deg, #c8e6c9 0%, #a5d6a7 100%);
}

/* 链接怪兽 - 深蓝色 */
.card-link .card-border {
  background: linear-gradient(145deg, #2060a0 0%, #1050a0 50%, #004080 100%);
}
.card-link .card-content {
  background: linear-gradient(180deg, #1868b0 0%, #1058a0 30%, #004890 100%);
}
.card-link .card-name,
.card-link .card-type-text {
  color: #f0f0f0;
}
.card-link .card-artwork-frame {
  border-color: #003060;
}
.card-link .card-desc-box {
  background: linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%);
}
.card-link .card-stats-row {
  background: linear-gradient(180deg, #bbdefb 0%, #90caf9 100%);
}
.card-link .stat-link {
  color: #0066cc;
  font-weight: 800;
}

/* 稀有度边框效果 */
.rarity-ur .card-border {
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5), inset 0 0 5px rgba(255, 215, 0, 0.3);
}

.rarity-sr .card-border {
  box-shadow: 0 0 10px rgba(147, 112, 219, 0.4);
}

/* 悬停光效 */
.card-item:hover .card-artwork::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  animation: shine 0.6s ease forwards;
}

@keyframes shine {
  to { left: 150%; }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
</style>
