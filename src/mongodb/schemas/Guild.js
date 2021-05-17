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
      DisabledCommands: [],
      DisabledFeatures: []
    },
    Statistics: {
      CommandsUsed: [],
      CommandsUsedTotal: Number
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

// disabled features json
//
// Name: String,
// Default: Boolean,
// Note: String