const { Schema, model } = require("mongoose");
module.exports = model(
  "GuildDB",
  new Schema({
    ID: String,
    Danger: {
      Banned: Boolean
    },
    Settings: {
      Prefix: String,
      DisabledCommands: []
    },
    Statistics: {
      CommandsUsed: []
    }, 
    CustomCommands: [],
    Leveling: []
  })
);

// leveling json
// 
// userID: String,
// Level: Number,
// XP: Number

// commands used json
//
// Number: Number,
// Date: String