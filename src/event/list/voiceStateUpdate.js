const { io } = require("../../website/app.js");
let data = require("../../mongodb/schemas/247.js");

module.exports = {
  name: "voiceStateUpdate",
  execute: async (oldVoice, newVoice, client) => {
    
    if (newVoice.member.id == client.user.id) {
      let checkQ = client.music.queue.get(oldVoice.guild.id);
      
      let check = await data.findOne({ID: newVoice.guild.id});
      if (!check) return;
      if (!newVoice.channel) {
        console.log("Launch 1")
        let chl = oldVoice.guild.channels.cache.get(check.Channel)
        if (!chl) return removeData(check);
        chl.join();
        client.music.queue.delete(oldVoice.guild.id);
        client.music.handle(chl, null, oldVoice.guild.id, 'https://www.youtube.com/watch?v=5qap5aO4i9A');     
      } else if (newVoice.channel.id !== check.Channel) {
        console.log("Launch 2")
        let chl = oldVoice.guild.channels.cache.get(check.Channel)
        if (!chl) return removeData(check);
        chl.join();
        client.music.queue.delete(oldVoice.guild.id);
        client.music.handle(chl, null, oldVoice.guild.id, 'https://www.youtube.com/watch?v=5qap5aO4i9A'); 
      } 
    }
    
    function removeData(datas) {
      datas.remove()
    }
    
  }
}