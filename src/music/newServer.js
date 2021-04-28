const { trackManager } = require("./trackManager.js");
const { client } = require("../client/index.js");

class ServerQueue extends trackManager {
  constructor(website = false, message, song, youtube = false) {
    super();
    
    this.play(website, message, song, youtube);
    
  }
  
  async play(website, message, song, youtube) {
    this.message = message;
    this.query = song;
    this.textChannel = message.channel;
    this.author = message.author;
    let type, stream;
    
    let VoiceChannel = await _voice(message);
    
    this.voiceChannel = VoiceChannel;
    
    if (youtube) {
      
      let _playlist = await client.isYtPlaylistUrl(song);
      if (_playlist) return this.playlist(website, message, song);
      
    } else if (!youtube) {
      
      let _playlist = await client.isYtPlaylistUrl(song);
      if (_playlist) return this.playlist(website, message, song);
      
    }
  }
  
  async list(website = false) {
    
  }
  
  async shuffle(website = false) {
    
  }
  
  async nowPlaying(website = false) {
    
  }
  
  async playlist(website = false, message, url) {
    
  }
  
}

module.exports = {ServerQueue}

// another function
async function _voice(message) {
  let VoiceChannel = message.member.voice.channel;
  if (!VoiceChannel) return message.channel.send(`You do not join any voice channel yet.`);
  
  return VoiceChannel;
}

async function _queue(id) {
  let _check = client.music.get(id);
  if (!_check) return false;
  
  return _check;
}