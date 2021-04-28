class ServerEvent {
  constructor() {
  }
  
  onSongAdded(message) {
    
    message.react("✅");
    
  }
}

module.exports = {ServerEvent};