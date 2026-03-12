import express from 'express'
import { store, saveUsers } from '../store.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

// 获取用户收藏
router.get('/collection', auth, (req, res) => {
  const user = store.users.find(u => u._id === req.user.userId)
  if (!user) {
    return res.status(404).json({ message: '用户不存在' })
  }
  res.json(user.ownedCards || [])
})

export default router
