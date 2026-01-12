module.exports = {
  name: "slot",
  description: "Play slot machine",
  usage: "slot <bet>",
  aliases: [],
  adminOnly: false,

  async execute(bot, msg, args) {
    const bet = parseInt(args[0]);
    if (!bet || bet <= 0)
      return bot.sendMessage(msg.chat.id, "Invalid bet");

    const user = await bot.db.getUser(msg.from.id);
    if (user.coins < bet)
      return bot.sendMessage(msg.chat.id, "Not enough coins");

    const roll = Math.random() < 0.3;
    if (roll) {
      await bot.economy.addCoins(msg.from.id, bet);
      bot.sendMessage(msg.chat.id, `🎰 You WON ${bet} coins!`);
    } else {
      await bot.economy.removeCoins(msg.from.id, bet);
      bot.sendMessage(msg.chat.id, `🎰 You LOST ${bet} coins`);
    }
  }
};

