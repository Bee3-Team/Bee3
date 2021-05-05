module.exports = {
  name: "set-volume",
  description: "Set the song volume.",
  aliases: ["volume", "vol"],
  permissions: {
    user: [],
    client: ["SPEAK"]
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    client.music.setVolume(message.member.voice.channel, message.channel, args[0])
    
  }
}