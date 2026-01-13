const config = require("../config.json");

module.exports = {
  name: "feedback",
  description: "Send feedback to the bot admin",
  usage: "feedback <message>",
  aliases: [],
  adminOnly: false,

  async execute(bot, msg, args) {
    const text = args.join(" ");

    if (!text) {
      return bot.sendMessage(
        msg.chat.id,
        "Usage: feedback <your message>"
      );
    }

    const senderName = `${msg.from.first_name || ""} ${msg.from.last_name || ""}`.trim();
    const username = msg.from.username ? `@${msg.from.username}` : "No username";

    const feedbackMessage =
`📢 NEW FEEDBACK RECEIVED

👤 From: ${senderName}
🆔 User ID: ${msg.from.id}
🔗 Username: ${username}

💬 Message:
${text}`;

    try {
      await bot.sendMessage(config.adminId, feedbackMessage);
      await bot.sendMessage(
        msg.chat.id,
        "✅ Your feedback has been sent to the admin. Thank you!"
      );
    } catch (err) {
      console.error("Feedback send failed:", err);
      bot.sendMessage(
        msg.chat.id,
        "❌ Failed to send feedback. Please try again later."
      );
    }
  }
};
