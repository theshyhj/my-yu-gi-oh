<template>
  <div class="admin-cards-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">卡牌管理</h1>
        <router-link to="/admin/cards/new" class="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          添加卡牌
        </router-link>
      </div>

      <div class="filter-bar">
        <div class="input-wrap" style="flex:1;max-width:300px">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input v-model="searchQuery" type="text" class="input-field input-with-icon" placeholder="搜索卡牌..." />
        </div>
        <select v-model="filterType" class="select-field" style="max-width:180px">
          <option value="">全部类型</option>
          <option value="monster">怪兽卡</option>
          <option value="spell">魔法卡</option>
          <option value="trap">陷阱卡</option>
        </select>
      </div>

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

      <div v-if="filteredCards.length === 0" class="empty-state"><p>暂无卡牌数据</p></div>
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
.admin-cards-page { padding: 40px 0 80px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.page-header .page-title { margin-bottom: 0; }
.page-header .page-title::after { display: none; }

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

.card-table {
  background: var(--color-bg-glass);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.table-header, .table-row {
  display: grid;
  grid-template-columns: 80px 60px 1fr 90px 90px 140px;
  align-items: center;
  padding: 14px 20px;
  gap: 14px;
}

.table-header {
  background: rgba(0,0,0,0.2);
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.table-row {
  border-top: 1px solid rgba(255,255,255,0.04);
  transition: background 0.2s ease;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.table-row:hover {
  background: rgba(212,175,55,0.04);
}

.card-thumb {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
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
  font-size: 0.9rem;
}

.col-name {
  color: var(--color-text-primary);
  font-weight: 500;
}

.col-rarity {
  font-family: var(--font-tech);
  font-weight: 600;
  font-size: 0.85rem;
}

.rarity-ur { color: var(--color-gold-light); }
.rarity-sr { color: var(--color-purple-light); }
.rarity-r { color: var(--color-blue-light); }
.rarity-n { color: #999; }

.col-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 5px 12px;
  font-size: 0.82rem;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  font-weight: 500;
}

.action-btn.edit {
  background: rgba(16,185,129,0.1);
  color: var(--color-success);
  border: 1px solid rgba(16,185,129,0.15);
}

.action-btn.edit:hover {
  background: rgba(16,185,129,0.2);
  border-color: rgba(16,185,129,0.3);
}

.action-btn.delete {
  background: rgba(239,68,68,0.1);
  color: var(--color-danger);
  border: 1px solid rgba(239,68,68,0.15);
}

.action-btn.delete:hover {
  background: rgba(239,68,68,0.2);
  border-color: rgba(239,68,68,0.3);
}

@media (max-width: 768px) {
  .table-header, .table-row {
    grid-template-columns: 60px 50px 1fr 70px 60px 100px;
    padding: 10px 12px;
    gap: 8px;
    font-size: 0.8rem;
  }
}
</style>