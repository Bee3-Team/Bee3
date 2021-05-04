module.exports = {
  name: "pause-resume",
  description: "Pause a music or resume.",
  aliases: ["pause", "resume"],
  permissions: {
    user: [],
    client: []
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    client.music.pauseResume(message.member.voice.channel, message.guild.id, message.channel);
    
  }
}