import mongoose from 'mongoose'

const deckSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: '新卡组' },
  mainDeck: [String],   // 卡牌ID数组
  extraDeck: [String],
  sideDeck: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model('Deck', deckSchema)
