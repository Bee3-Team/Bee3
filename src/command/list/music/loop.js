module.exports = {
  name: "loop",
  description: "Repeat current song",
  aliases: ["repeat"],
  permissions: {
    user: [],
    client: ["SPEAK", "CONNECT"]
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    client.music.onloop(false, message, args, client)
    
  }
}