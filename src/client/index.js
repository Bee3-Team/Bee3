const Discord = require("discord.js");
const client = new Discord.Client({
  disableMentions: "everyone"
});
const config = require("../other/config.js");

client.login(config.token);
client.config = config;
client.waiting = new Map();

const Music = require("../music/Create.js");
const MusicConfig = require("../music/Config.js");

client.music = new Music(client, MusicConfig);
// require("../other/clientNavigation.js")(client);
require("../mongodb/connect.js")(client);
require("../event/eventManager.js")(client);
require("../command/commandManager.js")(client);
require("../website/app.js")(client);

client.music.on("trackEnd", channel => {
  let queue = client.music.queue.get(channel.guild.id);

  channel.send("Queue ended.");
  
  queue.voiceChannel.leave();
  client.music.queue.delete(channel.guild.id);
});

client.music.on("trackEndWeb", async channel => {
  let queue = client.music.queue.get(channel.guild.id);

  queue.voiceChannel.leave();
  client.music.queue.delete(channel.guild.id);
});

client.music.on("trackAdded", async (track, channel) => {
  if (!channel) return true;
  channel.send(`Queued **${track.title}**`)
});

client.music.on("playlistAdded", async (playlist, channel) => {
  if (!channel) return true;
  
  channel.send(`Queued **${playlist.title}** songs.`);
});

client.music.on("notSameChannel", async channel => {
  if (channel) {
    return channel.send("You cannot use this command.");
  } else {
    throw new TypeError("You cannot use this command.")
  }  
});

client.music.on("noQueue", async channel => {
  if (channel) {
    return channel.send('There is no songs.');
  } else {
    throw new TypeError("There is no songs.");
  }  
});

client.music.on("noChannel", async channel => {
  if (channel) {
    return channel.send('Please join voice channel.');
  } else {
    throw new TypeError("Please join voice channel.");
  }   
});

client.music.on("queueReachLimit", async (channel, limit) => {
  if (channel) {
    return channel.send(`The queue songs was reach the limit (\`${limit}\`)`);
  } else {
    throw new TypeError(`The queue songs was reach the limit (\`${limit}\`)`);
  }
});

const Guild = require("../mongodb/schemas/Guild.js");

// GLOBAL
String.prototype.toHHMMSS = function() {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
};

//
client.Guild = Guild;
client.Guild.Create = async function a(message, id = false) {
  if (!message && id) {
    let findGuild = await client.guilds.fetch(id);
    if (!findGuild) return;

    let newData = new Guild({
      ID: findGuild.id.toString(),
      Danger: {
        Banned: false
      },
      Settings: {
        Prefix: config.prefix,
        DisabledCommands: [],
        DisabledFeatures: []
      }, 
      Statistics: {
        CommandsUsed: [],
        CommandsUsedTotal: 0
      },
      CustomCommands: [],
      Leveling: []
    });

    newData.save();

    return newData;
  } else {
    let newData = new Guild({
      ID: message.guild.id.toString(),
      Danger: {
        Banned: false
      },
      Settings: {
        Prefix: config.prefix,
        DisabledCommands: [],
        DisabledFeatures: [],
      },
      Statistics: {
        CommandsUsed: []
      },
      CustomCommands: [],
      Leveling: []
    });

    newData.save();

    return newData;
  }
};

client.Guild.Find = async function b(id) {
  let find = await client.Guild.findOne({
    ID: id.toString
  });

  if (!find) {
    let newData = client.Guild.Create(false, id);

    return newData;
  } else if (find) {
    console.log(find);
    return find;
  }
};
client.isYtUrl = function validatorURL(url) {
  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return url.match(p) ? true : false;
};
client.isYtPlaylistUrl = function validatorPlaylistURL(url) {
  let p = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/;

  return url.match(p) ? true : false;
};
//

// export client.
module.exports = {
  client
};
