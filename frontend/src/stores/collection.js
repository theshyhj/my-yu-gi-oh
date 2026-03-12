import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../api'

export const useCollectionStore = defineStore('collection', () => {
  const collection = ref([])
  const loading = ref(false)

  async function fetchCollection() {
    loading.value = true
    try {
      const res = await api.get('/user/collection')
      collection.value = res.data
    } finally {
      loading.value = false
    }
  }

  function getCardCount(cardId) {
    const item = collection.value.find(c => c.cardId === cardId)
    return item ? item.count : 0
  }

  return { collection, loading, fetchCollection, getCardCount }
})
