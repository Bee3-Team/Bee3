const { Permissions, Collection } = require("discord.js");
const cooldowns = new Collection();

module.exports = {
  name: "message",
  execute: async (message, client) => {
    if (message.author.bot) return;
    let config = client.config;

    let Guild = null;

    try {
      const findGuildDatabase = await client.Guild.findOne({
        ID: message.guild.id
      });
      if (!findGuildDatabase) {
        let newData = await client.Guild.Create(message);

        Guild = newData;
      } else if (findGuildDatabase) {
        Guild = findGuildDatabase;
      }
    } catch (e) {
      return console.log(`[ERROR] ${e}`);
    }

    if (!message.content.startsWith(Guild.Settings.Prefix)) {
      let disabledF = [];

      Guild.Settings.DisabledFeatures.map(disabledFA => {
        disabledF.push(disabledFA.Name.toLowerCase());
      });

      var regex = new RegExp(
        "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?"
      );

      if (disabledF.includes("anti-link")) {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
          if (regex.test(message.content.toLowerCase())) {
            message.delete().catch(e => message.channel.send(`Cannot delete message, missing permission.`))
            message.reply(
              `Your message includes links, we not allowed that here.`
            ).then(m => {
              m.delete({
                timeout: 5000
              })
            })
            return;
          }
        }
       }

      return;
    }


    const args = message.content
      .slice(Guild.Settings.Prefix.length)
      .trim()
      .split(/ +/g);
    const cmd = args.shift().toLowerCase();

    let disable = [];
    Guild.Settings.DisabledCommands.map(disabledCMD => {
      disable.push(disabledCMD.name.toLowerCase());
    });

    const command =
      client.Commands.get(cmd) || client.Commands.get(client.Aliases.get(cmd));
    if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }
  const member = message.member;
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 5) * 1000;


  
  if (!timestamps.has(member.id)) {
    timestamps.set(member.id, now);
  } else {
    const expirationTime = timestamps.get(member.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`Hey! you must wait \`${timeLeft.toFixed(1)}s\` before reusing \`${command.name}\`.`).then(m => {m.delete({
        timeout: timeLeft.toFixed(1) * 1000
      })})
    }

    timestamps.set(member.id, now);
    setTimeout(() => timestamps.delete(member.id), cooldownAmount);
  }    
    
    try {
      if (Guild.Danger.Banned) return;
      let disabled_ = false;
      if (disable.includes(command.name.toLowerCase())) {
        disabled_ = true;
      }
      if (disabled_)
        return message.channel
          .send(
            `the \`${command.name}\` command has been \`disabled\` by the admin`
          )
          .then(dcm => {
          try {
            dcm.delete({
              timeout: 7000
            }).catch(e => {
            return message.channel.send(`Cannot delete message, because do not have permission.`)
            })     
          } catch (e) {
            return message.channel.send(`Cannot delete message, because do not have permission.`)
          }
          });

      if (command.permissions.client.length > 0) {
        let clientChannelPermissions = message.channel.permissionsFor(
          message.guild.me
        );
        clientChannelPermissions = new Permissions(
          clientChannelPermissions.bitfield
        );
        if (!clientChannelPermissions.has(command.permissions.client)) {
          let missingPermissions = command.permissions.client
            .filter(perm => clientChannelPermissions.has(perm) === false)
            .join(", ");

          return message.reply(
            `Please make sure i have **${missingPermissions ||
              "an error occured"}** permissions :)`
          );
        }
      }

      if (command.permissions.user.length > 0) {
        let memberChannelPermissions = message.channel.permissionsFor(
          message.member
        );
        memberChannelPermissions = new Permissions(
          memberChannelPermissions.bitfield
        );
        if (!memberChannelPermissions.has(command.permissions.user)) {
          let missingPermissions = command.permissions.user
            .filter(perm => memberChannelPermissions.has(perm) === false)
            .join(", ");

          return message.reply(
            `Sorry, you must have **${missingPermissions ||
              "an error occured"}** permissions to use this command :)`
          );
        }
      }

      command.run(message, args, client);
    } catch (e) {
      return console.log(`[ERROR] ${e}`);
    } finally {
      let a, b;
      Guild.Statistics.CommandsUsed.push({
        Number: Guild.Statistics.CommandsUsedTotal + 1,
        Date: Date()
      });
      a = Guild.Statistics.CommandsUsed.length; 
      b = Guild.Statistics.CommandsUsedTotal;
      Guild.Statistics.CommandsUsedTotal = Guild.Statistics.CommandsUsedTotal + 1;
      if (Guild.Statistics.CommandsUsed.length >= 6) {
        Guild.Statistics.CommandsUsed = Guild.Statistics.CommandsUsed.slice(Guild.Statistics.CommandsUsed.length - 5)
      }
      Guild.save();
      console.log(a + " - " + b)
    }
  }
};
