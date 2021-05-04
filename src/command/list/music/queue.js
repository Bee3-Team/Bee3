module.exports = {
  name: "queue",
  description: "Show server songs.",
  aliases: ["q", "songs"],
  permissions: {
    user: [],
    client: []
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    client.music.Queue(message.guild.id, message.channel)
    
  }
}