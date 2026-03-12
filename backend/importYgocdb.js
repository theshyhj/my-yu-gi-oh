import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Card from './models/Card.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yugioh'

// ============ 位运算映射表 ============

// 卡片类型位运算
const TYPE_MONSTER = 0x1
const TYPE_SPELL = 0x2
const TYPE_TRAP = 0x4
const TYPE_NORMAL = 0x10
const TYPE_EFFECT = 0x20
const TYPE_FUSION = 0x40
const TYPE_RITUAL = 0x80
const TYPE_SPIRIT = 0x200
const TYPE_UNION = 0x400
const TYPE_GEMINI = 0x800
const TYPE_TUNER = 0x1000
const TYPE_SYNCHRO = 0x2000
const TYPE_TOKEN = 0x4000
const TYPE_QUICKPLAY = 0x10000
const TYPE_CONTINUOUS = 0x20000
const TYPE_EQUIP = 0x40000
const TYPE_FIELD = 0x80000
const TYPE_COUNTER = 0x100000
const TYPE_FLIP = 0x200000
const TYPE_TOON = 0x400000
const TYPE_XYZ = 0x800000
const TYPE_PENDULUM = 0x1000000
const TYPE_SPSUMMON = 0x2000000
const TYPE_LINK = 0x4000000

// 属性位运算
const ATTRIBUTE_MAP = {
  0x01: '地',
  0x02: '水',
  0x04: '火',
  0x08: '风',
  0x10: '光',
  0x20: '暗',
  0x40: '神'
}

// 种族位运算
const RACE_MAP = {
  0x1: '战士族',
  0x2: '魔法使族',
  0x4: '天使族',
  0x8: '恶魔族',
  0x10: '不死族',
  0x20: '机械族',
  0x40: '水族',
  0x80: '炎族',
  0x100: '岩石族',
  0x200: '鸟兽族',
  0x400: '植物族',
  0x800: '昆虫族',
  0x1000: '雷族',
  0x2000: '龙族',
  0x4000: '兽族',
  0x8000: '兽战士族',
  0x10000: '恐龙族',
  0x20000: '鱼族',
  0x40000: '海龙族',
  0x80000: '爬虫类族',
  0x100000: '念动力族',
  0x200000: '幻神兽族',
  0x400000: '创造神族',
  0x800000: '幻龙族',
  0x1000000: '电子界族',
  0x2000000: '幻想魔族'
}

// ============ 解析函数 ============

// 解析卡片主类型
function parseMainType(type) {
  if (type & TYPE_MONSTER) return 'monster'
  if (type & TYPE_SPELL) return 'spell'
  if (type & TYPE_TRAP) return 'trap'
  return 'monster'
}

// 解析怪兽类型
function parseMonsterType(type) {
  if (type & TYPE_LINK) return '连接'
  if (type & TYPE_XYZ) return '超量'
  if (type & TYPE_SYNCHRO) return '同调'
  if (type & TYPE_FUSION) return '融合'
  if (type & TYPE_RITUAL) return '仪式'
  if (type & TYPE_PENDULUM) return '灵摆'
  if (type & TYPE_EFFECT) return '效果'
  if (type & TYPE_NORMAL) return '通常'
  return '通常'
}

// 解析魔法卡类型
function parseSpellType(type) {
  if (type & TYPE_QUICKPLAY) return '速攻'
  if (type & TYPE_CONTINUOUS) return '永续'
  if (type & TYPE_EQUIP) return '装备'
  if (type & TYPE_FIELD) return '场地'
  if (type & TYPE_RITUAL) return '仪式'
  return '通常'
}

// 解析陷阱卡类型
function parseTrapType(type) {
  if (type & TYPE_COUNTER) return '反击'
  if (type & TYPE_CONTINUOUS) return '永续'
  return '通常'
}

// 解析属性
function parseAttribute(attr) {
  return ATTRIBUTE_MAP[attr] || ''
}

// 解析种族
function parseRace(race) {
  return RACE_MAP[race] || ''
}

// 解析等级（处理灵摆卡的特殊情况）
function parseLevel(level, type) {
  if (type & TYPE_PENDULUM) {
    // 灵摆卡的level字段包含等级和刻度信息
    // 低8位是等级，高位包含刻度信息
    return level & 0xFF
  }
  return level
}

// 解析灵摆刻度
function parsePendulumScale(level, type) {
  if (type & TYPE_PENDULUM) {
    // 灵摆刻度在level的高位
    return (level >> 24) & 0xFF
  }
  return null
}

// 解析连接值
function parseLinkRating(level, type) {
  if (type & TYPE_LINK) {
    return level
  }
  return null
}

// ============ 卡片转换函数 ============

function convertCard(cid, cardData) {
  const { id, cn_name, sc_name, md_name, jp_name, en_name, jp_ruby, text, data } = cardData

  const rawType = data?.type || 0
  const rawRace = data?.race || 0
  const rawAttribute = data?.attribute || 0
  const rawLevel = data?.level || 0

  const mainType = parseMainType(rawType)
  const isMonster = mainType === 'monster'

  // 构建卡片对象
  const card = {
    id: String(id),
    cid: parseInt(cid),
    name: cn_name || sc_name || md_name || jp_name || en_name || '未知卡片',
    scName: sc_name || '',
    mdName: md_name || '',
    jpName: jp_name || '',
    enName: en_name || '',
    jpRuby: jp_ruby || '',
    type: mainType,
    rarity: 'N',
    image: `https://cdn.233.momobako.com/ygopro/pics/${id}.jpg`,
    effect: text?.desc || '',
    rawType,
    rawRace,
    rawAttribute
  }

  // 怪兽卡特有属性
  if (isMonster) {
    card.attribute = parseAttribute(rawAttribute)
    card.race = parseRace(rawRace)
    card.monsterType = parseMonsterType(rawType)
    card.level = parseLevel(rawLevel, rawType)
    card.atk = data?.atk
    card.def = data?.def

    // 连接怪兽
    if (rawType & TYPE_LINK) {
      card.linkRating = parseLinkRating(rawLevel, rawType)
      card.def = null  // 连接怪兽没有DEF
    }

    // 灵摆怪兽
    if (rawType & TYPE_PENDULUM) {
      card.pendulumScale = parsePendulumScale(rawLevel, rawType)
      card.pendulumEffect = text?.pdesc || ''
    }
  }

  // 魔法卡
  if (mainType === 'spell') {
    card.spellType = parseSpellType(rawType)
  }

  // 陷阱卡
  if (mainType === 'trap') {
    card.trapType = parseTrapType(rawType)
  }

  return card
}

// ============ 主导入函数 ============

async function importCards() {
  try {
    // 连接数据库
    await mongoose.connect(MONGODB_URI)
    console.log('数据库连接成功')

    // 读取cards.json
    const cardsJsonPath = path.join(__dirname, '..', 'cards.json')
    console.log('正在读取卡片数据...')
    const rawData = fs.readFileSync(cardsJsonPath, 'utf-8')
    const cardsData = JSON.parse(rawData)

    const cardKeys = Object.keys(cardsData)
    console.log(`共发现 ${cardKeys.length} 张卡片`)

    // 清空现有卡片数据
    await Card.deleteMany({})
    console.log('已清空现有卡片数据')

    // 批量转换和导入
    const batchSize = 1000
    let imported = 0
    let failed = 0

    for (let i = 0; i < cardKeys.length; i += batchSize) {
      const batch = cardKeys.slice(i, i + batchSize)
      const cards = []

      for (const cid of batch) {
        try {
          const card = convertCard(cid, cardsData[cid])
          if (card && card.id && card.name) {
            cards.push(card)
          }
        } catch (err) {
          failed++
        }
      }

      if (cards.length > 0) {
        await Card.insertMany(cards, { ordered: false }).catch(err => {
          // 忽略重复键错误
          if (err.code !== 11000) {
            console.error('批量插入错误:', err.message)
          }
        })
        imported += cards.length
      }

      console.log(`进度: ${Math.min(i + batchSize, cardKeys.length)}/${cardKeys.length}`)
    }

    console.log(`\n导入完成!`)
    console.log(`成功导入: ${imported} 张卡片`)
    console.log(`失败: ${failed} 张卡片`)

    // 统计信息
    const stats = await Card.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ])
    console.log('\n卡片类型统计:')
    stats.forEach(s => {
      console.log(`  ${s._id}: ${s.count} 张`)
    })

    process.exit(0)
  } catch (err) {
    console.error('导入失败:', err)
    process.exit(1)
  }
}

// 运行导入
importCards()
