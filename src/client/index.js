const Discord = require("discord.js");
const client = new Discord.Client({
  disableMentions: "everyone"
});
const config = require("../other/config.js");

client.login(config.token);

require("../other/clientNavigation.js")(client);
require("../mongodb/connect.js")(client);
require("../event/eventManager.js")(client);
require("../command/commandManager.js")(client);
require("../website/app.js")(client);

// export client.
module.exports = {
  client
}