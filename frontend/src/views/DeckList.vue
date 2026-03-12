<template>
  <div class="deck-list-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">卡组管理</h1>
        <button @click="createDeck" class="btn btn-primary">
          <span>+</span> 新建卡组
        </button>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="decks.length === 0" class="empty-state">
        <div class="empty-icon">🃏</div>
        <p>还没有创建任何卡组</p>
        <button @click="createDeck" class="btn btn-primary mt-3">创建第一个卡组</button>
      </div>

      <div v-else class="deck-grid">
        <div v-for="deck in decks" :key="deck._id" class="deck-card" @click="editDeck(deck._id)">
          <div class="deck-preview">
            <div class="deck-cards-preview">
              <img
                v-for="(cardId, i) in getDeckPreviewCards(deck)"
                :key="i"
                :src="getCardImageUrl(cardId)"
                class="preview-card-img"
                alt="卡牌"
              />
              <div v-if="getDeckPreviewCards(deck).length === 0" class="preview-empty">
                <span>🃏</span>
              </div>
            </div>
          </div>
          <div class="deck-info">
            <h3 class="deck-name">{{ deck.name }}</h3>
            <div class="deck-stats">
              <span>主卡组: {{ deck.mainDeck?.length || 0 }}</span>
              <span>额外: {{ deck.extraDeck?.length || 0 }}</span>
              <span>副卡组: {{ deck.sideDeck?.length || 0 }}</span>
            </div>
          </div>
          <button class="deck-delete" @click.stop="deleteDeck(deck._id)">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCardStore } from '../stores/cards'
import api from '../api'

const router = useRouter()
const cardStore = useCardStore()
const decks = ref([])
const loading = ref(true)

async function fetchDecks() {
  loading.value = true
  try {
    const res = await api.get('/decks')
    decks.value = res.data
  } finally {
    loading.value = false
  }
}

function getCardImageUrl(cardId) {
  const card = cardStore.getCardById(cardId)
  if (!card || !card.image) return ''
  if (card.image.startsWith('http')) return card.image
  return `/img/${card.image}`
}

function getDeckPreviewCards(deck) {
  const allCards = [...(deck.mainDeck || []), ...(deck.extraDeck || [])]
  return allCards.slice(0, 3)
}

async function createDeck() {
  try {
    const res = await api.post('/decks', { name: '新卡组' })
    router.push(`/decks/${res.data._id}`)
  } catch (e) {
    console.error('创建卡组失败:', e)
    alert('创建卡组失败: ' + (e.response?.data?.message || e.message))
  }
}

function editDeck(id) {
  router.push(`/decks/${id}`)
}

async function deleteDeck(id) {
  if (!confirm('确定要删除这个卡组吗？')) return
  try {
    await api.delete(`/decks/${id}`)
    decks.value = decks.value.filter(d => d._id !== id)
  } catch (e) {
    console.error('删除卡组失败:', e)
    alert('删除失败: ' + (e.response?.data?.message || e.message))
  }
}

onMounted(async () => {
  await cardStore.fetchCards()
  await fetchDecks()
})
</script>

<style scoped>
.deck-list-page {
  padding: 40px 0 80px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.page-header .page-title {
  margin-bottom: 0;
}

.page-header .page-title::after {
  display: none;
}

.deck-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.deck-card {
  position: relative;
  background: linear-gradient(145deg, #1a1a25 0%, #12121a 100%);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.deck-card:hover {
  border-color: var(--color-gold);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3), 0 0 20px rgba(212,175,55,0.1);
  transform: translateY(-5px);
}

.deck-preview {
  height: 140px;
  background: linear-gradient(135deg, rgba(20, 20, 30, 0.8), rgba(10, 10, 15, 0.9));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.deck-cards-preview {
  display: flex;
  gap: 8px;
  align-items: center;
}

.preview-card-img {
  width: 60px;
  height: 87px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.deck-card:hover .preview-card-img {
  transform: translateY(-5px);
}

.preview-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  opacity: 0.3;
}

.deck-info {
  padding: 20px;
}

.deck-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.deck-stats {
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.deck-delete {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: rgba(255,107,107,0.2);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
}

.deck-card:hover .deck-delete {
  opacity: 1;
}

.deck-delete:hover {
  background: rgba(255,107,107,0.4);
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
</style>
