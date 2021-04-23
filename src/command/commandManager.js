const fs = require("fs");
const { Collection } = require("discord.js");

module.exports = async (client) => {
  
  client.Commands = new Collection();
  client.Modules = new Collection();
  client.Aliases = new Collection();
  
  // command category
  fs.readdir("./src/command/list", async (err, categorys) => {
    
    categorys.forEach(category => {
      
      let catConfig  = require(`./list/${category}/config.js`);
      if (!catConfig) return;
      
      fs.readdir(`./src/command/list/${category}`, async (err, commands) => {
        
        commands.forEach(command => {
          
          if (!command.endsWith(".js")) return;
          
          let cmdConfig = require(`./list/${category}/${command}`);
          if (!cmdConfig.exec) return;
          
          cmdConfig.aliases.map(ali => {
            client.Aliases.set(ali, cmdConfig.name);
          });
          
          client.Commands.set(cmdConfig.name.toLowerCase(), cmdConfig);
          
        });
        
        client.Modules.set(catConfig.name.toLowerCase(), catConfig);
        
      });
      
    });
    
  });
  
}