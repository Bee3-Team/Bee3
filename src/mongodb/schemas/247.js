const { Schema, model } = require("mongoose");
module.exports = model(
  "AlwaysJoin",
  new Schema({
    ID: String,
    Channel: String
  })
);