const { trackManager } = require("./trackManager.js");

class ServerQueue extends trackManager {
  constructor(message, song) {
    this.message = message;
    this.query = song;
    this.textChannel = message.channel;
    this.author = message.author;
    
    let VoiceChannel = onVoice(message);
    
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
async function onVoice(message) {
  let VoiceChannel = message.member.voice.channel;
  if (!VoiceChannel) return message.channel.send(`You do not join any voice channel yet.`);
  
  return VoiceChannel;
}