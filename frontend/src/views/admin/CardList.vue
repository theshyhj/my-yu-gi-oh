<template>
  <div class="admin-cards-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">卡牌管理</h1>
        <router-link to="/admin/cards/new" class="btn btn-primary">
          <span>+</span> 添加卡牌
        </router-link>
      </div>

      <!-- 搜索和筛选 -->
      <div class="filter-bar">
        <input v-model="searchQuery" type="text" class="input-field" placeholder="搜索卡牌..." />
        <select v-model="filterType" class="select-field">
          <option value="">全部类型</option>
          <option value="monster">怪兽卡</option>
          <option value="spell">魔法卡</option>
          <option value="trap">陷阱卡</option>
        </select>
      </div>

      <!-- 卡牌列表 -->
      <div class="card-table">
        <div class="table-header">
          <span class="col-id">ID</span>
          <span class="col-image">图片</span>
          <span class="col-name">名称</span>
          <span class="col-type">类型</span>
          <span class="col-rarity">稀有度</span>
          <span class="col-actions">操作</span>
        </div>
        <div v-for="card in filteredCards" :key="card.id" class="table-row">
          <span class="col-id">{{ card.id }}</span>
          <span class="col-image">
            <div class="card-thumb">
              <img v-if="card.image" :src="`/img/${card.image}`" :alt="card.name" />
              <span v-else>{{ card.name?.charAt(0) }}</span>
            </div>
          </span>
          <span class="col-name">{{ card.name }}</span>
          <span class="col-type">{{ typeText(card.type) }}</span>
          <span class="col-rarity" :class="`rarity-${card.rarity?.toLowerCase()}`">{{ card.rarity }}</span>
          <span class="col-actions">
            <router-link :to="`/admin/cards/${card.id}/edit`" class="action-btn edit">编辑</router-link>
            <button @click="deleteCard(card.id)" class="action-btn delete">删除</button>
          </span>
        </div>
      </div>

      <div v-if="filteredCards.length === 0" class="empty-state">
        <p>暂无卡牌数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../api'

const cards = ref([])
const searchQuery = ref('')
const filterType = ref('')

const filteredCards = computed(() => {
  return cards.value.filter(card => {
    if (searchQuery.value && !card.name?.includes(searchQuery.value)) return false
    if (filterType.value && card.type !== filterType.value) return false
    return true
  })
})

function typeText(type) {
  const types = { monster: '怪兽', spell: '魔法', trap: '陷阱' }
  return types[type] || type
}

async function fetchCards() {
  const res = await api.get('/cards')
  cards.value = res.data
}

async function deleteCard(id) {
  if (!confirm('确定要删除这张卡牌吗？')) return
  try {
    await api.delete(`/admin/cards/${id}`)
    cards.value = cards.value.filter(c => c.id !== id)
  } catch (e) {
    alert('删除失败: ' + (e.response?.data?.message || e.message))
  }
}

onMounted(fetchCards)
</script>

<style scoped>
.admin-cards-page {
  padding: 40px 0 80px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header .page-title {
  margin-bottom: 0;
}

.page-header .page-title::after {
  display: none;
}

.filter-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.filter-bar .input-field {
  flex: 1;
  max-width: 300px;
}

.card-table {
  background: rgba(20, 20, 30, 0.6);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  overflow: hidden;
}

.table-header, .table-row {
  display: grid;
  grid-template-columns: 80px 70px 1fr 100px 100px 150px;
  align-items: center;
  padding: 16px 20px;
  gap: 16px;
}

.table-header {
  background: rgba(0,0,0,0.3);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.table-row {
  border-top: 1px solid rgba(255,255,255,0.05);
  transition: background 0.2s ease;
}

.table-row:hover {
  background: rgba(212,175,55,0.05);
}

.card-thumb {
  width: 45px;
  height: 45px;
  border-radius: 4px;
  overflow: hidden;
  background: var(--color-bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-thumb span {
  color: var(--color-gold);
  font-weight: 600;
}

.col-rarity {
  font-family: 'Orbitron', sans-serif;
  font-weight: 600;
}

.rarity-ur { color: #ffd700; }
.rarity-sr { color: #b19cd9; }
.rarity-r { color: #6bb3e0; }
.rarity-n { color: #aaa; }

.col-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.action-btn.edit {
  background: rgba(78,205,196,0.2);
  color: #4ecdc4;
}

.action-btn.edit:hover {
  background: rgba(78,205,196,0.3);
}

.action-btn.delete {
  background: rgba(255,107,107,0.2);
  color: #ff6b6b;
}

.action-btn.delete:hover {
  background: rgba(255,107,107,0.3);
}

.empty-state {
  padding: 60px;
  text-align: center;
  color: var(--color-text-secondary);
}
</style>
