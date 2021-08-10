const Activity = require("../../other/Activity.js");
let data = require("../../mongodb/schemas/247.js");

module.exports = {
  name: "ready",
  execute: async (client) => {
    
    require("../../command/slashManager.js")(client)
    
    console.log(`[DISCORD] login as ${client.user.tag}`)
    
    let DateNow = new Date();
    setInterval(() => {
      client.channels.cache.get("845597394833113088").setName(`${DateNow.getDate()}:${DateNow.getMonth()}:${DateNow.getFullYear()}`)
    }, 3600000)
    // client.user.setActivity(Activity.name, {type: Activity.type.toUpperCase()})
    
    let dataList = await data.find();
    if (!dataList) return;
    
    dataList.map(async x => {
      try {
        
        console.log("Launch 3")
        
        let vc = client.channels.cache.get(x.Channel);
        if (!vc) {
          let checkRemove = await data.findOne({ID: x.ID});
          
          checkRemove.remove();
        }
        
        client.music.handle(vc, null, x.ID, 'https://www.youtube.com/watch?v=5qap5aO4i9A');
        
      } catch (e) {
        return;
      }
    });
  }
}