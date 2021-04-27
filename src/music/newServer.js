const { trackManager } = require("./trackManager.js");

class ServerQueue extends trackManager {
  constructor(message, song) {
    this.message = message;
    this.query = song;
    
  }
  
  list(website = false) {
    
  }
  
  shuffle(website = false) {
    
  }
  
  nowPlaying(website = false) {
    
  }
  
}

module.exports = {ServerQueue}