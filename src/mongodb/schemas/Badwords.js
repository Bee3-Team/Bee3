const { Schema, model } = require("mongoose");
module.exports = model(
  "BadwordsDB",
  new Schema({
    ID: String,
    List: []
  })
);