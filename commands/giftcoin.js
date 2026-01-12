module.exports = {
  name: "giftcoin",
  description: "Gift coins to another user",
  usage: "giftcoin <id> <amount>",
  aliases: [],
  adminOnly: false,

  async execute(bot, msg, args) {
    const targetId = args[0];
    const amount = parseInt(args[1]);

    if (!targetId || !amount || amount <= 0) {
      return bot.sendMessage(
        msg.chat.id,
        "Usage: giftcoin <id> <amount>"
      );
    }

    if (String(targetId) === String(msg.from.id)) {
      return bot.sendMessage(
        msg.chat.id,
        "❌ You cannot gift coins to yourself"
      );
    }

    const sender = await bot.db.getUser(msg.from.id);
    if (sender.coins < amount) {
      return bot.sendMessage(
        msg.chat.id,
        "❌ Not enough coins"
      );
    }

    // Ensure receiver exists
    await bot.db.getUser(targetId);

    // Transfer
    sender.coins -= amount;
    await bot.db.saveUser(msg.from.id, sender);

    const receiver = await bot.db.getUser(targetId);
    receiver.coins += amount;
    await bot.db.saveUser(targetId, receiver);

    bot.sendMessage(
      msg.chat.id,
      `✅ Sent ${amount} coins to user ${targetId}`
    );

    // Optional notify receiver
    try {
      bot.sendMessage(
        targetId,
        `🎁 You received ${amount} coins from ${msg.from.first_name}`
      );
    } catch {}
  }
};
