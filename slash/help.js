const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ComponentType, SlashCommandBuilder } = require('discord.js');
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
        { name: 'Create / Start', value: `Start a giveaway in your guild!\n > </giveaway start:1>`, inline: true },
        { name: 'End', value: `End an already running giveaway!\n > </giveaway end:1>`, inline: true },
        { name: 'Reroll', value: `Reroll an ended giveaway!\n > </giveaway reroll:1>`, inline: true },
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

    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("help-menu")
          .setPlaceholder("Please Select a Category")
          .setDisabled(state)
          .addOptions([{
            label: `Giveaways`,
            value: `giveaway`,
            description: `View all the giveaway based commands!`,
            emoji: `🎉`
          },
          {
            label: `General`,
            value: `general`,
            description: `View all the general bot commands!`,
            emoji: `⚙`
          }
          ])
      ),
    ];

    const initialMessage = await interaction.reply({ embeds: [embed], components: components(false) });

    const filter = (interaction) => interaction.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponentCollector(
      {
        filter,
        componentType: ComponentType.SelectMenu,
        idle: 300000,
        dispose: true,
      });

    collector.on('collect', (interaction) => {
      if (interaction.values[0] === "giveaway") {
        interaction.update({ embeds: [giveaway], components: components(false) }).catch((e) => { });
      } else if (interaction.values[0] === "general") {
        interaction.update({ embeds: [general], components: components(false) }).catch((e) => { });
      }
    });
    collector.on('end', (collected, reason) => {
      if (reason == "time") {
        initialMessage.edit({
          components: [],
        });
      }
    })
  }
}
