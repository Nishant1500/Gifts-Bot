const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, SlashCommandBuilder } = require('discord.js');
const config = require('../config.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('📜 Shows a list of commands of this bot.'),
  guildOnly: false,
  private: false,
  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setTitle(`Commands of ${client.user.username}`)
      .setColor('#2F3136')
      .setDescription('**Please Select a category to view all its commands**\n\nThis bot is mostly based on [open source code](https://github.com/Androz2091/discord-giveaways) but Gifts Bot stands out as it provide high-quality support, and 98% uptime.')
      .addFields({ name: `Links:`, value: `- 🌍 [Discord Server](https://discord.gg/8t2GrkpJcN)\n- 📃 [Terms Of Service](https://github.com/Nishant1500/Gifts-Bot/blob/main/TERMS_OF_SERVICE.md)\n- 🕵️ [Privacy Policy](https://github.com/Nishant1500/Gifts-Bot/blob/main/PRIVACY_POLICY.md)\n- 📦[GitHub Repository](https://github.com/Nishant1500/Gifts-Bot)`, inline: true })

      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL()
      });

    const giveaway = new EmbedBuilder()
      .setTitle("Categories » Giveaway")
      .setColor('#2F3136')
      .setDescription("Here are the 🎉 Giveaway commands:")
      .addFields(
        { name: 'Create / Start', value: `Start a giveaway in your guild! **Needs \`MANAGE_MESSAGES\` permission**\n > </giveaway start:1>`, inline: true },
        { name: 'End', value: `End an already running giveaway! **Needs \`MANAGE_MESSAGES\` permission**\n > </giveaway end:1>`, inline: true },
        { name: 'Reroll', value: `Reroll an ended giveaway! **Needs \`MANAGE_MESSAGES\` permission**\n > </giveaway reroll:1>`, inline: true },
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL()
      });

    const secretsanta = new EmbedBuilder()
      .setTitle("Categories » Secret Santa")
      .setColor('#46a13a')
      .setDescription("🎅 The famous and awesome secret santa game now on Discord!\nHere are the 🎅🏻 Secret Santa commands:")
      .addFields(
        { name: 'Signup', value: `Signup to participate in the event.\n > </secretsanta signup:1>` },
        { name: 'Start', value: `Starts the event. **Needs \`MANAGE_EVENTS\` permission**\n > </secretsanta start:1>` },
        { name: 'Leave', value: `Take you name off the rolls.\n > </secretsanta leave:1>` },
        { name: 'List', value: `Shows a list of participants. **Needs \`MANAGE_EVENTS\` permission**\n > </secretsanta list:1>` },
        { name: 'Message', value: `Message your partner, since its secret santa the sender\'s name will be anonymous.\n > </secretsanta message:1>` },
        { name: 'Profile', value: `Check your partner\'s profile for their wishlist\n > </secretsanta profile:1>` },
        { name: 'Set wishlist', value: `You can set you wishlist and give your partner a hint about what you want\n > </secretsanta setwishlist:1>` },
        { name: 'End', value: `End an ongoing event. **Needs \`MANAGE_EVENTS\` permission**\n> </secretsanta start:1>` },
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL()
      });

    const general = new EmbedBuilder()
      .setTitle("Categories » General")
      .setColor('#2F3136')
      .setDescription("Here are the ⚙️ general bot commands:")
      .addFields(
        { name: 'Help', value: `Shows all available commands to this bot!\n > </help:1>`, inline: true },
        { name: 'Invite', value: `Get the bot's invite link!\n > </invite:1>`, inline: true },
        { name: 'Ping', value: `Check the bot's latency!\n > </ping:1>`, inline: true },
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL()
      });

    let _default = 'overview';

    const components = ({ state, selected }) => [
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("help-menu")
          .setPlaceholder("Please Select a Category")
          .setDisabled(state)
          .addOptions([{
            label: `General`,
            value: `general`,
            description: `View all the general bot commands!`,
            emoji: `⚙`,
            default: (selected == 'general')
          },
          {
            label: `Secret Santa`,
            value: `secretsanta`,
            description: `View all the secret santa bot commands!`,
            emoji: `🎄`,
            default: (selected == 'secretsanta')
          },
          {
            label: `Giveaways`,
            value: `giveaway`,
            description: `View all the giveaway based commands!`,
            emoji: `🎉`,
            default: (selected == 'giveaway')
          }
          ])
      ),
    ];

    await interaction.reply({
      embeds: [embed],
      components: components({
        state: false
      })
    });
    const setInitialMessage = (msg) => initialMessage = msg;
    const filter = (interaction) => interaction.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponentCollector(
      {
        filter,
        componentType: ComponentType.SelectMenu,
        idle: 10 * 1000,
        dispose: true,
      });

    collector.on('collect', async (interaction) => {
      if (interaction.values[0] === "giveaway") {
        _default = 'giveaway'
        await interaction.update({
          embeds: [giveaway],
          components: components({
            state: false,
            selected: _default
          })
        }).catch((e) => { });
      } else if (interaction.values[0] === "general") {
        _default = 'general'
        await interaction.update({
          embeds: [general],
          components: components({
            state: false,
            selected: _default
          })
        }).catch((e) => { });
      } else if (interaction.values[0] === "secretsanta") {
        _default = 'secretsanta'
        await interaction.update({
          embeds: [secretsanta],
          components: components({
            state: false,
            selected: _default
          })
        }).catch((e) => { });
      }
    });
    collector.on('end', (collected, reason) => {
      interaction.editReply({
        components: components({
          state: true,
          selected: _default
        })
      })
    });
  },
}
