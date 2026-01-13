module.exports = {
  name: "hourly",
  description: "Claim hourly reward (500–1000 coins)",
  usage: "hourly",
  aliases: [],
  adminOnly: false,

  async execute(bot, msg) {
    const userId = msg.from.id;
    const now = Date.now();
    const cooldown = 60 * 60 * 1000; // 1 hour

    const user = await bot.db.getUser(userId);

    if (user.lastHourly && now - user.lastHourly < cooldown) {
      const remaining = cooldown - (now - user.lastHourly);
      const minutes = Math.ceil(remaining / 60000);

      return bot.sendMessage(
        msg.chat.id,
        `⏳ You already claimed hourly.\nTry again in ${minutes} minute(s).`
      );
    }

    const reward = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;

    user.coins += reward;
    user.lastHourly = now;

    await bot.db.saveUser(userId, user);

    bot.sendMessage(
      msg.chat.id,
      `🕒 Hourly Reward Claimed!\n💰 You received ${reward} coins`
    );
  }
};
