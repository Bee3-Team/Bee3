class ServerEvent {
  constructor() {
    
    this.on("songAdded", message => {
      
      message.react("✅")
      
    });
    
  }
}

module.exports = {ServerEvent};