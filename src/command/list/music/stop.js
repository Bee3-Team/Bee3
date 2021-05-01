module.exports = {
  name: "stop",
  description: "Stop playing queue.",
  aliases: ["stop"],
  permissions: {
    user: [],
    client: ["SPEAK", "CONNECT"]
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    client.music.stop(message.member.voice.channel, message.channel);
    
  }
}