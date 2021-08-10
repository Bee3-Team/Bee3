let slash = require("../../command/slashManager.js");

module.exports = {
  name: "guildDelete",
  execute: async (guild, client) => {
    
    slash(client, guild);
    
  }
}