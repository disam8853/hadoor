const TelegramBot = require('node-telegram-bot-api')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const ChatRoom = require('./utils/database.js')

// replace the value below with the Telegram token you receive from @BotFather
const TOKEN = process.env.TOKEN
const url = process.env.URL
const port = process.env.PORT || 8000

const express = require('express')

// No need to pass any parameters as we will handle the updates with Express
const bot = new TelegramBot(TOKEN)

const commands = {
  stop: { regex: /\/stop/, command: '/stop', description: 'stop auto-reply 哈們' },
  start: { regex: /\/start/, command: '/start', description: 'start auto-reply 哈們' },
}
// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/bot${TOKEN}`)
bot.setMyCommands([commands.stop, commands.start])

const app = express()

// parse the updates to JSON
app.use(express.json())

// We are receiving updates at the route below!
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body)
  res.sendStatus(200)
})

// keep Heroku awake
app.get('/awake', (req, res) => {
  res.sendStatus(200)
})

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${port}`)
})

bot.onText(commands.stop.regex, async (msg) => {
  const chatId = msg.chat.id
  await ChatRoom.findOneAndUpdate({ chatId }, { stop: true }, { upsert: true }).exec()
})

bot.onText(commands.start.regex, async (msg) => {
  const chatId = msg.chat.id
  await ChatRoom.findOneAndUpdate({ chatId }, { stop: false }, { upsert: true }).exec()
})

bot.on('message', async (msg) => {
  // do nothing when message is a command
  for (const prop in commands) {
    if (commands[prop].regex.test(msg.text)) return
  }
  const chatId = msg.chat.id
  let chatRoom = await ChatRoom.findOne({ chatId }).exec()
  // create one if chat room is not found in DB
  if (!chatRoom) {
    chatRoom = await ChatRoom.create({ chatId })
  }
  // reply 哈們 when `stop` is false
  if (!chatRoom.stop) bot.sendMessage(chatId, '哈們')
})
