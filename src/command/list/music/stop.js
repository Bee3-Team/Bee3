module.exports = {
  name: "stop",
  description: "Play a music / video / playlist",
  aliases: ["p"],
  permissions: {
    user: [],
    client: ["SPEAK", "CONNECT"]
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    client.music.handle(message.member.voice.channel, message.channel);
    
  }
}