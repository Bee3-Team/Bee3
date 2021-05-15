const { Permissions } = require("discord.js");

module.exports = {
  name: "message",
  execute: async (message, client) => {
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
            message.delete();
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

    if (message.author.bot) return;

    const args = message.content
      .slice(Guild.Settings.Prefix.length)
      .trim()
      .split(/ +/g);
    const cmd = args.shift().toLowerCase();

    let disable = [];
    Guild.Settings.DisabledCommands.map(disabledCMD => {
      disable.push(disabledCMD.name.toLowerCase());
    });

    Guild.Settings.DisabledFeatures.map(disabledF => {
      disabledF.push(disabledF.Name.toLowerCase());
    });

    const command =
      client.Commands.get(cmd) || client.Commands.get(client.Aliases.get(cmd));
    if (!command) return;

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
            dcm.delete({
              timeout: 7000
            });
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
      Guild.Statistics.CommandsUsed.push({
        Number: Guild.Statistics.CommandsUsed.length + 1,
        Date: Date()
      });
      Guild.save();
    }
  }
};
