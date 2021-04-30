const MusicEvents = require("./Events.js");
const ytdl = require("ytdl-core");

class MusicRoutes extends MusicEvents {
  constructor() {
    super();
  }
  
  async play(textChannel = null, id, song) {
    const queue = this.queue.get(id);
    if (!queue) return;
    
    if (!song) {
      
      if (textChannel) {
        this.emit("trackEnd", textChannel);
      } else {
        this.emit("trackEndWeb", queue.voiceChannel);
      }
      
    }
    
    this.dispatcher = queue.connection.play(ytdl(song.url, this.option.stream), {type: "opus"})
    .on("finish", async () => {
      
    });
  }
}

module.exports = MusicRoutes;