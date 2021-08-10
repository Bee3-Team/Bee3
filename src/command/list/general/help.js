module.exports = {
  name: "help",
  description: "Show all existing commands",
  aliases: ["h"],
  permissions: {
    user: [],
    client: []
  },
  cooldown: 5,
  run: async (message, args, client, disbut) => {
     
    
let button = new disbut.MessageButton()
  .setStyle('url')
  .setURL('https://beee.cf/commands?id=' + message.guild.id) 
  .setLabel('get help');
    
let button2 = new disbut.MessageButton()
  .setStyle('red')
  .setLabel('cannot redirect?')
  .setID('cannot-redirect')
    
let row = new disbut.MessageActionRow()
  .addComponents(button, button2);    
    
    message.channel.send(`get help by click the button below`, row)
    
  },
  slashcommand: {
    run: (interaction, args, client, disbut) => {
    interaction.send(`https://beee.cf/commands?id=${interaction.guild_id}`);   
    }
  }
}