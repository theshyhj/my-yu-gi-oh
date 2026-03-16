<template>
  <div class="deck-list-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">卡组管理</h1>
        <button @click="createDeck" class="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          新建卡组
        </button>
      </div>

      <div v-if="loading" class="loading-state"><div class="loading-spinner"></div><p>加载中...</p></div>

      <div v-else-if="decks.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48" style="opacity:0.4"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
        <p>还没有创建任何卡组</p>
        <button @click="createDeck" class="btn btn-primary mt-3">创建第一个卡组</button>
      </div>

      <div v-else class="deck-grid">
        <div v-for="deck in decks" :key="deck._id" class="deck-card" @click="editDeck(deck._id)">
          <div class="deck-preview">
            <div class="deck-cards-preview">
              <img v-for="(cardId, i) in getDeckPreviewCards(deck)" :key="i" :src="getCardImageUrl(cardId)" class="preview-card-img" alt="卡牌" />
              <div v-if="getDeckPreviewCards(deck).length === 0" class="preview-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" width="40" height="40" style="opacity:0.3"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              </div>
            </div>
          </div>
          <div class="deck-info">
            <h3 class="deck-name">{{ deck.name }}</h3>
            <div class="deck-stats">
              <span class="deck-stat">主 {{ deck.mainDeck?.length || 0 }}</span>
              <span class="deck-stat">额外 {{ deck.extraDeck?.length || 0 }}</span>
              <span class="deck-stat">副 {{ deck.sideDeck?.length || 0 }}</span>
            </div>
          </div>
          <button class="deck-delete" @click.stop="deleteDeck(deck._id)" aria-label="删除卡组">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
  return [...(deck.mainDeck || []), ...(deck.extraDeck || [])].slice(0, 3)
}

async function createDeck() {
  try {
    const res = await api.post('/decks', { name: '新卡组' })
    router.push(`/decks/${res.data._id}`)
  } catch (e) {
    alert('创建卡组失败: ' + (e.response?.data?.message || e.message))
  }
}

function editDeck(id) { router.push(`/decks/${id}`) }

async function deleteDeck(id) {
  if (!confirm('确定要删除这个卡组吗？')) return
  try {
    await api.delete(`/decks/${id}`)
    decks.value = decks.value.filter(d => d._id !== id)
  } catch (e) {
    alert('删除失败: ' + (e.response?.data?.message || e.message))
  }
}

onMounted(async () => {
  await cardStore.fetchCards()
  await fetchDecks()
})
</script>

<style scoped>
.deck-list-page { padding: 40px 0 80px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 36px;
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
  gap: 20px;
}

.deck-card {
  position: relative;
  background: var(--color-bg-glass);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.35s var(--ease-out-expo);
}

.deck-card:hover {
  border-color: rgba(212,175,55,0.2);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-6px);
}

.deck-preview {
  height: 130px;
  background: linear-gradient(135deg, rgba(14,14,22,0.6), rgba(6,6,12,0.8));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.deck-cards-preview {
  display: flex;
  gap: 8px;
  align-items: center;
}

.preview-card-img {
  width: 56px;
  height: 82px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(212,175,55,0.2);
  box-shadow: var(--shadow-sm);
  transition: transform 0.25s var(--ease-out-expo);
}

.deck-card:hover .preview-card-img {
  transform: translateY(-4px);
}

.preview-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

.deck-info {
  padding: 18px 20px;
}

.deck-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.deck-stats {
  display: flex;
  gap: 14px;
}

.deck-stat {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-family: var(--font-tech);
}

.deck-delete {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.15);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--color-text-muted);
  opacity: 0;
  transition: all 0.25s ease;
}

.deck-card:hover .deck-delete {
  opacity: 1;
}

.deck-delete:hover {
  background: rgba(239,68,68,0.2);
  border-color: rgba(239,68,68,0.3);
  color: var(--color-danger);
}
</style>