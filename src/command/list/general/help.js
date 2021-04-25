module.exports = {
  name: "help",
  description: "Show all existing commands",
  aliases: ["h"],
  permissions: {
    user: [],
    client: []
  },
  run: async (message, args, client) => {
    
    message.channel.send(`https://beee.cf/commands?id=${message.guild.id}`)
    
  }
}