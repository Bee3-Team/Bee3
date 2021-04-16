const express = require("express");
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const path = require("path");

module.exports = async client => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.set('views', path.join(__dirname, '/views'));
  
  
  // 404
  app.use("/", async (req, res) => {
    res.status(404).send(`<h1>404 Not Found, cannot get ${req.baseUrl}</h1>`)
  })
  
  app.listen(port, () => {
    console.log(`The bot web was running!`);
  });
};
