const config = require("./config.js");
let Guild = require("../mongodb/schemas/Guild.js");

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
          DisabledCommands: []
        },
        Statistics: {
          CommandsUsed: 0
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
          CommandsUsed: 0
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
};
