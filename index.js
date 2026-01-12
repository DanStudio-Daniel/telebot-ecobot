const express = require("express");
const fs = require("fs");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");
const config = require("./config.json");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = `${process.env.RENDER_EXTERNAL_URL}/bot${config.token}`;

// ================= EXPRESS SERVER =================
app.get("/", (req, res) => {
  res.status(200).send("Telegram Bot is running (Webhook Mode)");
});

app.listen(PORT, async () => {
  console.log(`Express server listening on port ${PORT}`);

  try {
    await bot.setWebHook(WEBHOOK_URL);
    console.log("Webhook set:", WEBHOOK_URL);
  } catch (err) {
    console.error("Failed to set webhook:", err.message);
  }
});

// ================= TELEGRAM BOT =================
const bot = new TelegramBot(config.token);
bot.commands = new Map();

// Telegram webhook endpoint
app.post(`/bot${config.token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// ================= AUTO PING CHECKER =================
setInterval(() => {
  console.log("Bot heartbeat OK (Webhook active)");
}, 60 * 1000);

// ================= LOAD HANDLERS =================
const handlersPath = path.join(__dirname, "handlers");
fs.readdirSync(handlersPath).forEach(file => {
  require(`./handlers/${file}`)(bot);
});

// ================= LOAD COMMANDS =================
const commandsPath = path.join(__dirname, "commands");
fs.readdirSync(commandsPath).forEach(file => {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
});

// ================= MESSAGE HANDLER =================
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

  try {
    await command.execute(bot, msg, args);
  } catch (err) {
    console.error(`Command error (${command.name}):`, err);
    bot.sendMessage(msg.chat.id, "⚠️ An error occurred");
  }
});

console.log("Telegram bot initialized (Webhook mode)");
    
