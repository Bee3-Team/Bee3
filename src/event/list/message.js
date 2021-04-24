module.exports = {
  name: "message",
  execute: async (message, client) => {
    let config = client.config;
    
    try {
      
      const findGuildDatabase = await client.Guild.findOne({ID: message.guild.id});
      if (!findGuildDatabase) {
        
        let newData = await client.Guild.Create(message);
        
        message.guild.database = newData;
        
      } else if (findGuildDatabase) {
        
        message.guild.database = findGuildDatabase;
        
      }
      
    } catch (e) {
      return console.log(`[ERROR] ${e}`)
    }
    
    if (!message.content.startsWith(message.guild.database.Settings.Prefix)) return;
    
    if (message.author.bot) return;
    
    const args = message.content.slice(message.guild.database.Settings.Prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    const command = client.Commands.get(cmd) || client.Commands.get(client.Aliases.get(cmd));
    if (!command) return;
    
    try {
      if (message.guild.database.Banned) return;
      command.run(message, args, client)
    } catch (e) {
      return console.log(`${e}`)
    } finally {
      message.guild.database.Statistics.CommandsUsed = message.guild.database.Statistics.CommandsUsed + 1;
      message.guild.database.save();
    }
    
  }
}