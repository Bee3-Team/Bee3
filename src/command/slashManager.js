const disbut = require("discord-buttons");
const Discord = require("discord.js");

module.exports = async (client, guild = false) => {
  console.log(`BUILD THE INTERACTION...`)  
  
  client.Commands.forEach(async cmd => {
    if (!cmd.slashcommand) return;
    console.log(`Build ${cmd.name} 2`)
    
    let slashData = {
      name: cmd.name,
      description: cmd.description,
      options: cmd.slashcommand.options,      
    }
    
  
    
    console.log(`Build ${cmd.name} 3`)
    if (guild) {
      let caa = client.api.applications(client.user.id);
      let ga = caa.guilds(guild.id);
      
      try {
        await ga.commands.post({ data: slashData })
      } catch (e) {
        return;
      }
      console.log(`post cmd ${slashData.name} for ${guild.name}`)      
    } else {
    client.guilds.cache.map(async g => {
      let caa = client.api.applications(client.user.id);
      let ga = caa.guilds(g.id);
      
      try {
        await ga.commands.post({ data: slashData })
      } catch (e) {
        return;
      }
      console.log(`post cmd ${slashData.name} for ${g.name}`)
    })      
    }
    
  }) 
  
  
};