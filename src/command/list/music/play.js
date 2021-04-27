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
    
    if (client.isYtUrl(query)) {
      message.channel.send("Yes")
    } else {
      message.channel.send("No")
    }
  }
}