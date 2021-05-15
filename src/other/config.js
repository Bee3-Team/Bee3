require("dotenv").config();

module.exports = {
  token: process.env.token,
  prefix: "!",
  yt: process.env.yt,
  mongodb: process.env.mongodb,
  secret: process.env.secret,
  maxCommands: 5
};