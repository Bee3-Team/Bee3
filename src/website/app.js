const express = require("express");
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const path = require("path");
const { Permissions } = require("discord.js");
var back = require("express-back");
const http = require("http").Server(app);
const io = require("socket.io")(http);

module.exports = async client => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
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
      resave: false,
      saveUninitialized: false
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
        perms = 8;
      } else if (permsCheck) {
        let check = new Permissions(Number(permsCheck));
        let check2 = check.FLAGS ? true : false;
        if (!check2) perms = 8;
        else perms = check.bitfield;
      }

      return res.redirect(
        `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=${perms}&redirect_uri=https%3A%2F%2Fbeee.cf&scope=bot`
      );
    } else {
      if (!permsCheck) {
        perms = 8;
      } else if (permsCheck) {
        let check = new Permissions(Number(permsCheck));
        let check2 = check.FLAGS ? true : false;
        if (!check2) perms = 8;
        else perms = check.bitfield;
      }

      // https://discord.com/api/oauth2/authorize?client_id=832610957405847562&permissions=${perms}&redirect_uri=https%3A%2F%2Fbeee.cf%2Faccount%2Fserver-list&scope=bot&guild_id=${guild}&disable_guild_select=true
      return res.redirect(
        `https://discord.com/api/oauth2/authorize?client_id=832610957405847562&permissions=${perms}&redirect_uri=https%3A%2F%2Fbeee.cf%2Faccount%2Fserver-list&response_type=code&scope=bot&guild_id=${guild}`
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
    let disabledF = [];

      findGuildDB.Settings.DisabledFeatures.map(disabledFT => {
        disabledF.push(disabledFT.Name.toLowerCase());
      });
    if (disabledF.includes("anti-link")) _enable = true;
    
    res.render("acc/dashboard-automod.ejs", {
      req,
      res,
      bot,
      lost: false,
      user: await client.users.fetch(req.user.id.toString()),
      Permission: Permissions,
      guild: client.guilds.cache.get(checkUserGuild.id),
      database: findGuildDB,
      enable_: _enable
    });    
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
    
    let _enable = [], _enableStruct;
    
    let enable = req.body[`anti-link`];
    
    _enableStruct = require("../other/Features.js")[0];
    if (enable) {
      _enable.push(_enableStruct)
      findGuildDB.Settings.DisabledFeatures = _enable;
    } else if (!enable) {
      findGuildDB.Settings.DisabledFeatures = [];
    }
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
  
  // music player api.
//   app.get("/player/play/:id", async (req, res) => {
//     let guild = req.params.id;
//     let user = req.query.user;
//     let query = req.query.query;
//     if (!guild) return res.status(404).send({success: false});
//     if (!user) return res.status(404).send({success: false});
//     if (!query) return res.status(404).send({success: false});
    
//     let userR, guildR, channelR;
//     guildR = await client.guilds.cache.get(guild);
//     if (!guildR) return res.status(404).send({success: false, error: 'Cannot get guild'});
    
//     userR = await client.users.fetch(user);
//     if (!userR) return res.status(404).send({success: false, error: 'Cannot get user'});
    
//     channelR = guildR.members.cache.get(userR.id).voice.channel;
//     if (!channelR) return res.status(404).send({success: false, error: 'Cannot get user voice channel'});
    
//     try {
//       client.music.handle(channelR, null, guildR.id, query).catch(e => {
//         return res.send({success: false, error: `${e.message}`});
//       })
//     } catch (e) {
//       return res.send({success: false, error: `${e.message}`});
//     }
    
//     return res.status(200).send({success: true, voiceChannel: channelR, guild: guildR, query: query});
//   });
  
//   app.get("/player/stop/:id", async (req, res) => {
//     let guild = req.params.id;
//     let user = req.query.user;
//     if (!guild) return res.status(404).send({success: false});
//     if (!user) return res.status(404).send({success: false});    
    
//     let userR, guildR, channelR;
//     guildR = await client.guilds.cache.get(guild);
//     if (!guildR) return res.status(404).send({success: false, error: 'Cannot get guild'});
    
//     userR = await client.users.fetch(user);
//     if (!userR) return res.status(404).send({success: false, error: 'Cannot get user'});
    
//     channelR = guildR.members.cache.get(userR.id).voice.channel;
//     if (!channelR) return res.status(404).send({success: false, error: 'Cannot get user voice channel'});
    
//     try {
//       client.music.stop(channelR, null).catch(e => {
//         return res.send({success: false, error: `${e.message}`});
//       })
//     } catch (e) {
//       return res.send({success: false, error: `${e.message}`});
//     }
    
//     return res.status(200).send({success: true, by: userR, voiceChannel: channelR, guild: guildR});
//   });
  
//   app.get("/player/now-playing/:id", async (req, res) => {
//     let guild = req.params.id;
//     let user = req.query.user;
//     if (!guild) return res.status(404).send({success: false});
    
//     let userR, guildR, channelR;
//     guildR = await client.guilds.cache.get(guild);
//     if (!guildR) return res.status(404).send({success: false, error: 'Cannot get guild'});
    
//     let nowPlaying;
    
//     try {
//       nowPlaying = await client.music.nowPlaying(guildR.id, null).catch(e => {
//         return res.send({success: false, error: `${e.message}`});
//       })
//     } catch (e) {
//       return res.send({success: false, error: `${e.message}`});
//     }
    
//     return res.status(200).send({success: true, song: {title: nowPlaying.title, url: nowPlaying.url, duration: nowPlaying.duration}});
    
//   });
  
//   app.get("/player/skip/:id", async (req, res) => {
//     let guild = req.params.id;
//     let user = req.query.user;
//     if (!guild) return res.status(404).send({success: false});
//     if (!user) return res.status(404).send({success: false});    
    
//     let userR, guildR, channelR;
//     guildR = await client.guilds.cache.get(guild);
//     if (!guildR) return res.status(404).send({success: false, error: 'Cannot get guild'});
    
//     userR = await client.users.fetch(user);
//     if (!userR) return res.status(404).send({success: false, error: 'Cannot get user'});
    
//     channelR = guildR.members.cache.get(userR.id).voice.channel;
//     if (!channelR) return res.status(404).send({success: false, error: 'Cannot get user voice channel'});
    
//     try {
//       client.music.skip(channelR, null).catch(e => {
//         return res.send({success: false, error: `${e.message}`});
//       })
//     } catch (e) {
//       return res.send({success: false, error: `${e.message}`});
//     }
    
//     return res.status(200).send({success: true, by: userR, voiceChannel: channelR, guild: guildR});    
//   });
  
//   app.get("/player/set-volume/:id", async (req, res) => {
//     let guild = req.params.id;
//     let user = req.query.user;
//     let value = req.query.value;
//     if (!guild) return res.status(404).send({success: false});
//     if (!user) return res.status(404).send({success: false});    
//     if (!value) return res.status(404).send({success: false});
    
//     let userR, guildR, channelR;
//     guildR = await client.guilds.cache.get(guild);
//     if (!guildR) return res.status(404).send({success: false, error: 'Cannot get guild'});
    
//     userR = await client.users.fetch(user);
//     if (!userR) return res.status(404).send({success: false, error: 'Cannot get user'});
    
//     channelR = guildR.members.cache.get(userR.id).voice.channel;
//     if (!channelR) return res.status(404).send({success: false, error: 'Cannot get user voice channel'});

//     try {
//       client.music.setVolume(channelR, null, value).catch(e => {
//         return res.send({success: false, error: `${e.message}`});
//       })
//     } catch (e) {
//       return res.send({success: false, error: `${e.message}`});
//     }
    
//     return res.status(200).send({success: true, by: userR, voiceChannel: channelR, guild: guildR, volume: value});
//   });
  
//   app.get("/player/pause-resume/:id", async (req, res) => {
//     let guild = req.params.id;
//     let user = req.query.user;
//     if (!guild) return res.status(404).send({success: false});
//     if (!user) return res.status(404).send({success: false});
    
//     let userR, guildR, channelR;
//     guildR = await client.guilds.cache.get(guild);
//     if (!guildR) return res.status(404).send({success: false, error: 'Cannot get guild'});
    
//     userR = await client.users.fetch(user);
//     if (!userR) return res.status(404).send({success: false, error: 'Cannot get user'});
    
//     channelR = guildR.members.cache.get(userR.id).voice.channel;
//     if (!channelR) return res.status(404).send({success: false, error: 'Cannot get user voice channel'});
    
//     let playing;
    
//     if (!client.music.queue.get(guildR.id)) return this.emit("noQueue")
    
//     playing = client.music.queue.get(guildR.id).playing;
    
//     try {
//        client.music.pauseResume(channelR, guildR.id, null).catch(e => {
//          return res.send({success: false, error: `${e.message}`});
//        })
//     } catch (e) {
//       return res.send({success: false, error: `${e.message}`})
//     }
    
//     return res.send({success: true, by: userR, voiceChannel: channelR, guild: guildR, playing: !playing})
//   });
  
//   app.get("/musicplayer", checkAuth, async (req, res) => {
//     const guildQ = req.query.g;
//     if (!guildQ) return res.redirect("/");
    
//     let guild = client.guilds.cache.get(guildQ);
//     if (!guild) return res.redirect("/");
    
//     let voiceChannel = guild.members.cache.get(req.user.id).voice.channel;
//     if (!voiceChannel) return res.redirect("/musicplayer/novoice?g=" + guildQ);
    
//     let status;
    
//     let queue = client.music.queue.get(guild.id);
//     if (!queue) {
//       status = false;
//     } else if (queue) {
//       status = true;
//     }
    
//     res.render("player/player.ejs", {
//       res,
//       req,
//       bot,
//       lost: false,
//       Permission: Permissions,
//       guild: guild, 
//       queue,
//       status
//     })
//   });
  
//   app.get("/musicplayer/novoice", checkAuth, async (req, res) => {
//     const guildQ = req.query.g;
//     if (!guildQ) return res.redirect("/");
    
//     client.waiting.set(req.user.id, true);
//     let guild = client.guilds.cache.get(guildQ);
//     if (!guild) return res.redirect("/");
    
//     res.render("player/waiting.ejs", {
//       res,
//       req,
//       bot, 
//       lost: false,
//       guild: guild,
//       voice: guild.members.cache.get(req.user.id).voice.channel
//     })
//   });
  
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
// io.on('connection', (socket) => {

//   client.socket = socket;
	
//   socket.on("voiceUpdate", user => {
//     io.emit("voiceUpdate", user);
//   });
// });
  
module.exports = {io}
  
http.listen(process.env.PORT, () => {
  console.log(`[WEBSITE] the bot web was running!`);
});  
};