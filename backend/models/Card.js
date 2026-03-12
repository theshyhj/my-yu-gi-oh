import mongoose from 'mongoose'

const cardSchema = new mongoose.Schema({
  // 基础标识
  id: { type: String, required: true, unique: true },  // 卡片密码
  cid: { type: Number },  // 官方数据库唯一标识符

  // 多语言名称
  name: { type: String, required: true },  // 主要显示名称（cn_name）
  scName: String,   // 官方简体中文名
  mdName: String,   // Master Duel名称
  jpName: String,   // 日文名
  enName: String,   // 英文名
  jpRuby: String,   // 日文假名

  // 卡片分类
  type: { type: String, enum: ['monster', 'spell', 'trap'], required: true },
  rarity: { type: String, enum: ['N', 'R', 'SR', 'UR'], default: 'N' },

  // 卡图
  image: String,

  // 怪兽卡属性
  attribute: String,  // 属性：地/水/火/风/光/暗/神
  level: Number,      // 等级/阶级
  monsterType: String,  // 怪兽类型：通常/效果/融合/仪式/同调/超量/灵摆/连接
  race: String,       // 种族
  atk: Number,
  def: Number,

  // 特殊怪兽属性
  linkRating: Number,     // 连接值
  pendulumScale: Number,  // 灵摆刻度

  // 效果描述
  effect: String,         // 怪兽效果/魔法陷阱效果
  pendulumEffect: String, // 灵摆效果

  // 魔法/陷阱子类型
  spellType: String,  // 通常/速攻/永续/装备/场地/仪式
  trapType: String,   // 通常/永续/反击

  // 原始数据（用于高级查询）
  rawType: Number,    // 原始type位运算值
  rawRace: Number,    // 原始race位运算值
  rawAttribute: Number, // 原始attribute位运算值

  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Card', cardSchema)
