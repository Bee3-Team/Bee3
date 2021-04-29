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
    
    client.music.play(false, message, args, client)
    
  }
}