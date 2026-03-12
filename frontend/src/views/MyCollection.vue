<template>
  <div class="collection-page">
    <div class="container">
      <h1 class="page-title">我的收藏</h1>

      <!-- 统计信息 -->
      <div class="collection-stats">
        <div class="stat-item">
          <span class="stat-value">{{ totalCards }}</span>
          <span class="stat-label">总卡牌数</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ uniqueCards }}</span>
          <span class="stat-label">不同卡牌</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ urCount }}</span>
          <span class="stat-label">UR卡牌</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ srCount }}</span>
          <span class="stat-label">SR卡牌</span>
        </div>
      </div>

      <!-- 筛选 -->
      <div class="filter-bar">
        <input v-model="searchQuery" type="text" class="input-field search-input" placeholder="搜索卡牌..." />
        <select v-model="filterRarity" class="select-field">
          <option value="">全部稀有度</option>
          <option value="UR">UR</option>
          <option value="SR">SR</option>
          <option value="R">R</option>
          <option value="N">N</option>
        </select>
      </div>

      <!-- 卡牌列表 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="filteredCollection.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>还没有收藏任何卡牌</p>
        <router-link to="/gacha" class="btn btn-primary mt-3">去抽卡</router-link>
      </div>

      <div v-else class="card-grid">
        <div
          v-for="item in filteredCollection"
          :key="item.cardId"
          class="card-wrapper"
          @click="openDetail(item.card, item.count)"
        >
          <img
            v-if="item.card.image"
            :src="getCardImageUrl(item.card.image)"
            :alt="item.card.name"
            class="card-image"
            @error="handleImageError"
          />
          <div v-else class="card-placeholder">
            <span>{{ item.card.name?.charAt(0) }}</span>
          </div>
          <div class="card-count">×{{ item.count }}</div>
        </div>
      </div>
    </div>

    <CardDetail
      :visible="showDetail"
      :card="selectedCard"
      :show-owned="true"
      :owned-count="selectedCount"
      @close="showDetail = false"
    />
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

function getCardImageUrl(image) {
  if (!image) return ''
  if (image.startsWith('http')) return image
  return `/img/${image}`
}

function handleImageError(e) {
  e.target.style.display = 'none'
}

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
.collection-page {
  padding: 40px 0 80px;
}

.collection-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-item {
  padding: 24px;
  background: rgba(20, 20, 30, 0.6);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  text-align: center;
}

.stat-value {
  display: block;
  font-family: 'Orbitron', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-gold);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.filter-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input {
  flex: 1;
  max-width: 300px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.card-wrapper {
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: rgba(20, 20, 30, 0.4);
}

.card-wrapper:hover {
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

.card-count {
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 4px 12px;
  background: rgba(212, 175, 55, 0.95);
  color: #000;
  font-family: 'Arial', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  color: var(--color-text-secondary);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(212,175,55,0.2);
  border-top-color: var(--color-gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .collection-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
