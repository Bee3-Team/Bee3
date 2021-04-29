class MusicManager {
  constructor(client) {
    this.client = client;
  }
  
  async play(website = false, message, args, client) {
    
    this.distube.play(message, args.join(" "))
    
  }
  
  async loop(website = false, message, args, client) {
    
  }
  
  async stop(website = false, message, args, client) {
    
  }
  
  async skip(website = false, message, args, client) {
    
  }
  
  async queue(website = false, message, args, client) {
    
  }
  
  async jump(website = false, message, args, client) {
    
  }
  
  async pause(website = false, message, args, client) {
    
  }
  
  async resume(website = false, message, args, client) {
    
  }
  
  async search(website = false, message, args, client) {
    
  }
  
  async seek(website = false, message, args, client) {
    
  }
  
  async volume(website = false, message, args, client) {
    
  }
  
  async shuffle(website = false, message, args, client) {
    
  }
}

module.exports = { MusicManager }