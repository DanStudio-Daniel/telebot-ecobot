const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");

const app = express();
const PORT = process.env.PORT || 3000;

// Express server
app.get("/", (_, res) => res.send("Bot is running"));
app.listen(PORT, () => console.log("Express server started"));

// Auto ping checker
setInterval(() => {
  console.log("Bot heartbeat OK");
}, 60 * 1000);

// Telegram bot
const bot = new TelegramBot(config.token, { polling: true });
bot.commands = new Map();

// Load handlers
const handlersPath = path.join(__dirname, "handlers");
fs.readdirSync(handlersPath).forEach(file => {
  require(`./handlers/${file}`)(bot);
});

// Load commands
const commandsPath = path.join(__dirname, "commands");
fs.readdirSync(commandsPath).forEach(file => {
  const cmd = require(`./commands/${file}`);
  bot.commands.set(cmd.name, cmd);
});

// Message listener
bot.on("message", async msg => {
  if (!msg.text) return;

  const args = msg.text.trim().split(/\s+/);
  const cmdName = args.shift().toLowerCase();

  const command =
    bot.commands.get(cmdName) ||
    [...bot.commands.values()].find(c => c.aliases?.includes(cmdName));

  if (!command) return;

  if (command.adminOnly && msg.from.id !== config.adminId) {
    return bot.sendMessage(msg.chat.id, "❌ Admin only command");
  }

  command.execute(bot, msg, args);
});

console.log("Telegram bot started");

