<template>
  <div class="card-library-page">
    <div class="container">
      <h1 class="page-title">卡牌图鉴</h1>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-group">
          <div class="input-wrap">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input v-model="searchQuery" type="text" class="input-field input-with-icon" placeholder="搜索卡牌名称..." />
          </div>
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

      <!-- 统计 -->
      <div class="stats-bar">
        <span class="stats-text">共 {{ filteredCards.length }} 张卡牌</span>
        <div class="pagination-info">第 {{ currentPage }} / {{ totalPages }} 页</div>
      </div>

      <!-- 卡牌网格 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="filteredCards.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48" style="opacity:0.4"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        <p>没有找到符合条件的卡牌</p>
      </div>

      <div v-else class="card-grid">
        <div v-for="card in paginatedCards" :key="card.id" class="card-wrapper" @click="openDetail(card)">
          <img v-if="card.image" :src="getCardImageUrl(card.image)" :alt="card.name" class="card-image" @error="handleImageError" />
          <div v-else class="card-placeholder"><span>{{ card.name?.charAt(0) }}</span></div>
          <div class="card-overlay">
            <div class="card-name">{{ card.name }}</div>
            <div class="card-rarity" :class="`badge-${card.rarity?.toLowerCase()}`">{{ card.rarity }}</div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="pagination">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage = 1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
        </button>
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button v-for="page in visiblePages" :key="page" class="page-btn" :class="{ active: page === currentPage }" @click="currentPage = page">{{ page }}</button>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage = totalPages">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
        </button>
      </div>
    </div>

    <CardDetail :visible="showDetail" :card="selectedCard" @close="showDetail = false" />
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

const totalPages = computed(() => Math.ceil(filteredCards.value.length / pageSize))
const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredCards.value.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

watch([searchQuery, filterType, filterAttribute, filterRarity], () => { currentPage.value = 1 })

function getCardImageUrl(image) {
  if (!image) return ''
  if (image.startsWith('http')) return image
  return `/img/${image}`
}
function handleImageError(e) { e.target.style.display = 'none' }
function openDetail(card) { selectedCard.value = card; showDetail.value = true }

onMounted(() => { cardStore.fetchCards() })
</script>

<style scoped>
.card-library-page { padding: 40px 0 80px; }

.filter-bar {
  display: flex; flex-wrap: wrap; gap: 12px;
  margin-bottom: 24px; padding: 20px;
  background: var(--color-bg-glass);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: var(--radius-lg);
}
.filter-group { flex: 1; min-width: 170px; }
.input-wrap { position: relative; }
.input-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: var(--color-text-muted); pointer-events: none;
}
.input-with-icon { padding-left: 44px; }

.stats-bar {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px;
}
.stats-text, .pagination-info {
  color: var(--color-text-muted); font-size: 0.85rem;
}

/* Card Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
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

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 10px 10px;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-wrapper:hover .card-overlay {
  opacity: 1;
}

.card-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 68%;
}

.card-rarity {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.badge-n { background: rgba(150,150,150,0.8); color: #fff; }
.badge-r { background: rgba(59,130,246,0.85); color: #fff; }
.badge-sr { background: rgba(171,71,188,0.85); color: #fff; }
.badge-ur { background: linear-gradient(135deg, #ffd54f, #d4af37); color: #0a0a0f; }

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 40px;
}

.page-btn {
  min-width: 38px;
  height: 38px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-glass);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.25s var(--ease-out-expo);
  font-size: 0.88rem;
}

.page-btn:hover:not(:disabled) {
  background: rgba(212,175,55,0.1);
  border-color: rgba(212,175,55,0.3);
  color: var(--color-gold);
}

.page-btn.active {
  background: var(--gradient-gold);
  border-color: transparent;
  color: #0a0a0f;
  font-weight: 700;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .filter-bar { flex-direction: column; }
  .card-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
}
</style>
