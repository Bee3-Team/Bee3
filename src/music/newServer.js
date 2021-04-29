const DisTube = require("distube");
const { MusicManager } = require("./musicManager.js");

class Music extends MusicManager {
  constructor(client) {
    super(client)
    
    this.createClient(client);
  }
  
  async createClient(client) {
    
  }
}

module.exports = { Music }