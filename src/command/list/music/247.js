let data = require("../../../mongodb/schemas/247.js");

module.exports = {
  name: "always-join",
  description: "Make the bot always join the voice channel",
  aliases: ["247"],
  permissions: {
    user: ["MANAGE_GUILD"],
    client: ["SPEAK", "CONNECT"]
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    let check = await data.findOne({ID: message.guild.id});
    
    if (args[0] === "off") {
      if (!check) return message.channel.send("This server do not set 24/7 music");
      
      check.remove();
      
      message.channel.send(`24/7 music has been set off`);
      
    } else {
      let chl = message.member.voice.channel || message.guild.me.voice.channel || message.guild.channels.cache.get(args[0])
      if (!chl) return message.channel.send("Please mention valid voice channel id, or use `24/7 off`");
      
      if (check) {
        check.Channel = chl.id;
        check.save();
      } else {
        let newData = new data({
          ID: message.guild.id,
          Channel: chl.id
        });
        newData.save();
      }
      
      message.channel.send(`24/7 music voice channel has been set to ${chl}`);
      
      let checkQ = client.music.queue.get(message.guild.id);
      if (!checkQ) {
        chl.join();
        client.music.handle(chl, null, message.guild.id, 'https://www.youtube.com/watch?v=5qap5aO4i9A');
      }
    }
    
  }
}