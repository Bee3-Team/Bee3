module.exports = {
  name: "message",
  execute: async (message, client) => {
    let config = client.config;
    
    
    if (message.author.bot) return console.log(`[DISCORD] cannot response to bot`)
    
  }
}