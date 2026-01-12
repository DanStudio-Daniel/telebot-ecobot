module.exports = {
  name: "help",
  description: "Show all commands",
  usage: "help",
  aliases: ["cmds"],
  adminOnly: false,

  execute(bot, msg) {
    bot.sendMessage(msg.chat.id, "📜 Commands:\n\n" + bot.getCommandList());
  }
};

