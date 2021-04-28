const Discord = require("discord.js");
const client = new Discord.Client({
  disableMentions: "everyone"
});
const config = require("../other/config.js");

client.login(config.token);
client.config = config;
client.music = new Map();

// require("../other/clientNavigation.js")(client);
require("../mongodb/connect.js")(client);
require("../event/eventManager.js")(client);
require("../command/commandManager.js")(client);
require("../website/app.js")(client);

const Guild = require("../mongodb/schemas/Guild.js");

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
        DisabledCommands: []
      },
      Statistics: {
        CommandsUsed: []
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
        DisabledCommands: []
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
