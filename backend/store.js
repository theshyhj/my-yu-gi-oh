import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname, 'data')
const CARDS_FILE = path.join(DATA_DIR, 'cards.json')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const DECKS_FILE = path.join(DATA_DIR, 'decks.json')

// 内存数据存储
export const store = {
  cards: [],
  users: [],
  decks: []
}

// 读取 JSON 文件
function readJSON(file, defaultValue = []) {
  try {
    if (fs.existsSync(file)) {
      return JSON.parse(fs.readFileSync(file, 'utf-8'))
    }
  } catch (e) {
    console.error(`读取 ${file} 失败:`, e)
  }
  return defaultValue
}

// 写入 JSON 文件
function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
  } catch (e) {
    console.error(`写入 ${file} 失败:`, e)
  }
}

// 初始化数据
export function initData() {
  // 确保数据目录存在
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  // 加载卡牌数据
  store.cards = readJSON(CARDS_FILE, [])
  console.log(`已加载 ${store.cards.length} 张卡牌`)

  // 加载用户数据
  store.users = readJSON(USERS_FILE, [])

  // 如果没有用户，创建默认账号
  if (store.users.length === 0) {
    const adminPassword = bcrypt.hashSync('admin123', 10)
    const userPassword = bcrypt.hashSync('123456', 10)

    store.users = [
      { _id: 'admin001', username: 'admin', password: adminPassword, role: 'admin', ownedCards: [] },
      { _id: 'user001', username: 'test', password: userPassword, role: 'user', ownedCards: [] }
    ]
    saveUsers()
    console.log('已创建默认账号: admin/admin123, test/123456')
  } else {
    console.log(`已加载 ${store.users.length} 个用户`)
  }

  // 加载卡组数据
  store.decks = readJSON(DECKS_FILE, [])
  console.log(`已加载 ${store.decks.length} 个卡组`)
}

// 保存函数
export function saveCards() {
  writeJSON(CARDS_FILE, store.cards)
}

export function saveUsers() {
  writeJSON(USERS_FILE, store.users)
}

export function saveDecks() {
  writeJSON(DECKS_FILE, store.decks)
}

// 生成唯一 ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}
