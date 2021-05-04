module.exports = {
  name: "loop",
  description: "Loop current song.",
  aliases: ["repeat"],
  permissions: {
    user: [],
    client: []
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    client.music.loop(message.member.voice.channel, message.channel)
    
  }
}