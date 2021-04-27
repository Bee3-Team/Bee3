module.exports = async (client) => {
  
  client.on("trackAdded", message => {
    
    message.react("➕");
    
  });
  
};