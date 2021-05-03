const { socket } = require("..")

module.exports = {
  name: "voiceStateUpdate",
  execute: async (oldVoice, newVoice, client) => {
    
    let waiting_ = client.waiting.get(newVoice.member.id);
    
    if (waiting_) {
      client.socket.emit("voiceUpdate", newVoice.member.id);
    }
    
  }
}