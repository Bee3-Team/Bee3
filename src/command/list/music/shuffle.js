module.exports = {
  name: "shuffle",
  description: "Shuffle server songs.",
  aliases: ["shuff"],
  permissions: {
    user: [],
    client: []
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    client.music.shuffle(message.member.voice.channel, message.channel)
    
  }
}