const Activity = require("../../other/Activity.js");
let Guild = require("../../mongodb/schemas/Guild.js");

module.exports = {
  name: "guildDelete",
  execute: async (guild, client) => {
    
    let check_ = await Guild.findOne({ID: guild.id});
    if (!check_) return;
    
    check_.remove();
    console.log("Removed 1 server")
    
  }
}