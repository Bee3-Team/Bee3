const { Schema, model } = require("mongoose");
module.exports = model(
  "url",
  new Schema({
    ID: String,
    Settings: {
      Prefix: String
    }
  })
);