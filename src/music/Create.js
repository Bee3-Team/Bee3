const MusicRoutes = require("./Routes.js");
const ytdl = require('ytdl-core');

class CreateMusic extends MusicRoutes {
  constructor(voiceChannel, option = {}, textChannel = null) {
    super();
    
    this.start(voiceChannel, option, textChannel)
  }
  
  async start(voiceChannel, option = {}, textChannel = null) {
    if (!voiceChannel) throw new TypeError("Please join a voice channel.");
    
    let connection = await voiceChannel.join();
    
    connection.play(ytdl('https://youtube.com/watch?v=SlPhMPnQ58k', {filter: "audioandvideo"}))
  }
}

module.exports = CreateMusic;