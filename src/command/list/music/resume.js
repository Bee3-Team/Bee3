module.exports = {
  name: "resume",
  description: "Resume paused song",
  aliases: ["resume-song"],
  permissions: {
    user: [],
    client: ["SPEAK", "CONNECT"]
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    client.music.onresume(false, message, args, client)
    
  }
}