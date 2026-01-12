module.exports = bot => {
  bot.getCommandList = () => {
    return [...bot.commands.values()]
      .map(c => `• ${c.name} - ${c.description}`)
      .join("\n");
  };
};

