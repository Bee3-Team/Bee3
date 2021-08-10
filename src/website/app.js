const express = require("express");
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const path = require("path");
const { Permissions } = require("discord.js");
var back = require("express-back");
const http = require("http").Server(app);
const io = require("socket.io")(http);

function getSubdomain(host) {
    var subdomain = host ? host.substring(0, host.lastIndexOf('.')) : null;
    return subdomain;
}

function getSubdomainList(host) {
    var subdomainList = host ? host.split('.') : null;
    if(subdomainList)
        subdomainList.splice(-1, 1);
    return subdomainList;
}

module.exports = async client => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.set("views", path.join(__dirname, "/views"));
  app.use(express.static(__dirname + "/public"));
  app.set("view engine", "ejs"); 
//   app.use(function(req, res, next) {
//     var host = req.get('host');
//     console.log(getSubdomain(host));
//     console.log(getSubdomainList(host));
//     next();
// })
  const bot = client;
  const session = require("express-session");
  const passport = require("passport");
  const Strategy = require("passport-discord").Strategy;
  var MongoStore = require('connect-mongo')(session);
  
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
        clientID: "837251737630408734",
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
      resave: true,
      saveUninitialized: false,
      store: new MongoStore({
    mongooseConnection: client.db,
    autoRemove: 'disabled'
  })
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(back());
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
    });
  });
  
  app.get(
    "/callback",
    passport.authenticate("discord", { failureRedirect: "/" }),
    function(req, res, next) {
      return res.redirect("/account/server-list");
    } // auth successs
  );
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // owner app
  var subdomain = require('express-subdomain');
  const porto = express.Router();
  app.use(subdomain('owner', porto));  
  
  porto.get("/redirect", async (req, res) => {
    let query = req.query.code;
    if (query === "YOUTUBE") {
      return res.redirect('https://youtube.com/Vins2106')
    } else if (query === "DISCORD") {
      return res.redirect('https://discord.gg/MUEwtCfeT8')
    }
    
    res.render("owner/redirect.ejs")
  });
  
  let rDB = require("../mongodb/schemas/redirect.js");
  
  app.get("/api/redirect", async (req, res) => {
    let code = req.query.code;
    if (!code) return res.status(404).send({e: true, msg: "No code provided"});
    
    if (code === "YOUTUBE") {
      return res.status(200).send({e: false, r: 'https://youtube.com/Vins2106'})
    } else if (code === "DISCORD") {
      return res.status(200).send({e: false, r: 'https://discord.gg/MUEwtCfeT8'})
    }    
    
    console.log(code)
    let check = await rDB.findOne({CODE: code});
    console.log(check)
    if (!check) return res.status(404).send({e: true, msg: "Invalid code"});
    
    return res.status(200).send({e: false, r: check.Redirect})
  })
  
  porto.get("/", async (req, res) => {
    res.render("owner/portofolio.ejs")
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
      if (!permsCheck) {
        perms = 2147483656;
      } else if (permsCheck) {
        let check = new Permissions(Number(permsCheck));
        let check2 = check.FLAGS ? true : false;
        if (!check2) perms = 2147483656;
        else perms = check.bitfield;
      }

      return res.redirect(
        `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=${perms}&redirect_uri=https%3A%2F%2Fbeee.cf&scope=bot`
      );
    } else {
      if (!permsCheck) {
        perms = 2147483656;
      } else if (permsCheck) {
        let check = new Permissions(Number(permsCheck));
        let check2 = check.FLAGS ? true : false;
        if (!check2) perms = 2147483656;
        else perms = check.bitfield;
      }

      // https://discord.com/api/oauth2/authorize?client_id=832610957405847562&permissions=${perms}&redirect_uri=https%3A%2F%2Fbeee.cf%2Faccount%2Fserver-list&scope=bot&guild_id=${guild}&disable_guild_select=true
      // https://discord.com/oauth2/authorize?scope=bot&response_type=code&redirect_uri=https%3A%2F%2Fbeee.cf%2Faccount%2Fserver-list&permissions=8&client_id=${client.user.id}&guild_id=${guild}
      return res.redirect(
        `https://discord.com/oauth2/authorize?scope=bot&response_type=code&redirect_uri=https%3A%2F%2Fbeee.cf%2Faccount%2Fserver-list&permissions=8&client_id=${client.user.id}&guild_id=${guild}&disable_guild_select=true`
      );
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
    });
  });

  app.get("/account/owner", checkAuth, async (req, res) => {
    res.render("owner/acc.ejs", {
      req,
      res,
      bot,
      lost: false,
      user: await client.users.fetch(req.user.id.toString()),
      owner: await client.users.fetch("727110220400033865")
    });
  });

  app.get("/account/server-list", checkAuth, async (req, res) => {
    if (req.query.guild_id) {
      return res.redirect("/dashboard/" + req.query.guild_id);
    }

    if (req.query.mp === "true") {
      return res.render("acc/server-list.ejs", {
        req,
        res,
        bot,
        lost: false,
        user: await client.users.fetch(req.user.id.toString()),
        Permissions: Permissions,
        missing_permission: { type: true, guild: req.query.mpguild }
      });
    } else if (!req.query.mp) {
      res.render("acc/server-list.ejs", {
        req,
        res,
        bot,
        lost: false,
        user: await client.users.fetch(req.user.id.toString()),
        Permissions: Permissions,
        missing_permission: { type: false }
      });
    }
  });

  app.get("/dashboard/:id", checkAuth, async (req, res) => {
    
    
    let guild_id = req.params.id;
    if (!guild_id) return res.redirect("/account/server-list");
    if (isNaN(guild_id)) return res.redirect("/account/server-list");

    let checkUserGuild = req.user.guilds.find(x => x.id == guild_id);
    if (!checkUserGuild) return res.redirect("/account/server-list");

    let perms = new Permissions(checkUserGuild.permissions);
    if (!perms.has("MANAGE_GUILD")) {
      return res.redirect(
        "/account/server-list?mp=true&mpguild=" + checkUserGuild.name + "#error"
      );
    }

    let findGuildDB = await client.Guild.findOne({ ID: checkUserGuild.id });

    if (!findGuildDB) {
      findGuildDB = await client.Guild.Create(false, guild_id);
    }

    res.render("acc/dashboard-stats.ejs", {
      req,
      res,
      bot,
      lost: false,
      user: await client.users.fetch(req.user.id.toString()),
      Permission: Permissions,
      guild: client.guilds.cache.get(checkUserGuild.id),
      database: findGuildDB
    });
  });

  app.get("/dashboard/:id/settings", checkAuth, async (req, res) => {
    
    
    let guild_id = req.params.id;
    if (!guild_id) return res.redirect("/account/server-list");
    if (isNaN(guild_id)) return res.redirect("/account/server-list");

    let checkUserGuild = req.user.guilds.find(x => x.id == guild_id);
    if (!checkUserGuild) return res.redirect("/account/server-list");

    let perms = new Permissions(checkUserGuild.permissions);
    if (!perms.has("MANAGE_GUILD")) {
      return res.redirect(
        "/account/server-list?mp=true&mpguild=" + checkUserGuild.name + "#error"
      );
    }

    let findGuildDB = await client.Guild.findOne({ ID: checkUserGuild.id });

    if (!findGuildDB) {
      findGuildDB = await client.Guild.Create(false, guild_id);
    }

    res.render("acc/dashboard-settings.ejs", {
      req,
      res,
      bot,
      lost: false,
      user: await client.users.fetch(req.user.id.toString()),
      Permission: Permissions,
      guild: client.guilds.cache.get(checkUserGuild.id),
      database: findGuildDB
    });
  });

  app.get("/dashboard/:id/commands", checkAuth, async (req, res) => {
    
    
    let guild_id = req.params.id;
    if (!guild_id) return res.redirect("/account/server-list");
    if (isNaN(guild_id)) return res.redirect("/account/server-list");

    let checkUserGuild = req.user.guilds.find(x => x.id == guild_id);
    if (!checkUserGuild) return res.redirect("/account/server-list");

    let perms = new Permissions(checkUserGuild.permissions);
    if (!perms.has("MANAGE_GUILD")) {
      return res.redirect(
        "/account/server-list?mp=true&mpguild=" + checkUserGuild.name + "#error"
      );
    }

    let findGuildDB = await client.Guild.findOne({ ID: checkUserGuild.id });

    if (!findGuildDB) {
      findGuildDB = await client.Guild.Create(false, guild_id);
    }

    res.render("acc/dashboard-commands.ejs", {
      req,
      res,
      bot,
      lost: false,
      user: await client.users.fetch(req.user.id.toString()),
      Permission: Permissions,
      guild: client.guilds.cache.get(checkUserGuild.id),
      database: findGuildDB
    });
  });
  
  app.get("/dashboard/:id/automod", checkAuth, async (req, res) => {
    
    
    let guild_id = req.params.id;
    if (!guild_id) return res.redirect("/account/server-list");
    if (isNaN(guild_id)) return res.redirect("/account/server-list");

    let checkUserGuild = req.user.guilds.find(x => x.id == guild_id);
    if (!checkUserGuild) return res.redirect("/account/server-list");

    let perms = new Permissions(checkUserGuild.permissions);
    if (!perms.has("MANAGE_GUILD")) {
      return res.redirect(
        "/account/server-list?mp=true&mpguild=" + checkUserGuild.name + "#error"
      );
    }
 
    let findGuildDB = await client.Guild.findOne({ ID: checkUserGuild.id });

    if (!findGuildDB) {
      findGuildDB = await client.Guild.Create(false, guild_id);
    }

    let _enable = false;
    let __enable = false;
    let disabledF = [];
    let badwordList;

      findGuildDB.Settings.DisabledFeatures.map(disabledFT => {
        disabledF.push(disabledFT.Name.toLowerCase());
      });
    if (disabledF.includes("anti-link")) _enable = true;
    if (disabledF.includes("badwords")) {
      __enable = true;
    }
    
    badwordList = await client.Badword.Find(checkUserGuild.id);
    res.render("acc/dashboard-automod.ejs", {
      req,
      res,
      bot,
      lost: false,
      user: await client.users.fetch(req.user.id.toString()),
      Permission: Permissions,
      guild: client.guilds.cache.get(checkUserGuild.id),
      database: findGuildDB,
      enable_: _enable,
      enable__: __enable,
      badwordList
    });    
  });
  
  app.get("/dashboard/:id/cc", checkAuth, async (req, res) => {
    
    
    let guild_id = req.params.id;
    if (!guild_id) return res.redirect("/account/server-list");
    if (isNaN(guild_id)) return res.redirect("/account/server-list");

    let checkUserGuild = req.user.guilds.find(x => x.id == guild_id);
    if (!checkUserGuild) return res.redirect("/account/server-list");

    let perms = new Permissions(checkUserGuild.permissions);
    if (!perms.has("MANAGE_GUILD")) {
      return res.redirect(
        "/account/server-list?mp=true&mpguild=" + checkUserGuild.name + "#error"
      );
    }
 
    let findGuildDB = await client.Guild.findOne({ ID: checkUserGuild.id });

    if (!findGuildDB) {
      findGuildDB = await client.Guild.Create(false, guild_id);
    }
    
    res.render("acc/dashboard-cc.ejs", {
      req,
      res,
      bot,
      lost: false,
      user: await client.users.fetch(req.user.id.toString()),
      Permission: Permissions,
      guild: client.guilds.cache.get(checkUserGuild.id),
      database: findGuildDB
    });    
  });  

  app.post("/dashboard/:id/cc", checkAuth, async (req, res) => {
    
    
    let guild_id = req.params.id;
    if (!guild_id) return res.redirect("/account/server-list");
    if (isNaN(guild_id)) return res.redirect("/account/server-list");

    let checkUserGuild = req.user.guilds.find(x => x.id == guild_id);
    if (!checkUserGuild) return res.redirect("/account/server-list");

    let perms = new Permissions(checkUserGuild.permissions);
    if (!perms.has("MANAGE_GUILD")) {
      return res.redirect(
        "/account/server-list?mp=true&mpguild=" + checkUserGuild.name + "#error"
      );
    }
 
    let findGuildDB = await client.Guild.findOne({ ID: checkUserGuild.id });

    if (!findGuildDB) {
      findGuildDB = await client.Guild.Create(false, guild_id);
    }
    
    if (req.body.cc.length) {
      findGuildDB.CustomCommands = req.body.cc;
    }
    
    findGuildDB.save()
    
    res.redirect(`/dashboard/${guild_id}/cc`)
  });  

  
  app.post("/dashboard/:id/commands", checkAuth, async (req, res) => {
    
    
    let guild_id = req.params.id;
    if (!guild_id) return res.redirect("/account/server-list");
    if (isNaN(guild_id)) return res.redirect("/account/server-list");

    let checkUserGuild = req.user.guilds.find(x => x.id == guild_id);
    if (!checkUserGuild) return res.redirect("/account/server-list");

    let perms = new Permissions(checkUserGuild.permissions);
    if (!perms.has("MANAGE_GUILD")) {
      return res.redirect(
        "/account/server-list?mp=true&mpguild=" + checkUserGuild.name + "#error"
      );
    }

    let findGuildDB = await client.Guild.findOne({ ID: checkUserGuild.id });

    if (!findGuildDB) {
      findGuildDB = await client.Guild.Create(false, guild_id);
    }

    let disabled = [];
    let noDisabled = [];

    client.Commands.map(cmd => {
      let cmdDisabled_ = req.body[`${cmd.name}`];
      if (!cmdDisabled_) {
        disabled.push(cmd);
      } else if (cmdDisabled_) { 
        noDisabled.push(cmd);
      }
    });

    findGuildDB.Settings.DisabledCommands = disabled;
    findGuildDB.save();

    res.redirect(`/dashboard/${guild_id}/commands`);
  });

  app.post("/dashboard/:id/automod", checkAuth, async (req, res) => {
    
    
    let guild_id = req.params.id;
    if (!guild_id) return res.redirect("/account/server-list");
    if (isNaN(guild_id)) return res.redirect("/account/server-list");

    let checkUserGuild = req.user.guilds.find(x => x.id == guild_id);
    if (!checkUserGuild) return res.redirect("/account/server-list");

    let perms = new Permissions(checkUserGuild.permissions);
    if (!perms.has("MANAGE_GUILD")) {
      return res.redirect(
        "/account/server-list?mp=true&mpguild=" + checkUserGuild.name + "#error"
      );
    }

    let findGuildDB = await client.Guild.findOne({ ID: checkUserGuild.id });

    if (!findGuildDB) {
      findGuildDB = await client.Guild.Create(false, guild_id);
    }
    
    let _enable = [], _enableStruct, List = [];
    
    let enable = req.body[`anti-link`];
    let enable_ = req.body[`badwords`];
    let badwordList = req.body[`badwordsList`];
    
    let __enableStruct = require("../other/Features.js")[1];
    if (enable_) {
      await client.Badword.SaveAndCreate(guild_id, badwordList);
      _enable.push(__enableStruct);
    }
    
    _enableStruct = require("../other/Features.js")[0];
    if (enable) {
      _enable.push(_enableStruct)
    }
    findGuildDB.Settings.DisabledFeatures = _enable;
    
    findGuildDB.save();

    res.redirect(`/dashboard/${guild_id}/automod`);
  });  
  
  app.get("/commands", async (req, res) => {
    let guild_id = req.query.id;
    if (!guild_id) return res.redirect("/");

    let findGuild = client.guilds.cache.get(guild_id);
    if (!findGuild) return res.redirect("/");

    let findGuildDB = await client.Guild.findOne({ ID: findGuild.id });

    if (!findGuildDB) {
      findGuildDB = await client.Guild.Create(false, guild_id);
    }

    return res.render("commands.ejs", {
      res,
      req,
      bot,
      lost: false,
      Permission: Permissions,
      guild: findGuild,
      database: findGuildDB
    });
  });
  
  app.get("/queue", async (req, res) => {
    let guild_id = req.query.id;
    if (!guild_id) return res.redirect("/");
    
    let findGuild = client.guilds.cache.get(guild_id);
    if (!findGuild) return res.redirect("/");
    
    let serverQueue = client.music.queue.get(findGuild.id)
    if (!serverQueue) return res.redirect("/");
    
    return res.render("queue.ejs", {
      res,
      req,
      bot,
      lost: false,
      Permission: Permissions,
      guild: findGuild, 
      queue: serverQueue
    })
  });

  app.post("/dashboard/:id/settings", checkAuth, async (req, res) => {
    
    
    let guild_id = req.params.id;
    if (!guild_id) return res.redirect("/account/server-list");
    if (isNaN(guild_id)) return res.redirect("/account/server-list");

    let checkUserGuild = req.user.guilds.find(x => x.id == guild_id);
    if (!checkUserGuild) return res.redirect("/account/server-list");

    let perms = new Permissions(checkUserGuild.permissions);
    if (!perms.has("MANAGE_GUILD")) {
      return res.redirect(
        "/account/server-list?mp=true&mpguild=" + checkUserGuild.name + "#error"
      );
    }

    let newUsername = req.body.newUsername;
    let newPrefix = req.body.newPrefix;

    let getGuild = client.guilds.cache.get(checkUserGuild.id);
    if (!getGuild) return res.redirect("/account/server-list");

    getGuild.me.setNickname(newUsername);

    let findGuildDB = await client.Guild.findOne({ ID: checkUserGuild.id });

    findGuildDB.Settings.Prefix = newPrefix.toString();
    findGuildDB.save();

    return res.redirect(`/dashboard/${guild_id}/settings`);
  });

  // music player
  
  app.get("/musicplayer/:gid", checkAuth, async(req, res) => {
    let gid = req.params.gid;
    if (!gid) return res.redirect("/");
    
    let findGid = client.guilds.cache.get(gid.toString());
    if (!findGid) return res.redirect("/");
    
    let queue = null;
    
    let getQueue = client.music.queue.get(gid);
    if (getQueue) queue = getQueue;
    
    let findGuildDB = await client.Guild.findOne({ ID: gid });

    if (!findGuildDB) {
      findGuildDB = await client.Guild.Create(false, gid);
    }

    res.render("music/index.ejs", {
      req,
      res,
      bot,
      lost: false,
      user: await client.users.fetch(req.user.id.toString()),
      Permission: Permissions,
      guild: client.guilds.cache.get(gid),
      database: findGuildDB,
      queue
    });    
  })
  
  // music player api.
  app.get("/player/play/:id", async (req, res) => {
    let guild = req.params.id;
    let user = req.query.user;
    let query = req.query.query;
    if (!guild) return res.status(404).send({success: false});
    if (!user) return res.status(404).send({success: false});
    if (!query) return res.status(404).send({success: false});
    
    let userR, guildR, channelR;
    guildR = await client.guilds.cache.get(guild);
    if (!guildR) return res.status(404).send({success: false, error: 'Unavailable server'});
    
    userR = await client.users.fetch(user);
    if (!userR) return res.status(404).send({success: false, error: 'Unavailable user'});
    
    channelR = guildR.members.cache.get(userR.id).voice.channel;
    if (!channelR) return res.status(404).send({success: false, error: 'Please join voice channel'});
    
    try {
      client.music.handle(channelR, null, guildR.id, query).catch(e => {
        return res.send({success: false, error: `${e.message}`});
      })
    } catch (e) {
      return res.send({success: false, error: `${e.message}`});
    }
    
    return res.status(200).send({success: true, voiceChannel: channelR, guild: guildR, query: query});
  });
  
  app.get("/player/stop/:id", async (req, res) => {
    let guild = req.params.id;
    let user = req.query.user;
    if (!guild) return res.status(404).send({success: false});
    if (!user) return res.status(404).send({success: false});    
    
    let userR, guildR, channelR;
    guildR = await client.guilds.cache.get(guild);
    if (!guildR) return res.status(404).send({success: false, error: 'Unavailable server'});
    
    userR = await client.users.fetch(user);
    if (!userR) return res.status(404).send({success: false, error: 'Unavailable user'});
    
    channelR = guildR.members.cache.get(userR.id).voice.channel;
    if (!channelR) return res.status(404).send({success: false, error: 'Please join voice channel'});
    
    let gq = client.music.queue.get(guild);
    if (!gq) return res.send({success: false, error: 'There is no songs.'})
    
    try {
      client.music.stop(channelR, null).catch(e => {
        return res.send({success: false, error: `${e.message}`});
      })
    } catch (e) {
      return res.send({success: false, error: `${e.message}`});
    }
    
    return res.status(200).send({success: true, by: userR, voiceChannel: channelR, guild: guildR});
  });
  
  app.get("/player/now-playing/:id", async (req, res) => {
    let guild = req.params.id;
    let user = req.query.user;
    if (!guild) return res.status(404).send({success: false});
    
    let userR, guildR, channelR;
    guildR = await client.guilds.cache.get(guild);
    if (!guildR) return res.status(404).send({success: false, error: 'Unavailable server'});
    
    let nowPlaying;
    
    try {
      nowPlaying = await client.music.nowPlaying(guildR.id, null).catch(e => {
        return res.send({success: false, error: `${e.message}`});
      })
    } catch (e) {
      return res.send({success: false, error: `${e.message}`});
    }
    
    return res.status(200).send({success: true, song: {title: nowPlaying.title, url: nowPlaying.url, duration: nowPlaying.duration}});
    
  });
  
  app.get("/player/skip/:id", async (req, res) => {
    let guild = req.params.id;
    let user = req.query.user;
    if (!guild) return res.status(404).send({success: false});
    if (!user) return res.status(404).send({success: false});    
    
    let userR, guildR, channelR;
    guildR = await client.guilds.cache.get(guild);
    if (!guildR) return res.status(404).send({success: false, error: 'Unavailable server'});
    
    userR = await client.users.fetch(user);
    if (!userR) return res.status(404).send({success: false, error: 'Unavailable user'});
    
    channelR = guildR.members.cache.get(userR.id).voice.channel;
    if (!channelR) return res.status(404).send({success: false, error: 'Please join voice channel'});
    
    try {
      client.music.skip(channelR, null).catch(e => {
        return res.send({success: false, error: `${e.message}`});
      })
    } catch (e) {
      return res.send({success: false, error: `${e.message}`});
    }
    
    return res.status(200).send({success: true, by: userR, voiceChannel: channelR, guild: guildR});    
  });
  
  app.get("/player/set-volume/:id", async (req, res) => {
    let guild = req.params.id;
    let user = req.query.user;
    let value = req.query.value;
    if (!guild) return res.status(404).send({success: false});
    if (!user) return res.status(404).send({success: false});    
    if (!value) return res.status(404).send({success: false});
    
    let userR, guildR, channelR;
    guildR = await client.guilds.cache.get(guild);
    if (!guildR) return res.status(404).send({success: false, error: 'Unavailable server'});
    
    userR = await client.users.fetch(user);
    if (!userR) return res.status(404).send({success: false, error: 'Unavailable user'});
    
    channelR = guildR.members.cache.get(userR.id).voice.channel;
    if (!channelR) return res.status(404).send({success: false, error: 'Please join voice channel'});

    try {
      client.music.setVolume(channelR, null, value).catch(e => {
        return res.send({success: false, error: `${e.message}`});
      })
    } catch (e) {
      return res.send({success: false, error: `${e.message}`});
    }
    
    return res.status(200).send({success: true, by: userR, voiceChannel: channelR, guild: guildR, volume: value});
  });
  
  app.get("/player/pause-resume/:id", async (req, res) => {
    let guild = req.params.id;
    let user = req.query.user;
    if (!guild) return res.status(404).send({success: false});
    if (!user) return res.status(404).send({success: false});
    
    let userR, guildR, channelR;
    guildR = await client.guilds.cache.get(guild);
    if (!guildR) return res.status(404).send({success: false, error: 'Unavailable server'});
    
    userR = await client.users.fetch(user);
    if (!userR) return res.status(404).send({success: false, error: 'Unavailable user'});
    
    channelR = guildR.members.cache.get(userR.id).voice.channel;
    if (!channelR) return res.status(404).send({success: false, error: 'Please join voice channel'});
    
    let playing;
    
    if (!client.music.queue.get(guildR.id)) return this.emit("noQueue")
    
    playing = client.music.queue.get(guildR.id).playing;
    
    try {
       client.music.pauseResume(channelR, guildR.id, null).catch(e => {
         return res.send({success: false, error: `${e.message}`});
       })
    } catch (e) {
      return res.send({success: false, error: `${e.message}`})
    }
    
    return res.send({success: true, by: userR, voiceChannel: channelR, guild: guildR, playing: !playing})
  });
  
  app.get("/player/loop/:id", async (req, res) => {
    let guild = req.params.id;
    let user = req.query.user;
    if (!guild) return res.status(404).send({success: false});
    if (!user) return res.status(404).send({success: false});
    
    let userR, guildR, channelR;
    guildR = await client.guilds.cache.get(guild);
    if (!guildR) return res.status(404).send({success: false, error: 'Unavailable server'});
    
    userR = await client.users.fetch(user);
    if (!userR) return res.status(404).send({success: false, error: 'Unavailable user'});
    
    channelR = guildR.members.cache.get(userR.id).voice.channel;
    if (!channelR) return res.status(404).send({success: false, error: 'Please join voice channel'});
    
    let looping;
    
    if (!client.music.queue.get(guildR.id)) return this.emit("noQueue")
    
    looping = client.music.queue.get(guildR.id).loop;
    
    try {
       client.music.loop(channelR, guildR.id, null).catch(e => {
         return res.send({success: false, error: `${e.message}`});
       })
    } catch (e) {
      return res.send({success: false, error: `${e.message}`})
    }
    
    return res.send({success: true, by: userR, voiceChannel: channelR, guild: guildR, loop: !looping})
  });    
  
  // music player end
  
  // app.get("/chatapp", (req, res) => {
  //   res.render("chatapp/chat.ejs", {
  //     res,
  //     req,
  //     bot,
  //     lost: false
  //   })
  // })
  
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
    return res.redirect("/login");
  }

  // app.listen(port, () => {
  //   console.log(`[WEBSITE] the bot web was running!`);
  // });

  // socket.io (realtime music - to discord)
//listen on every connection
  io.on("connection", async socket => {
    
    // when music play, add pause and resume.
    socket.on("server", gid => {
      if (socket.Server) clearInterval(socket.Server)
      socket.Server = setInterval(() => {
      let GUILD = client.guilds.cache.get(gid);
      if (!GUILD) return socket.emit("error", 'Cannot find this server');
      
      let serverQueue = client.music.queue.get(gid);
      if (!serverQueue) {
        socket.emit("server2", {
          currentlyPlaying: false
        });
      } else {
        socket.emit("server2", {
          currentlyPlaying: true,
          prb: serverQueue.playing ? "Pause" : "Resume",
          lb: serverQueue.loop ? "Unloop" : "Loop",
          song: serverQueue.songs[0],
          songs: serverQueue.songs
        });        
      }        
      }, 1000)
    })
    
  })
  
  io.on("recoonect", attempt => {
    console.log(attempt)
  })
  
module.exports = {io}
  
http.listen(process.env.PORT, () => {
  console.log(`[WEBSITE] the bot web was running!`);
});  
};