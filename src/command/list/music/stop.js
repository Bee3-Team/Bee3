module.exports = {
  name: "stop",
  description: "Stop current song",
  aliases: ["stop-song"],
  permissions: {
    user: [],
    client: ["SPEAK", "CONNECT"]
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    client.music.onstop(false, message, args, client)
    
  }
}