const express = require("express");
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const path = require("path");

module.exports = async client => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.set("views", path.join(__dirname, "/views"));
  app.use(express.static(__dirname + "/public"));
  app.set("view engine", "ejs");
  const bot = client;
  const session = require("express-session");
  const passport = require("passport");
  const Strategy = require("passport-discord").Strategy;

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  var scopes = [
    "identify",
    /* 'connections', (it is currently broken) */ "guilds"
  ];
  var prompt = "consent";

  passport.use(
    new Strategy(
      {
        clientID: "832610957405847562",
        clientSecret: client.config.secret,
        callbackURL: "https://beee.cf/callback",
        scope: scopes,
        prompt: prompt
      },
      function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
          return done(null, profile);
        });
      }
    )
  );

  app.use(
    session({
      secret: "mybot",
      resave: false,
      saveUninitialized: false
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.get(
    "/login",
    passport.authenticate("discord", { scope: scopes, prompt: prompt }),
    function(req, res) {}
  );
  app.get(
    "/callback",
    passport.authenticate("discord", { failureRedirect: "/" }),
    function(req, res, next) {
      return res.redirect("/account/server-list");
    } // auth success
  );
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // web app
  app.get("/", async (req, res) => {
    res.status(200).render("home.ejs", {
      req,
      res,
      bot,
      lost: false
    });
  });

  // 404
  app.use("/", async (req, res) => {
    res.status(404).render("status/404.ejs", {
      req,
      res,
      bot,
      lost: true
    });
  });

  function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send("not logged in :(");
  }

  app.listen(port, () => {
    console.log(`The bot web was running!`);
  });
};
