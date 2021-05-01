module.exports = {
  name: "now-playing",
  description: "Show current song",
  aliases: ["np"],
  permissions: {
    user: [],
    client: ["SPEAK", "CONNECT"]
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    client.music.nowPlaying(message.guild.id, message.channel)
    
  }
}