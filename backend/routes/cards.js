import express from 'express'
import { store } from '../store.js'

const router = express.Router()

// 获取所有卡牌
router.get('/', (req, res) => {
  res.json(store.cards)
})

// 获取单张卡牌
router.get('/:id', (req, res) => {
  const card = store.cards.find(c => c.id === req.params.id)
  if (!card) {
    return res.status(404).json({ message: '卡牌不存在' })
  }
  res.json(card)
})

export default router
