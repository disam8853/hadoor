const mongoose = require('mongoose')

const DB_ENDPOINT = process.env.DB_ENDPOINT

const chatRoomSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true, index: true, unique: true },
    stop: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

mongoose.connect(DB_ENDPOINT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema)

module.exports = ChatRoom
