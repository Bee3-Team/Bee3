class MusicManager {
  constructor(client) {
    this.client = client;
  }
  
  async onplay(website = false, message, args, client) {
    
    this.control.play(message, args.join(" "))
    
  }
  
  async onloop(website = false, message, args, client) {
    
  }
  
  async onstop(website = false, message, args, client) {
    
  }
  
  async onskip(website = false, message, args, client) {
    
  }
  
  async onqueue(website = false, message, args, client) {
    
  }
  
  async onjump(website = false, message, args, client) {
    
  }
  
  async onpause(website = false, message, args, client) {
    
  }
  
  async onresume(website = false, message, args, client) {
    
  }
  
  async onsearch(website = false, message, args, client) {
    
  }
  
  async onseek(website = false, message, args, client) {
    
  }
  
  async onvolume(website = false, message, args, client) {
    
  }
  
  async onshuffle(website = false, message, args, client) {
    
  }
}

module.exports = { MusicManager }