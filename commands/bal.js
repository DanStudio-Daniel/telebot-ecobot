module.exports = {
  name: "bal",
  description: "Check your balance",
  usage: "bal",
  aliases: [],
  adminOnly: false,

  async execute(bot, msg) {
    const user = await bot.db.getUser(msg.from.id);
    bot.sendMessage(msg.chat.id, `💰 Balance: ${user.coins} coins`);
  }
};

