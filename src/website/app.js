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
    "/login/discord",
    passport.authenticate("discord", { scope: scopes, prompt: prompt }),
    function(req, res) {}
  );
  app.get("/login", async (req, res) => {
    return res.render("status/onlogin.ejs", {
      req,
      res,
      bot,
      lost: false
    })    
  });
  app.get( 
    "/callback",
    passport.authenticate("discord", { failureRedirect: "/" }),
    function(req, res, next) {
      return next();
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
      
    // https://discord.com/api/oauth2/authorize?client_id=832610957405847562&permissions=${perms}&redirect_uri=https%3A%2F%2Fbeee.cf%2Faccount%2Fserver-list&scope=bot&guild_id=${guild}&disable_guild_select=true
    return res.redirect(`https://discord.com/api/oauth2/authorize?client_id=832610957405847562&permissions=${perms}&redirect_uri=https%3A%2F%2Fbeee.cf%2Faccount%2Fserver-list&response_type=code&scope=bot&guild_id=${guild}`)      
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
  
  app.get("/account/owner", checkAuth, async (req, res) => {
    res.render("owner/acc.ejs", {
      req,
      res,
      bot,
      lost: false,
      user: await client.users.fetch(req.user.id.toString()),
      owner: await client.users.fetch("727110220400033865")
    })
  });  
  
  app.get("/account/server-list", checkAuth, async (req, res) => {
    if (req.query.guild_id) {
      return res.redirect("/dashboard/" + req.query.guild_id)
    }
    
    if (req.query.mp === "true") {
      return res.render("acc/server-list.ejs", {
        req,
        res,
        bot,
        lost: false,
        user: await client.users.fetch(req.user.id.toString()),
        Permissions: Permissions,
        missing_permission: {type: true, guild: req.query.mpguild}       
      })
    } else if (!req.query.mp) {
    res.render("acc/server-list.ejs", {
      req,
      res,
      bot,
      lost: false,
      user: await client.users.fetch(req.user.id.toString()),
      Permissions: Permissions,
      missing_permission: {type: false}
    })
    }
    
  });  
  
  app.get("/dashboard/:id", checkAuth, async (req, res) => {
    let guild_id = req.params.id;
    if (!guild_id) return res.redirect("/account/server-list");
    if (isNaN(guild_id)) return res.redirect("/account/server-list")
    
    let checkUserGuild = req.user.guilds.find(x => x.id == guild_id);
    if (!checkUserGuild) return res.redirect("/account/server-list");
    
    let perms = new Permissions(checkUserGuild.permissions);
    if (!perms.has("MANAGE_GUILD")) {
      return res.redirect("/account/server-list?mp=true&mpguild=" + checkUserGuild.name + "#error")
    }
    
    res.render("acc/dashboard-stats.ejs", {
      req,
      res,
      bot,
      lost: false,
      user: await client.users.fetch(req.user.id.toString()),
      Permission: Permissions,
      guild: client.guilds.cache.get(checkUserGuild.id)
    });
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
    return res.redirect("/login")
  }

  app.listen(port, () => {
    console.log(`The bot web was running!`);
  });
};
