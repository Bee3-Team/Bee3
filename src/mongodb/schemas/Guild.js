const { Schema, model } = require("mongoose");
module.exports = model(
  "url",
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
      CommandsUsed: Number
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