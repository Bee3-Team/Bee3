module.exports = async (client) => {
  
  client.on("trackAdded", message => {
    
    message.react("➕");
    
  });
  
  client.on("trackStop", message => {
    
    message.react("🚫")
    
  });
  
};