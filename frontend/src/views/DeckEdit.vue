<template>
  <div class="deck-edit-page">
    <div class="container">
      <!-- 头部 -->
      <div class="deck-header">
        <router-link to="/decks" class="back-link">← 返回卡组列表</router-link>
        <input v-model="deckName" type="text" class="deck-name-input" placeholder="卡组名称" @blur="saveDeck" />
        <button @click="saveDeck" class="btn btn-primary" :disabled="saving">
          {{ saving ? '保存中...' : '保存' }}
        </button>
      </div>

      <div class="deck-editor">
        <!-- 左侧：卡组区域 -->
        <div class="deck-area">
          <!-- 主卡组 -->
          <div class="deck-section">
            <h3 class="section-title">
              主卡组 <span class="count" :class="{ 'invalid': !isMainDeckValid }">{{ mainDeck.length }}/40-60</span>
            </h3>
            <div class="deck-cards">
              <div
                v-for="(cardId, index) in mainDeck"
                :key="`main-${index}`"
                class="deck-card-slot"
                @click="removeFromDeck('main', index)"
                :title="getCard(cardId).name"
              >
                <img
                  v-if="getCard(cardId).image"
                  :src="getCardImageUrl(getCard(cardId).image)"
                  :alt="getCard(cardId).name"
                  class="deck-slot-img"
                />
                <div v-else class="deck-slot-placeholder">
                  {{ getCard(cardId).name?.charAt(0) }}
                </div>
              </div>
              <div v-if="mainDeck.length === 0" class="empty-slot">拖入或点击卡牌添加</div>
            </div>
          </div>

          <!-- 额外卡组 -->
          <div class="deck-section">
            <h3 class="section-title">
              额外卡组 <span class="count" :class="{ 'invalid': extraDeck.length > 15 }">{{ extraDeck.length }}/15</span>
            </h3>
            <div class="deck-cards extra">
              <div
                v-for="(cardId, index) in extraDeck"
                :key="`extra-${index}`"
                class="deck-card-slot"
                @click="removeFromDeck('extra', index)"
                :title="getCard(cardId).name"
              >
                <img
                  v-if="getCard(cardId).image"
                  :src="getCardImageUrl(getCard(cardId).image)"
                  :alt="getCard(cardId).name"
                  class="deck-slot-img"
                />
                <div v-else class="deck-slot-placeholder">
                  {{ getCard(cardId).name?.charAt(0) }}
                </div>
              </div>
              <div v-if="extraDeck.length === 0" class="empty-slot small">额外卡组</div>
            </div>
          </div>
        </div>

        <!-- 右侧：卡牌选择 -->
        <div class="card-selector">
          <h3 class="section-title">我的卡牌</h3>
          <input v-model="searchQuery" type="text" class="input-field" placeholder="搜索卡牌..." />
          <div class="selector-cards">
            <div
              v-for="item in filteredCollection"
              :key="item.cardId"
              class="selector-card"
              :class="{ 'disabled': !canAddCard(item.card) }"
              @click="addToDeck(item.card)"
              :title="item.card.name"
            >
              <img
                v-if="item.card.image"
                :src="getCardImageUrl(item.card.image)"
                :alt="item.card.name"
                class="selector-card-img"
              />
              <div v-else class="selector-placeholder">
                {{ item.card.name?.charAt(0) }}
              </div>
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

function getCard(cardId) {
  return cardStore.getCardById(cardId) || {}
}

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
  if (countInDeck >= 3 || countInDeck >= owned) return false
  return true
}

function isExtraCard(card) {
  const extraTypes = ['融合', '同调', '超量', '链接']
  return extraTypes.includes(card.monsterType)
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
    console.error('保存失败:', e)
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
    console.error('加载卡组失败:', e)
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
.deck-edit-page {
  padding: 20px 0 80px;
}

.deck-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back-link {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.deck-name-input {
  flex: 1;
  max-width: 300px;
  padding: 12px 16px;
  font-size: 1.2rem;
  font-weight: 600;
  background: transparent;
  border: none;
  border-bottom: 2px solid rgba(212,175,55,0.3);
  color: var(--color-text-primary);
  outline: none;
}

.deck-name-input:focus {
  border-color: var(--color-gold);
}

.deck-editor {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 30px;
}

.deck-area {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.deck-section {
  background: rgba(20, 20, 30, 0.6);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 20px;
}

.section-title {
  font-size: 1rem;
  color: var(--color-text-primary);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.count {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.85rem;
  color: var(--color-gold);
}

.count.invalid {
  color: #ff6b6b;
}

.deck-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 200px;
}

.deck-cards.extra {
  min-height: 80px;
}

.deck-card-slot {
  width: 50px;
  height: 72px;
  cursor: pointer;
  transition: transform 0.2s ease;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.deck-card-slot:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
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
  background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
  font-size: 1.2rem;
  font-weight: bold;
  color: #d4af37;
}

.empty-slot {
  width: 100%;
  padding: 40px;
  text-align: center;
  color: var(--color-text-muted);
  border: 2px dashed rgba(255,255,255,0.1);
  border-radius: 8px;
}

.empty-slot.small {
  padding: 20px;
}

.card-selector {
  background: rgba(20, 20, 30, 0.6);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 20px;
  height: fit-content;
  position: sticky;
  top: 90px;
}

.card-selector .input-field {
  margin-bottom: 16px;
}

.selector-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 8px;
  max-height: 600px;
  overflow-y: auto;
  padding: 4px;
}

.selector-card {
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 4px;
  overflow: hidden;
}

.selector-card:hover:not(.disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  z-index: 10;
}

.selector-card.disabled {
  opacity: 0.4;
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
  background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
  font-size: 1.5rem;
  font-weight: bold;
  color: #d4af37;
}

.card-count {
  position: absolute;
  bottom: 4px;
  right: 4px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.9);
  color: var(--color-gold);
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 3px;
  border: 1px solid rgba(212, 175, 55, 0.5);
}

@media (max-width: 900px) {
  .deck-editor {
    grid-template-columns: 1fr;
  }

  .card-selector {
    position: static;
  }
}
</style>
