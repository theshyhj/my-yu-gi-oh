import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.js'
import cardRoutes from './routes/cards.js'
import gachaRoutes from './routes/gacha.js'
import deckRoutes from './routes/decks.js'
import adminRoutes from './routes/admin.js'
import userRoutes from './routes/user.js'
import { initData } from './store.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// 中间件
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/cards', cardRoutes)
app.use('/api/gacha', gachaRoutes)
app.use('/api/decks', deckRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/user', userRoutes)

// 初始化数据并启动服务器
initData()
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
})
