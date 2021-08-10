const { Schema, model } = require("mongoose");
module.exports = model(
  "WarningsDB",
  new Schema({
    ID: String,
    Cases: [],
    Warns: Number
  })
);