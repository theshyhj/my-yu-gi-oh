import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { store, saveUsers, generateId } from '../store.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'yugioh-secret-key-2024'

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码不能为空' })
    }

    if (username.length < 3) {
      return res.status(400).json({ message: '用户名至少3个字符' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: '密码至少6个字符' })
    }

    const existingUser = store.users.find(u => u.username === username)
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = {
      _id: generateId(),
      username,
      password: hashedPassword,
      role: 'user',
      ownedCards: []
    }

    store.users.push(user)
    saveUsers()

    res.status(201).json({ message: '注册成功' })
  } catch (err) {
    console.error('注册错误:', err)
    res.status(500).json({ message: '服务器错误' })
  }
})

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const user = store.users.find(u => u.username === username)
    if (!user) {
      return res.status(400).json({ message: '用户名或密码错误' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: '用户名或密码错误' })
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    })
  } catch (err) {
    console.error('登录错误:', err)
    res.status(500).json({ message: '服务器错误' })
  }
})

export default router
