const TelegramBot = require('node-telegram-bot-api')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// replace the value below with the Telegram token you receive from @BotFather
const TOKEN = process.env.TOKEN
const url = process.env.URL
const port = process.env.PORT || 8000

const express = require('express')

// No need to pass any parameters as we will handle the updates with Express
const bot = new TelegramBot(TOKEN)

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/bot${TOKEN}`)
bot.setMyCommands([
  { command: '/stop', description: 'stop auto-reply 哈們' },
  { command: '/start', description: 'start auto-reply 哈們' },
])

const app = express()

// parse the updates to JSON
app.use(express.json())

// We are receiving updates at the route below!
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body)
  res.sendStatus(200)
})

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on ${port}`)
})

let bannedChatId = []
bot.onText(/\/stop/, (msg) => {
  const chatId = msg.chat.id
  if (!bannedChatId.includes(chatId)) {
    bannedChatId.push(chatId)
  }
})

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  bannedChatId = bannedChatId.filter((id) => id !== chatId)
})

// Just to ping!
bot.on('message', (msg) => {
  console.log(msg)
  if (!bannedChatId.includes(msg.chat.id)) bot.sendMessage(msg.chat.id, '哈們')
  else console.log(`${msg.chat.id} is stop`)
})
