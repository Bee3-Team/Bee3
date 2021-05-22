const Activity = require("../../other/Activity.js");

module.exports = {
  name: "ready",
  execute: async (client) => {
    
    console.log(`[DISCORD] login as ${client.user.tag}`)
    
    let DateNow = new Date();
    client.channels.cache.get("845585346112782346").setName(`Date: ${DateNow.getDate()}:${DateNow.getMinutes()}:${DateNow.getSeconds()}`)
    // client.user.setActivity(Activity.name, {type: Activity.type.toUpperCase()})
  }
}