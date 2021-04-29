require("dotenv").config();

module.exports = {
  token: process.env.token,
  prefix: "!",
  mongodb: process.env.mongodb,
  secret: process.env.secret
};