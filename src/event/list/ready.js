const Activity = require("../../other/Activity.js");

module.exports = {
  name: "ready",
  execute: async (client) => {
    
    console.log(`[DISCORD] login as ${client.user.tag}`)
    
    let DateNow = new Date();
    client.channels.cache.get("845597394833113088").setName(`${DateNow.getDate()}:${DateNow.getMonth()}:${DateNow.getFullYear()}`)
    // client.user.setActivity(Activity.name, {type: Activity.type.toUpperCase()})
  }
}