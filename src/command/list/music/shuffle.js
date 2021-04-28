const { ServerQueue } = require("../../../music/newServer.js");

module.exports = {
  name: "shuffle",
  description: "Get songs list",
  aliases: ["shuff"],
  permissions: {
    user: [],
    client: []
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    const serverQueue = client.music.get(message.guild.id);
    if (!serverQueue) return message.channel.send(`There is not songs.`);
    
    serverQueue.control.shuffle(false, message);
    
  }
}