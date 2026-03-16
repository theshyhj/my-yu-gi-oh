<template>
  <div class="collection-page">
    <div class="container">
      <h1 class="page-title">我的收藏</h1>

      <!-- 统计 -->
      <div class="collection-stats">
        <div class="stat-item" v-for="s in stats" :key="s.label">
          <span class="stat-value">{{ s.value }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>

      <!-- 筛选 -->
      <div class="filter-bar">
        <div class="input-wrap" style="flex:1;max-width:300px">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input v-model="searchQuery" type="text" class="input-field input-with-icon" placeholder="搜索卡牌..." />
        </div>
        <select v-model="filterRarity" class="select-field" style="max-width:180px">
          <option value="">全部稀有度</option>
          <option value="UR">UR</option>
          <option value="SR">SR</option>
          <option value="R">R</option>
          <option value="N">N</option>
        </select>
      </div>

      <!-- 列表 -->
      <div v-if="loading" class="loading-state"><div class="loading-spinner"></div><p>加载中...</p></div>

      <div v-else-if="filteredCollection.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48" style="opacity:0.4"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <p>还没有收藏任何卡牌</p>
        <router-link to="/gacha" class="btn btn-primary mt-3">去抽卡</router-link>
      </div>

      <div v-else class="card-grid">
        <div v-for="item in filteredCollection" :key="item.cardId" class="card-wrapper" @click="openDetail(item.card, item.count)">
          <img v-if="item.card.image" :src="getCardImageUrl(item.card.image)" :alt="item.card.name" class="card-image" @error="handleImageError" />
          <div v-else class="card-placeholder"><span>{{ item.card.name?.charAt(0) }}</span></div>
          <div class="card-count-badge">x{{ item.count }}</div>
        </div>
      </div>
    </div>

    <CardDetail :visible="showDetail" :card="selectedCard" :show-owned="true" :owned-count="selectedCount" @close="showDetail = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCollectionStore } from '../stores/collection'
import { useCardStore } from '../stores/cards'
import CardDetail from '../components/CardDetail.vue'

const collectionStore = useCollectionStore()
const cardStore = useCardStore()
const searchQuery = ref('')
const filterRarity = ref('')
const showDetail = ref(false)
const selectedCard = ref({})
const selectedCount = ref(0)

const loading = computed(() => collectionStore.loading)

const collectionWithCards = computed(() => {
  return collectionStore.collection.map(item => ({
    ...item,
    card: cardStore.getCardById(item.cardId) || {}
  })).filter(item => item.card.id)
})

const filteredCollection = computed(() => {
  return collectionWithCards.value.filter(item => {
    if (searchQuery.value && !item.card.name?.includes(searchQuery.value)) return false
    if (filterRarity.value && item.card.rarity !== filterRarity.value) return false
    return true
  })
})

const totalCards = computed(() => collectionStore.collection.reduce((sum, item) => sum + item.count, 0))
const uniqueCards = computed(() => collectionStore.collection.length)
const urCount = computed(() => collectionWithCards.value.filter(i => i.card.rarity === 'UR').length)
const srCount = computed(() => collectionWithCards.value.filter(i => i.card.rarity === 'SR').length)

const stats = computed(() => [
  { value: totalCards.value, label: '总卡牌数' },
  { value: uniqueCards.value, label: '不同卡牌' },
  { value: urCount.value, label: 'UR卡牌' },
  { value: srCount.value, label: 'SR卡牌' }
])

function getCardImageUrl(image) {
  if (!image) return ''
  if (image.startsWith('http')) return image
  return `/img/${image}`
}
function handleImageError(e) { e.target.style.display = 'none' }
function openDetail(card, count) {
  selectedCard.value = card
  selectedCount.value = count
  showDetail.value = true
}

onMounted(async () => {
  await cardStore.fetchCards()
  await collectionStore.fetchCollection()
})
</script>

<style scoped>
.collection-page { padding: 40px 0 80px; }

.collection-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-item {
  padding: 24px 16px;
  background: var(--color-bg-glass);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: all 0.3s var(--ease-out-expo);
}

.stat-item:hover {
  border-color: rgba(212,175,55,0.15);
  transform: translateY(-4px);
}

.stat-value {
  display: block;
  font-family: var(--font-tech);
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-gold);
  margin-bottom: 6px;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.input-wrap { position: relative; }
.input-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: var(--color-text-muted); pointer-events: none;
}
.input-with-icon { padding-left: 44px; }

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
}

.card-wrapper {
  position: relative;
  cursor: pointer;
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: transform 0.35s var(--ease-out-expo), box-shadow 0.35s ease;
  background: var(--color-bg-card);
}

.card-wrapper:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: var(--shadow-card-hover);
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
  background: linear-gradient(135deg, #1a1a2e 0%, #0d0d16 100%);
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--color-gold);
}

.card-count-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 3px 10px;
  background: var(--gradient-gold);
  color: #0a0a0f;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: var(--radius-sm);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

@media (max-width: 768px) {
  .collection-stats { grid-template-columns: repeat(2, 1fr); }
  .filter-bar { flex-direction: column; }
}
</style>
