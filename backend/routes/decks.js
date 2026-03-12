import express from 'express'
import { store, saveDecks, generateId } from '../store.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

// 获取用户所有卡组
router.get('/', auth, (req, res) => {
  const decks = store.decks.filter(d => d.userId === req.user.userId)
  res.json(decks)
})

// 获取单个卡组
router.get('/:id', auth, (req, res) => {
  const deck = store.decks.find(d => d._id === req.params.id && d.userId === req.user.userId)
  if (!deck) {
    return res.status(404).json({ message: '卡组不存在' })
  }
  res.json(deck)
})

// 创建卡组
router.post('/', auth, (req, res) => {
  const { name = '新卡组' } = req.body
  const deck = {
    _id: generateId(),
    userId: req.user.userId,
    name,
    mainDeck: [],
    extraDeck: [],
    sideDeck: [],
    createdAt: new Date().toISOString()
  }

  store.decks.push(deck)
  saveDecks()
  res.status(201).json(deck)
})

// 更新卡组
router.put('/:id', auth, (req, res) => {
  const { name, mainDeck, extraDeck, sideDeck } = req.body

  const deckIndex = store.decks.findIndex(d => d._id === req.params.id && d.userId === req.user.userId)
  if (deckIndex === -1) {
    return res.status(404).json({ message: '卡组不存在' })
  }

  if (extraDeck && extraDeck.length > 15) {
    return res.status(400).json({ message: '额外卡组最多15张' })
  }
  if (sideDeck && sideDeck.length > 15) {
    return res.status(400).json({ message: '副卡组最多15张' })
  }

  const deck = store.decks[deckIndex]
  if (name) deck.name = name
  if (mainDeck) deck.mainDeck = mainDeck
  if (extraDeck) deck.extraDeck = extraDeck
  if (sideDeck) deck.sideDeck = sideDeck
  deck.updatedAt = new Date().toISOString()

  saveDecks()
  res.json(deck)
})

// 删除卡组
router.delete('/:id', auth, (req, res) => {
  const deckIndex = store.decks.findIndex(d => d._id === req.params.id && d.userId === req.user.userId)
  if (deckIndex === -1) {
    return res.status(404).json({ message: '卡组不存在' })
  }

  store.decks.splice(deckIndex, 1)
  saveDecks()
  res.json({ message: '删除成功' })
})

export default router
