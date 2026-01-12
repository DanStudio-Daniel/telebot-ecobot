module.exports = bot => {
  bot.economy = {
    async addCoins(id, amount) {
      const user = await bot.db.getUser(id);
      user.coins += amount;
      await bot.db.saveUser(id, user);
      return user.coins;
    },

    async removeCoins(id, amount) {
      const user = await bot.db.getUser(id);
      user.coins -= amount;
      await bot.db.saveUser(id, user);
      return user.coins;
    }
  };
};

