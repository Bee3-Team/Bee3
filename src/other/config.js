require("dotenv").config();

module.exports = {
  token: process.env.token,
  prefix: "!",
  mongodb: process.env.mongodb,
  yt: process.env.yt_api
};