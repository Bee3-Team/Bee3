const config = require("../other/config.js");
const { ServerEvent } = require("./musicEvents.js");
const { client } = require("../client/index.js");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(config.yt);

class trackManager {
  constructor() {
    
  }
  
  addTrack(website = false, songAns, message) {
    
  }
  
  skip(website = false, message, args) {
    
  }
  
  stop(website = false, message, args) {
    
  }
  
  removeTrack(website = false, message, args) {
    
  }
  
  resume(website = false, message, args) {
    
  }
  
  pause(website = false, message, args) {
    
  }
  
  async playSong(website = false, songAns, message) {
    
    this.serverQueue = message.client.music.get(message.guild.id);
    
    if (!songAns) {
      setTimeout(() => {
        if (this.serverQueue.connection.dispatcher && message.guild.me.voice.channel) return;
        this.serverQueue.channel.voice.leave();
        this.serverQueue.channel.text.send(`I leave from voice channel because no inactive song in queue.`)
      }, 30000)
      this.serverQueue.channel.text.send(`Queue ended.`);
      return message.client.music.delete(message.guild.id);
    }
    
    let stream = null, streamType = songAns.url.includes("youtube.com") ? "opus" : "ogg/opus";
    
    try {
      
    } catch (e) {
      if (songAns.url.includes("youtube.com")) {
        stream = await ytdl(songAns.url, { highWaterMark: 1 << 25 });
        }  
    }
  }
}

module.exports = {trackManager}