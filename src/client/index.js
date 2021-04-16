const Discord = require("discord.js");
const client = new Discord.Client({
  disableMentions: "everyone"
});
const config = require("../other/config.js");

client.login(config.token);

require("../other/clientNavigation.js")(client);
require("../website/app.js")(client);