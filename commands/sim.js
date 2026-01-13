module.exports = {
  name: "sim",
  description: "Talk with the bot (AI talkback)",
  usage: "sim <message>",
  aliases: [],
  adminOnly: false,

  async execute(bot, msg, args) {
    const message = args.join(" ");

    if (!message) {
      return bot.sendMessage(
        msg.chat.id,
        "Usage: sim <message>"
      );
    }

    try {
      const response = await fetch(
        "https://talk-back-upd.netlify.app/.netlify/functions/talk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message })
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.respond) {
        throw new Error("Invalid API response");
      }

      bot.sendMessage(
        msg.chat.id,
        data.respond
      );

    } catch (err) {
      console.error("Sim command error:", err);
      bot.sendMessage(
        msg.chat.id,
        "❌ Talkback service is currently unavailable."
      );
    }
  }
};
