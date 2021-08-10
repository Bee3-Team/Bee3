module.exports = {
  name: "dashboard",
  description: "Show all existing commands",
  aliases: ["manage"],
  permissions: {
    user: ["MANAGE_GUILD"],
    client: []
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    message.channel.send(`https://beee.cf/dashboard/${message.guild.id}`)
    
  },
  slashcommand: {
    run: (interaction, args, client) => {
      
      console.log(interaction)
      
      if (interaction.guild.ownerID == interaction.member.user.id) {
        return interaction.send(`https://beee.cf/dashboard/${interaction.guild.id}`)
      }
      
    if (!client.checkPerms(parseInt(interaction.member.permissions), "MANAGE_GUILD")) return interaction.send(`You can't manage this server`)
    
    interaction.send(`https://beee.cf/dashboard/${interaction.guild.id}`)
    
    }
  }
}