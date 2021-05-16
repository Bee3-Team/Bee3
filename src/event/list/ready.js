const Activity = require("../../other/Activity.js");

module.exports = {
  name: "ready",
  execute: async (client) => {
    
    console.log(`[DISCORD] login as ${client.user.tag}`)
    
    client.user.setActivity(Activity.name, {type: Activity.type.toUpperCase()}) 
  }
}