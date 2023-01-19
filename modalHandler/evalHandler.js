const { EmbedBuilder } = require("discord.js");
const beautify = require('js-beautify').js

module.exports = {
  handle: async (client, interaction) => {
    const unsanitizedCode = interaction.fields.getTextInputValue('codeInput');

    const sanitizedCode = beautify(unsanitizedCode, {
      "indent_size": "4",
      "indent_char": " ",
      "max_preserve_newlines": "5",
      "preserve_newlines": true,
      "keep_array_indentation": false,
      "break_chained_methods": false,
      "indent_scripts": "normal",
      "brace_style": "collapse",
      "space_before_conditional": true,
      "unescape_strings": false,
      "jslint_happy": false,
      "end_with_newline": false,
      "wrap_line_length": "0",
      "indent_inner_html": false,
      "comma_first": false,
      "e4x": true,
      "indent_empty_lines": false
    })

    try {
      const data = await eval(unsanitizedCode.replace(/```/g, ''));
      const embed = new EmbedBuilder()
        .setTitle('Eval Command')
        .setDescription(`The eval was successful.`)
        .addFields({
          name: `Code Input`,
          value: `\`\`\`js\n${sanitizedCode}
          \`\`\``
        }, {
          name: `Output`,
          value: `${data}`
        })

      return await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setTitle('An Error occured')
        .setDescription(`${error}`);
      console.error(error);
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
}