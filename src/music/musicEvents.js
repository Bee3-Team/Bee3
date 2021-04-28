class ServerEvent {
  constructor(serverqueue) {
    
    serverqueue.on("songAdded", message => {
      
      message.react("✅")
      
    });
    
  }
}

module.exports = {ServerEvent};