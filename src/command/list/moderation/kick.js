module.exports = {
  name: "kick",
  description: "kick a user from guild.",
  aliases: ["kicked"],
  permissions: {
    user: ["KICK_MEMBERS"],
    client: ["KICK_MEMBERS"]
  },
  cooldown: 5,
  run: async (message, args, client) => {
    
    const user = message.mentions.users.first();
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provide."
    if (user) {
      if (user.id == client.user.id) return message.channel.send(`Wait what !? please use other bot to kick me :<`)
      
      const member = message.guild.members.resolve(user);
      if (member) {
        member
          .kick(reason.toString())
          .then(() => {
            message.channel.send(`Kicked **${user.tag}** from \`${message.guild.name}\`. reason: **${reason}**`);
          })
          .catch(err => {
            message.channel.send('I was unable to kick the member, please make sure i have higher role than user you want to kick.');
          });
      } else {
        message.channel.send("That user isn't in this guild.");
      }
    } else {
      message.channel.send("You didn't mention the user to kick.");
    }    
    
  }
}