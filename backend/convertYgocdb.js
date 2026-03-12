import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============ 位运算映射表 ============

const TYPE_MONSTER = 0x1
const TYPE_SPELL = 0x2
const TYPE_TRAP = 0x4
const TYPE_NORMAL = 0x10
const TYPE_EFFECT = 0x20
const TYPE_FUSION = 0x40
const TYPE_RITUAL = 0x80
const TYPE_SYNCHRO = 0x2000
const TYPE_XYZ = 0x800000
const TYPE_PENDULUM = 0x1000000
const TYPE_LINK = 0x4000000
const TYPE_QUICKPLAY = 0x10000
const TYPE_CONTINUOUS = 0x20000
const TYPE_EQUIP = 0x40000
const TYPE_FIELD = 0x80000
const TYPE_COUNTER = 0x100000

const ATTRIBUTE_MAP = {
  0x01: '地', 0x02: '水', 0x04: '火',
  0x08: '风', 0x10: '光', 0x20: '暗', 0x40: '神'
}

const RACE_MAP = {
  0x1: '战士族', 0x2: '魔法使族', 0x4: '天使族',
  0x8: '恶魔族', 0x10: '不死族', 0x20: '机械族',
  0x40: '水族', 0x80: '炎族', 0x100: '岩石族',
  0x200: '鸟兽族', 0x400: '植物族', 0x800: '昆虫族',
  0x1000: '雷族', 0x2000: '龙族', 0x4000: '兽族',
  0x8000: '兽战士族', 0x10000: '恐龙族', 0x20000: '鱼族',
  0x40000: '海龙族', 0x80000: '爬虫类族', 0x100000: '念动力族',
  0x200000: '幻神兽族', 0x400000: '创造神族', 0x800000: '幻龙族',
  0x1000000: '电子界族', 0x2000000: '幻想魔族'
}

// ============ 解析函数 ============

function parseMainType(type) {
  if (type & TYPE_MONSTER) return 'monster'
  if (type & TYPE_SPELL) return 'spell'
  if (type & TYPE_TRAP) return 'trap'
  return 'monster'
}

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

function parseSpellType(type) {
  if (type & TYPE_QUICKPLAY) return '速攻'
  if (type & TYPE_CONTINUOUS) return '永续'
  if (type & TYPE_EQUIP) return '装备'
  if (type & TYPE_FIELD) return '场地'
  if (type & TYPE_RITUAL) return '仪式'
  return '通常'
}

function parseTrapType(type) {
  if (type & TYPE_COUNTER) return '反击'
  if (type & TYPE_CONTINUOUS) return '永续'
  return '通常'
}

function parseAttribute(attr) {
  return ATTRIBUTE_MAP[attr] || ''
}

function parseRace(race) {
  return RACE_MAP[race] || ''
}

function parseLevel(level, type) {
  if (type & TYPE_PENDULUM) return level & 0xFF
  return level
}

function parsePendulumScale(level, type) {
  if (type & TYPE_PENDULUM) return (level >> 24) & 0xFF
  return null
}

// ============ 转换函数 ============

function convertCard(cid, cardData) {
  const { id, cn_name, sc_name, md_name, jp_name, en_name, jp_ruby, text, data } = cardData

  const rawType = data?.type || 0
  const rawRace = data?.race || 0
  const rawAttribute = data?.attribute || 0
  const rawLevel = data?.level || 0

  const mainType = parseMainType(rawType)
  const isMonster = mainType === 'monster'

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
    effect: text?.desc || ''
  }

  if (isMonster) {
    card.attribute = parseAttribute(rawAttribute)
    card.race = parseRace(rawRace)
    card.monsterType = parseMonsterType(rawType)
    card.level = parseLevel(rawLevel, rawType)
    card.atk = data?.atk
    card.def = data?.def

    if (rawType & TYPE_LINK) {
      card.linkRating = rawLevel
      card.def = null
    }

    if (rawType & TYPE_PENDULUM) {
      card.pendulumScale = parsePendulumScale(rawLevel, rawType)
      card.pendulumEffect = text?.pdesc || ''
    }
  }

  if (mainType === 'spell') {
    card.spellType = parseSpellType(rawType)
  }

  if (mainType === 'trap') {
    card.trapType = parseTrapType(rawType)
  }

  return card
}

// ============ 主程序 ============

console.log('开始转换 ygocdb 数据...')

const inputPath = path.join(__dirname, '..', 'cards.json')
const outputPath = path.join(__dirname, 'data', 'cards.json')

// 确保输出目录存在
const outputDir = path.dirname(outputPath)
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// 读取源数据
console.log('读取源文件...')
const rawData = fs.readFileSync(inputPath, 'utf-8')
const cardsData = JSON.parse(rawData)

const cardKeys = Object.keys(cardsData)
console.log(`发现 ${cardKeys.length} 张卡片`)

// 转换数据
console.log('转换中...')
const convertedCards = []
let failed = 0

for (const cid of cardKeys) {
  try {
    const card = convertCard(cid, cardsData[cid])
    if (card && card.id && card.name) {
      convertedCards.push(card)
    }
  } catch (err) {
    failed++
  }
}

// 写入输出文件
console.log('写入输出文件...')
fs.writeFileSync(outputPath, JSON.stringify(convertedCards, null, 2), 'utf-8')

console.log(`\n转换完成!`)
console.log(`成功: ${convertedCards.length} 张卡片`)
console.log(`失败: ${failed} 张卡片`)
console.log(`输出文件: ${outputPath}`)
