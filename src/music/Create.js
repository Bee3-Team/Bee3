const MusicRoutes = require("./Routes.js");
const ytdl = require('ytdl-core');
const MusicConfig = require("./Config.js");

class CreateMusic extends MusicRoutes {
  constructor(client, option) {
    super();
    
    this.option = option;
  }
  
  async start(voiceChannel, option = {}, textChannel = null) {
    if (!voiceChannel) throw new TypeError("Please join a voice channel.");
    
    let connection = await voiceChannel.join();
    
    connection.play(ytdl('https://youtube.com/watch?v=SlPhMPnQ58k', {filter: "audioandvideo"}))
  }
}

module.exports = CreateMusic;