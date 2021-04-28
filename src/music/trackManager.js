const config = require("../other/config.js");
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
      if (songAns.url.includes("youtube.com")) {
        stream = await ytdl(songAns.url, { highWaterMark: 1 << 25 });
      }
    } catch (e) {
      if (this.serverQueue) {
        this.serverQueue.songs.shift();
        this.playSong(this.serverQueue.songs[0], message);
      }

      console.log(e);
      return message.channel.send("Error: " + e.message);
    }
    
    this.serverQueue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));
    
    const dispatcher = this.serverQueue.connection
      .play(stream, { type: streamType })
      .on("finish", () => {
        if (this.serverQueue.settings.loop) {
          // if loop is on, push the song back at the end of the queue
          // so it can repeat endlessly
          let lastSong = this.serverQueue.songs.shift();
          this.serverQueue.songs.push(lastSong);
          this.playSong(this.serverQueue.songs[0], message);
        } else {
          // Recursively play the next song
          this.serverQueue.songs.shift();
          this.playSong(this.serverQueue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        this.serverQueue.songs.shift();
        this.playSong(this.serverQueue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(this.serverQueue.settings.volume / 100);    
    
    this.serverQueue.channel.text.send(`Playing **${songAns.title}**`)
  }
}

module.exports = {trackManager}