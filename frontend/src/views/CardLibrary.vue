<template>
  <div class="card-library-page">
    <div class="container">
      <h1 class="page-title">卡牌图鉴</h1>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-group">
          <input v-model="searchQuery" type="text" class="input-field search-input" placeholder="搜索卡牌名称..." />
        </div>
        <div class="filter-group">
          <select v-model="filterType" class="select-field">
            <option value="">全部类型</option>
            <option value="monster">怪兽卡</option>
            <option value="spell">魔法卡</option>
            <option value="trap">陷阱卡</option>
          </select>
        </div>
        <div class="filter-group">
          <select v-model="filterAttribute" class="select-field">
            <option value="">全部属性</option>
            <option value="暗">暗</option>
            <option value="光">光</option>
            <option value="地">地</option>
            <option value="水">水</option>
            <option value="火">火</option>
            <option value="风">风</option>
          </select>
        </div>
        <div class="filter-group">
          <select v-model="filterRarity" class="select-field">
            <option value="">全部稀有度</option>
            <option value="N">N - 普通</option>
            <option value="R">R - 稀有</option>
            <option value="SR">SR - 超稀有</option>
            <option value="UR">UR - 极稀有</option>
          </select>
        </div>
      </div>

      <!-- 统计信息和分页控制 -->
      <div class="stats-bar">
        <span class="stats-text">共 {{ filteredCards.length }} 张卡牌</span>
        <div class="pagination-info">
          第 {{ currentPage }} / {{ totalPages }} 页
        </div>
      </div>

      <!-- 卡牌网格 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="filteredCards.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>没有找到符合条件的卡牌</p>
      </div>

      <div v-else class="card-grid">
        <div
          v-for="card in paginatedCards"
          :key="card.id"
          class="card-wrapper"
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
          <div class="card-info">
            <div class="card-name">{{ card.name }}</div>
            <div class="card-rarity">{{ card.rarity }}</div>
          </div>
        </div>
      </div>

      <!-- 分页控制 -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="currentPage = 1"
        >
          首页
        </button>
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          上一页
        </button>
        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            class="page-btn"
            :class="{ active: page === currentPage }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </div>
        <button
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          下一页
        </button>
        <button
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage = totalPages"
        >
          末页
        </button>
      </div>
    </div>

    <!-- 卡牌详情弹窗 -->
    <CardDetail
      :visible="showDetail"
      :card="selectedCard"
      @close="showDetail = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCardStore } from '../stores/cards'
import CardDetail from '../components/CardDetail.vue'

const cardStore = useCardStore()

const searchQuery = ref('')
const filterType = ref('')
const filterAttribute = ref('')
const filterRarity = ref('')
const showDetail = ref(false)
const selectedCard = ref({})
const currentPage = ref(1)
const pageSize = 50

const loading = computed(() => cardStore.loading)

const filteredCards = computed(() => {
  return cardStore.cards.filter(card => {
    if (searchQuery.value && !card.name.includes(searchQuery.value)) return false
    if (filterType.value && card.type !== filterType.value) return false
    if (filterAttribute.value && card.attribute !== filterAttribute.value) return false
    if (filterRarity.value && card.rarity !== filterRarity.value) return false
    return true
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredCards.value.length / pageSize)
})

const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredCards.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

watch([searchQuery, filterType, filterAttribute, filterRarity], () => {
  currentPage.value = 1
})

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

onMounted(() => {
  cardStore.fetchCards()
})
</script>

<style scoped>
.card-library-page {
  padding: 40px 0 80px;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  padding: 24px;
  background: rgba(20, 20, 30, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.05);
}

.filter-group {
  flex: 1;
  min-width: 180px;
}

.search-input {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23606070' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 14px center;
  padding-left: 48px;
}

.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.stats-text {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.pagination-info {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
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

.card-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-wrapper:hover .card-info {
  opacity: 1;
}

.card-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}

.card-rarity {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(212, 175, 55, 0.9);
  color: #000;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-btn {
  padding: 8px 16px;
  background: rgba(20, 20, 30, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.page-btn:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.2);
  border-color: var(--color-gold);
  color: var(--color-gold);
}

.page-btn.active {
  background: var(--color-gold);
  border-color: var(--color-gold);
  color: #000;
  font-weight: 600;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--color-text-secondary);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(212, 175, 55, 0.2);
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
</style>
