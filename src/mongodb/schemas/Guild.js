const { Schema, model } = require("mongoose");
module.exports = model(
  "url",
  new Schema({
    ID: String,
    Danger: {
      Banned: Boolean
    },
    Settings: {
      Prefix: String
    },
    Graph: {
      CommandsUsed: Number
    },
    CustomCommands: []
  })
);