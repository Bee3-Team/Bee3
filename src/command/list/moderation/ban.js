module.exports = {
  name: "ban",
  description: "ban a user from guild.",
  aliases: ["banned"],
  permissions: {
    user: ["BAN_MEMBERS"],
    client: ["BAN_MEMBERS"]
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    const user = message.mentions.users.first();
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provide."
    if (user) {
      if (user.id == client.user.id) return message.channel.send(`Wait what !? please use other bot to ban me :<`);
      if (user.id == message.author.id) return message.channel.send(`Wait, why you try to ban yourself ?`);
      if (user.id == message.guild.owner.id) return message.channel.send(`You cant ban server owner :<`)
      
      const member = message.guild.members.resolve(user);
      if (member) {
        member
          .ban(reason.toString())
          .then(() => {
            message.channel.send(`Banned **${user.tag}** from \`${message.guild.name}\`. reason: **${reason}**`);
          })
          .catch(err => {
            message.channel.send('I was unable to ban the member, please make sure i have higher role than user you want to ban.');
          });
      } else {
        message.channel.send("That user isn't in this guild.");
      }
    } else {
      message.channel.send("You didn't mention the user to ban.");
    }    
    
  }
}