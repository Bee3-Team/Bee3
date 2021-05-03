const { io } = require("../../website/app.js");

module.exports = {
  name: "voiceStateUpdate",
  execute: async (oldVoice, newVoice, client) => {
    
    console.log(newVoice.member.id);
    
    let waiting_ = client.waiting.get(newVoice.member.id);
    
    if (waiting_) {
      io.emit("voiceUpdate", newVoice.member.id);
    }
    
  }
}