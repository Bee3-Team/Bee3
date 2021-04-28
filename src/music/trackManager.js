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
    
  }
}

module.exports = {trackManager}