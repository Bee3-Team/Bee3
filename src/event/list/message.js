module.exports = {
  name: "message",
  execute: async (message, client) => {
    let config = client.config;
    
    let Guild = null;
    
    try {
      
      const findGuildDatabase = await client.Guild.findOne({ID: message.guild.id});
      if (!findGuildDatabase) {
        
        let newData = await client.Guild.Create(message);
        
        Guild = newData;
        
      } else if (findGuildDatabase) {
        
        Guild = findGuildDatabase;
        
      }
      
    } catch (e) {
      return console.log(`[ERROR] ${e}`)
    }
    
    if (!message.content.startsWith(Guild.Settings.Prefix)) return;
    
    if (message.author.bot) return;
    
    const args = message.content.slice(Guild.Settings.Prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    const command = client.Commands.get(cmd) || client.Commands.get(client.Aliases.get(cmd));
    if (!command) return;
    
    try {
      if (Guild.Danger.Banned) return;
      command.run(message, args, client)
    } catch (e) {
      return console.log(`${e}`)
    } finally {
      console.log(Guild)
      console.log("Added 1 command used")
      Guild.Statistics.CommandsUsed = Number(Guild.Statistics.CommandsUsed) + 1;
      Guild.save();
    }
    
  }
}