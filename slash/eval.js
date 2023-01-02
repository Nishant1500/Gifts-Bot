const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ComponentType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('🤖 [Dev] Evaluate a code from Discord.'),
  guildOnly: false,
  private: true,
  run: async (client, interaction) => {

    const modal = new ModalBuilder()
      .setCustomId('evalHandler')
      .setTitle('Eval Code');

    const codeInput = new TextInputBuilder()
      .setCustomId('codeInput')
      .setLabel("Enter Eval Code:")
      // Paragraph means multiple lines of text.
      .setStyle(TextInputStyle.Paragraph);

    const actionRow = new ActionRowBuilder().addComponents(codeInput);

    modal.addComponents(actionRow);

    // Show the modal to the user
    await interaction.showModal(modal);
  },
};
