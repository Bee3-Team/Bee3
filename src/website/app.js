const express = require("express");
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const path = require("path");

module.exports = async client => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.set('views', path.join(__dirname, '/views'));
  app.set('view engine', 'ejs')
  
  
  // 404
  app.use("/", async (req, res) => {
    res.status(404).render("status/404.ejs", {
      req,
      res,
      client
    })
  })
  
  app.listen(port, () => {
    console.log(`The bot web was running!`);
  });
};
