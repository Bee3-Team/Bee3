module.exports = {
  name: "message",
  execute: async (message, client) => {
    let config = client.config;
    
    try {
      
      const findGuildDatabase = await client.Database.Guild.findOne({ID: message.guild.id});
      if (!findGuildDatabase) {
        
        let newData = await client.Database.Guild.Create(message);
        
        message.guild.database = newData;
        
      } else if (findGuildDatabase) {
        
        message.guild.database = findGuildDatabase;
        
      }
      
    } catch (e) {
      return console.log(`[ERROR] ${e}`)
    }
    
    if (!message.content.startsWith(message.guild.database.prefix)) return;
    
    if (message.author.bot) return;
    
    const args = message.content.slice(message.guild.database.prefix.length).trim().split(+)
    
  }
}