const Music = require("../../../music/Create.js");

module.exports = {
  name: "play",
  description: "Play a music / video / playlist",
  aliases: ["p"],
  permissions: {
    user: [],
    client: ["SPEAK", "CONNECT"]
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    new Music(message.member.voice.channel);
    
  }
}