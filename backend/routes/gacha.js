import express from 'express'
import { store, saveUsers } from '../store.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

// 稀有度概率配置
const RARITY_RATES = {
  'N': 0.60,
  'R': 0.25,
  'SR': 0.12,
  'UR': 0.03
}

// 根据概率抽取稀有度
function drawRarity() {
  const rand = Math.random()
  let cumulative = 0

  for (const [rarity, rate] of Object.entries(RARITY_RATES)) {
    cumulative += rate
    if (rand < cumulative) {
      return rarity
    }
  }
  return 'N'
}

// 抽卡
router.post('/draw', auth, (req, res) => {
  try {
    const { count = 1 } = req.body
    const drawCount = Math.min(Math.max(1, count), 10)

    // 按稀有度分组
    const cardsByRarity = {
      'N': store.cards.filter(c => c.rarity === 'N'),
      'R': store.cards.filter(c => c.rarity === 'R'),
      'SR': store.cards.filter(c => c.rarity === 'SR'),
      'UR': store.cards.filter(c => c.rarity === 'UR')
    }

    // 抽取卡牌
    const drawnCards = []
    for (let i = 0; i < drawCount; i++) {
      const rarity = drawRarity()
      const pool = cardsByRarity[rarity]

      if (pool.length > 0) {
        const randomCard = pool[Math.floor(Math.random() * pool.length)]
        drawnCards.push({ ...randomCard })
      }
    }

    // 更新用户收藏
    const user = store.users.find(u => u._id === req.user.userId)
    if (!user) {
      return res.status(404).json({ message: '用户不存在' })
    }

    const newCards = []
    for (const card of drawnCards) {
      const existingCard = user.ownedCards.find(c => c.cardId === card.id)
      if (existingCard) {
        existingCard.count += 1
      } else {
        user.ownedCards.push({ cardId: card.id, count: 1 })
        newCards.push(card.id)
      }
    }

    saveUsers()

    // 返回结果
    const result = drawnCards.map(card => ({
      ...card,
      isNew: newCards.includes(card.id)
    }))

    res.json({ cards: result })
  } catch (err) {
    console.error('抽卡错误:', err)
    res.status(500).json({ message: '服务器错误' })
  }
})

export default router
