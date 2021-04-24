const config = require("./config.js");
let Guild = require("../mongodb/schemas/Guild.js");

module.exports = async client => {
  client.config = config;
  client.Guild = Guild;
  client.Guild.Create = async function a(message) {
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
    
    return {
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
    };
  };
};
