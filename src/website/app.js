const express = require("express");
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const path = require("path");
const { Permissions } = require("discord.js");

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
  
  app.get("/invite", async (req, res) => {
    let perms;
    
    let permsCheck = req.query.permission;
    let guild = req.query.guild;
    if (!guild) {
    if (!permsCheck)  {
      perms = 8;
    } else if (permsCheck) {
      let check = new Permissions(Number(permsCheck));
      let check2 = check.FLAGS ? true : false;
      if (!check2) perms = 8; else perms = check.bitfield;
    }
    
    return res.redirect(`https://discord.com/api/oauth2/authorize?client_id=832610957405847562&permissions=${perms}&redirect_uri=https%3A%2F%2Fbeee.cf&scope=bot`)      
    } else {
    if (!permsCheck)  {
      perms = 8;
    } else if (permsCheck) {
      let check = new Permissions(Number(permsCheck));
      let check2 = check.FLAGS ? true : false;
      if (!check2) perms = 8; else perms = check.bitfield;
    }
      
    
    return res.redirect(`https://discord.com/oauth2/authorize?client_id=204255083083333633&scope=bot&permissions=${perms}&guild_id=${guild}&disable_guild_select=true&response_type=code&redirect_uri=https%3A%2F%2Fbeee.cf%2Fdashboard%3Fguild%3D${guild}`)      
    }
    
  });
  
  app.get("/support", async (req, res) => {
    res.redirect("https://discord.gg/vH7fhRWg53");
  });

  app.get("/account", checkAuth, async (req, res) => {
    res.render("acc/account.ejs", {
      req,
      res,
      bot,
      lost: false,
      user: await client.users.fetch(req.user.id.toString())
    })
  });
  
  app.get("/account/server-list", checkAuth, async (req, res) => {
    res.render("acc/server-list.ejs", {
      req,
      res,
      bot,
      lost: false,
      user: await client.users.fetch(req.user.id.toString()),
      Permissions: Permissions
    })
  });  
  
  // 404
  app.get("*", async (req, res) => {
    res.status(404).render("status/404.ejs", {
      req,
      res,
      bot,
      lost: true
    });
  });

  function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login")
  }

  app.listen(port, () => {
    console.log(`The bot web was running!`);
  });
};
