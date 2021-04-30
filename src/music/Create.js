const MusicRoutes = require("./Routes.js");
const ytdl = require('ytdl-core');
const MusicConfig = require("./Config.js");

class CreateMusic extends MusicRoutes {
  constructor(client, option) {
    super();
    
    this.option = option;
    this.queue = new Map();
    this.client = client;
  }
  
  getQueue(id) {
    return this.queue.get(id) || null;
  }
  
  getGuild(id) {
    return this.client.guilds.cache.get(id) || undefined;
  }
  
  async handle(voiceChannel, id, query) {    
    let guild = await this.getGuild(id);
    if (!guild) throw new TypeError("Cannot find this guild.");
    
    let check = await this.getQueue(id);
    if (check) throw new TypeError("This server is playing songs.");
    
    let song 
    
    const Constructor = {
      connection: null,
      songs: [],
      volume: this.option.volume,
      playing: true,
      loop: false
    };
    
    this.queue.set(id, constructor);
    
  }
  
  async VideoQueue(query) {
    
  }
}

module.exports = CreateMusic;