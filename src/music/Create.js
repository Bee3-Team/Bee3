const MusicRoutes = require("./Routes.js");
const ytdl = require('ytdl-core');
const MusicConfig = require("./Config.js");

class CreateMusic extends MusicRoutes {
  constructor(client, option) {
    super();
    
    this.option = option;
    this.queue = new Map();
  }
  
  getQueue(id) {
    return this.queue.get(id) || null;
  }
  
  async createAndPlay(voiceChannel, id, query) {
    const Constructor = {
      
    };
  }
}

module.exports = CreateMusic;