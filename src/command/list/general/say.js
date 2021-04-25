module.exports = {
  name: "say",
  description: "Repeat message",
  aliases: ["repeat"],
  permissions: {
    user: [],
    client: []
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    let say = args.join(" ");
    if (!say) return;
    
    message.delete();
    message.channel.send(`${say}
    
    
    `)
    
  }
}