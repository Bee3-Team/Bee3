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
    
    const args = message.content.slice(message.guild.database.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    const command = client.Commands.get(cmd) || client.Commands.get(client.Aliases.get(cmd));
    if (!command) return;
    
    try {
      if (message.guild.database.Banned) return;
      command.execute(message, args, client)
    } catch (e) {
      return;
    } finally {
      message.guild.database.Statistics.CommandsUsed = message.guild.database.Statistics.CommandsUsed + 1;
    }
    
  }
}