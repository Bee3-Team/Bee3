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
    
    this.serverQueue = client.music.get(message.guild.id);
    
    if (!songAns) {
      setTimeout(() => {
        if (this.serverQueue.connection.dispatcher && message.guild.me.voice.channel) return;
        this.serverQueue.channel.voice.leave();
        this.serverQueue.channel.text.send(`I leave from voice channel because no inactive song in queue.`)
      }, 30000)
      this.serverQueue.channel.text.send(`Queue ended.`);
      return client.music.delete(message.guild.id);
    }
    
    this.serverQueue.connection.on("disconnect", () => client.queue.delete(message.guild.id));
    
    let streamType;
    
    if (songAns.duration == 0) {
      streamType = {type: "opus"};
    } else {
      streamType = {filter: "audioonly", type: "opus"};
    }
    
    const dispatcher = this.serverQueue.connection
      .play(await ytdl(songAns.url, streamType))
      .on("finish", () => {
        if (this.serverQueue.settings.loop) {
          // if loop is on, push the song back at the end of the queue
          // so it can repeat endlessly
          let lastSong = this.serverQueue.songs.shift();
          this.serverQueue.songs.push(lastSong);
          this.playSong(website, this.serverQueue.songs[0], message);
        } else {
          // Recursively play the next song
          this.serverQueue.songs.shift();
          this.playSong(website, this.serverQueue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        this.serverQueue.songs.shift();
        this.playSong(website, this.serverQueue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(this.serverQueue.settings.volume / 100);    
    
    this.serverQueue.channel.text.send(`Playing **${songAns.title}**`)
  }
}

module.exports = {trackManager}