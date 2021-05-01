const ytdl = require("ytdl-core");
const {EventEmitter} = require("events");

class MusicRoutes extends EventEmitter {
  constructor() {
    super()
  }
  
  async play(textChannel = null, id, song) {
    const queue = this.queue.get(id);
    if (!queue) return;
    
    if (!song) {
      
      if (textChannel) {
        return this.emit("trackEnd", textChannel);
      } else {
        return this.emit("trackEndWeb", queue.voiceChannel);
      }
      
    }
      
    this.dispatcher = queue.connection.play(ytdl(song.url, this.option.stream))
      .on("finish", () => {
      if (queue.loop) {
        let lastSong = queue.songs.shift();
        queue.songs.push(lastSong);
        this.play(textChannel, id, queue.songs[0]);
      } else {
        queue.songs.shift();
        this.play(textChannel, id, queue.songs[0]);
      }
    })
      .on("error", (err) => {
      console.error(err);
      queue.songs.shift();
      this.play(textChannel, id, queue.songs[0]);
    });
   
    this.dispatcher.setVolumeLogarithmic(queue.volume / 100);
    
    if (textChannel) {
      textChannel.send(`Playing **${song.title}** 🎶`);
    } else {
      return true;
    }
  }
  
  async stop(voiceChannel, textChannel = false) {
    let canModify;
    
    canModify = this.canModify(voiceChannel);
  }
}

module.exports = MusicRoutes;