module.exports = {
  name: "user",
  description: "Admin user management",
  usage: "user [coin <add|remove> <id> <amount> | message <id> <message>]",
  aliases: [],
  adminOnly: true,

  async execute(bot, msg, args) {
    const sub = args.shift();

    if (!sub) {
      return bot.sendMessage(
        msg.chat.id,
        "Usage:\n" +
        "user coin <add|remove> <id> <amount>\n" +
        "user message <id> <message>"
      );
    }

    // ================= COIN MANAGEMENT =================
    if (sub === "coin") {
      const action = args[0];
      const targetId = args[1];
      const amount = parseInt(args[2]);

      if (!["add", "remove"].includes(action) || !targetId || !amount || amount <= 0) {
        return bot.sendMessage(
          msg.chat.id,
          "Usage: user coin <add|remove> <id> <amount>"
        );
      }

      const user = await bot.db.getUser(targetId);

      if (action === "add") {
        user.coins += amount;
      } else {
        user.coins -= amount;
        if (user.coins < 0) user.coins = 0;
      }

      await bot.db.saveUser(targetId, user);

      return bot.sendMessage(
        msg.chat.id,
        `✅ ${action === "add" ? "Added" : "Removed"} ${amount} coins ${action === "add" ? "to" : "from"} ${targetId}\n💰 New balance: ${user.coins}`
      );
    }

    // ================= MESSAGE USER =================
    if (sub === "message") {
      const targetId = args.shift();
      const text = args.join(" ");

      if (!targetId || !text) {
        return bot.sendMessage(
          msg.chat.id,
          "Usage: user message <id> <message>"
        );
      }

      try {
        await bot.sendMessage(targetId, `📩 Admin message:\n\n${text}`);
        bot.sendMessage(msg.chat.id, "✅ Message sent");
      } catch (err) {
        bot.sendMessage(
          msg.chat.id,
          "❌ Failed to send message (user may not have started the bot)"
        );
      }
      return;
    }

    bot.sendMessage(msg.chat.id, "❌ Unknown subcommand");
  }
};
