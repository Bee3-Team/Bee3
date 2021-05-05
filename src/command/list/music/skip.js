module.exports = {
  name: "skip",
  description: "Skip the current song",
  aliases: ["skip-song"],
  permissions: {
    user: [],
    client: ["SPEAK"]
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    client.music.skip(message.member.voice.channel, message.channel)
    
  }
}