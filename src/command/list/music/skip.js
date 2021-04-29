module.exports = {
  name: "skip",
  description: "Skip current song",
  aliases: ["skip-song"],
  permissions: {
    user: [],
    client: ["SPEAK", "CONNECT"]
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    client.music.onskip(false, message, args, client)
    
  }
}