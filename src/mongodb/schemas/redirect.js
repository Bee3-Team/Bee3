const { Schema, model } = require("mongoose");
module.exports = model(
  "redirects",
  new Schema({
    CODE: String,
    Redirect: String
  })
);