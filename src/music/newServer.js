const { trackManager } = require("./trackManager.js");

class ServerQueue extends trackManager {
  constructor(website = false, message, song) {
    super();
    
    this.message = message;
    this.query = song;
    this.textChannel = message.channel;
    this.author = message.author;
    
    let VoiceChannel = _voice(message);
    
    this.voiceChannel = VoiceChannel;
    
    
    
  }
  
  list(website = false) {
    
  }
  
  shuffle(website = false) {
    
  }
  
  nowPlaying(website = false) {
    
  }
  
}

module.exports = {ServerQueue}

// another function
async function _voice(message) {
  let VoiceChannel = message.member.voice.channel;
  if (!VoiceChannel) return message.channel.send(`You do not join any voice channel yet.`);
  
  return VoiceChannel;
}

async function _queue() {
  
}