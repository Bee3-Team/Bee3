const express = require("express");
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const path = require("path");

module.exports = async client => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.set('views', path.join(__dirname, '/views'));
  app.use(express.static(__dirname + '/public'));
  app.set('view engine', 'ejs')
  const bot = client;
  
  // web app
  app.get("/", async (req, res) => {
    res.status(200).render("home.ejs", {
      req,
      res,
      bot,
      lost: false
    })
  });
  
  // 404
  app.use("/", async (req, res) => {
    res.status(404).render("status/404.ejs", {
      req,
      res,
      bot,
      lost: true
    })
  })
  
  app.listen(port, () => {
    console.log(`The bot web was running!`);
  });
};
