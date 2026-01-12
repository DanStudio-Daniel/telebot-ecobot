module.exports = {
  name: "id",
  description: "Get user ID",
  usage: "id [me | reply | username]",
  aliases: [],
  adminOnly: false,

  async execute(bot, msg, args) {
    if (msg.reply_to_message) {
      return bot.sendMessage(
        msg.chat.id,
        `🆔 User ID: ${msg.reply_to_message.from.id}`
      );
    }

    if (!args[0] || args[0] === "me") {
      return bot.sendMessage(msg.chat.id, `🆔 Your ID: ${msg.from.id}`);
    }

    bot.sendMessage(msg.chat.id, "❌ Username lookup not supported by Telegram API");
  }
};

