const { EmbedBuilder } = require("discord.js");
const secretSantaUserModel = require('../schema/secretSantaUser.js')

module.exports = {
  handle: async (client, interaction) => {
  await interaction.deferReply({
        content: 'Sent!',
        ephemeral: true
      });
    
    const message = interaction.fields.getTextInputValue('msgInput');
    const guildModel = await secretSantaUserModel.findOne({ guildId: interaction.guild.id })
    const userId = guildModel.choosen.filter(u => u.userId == interaction.user.id)[0];
    const user = await interaction.guild.members.fetch(userId.recipientId)
    
      const embed = new EmbedBuilder()
        .setTitle('Santa Mail 🦌🎁🎄')
        .setDescription(`Message from you secret santa, Ho Ho Ho 🎄\n\n> You can send them one too using </secretsanta message:1>`)
        .addFields({
          name: 'Message',
          value: `${message}`
        });
    await user.send({embeds: [embed]})

      return await interaction.editReply({
        content: 'Sent!',
        ephemeral: true
      });
  },
}