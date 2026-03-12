import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { store, saveCards } from '../store.js'
import { adminAuth } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = `${Date.now()}${ext}`
    cb(null, filename)
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mime = allowedTypes.test(file.mimetype)
    if (ext && mime) {
      cb(null, true)
    } else {
      cb(new Error('只允许上传图片文件'))
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
})

// 上传图片
router.post('/upload', adminAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '请选择要上传的图片' })
  }
  res.json({ filename: req.file.filename })
})

// 添加卡牌
router.post('/cards', adminAuth, (req, res) => {
  const { id, name, type, rarity } = req.body

  if (!id || !name || !type || !rarity) {
    return res.status(400).json({ message: '缺少必填字段' })
  }

  const existingCard = store.cards.find(c => c.id === id)
  if (existingCard) {
    return res.status(400).json({ message: '卡牌ID已存在' })
  }

  const card = { ...req.body, createdAt: new Date().toISOString() }
  store.cards.push(card)
  saveCards()
  res.status(201).json(card)
})

// 更新卡牌
router.put('/cards/:id', adminAuth, (req, res) => {
  const cardIndex = store.cards.findIndex(c => c.id === req.params.id)
  if (cardIndex === -1) {
    return res.status(404).json({ message: '卡牌不存在' })
  }

  store.cards[cardIndex] = { ...store.cards[cardIndex], ...req.body }
  saveCards()
  res.json(store.cards[cardIndex])
})

// 删除卡牌
router.delete('/cards/:id', adminAuth, (req, res) => {
  const cardIndex = store.cards.findIndex(c => c.id === req.params.id)
  if (cardIndex === -1) {
    return res.status(404).json({ message: '卡牌不存在' })
  }

  store.cards.splice(cardIndex, 1)
  saveCards()
  res.json({ message: '删除成功' })
})

export default router
