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
    
    let disable = [];
    Guild.Settings.DisabledCommands.map(disabledCMD => {
      disable.push(disabledCMD.name.toLowerCase());
    });
    
    const command = client.Commands.get(cmd) || client.Commands.get(client.Aliases.get(cmd));
    if (!command) return;
    
    try {
      if (Guild.Danger.Banned) return;
        let disabled_ = true;
        if (disable.includes(command.name.toLowerCase())) {
        disabled_ = false;
        }
      if (disabled_) return message.channel.send(`This command was \`turn off\` by admin`)
      
      command.run(message, args, client)
    } catch (e) {
      return console.log(`[ERROR] ${e}`)
    } finally {
      Guild.Statistics.CommandsUsed.push({
        Number: Guild.Statistics.CommandsUsed.length + 1,
        Date: Date()
      });
      Guild.save();
    }
    
  }
}