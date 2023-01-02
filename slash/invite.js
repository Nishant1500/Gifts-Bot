const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const config = require('../config.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('➕ Invite the bot to your server!'),
  guildOnly: false,
  private: false,
  run: async (client, interaction) => {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel(`Invite ${client.user.username}`)
          .setStyle(ButtonStyle.Link)
          .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=2474438634689&scope=applications.commands%20bot`),
        new ButtonBuilder()
          .setLabel('Support Server')
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.gg/8t2GrkpJcN"),
      )
    let invite = new EmbedBuilder()
      .setAuthor({
        name: `Invite Gifts Bot`,
        iconURL: client.user.displayAvatarURL()
      })
      .setTitle("Invite & Support Link!")
      .setDescription(`[Invite](https://discord.gg/8t2GrkpJcN) ${client.user} to your server today & enjoy, seamless giveaways with advanced features!`)
      .setColor('#2F3136')
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | ` + config.copyright,
        iconURL: interaction.user.displayAvatarURL()
      })

    interaction.reply({ embeds: [invite], components: [row] });
  }
}
