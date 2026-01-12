const fs = require("fs");
const mongoose = require("mongoose");
const config = require("../config.json");

let User;

module.exports = bot => {
  if (config.db !== "None") {
    mongoose.connect(config.db);
    const schema = new mongoose.Schema({
      userId: String,
      coins: Number
    });
    User = mongoose.model("User", schema);
  }

  bot.db = {
    async getUser(id) {
      if (config.db === "None") {
        if (!fs.existsSync("database.json"))
          fs.writeFileSync("database.json", "{}");

        const data = JSON.parse(fs.readFileSync("database.json"));
        if (!data[id]) {
          data[id] = { coins: 1000 };
          fs.writeFileSync("database.json", JSON.stringify(data, null, 2));
        }
        return data[id];
      } else {
        let user = await User.findOne({ userId: id });
        if (!user) {
          user = await User.create({ userId: id, coins: 1000 });
        }
        return user;
      }
    },

    async saveUser(id, data) {
      if (config.db === "None") {
        const db = JSON.parse(fs.readFileSync("database.json"));
        db[id] = data;
        fs.writeFileSync("database.json", JSON.stringify(db, null, 2));
      } else {
        await User.updateOne({ userId: id }, data);
      }
    }
  };
};

