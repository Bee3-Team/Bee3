const Activity = require("../../other/Activity.js");
let Guild = require("../../mongodb/schemas/Guild.js");
let Badword = require("../../mongodb/schemas/Badwords.js");

module.exports = {
  name: "guildDelete",
  execute: async (guild, client) => {
    
    let check__ = await Badword.findOne({ID: guild.id})
    let check_ = await Guild.findOne({ID: guild.id});
    if (check_) {
      check_.remove();
    }
    
    if (check__) {
      check__.remove();
    }
    
  }
}