const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options')

const token = '6298347290:AAGYwqIPrgLlY2pyV4G2M0oAv703BJW2avs';

const bot = new TelegramApi(token, { polling: true });

const chats = {

}

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `1-9`)
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Which?', gameOptions)
}

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Launch the bot' },
    { command: '/info', description: 'Learn about the bot' },
    { command: '/game', description: 'Play game' }
  ])

  bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const name = msg.chat.username;
    const typeChat = msg.chat.type

    if (text === '/start') {
      // bot.sendSticker()
      return bot.sendMessage(chatId, `Hello, ${name}`)
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `The type of this chat: ${typeChat}`)
    }

    if (text === '/game') {
      return startGame(chatId)
    }

    return bot.sendMessage(chatId, `I don't understand you`)
  })

  bot.on('callback_query', async msg => {

    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId)
    }

    if (data == chats[chatId]) {
      return await bot.sendMessage(chatId, `Victory! ${chats[chatId]}`, againOptions)
    } else {
      return await bot.sendMessage(chatId, `Failure(, ${chats[chatId]}`, againOptions)
    }
  })
}
start()