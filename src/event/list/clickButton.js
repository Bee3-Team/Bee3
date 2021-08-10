const Activity = require("../../other/Activity.js");

module.exports = {
  name: "clickButton",
  execute: async (button, client) => {
    
    if (button.id == 'cannot-redirect') {
      button.message.channel.send('https://beee.cf/commands?id=' + button.message.guild.id);
      button.message.delete()
    }
    
    if (button.id == "now-playing") {
      client.music.nowPlaying(button.message.guild.id, button.message.channel)
      button.message.delete()
    }
    
    if (button.id == "check-queue") {
      client.music.Queue(button.message.guild.id, button.message.channel)
      button.message.delete()
    }    
    
  }
}