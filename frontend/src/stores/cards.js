import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export const useCardStore = defineStore('cards', () => {
  const cards = ref([])
  const loading = ref(false)

  async function fetchCards() {
    loading.value = true
    try {
      const res = await api.get('/cards')
      cards.value = res.data
    } finally {
      loading.value = false
    }
  }

  function getCardById(id) {
    return cards.value.find(c => c.id === id)
  }

  return { cards, loading, fetchCards, getCardById }
})
