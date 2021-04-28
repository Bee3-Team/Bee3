module.exports = {
  name: "dashboard",
  description: "Show all existing commands",
  aliases: ["manage"],
  permissions: {
    user: [],
    client: []
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`You can't manage this server`)
    
    message.channel.send(`https://beee.cf/dashboard/${message.guild.id}`)
    
  }
}