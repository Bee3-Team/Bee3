module.exports = {
  name: "pause",
  description: "Pause the resumed song",
  aliases: ["pause-song"],
  permissions: {
    user: [],
    client: ["SPEAK", "CONNECT"]
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    client.music.onpause(false, message, args, client)
    
  }
}