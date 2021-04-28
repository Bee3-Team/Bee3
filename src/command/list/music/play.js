const { ServerQueue } = require("../../../music/newServer.js");

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
    const { ServerQueue } = client;
    
    const query = args.join(" ");
    if (!query) return message.channel.send(`Please give a song url / title`)
    
    if (client.isYtUrl(query)) {
      let serverQueue = new ServerQueue(false, message, query, true);
    } else {
      let serverQueue = new ServerQueue(false, message, query, false);
    }
  }
}