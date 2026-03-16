<template>
  <div class="deck-edit-page">
    <div class="container">
      <div class="deck-header">
        <router-link to="/decks" class="back-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg>
          返回卡组列表
        </router-link>
        <input v-model="deckName" type="text" class="deck-name-input" placeholder="卡组名称" @blur="saveDeck" />
        <button @click="saveDeck" class="btn btn-primary" :disabled="saving">
          {{ saving ? '保存中...' : '保存' }}
        </button>
      </div>

      <div class="deck-editor">
        <!-- 左侧：卡组区域 -->
        <div class="deck-area">
          <div class="deck-section">
            <h3 class="section-label">
              主卡组
              <span class="count" :class="{ 'invalid': !isMainDeckValid }">{{ mainDeck.length }}/40-60</span>
            </h3>
            <div class="deck-cards">
              <div v-for="(cardId, index) in mainDeck" :key="`main-${index}`" class="deck-card-slot" @click="removeFromDeck('main', index)" :title="getCard(cardId).name">
                <img v-if="getCard(cardId).image" :src="getCardImageUrl(getCard(cardId).image)" :alt="getCard(cardId).name" class="deck-slot-img" />
                <div v-else class="deck-slot-placeholder">{{ getCard(cardId).name?.charAt(0) }}</div>
              </div>
              <div v-if="mainDeck.length === 0" class="empty-slot">点击右侧卡牌添加</div>
            </div>
          </div>

          <div class="deck-section">
            <h3 class="section-label">
              额外卡组
              <span class="count" :class="{ 'invalid': extraDeck.length > 15 }">{{ extraDeck.length }}/15</span>
            </h3>
            <div class="deck-cards extra">
              <div v-for="(cardId, index) in extraDeck" :key="`extra-${index}`" class="deck-card-slot" @click="removeFromDeck('extra', index)" :title="getCard(cardId).name">
                <img v-if="getCard(cardId).image" :src="getCardImageUrl(getCard(cardId).image)" :alt="getCard(cardId).name" class="deck-slot-img" />
                <div v-else class="deck-slot-placeholder">{{ getCard(cardId).name?.charAt(0) }}</div>
              </div>
              <div v-if="extraDeck.length === 0" class="empty-slot small">额外卡组</div>
            </div>
          </div>
        </div>

        <!-- 右侧：卡牌选择 -->
        <div class="card-selector">
          <h3 class="section-label">我的卡牌</h3>
          <input v-model="searchQuery" type="text" class="input-field" placeholder="搜索卡牌..." />
          <div class="selector-cards">
            <div v-for="item in filteredCollection" :key="item.cardId" class="selector-card" :class="{ 'disabled': !canAddCard(item.card) }" @click="addToDeck(item.card)" :title="item.card.name">
              <img v-if="item.card.image" :src="getCardImageUrl(item.card.image)" :alt="item.card.name" class="selector-card-img" />
              <div v-else class="selector-placeholder">{{ item.card.name?.charAt(0) }}</div>
              <span class="card-count">{{ getCardCountInDeck(item.cardId) }}/{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCardStore } from '../stores/cards'
import { useCollectionStore } from '../stores/collection'
import api from '../api'

const route = useRoute()
const cardStore = useCardStore()
const collectionStore = useCollectionStore()

const deckId = route.params.id
const deckName = ref('')
const mainDeck = ref([])
const extraDeck = ref([])
const sideDeck = ref([])
const searchQuery = ref('')
const saving = ref(false)

const isMainDeckValid = computed(() => mainDeck.value.length >= 40 && mainDeck.value.length <= 60)

const filteredCollection = computed(() => {
  return collectionStore.collection
    .map(item => ({ ...item, card: cardStore.getCardById(item.cardId) }))
    .filter(item => item.card && (!searchQuery.value || item.card.name?.includes(searchQuery.value)))
})

function getCard(cardId) { return cardStore.getCardById(cardId) || {} }

function getCardImageUrl(image) {
  if (!image) return ''
  if (image.startsWith('http')) return image
  return `/img/${image}`
}

function getCardCountInDeck(cardId) {
  return [...mainDeck.value, ...extraDeck.value, ...sideDeck.value].filter(id => id === cardId).length
}

function canAddCard(card) {
  if (!card) return false
  const countInDeck = getCardCountInDeck(card.id)
  const owned = collectionStore.getCardCount(card.id)
  return countInDeck < 3 && countInDeck < owned
}

function isExtraCard(card) {
  return ['融合', '同调', '超量', '链接'].includes(card.monsterType)
}

function addToDeck(card) {
  if (!canAddCard(card)) return
  if (isExtraCard(card)) {
    if (extraDeck.value.length < 15) extraDeck.value.push(card.id)
  } else {
    if (mainDeck.value.length < 60) mainDeck.value.push(card.id)
  }
}

function removeFromDeck(type, index) {
  if (type === 'main') mainDeck.value.splice(index, 1)
  else if (type === 'extra') extraDeck.value.splice(index, 1)
}

async function saveDeck() {
  saving.value = true
  try {
    await api.put(`/decks/${deckId}`, {
      name: deckName.value,
      mainDeck: mainDeck.value,
      extraDeck: extraDeck.value,
      sideDeck: sideDeck.value
    })
    alert('保存成功！')
  } catch (e) {
    alert('保存失败: ' + (e.response?.data?.message || e.message))
  } finally {
    saving.value = false
  }
}

async function fetchDeck() {
  try {
    const res = await api.get(`/decks/${deckId}`)
    deckName.value = res.data.name
    mainDeck.value = res.data.mainDeck || []
    extraDeck.value = res.data.extraDeck || []
    sideDeck.value = res.data.sideDeck || []
  } catch (e) {
    alert('加载卡组失败: ' + (e.response?.data?.message || e.message))
  }
}

onMounted(async () => {
  await cardStore.fetchCards()
  await collectionStore.fetchCollection()
  await fetchDeck()
})
</script>

<style scoped>
.deck-edit-page { padding: 20px 0 80px; }

.deck-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-secondary);
  font-size: 0.88rem;
  text-decoration: none;
  transition: color 0.2s ease;
}

.back-link:hover { color: var(--color-gold); }

.deck-name-input {
  flex: 1;
  max-width: 300px;
  padding: 10px 16px;
  font-size: 1.15rem;
  font-weight: 600;
  background: transparent;
  border: none;
  border-bottom: 2px solid rgba(212,175,55,0.2);
  color: var(--color-text-primary);
  outline: none;
  transition: border-color 0.3s ease;
}

.deck-name-input:focus { border-color: var(--color-gold); }

.deck-editor {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
}

.deck-area {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.deck-section {
  background: var(--color-bg-glass);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: var(--radius-lg);
  padding: 18px;
}

.section-label {
  font-size: 0.95rem;
  color: var(--color-text-primary);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.count {
  font-family: var(--font-tech);
  font-size: 0.8rem;
  color: var(--color-gold);
  font-weight: 500;
}

.count.invalid { color: var(--color-danger); }

.deck-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 180px;
}

.deck-cards.extra { min-height: 70px; }

.deck-card-slot {
  width: 48px;
  height: 70px;
  cursor: pointer;
  transition: transform 0.2s var(--ease-out-expo);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(212,175,55,0.2);
}

.deck-card-slot:hover {
  transform: scale(1.12);
  box-shadow: 0 4px 12px rgba(212,175,55,0.3);
  z-index: 10;
}

.deck-slot-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.deck-slot-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e, #0d0d16);
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--color-gold);
}

.empty-slot {
  width: 100%;
  padding: 36px;
  text-align: center;
  color: var(--color-text-muted);
  border: 2px dashed rgba(255,255,255,0.06);
  border-radius: var(--radius-md);
  font-size: 0.88rem;
}

.empty-slot.small { padding: 18px; }

/* 右侧选择器 */
.card-selector {
  background: var(--color-bg-glass);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: var(--radius-lg);
  padding: 18px;
  height: fit-content;
  position: sticky;
  top: 90px;
}

.card-selector .input-field { margin-bottom: 14px; }

.selector-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
  gap: 6px;
  max-height: 560px;
  overflow-y: auto;
  padding: 2px;
}

.selector-card {
  position: relative;
  cursor: pointer;
  transition: all 0.2s var(--ease-out-expo);
  border-radius: 4px;
  overflow: hidden;
}

.selector-card:hover:not(.disabled) {
  transform: scale(1.06);
  box-shadow: 0 4px 12px rgba(212,175,55,0.2);
  z-index: 10;
}

.selector-card.disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.selector-card-img {
  width: 100%;
  aspect-ratio: 0.686;
  object-fit: cover;
  display: block;
}

.selector-placeholder {
  width: 100%;
  aspect-ratio: 0.686;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e, #0d0d16);
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--color-gold);
}

.card-count {
  position: absolute;
  bottom: 3px;
  right: 3px;
  padding: 1px 5px;
  background: rgba(0,0,0,0.85);
  color: var(--color-gold);
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 3px;
  border: 1px solid rgba(212,175,55,0.3);
}

@media (max-width: 900px) {
  .deck-editor { grid-template-columns: 1fr; }
  .card-selector { position: static; }
}
</style>
