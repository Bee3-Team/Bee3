const config = require("./config.js");
let Guild = require("../mongodb/schemas/Guild.js");
const { ServerQueue } = require('../music/newServer.js');

module.exports = async client => {
  client.config = config;
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
        DisabledFeatures: [],
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
          CommandsUsed: [],
          CommandsUsedTotal: 0
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
      
      let newData = client.Guild.Create(false, id)
      
      return newData;
    } else if (find) {
      
      console.log(find)
      return find;
      
    }
  };
  client.ServerQueue = ServerQueue;
  client.isYtUrl = function validatorURL(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? true : false;
}
  client.isYtPlaylistUrl = function validatorPlaylistURL(url) {
    let p = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/;
    
    return (url.match(p)) ? true : false;
  }
  client.music = new Map();
  
};