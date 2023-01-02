const { EmbedBuilder } = require("discord.js");

module.exports = {
  handle: async (client, interaction) => {
    const unsanitizedCode = interaction.fields.getTextInputValue('codeInput');

    try {
      const data = await eval(unsanitizedCode.replace(/```/g, ''));
      const embed = new EmbedBuilder()
        .setTitle('Eval Command')
        .setDescription(`${data}`);

      return await interaction.reply({embeds: [embed], ephemeral: true});
    } catch (error) {
      const embed = new EmbedBuilder()
        .setTitle('An Error occured')
        .setDescription(`${error}`);
      console.error(error);
      return await interaction.reply({embeds: [embed], ephemeral: true});
    }
  },
}