const fs = require("fs");

module.exports = async (client) => {
  
  fs.readdir("./src/event/list", async (err, events) => {
    
    events.forEach(event => {
      
      if (!event.endsWith(".js")) return;
      
      let eventConfig = require(`./list/${event}`);
      
      let eventCallback = eventConfig.execute;
      
      client.on(`${eventConfig.name}`, async (...args) => {
        
        eventCallback(...args)
        
      });
      
    });
    
  });
  
};