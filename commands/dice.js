module.exports = {
  name: "dice",
  description: "Guess dice number 1-6",
  usage: "dice <number> <bet>",
  aliases: [],
  adminOnly: false,

  async execute(bot, msg, args) {
    const guess = parseInt(args[0]);
    const bet = parseInt(args[1]);

    if (!guess || guess < 1 || guess > 6 || !bet)
      return bot.sendMessage(msg.chat.id, "Usage: dice <1-6> <bet>");

    const user = await bot.db.getUser(msg.from.id);
    if (user.coins < bet)
      return bot.sendMessage(msg.chat.id, "Not enough coins");

    const roll = Math.floor(Math.random() * 6) + 1;

    if (roll === guess) {
      await bot.economy.addCoins(msg.from.id, bet * 2);
      bot.sendMessage(msg.chat.id, `🎲 Rolled ${roll}. You WON!`);
    } else {
      await bot.economy.removeCoins(msg.from.id, bet);
      bot.sendMessage(msg.chat.id, `🎲 Rolled ${roll}. You LOST`);
    }
  }
};

