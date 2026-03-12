import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 导入模型
import Card from './models/Card.js'
import User from './models/User.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yugioh'

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('数据库连接成功')

    // 清空现有数据
    await Card.deleteMany({})
    await User.deleteMany({})
    console.log('已清空现有数据')

    // 导入卡牌数据
    const cardsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/cards.json'), 'utf-8')
    )
    await Card.insertMany(cardsData)
    console.log(`已导入 ${cardsData.length} 张卡牌`)

    // 创建管理员账号
    const adminPassword = await bcrypt.hash('admin123', 10)
    await User.create({
      username: 'admin',
      password: adminPassword,
      role: 'admin'
    })
    console.log('已创建管理员账号: admin / admin123')

    // 创建测试用户
    const userPassword = await bcrypt.hash('123456', 10)
    await User.create({
      username: 'test',
      password: userPassword,
      role: 'user'
    })
    console.log('已创建测试用户: test / 123456')

    console.log('\n数据初始化完成!')
    process.exit(0)
  } catch (err) {
    console.error('初始化失败:', err)
    process.exit(1)
  }
}

seed()
