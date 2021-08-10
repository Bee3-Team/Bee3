const fs = require("fs");
const { Collection } = require("discord.js");

module.exports = async (client) => {
   
  client.Commands = new Collection();
  client.Modules = new Collection();
  client.Aliases = new Collection();
  
  // command category
  fs.readdir("./src/command/list", async (err, categorys) => {
    
    if (!categorys[0]) return;
   
    categorys.forEach(category => {
      
      let catConfig  = require(`./list/${category}/config.js`);
      if (!catConfig) return;
      
      fs.readdir(`./src/command/list/${category}/`, async (err, commands) => {
        
        commands.forEach(async command => {
          
          if (!command.endsWith(".js")) return;
          
          let cmdConfig = require(`./list/${category}/${command}`);
          if (!cmdConfig.run) return;
          
          cmdConfig.aliases.map(ali => {
            client.Aliases.set(ali, cmdConfig.name);
          });
          
          console.log(`[HANDLER] loaded ${cmdConfig.name}`)
          
          client.Commands.set(cmdConfig.name.toLowerCase(), cmdConfig);
          
          catConfig.commands.push(cmdConfig);
        });
        
        
      });
      
      console.log(`[HANDLER] loaded ${catConfig.name}`)
      client.Modules.set(catConfig.name.toLowerCase(), catConfig);
      
    });      
    
    
  });
}