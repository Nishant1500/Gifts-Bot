const chalk = require('chalk')
const whitelistedUserModel = require('../../schema/whitelistUser.js')

module.exports = async (client, interaction) => {
  // Check if our interaction is a slash command
  const whitelistedUser = await whitelistedUserModel.findOne({ id: interaction.user.id });

  if (interaction.isCommand()) {

    // Get the command from our slash command collection
    const command = client.interactions.get(interaction.commandName);

    // If command does not exist return an error message
    if (!command) return interaction.reply({
      content: "There is no command like this..",
      ephemeral: true
    });

    if (!whitelistedUser && command.private == true) return interaction.reply({
      content: "This maze isn't for you.",
      ephemeral: true
    })
    if (whitelistedUser && !(whitelistedUser.permissionAll || whitelistedUser.permissions.includes(interaction.commandName))) return interaction.reply({
      content: "You This maze isn't for you.",
      ephemeral: true
    })
    

    if (command.guildOnly) return interaction.reply({
      content: `Use </${interaction.commandName}:1> in an actual server.`,
      ephemeral: true
    });
    try {
      command.run(client, interaction);
    } catch (err) {
      console.log(chalk.hex('#FFAC1C')(`${err}`))
      console.log(chalk.red(`${err.stack.replace(`${err}`, '')}`))

      return interaction.reply({ content: 'Something happened on our end :(', ephemeral: true });
    }
  } else if (interaction.isModalSubmit()) {
    const handler = client.modalHandlers.get(interaction.customId);

    if (!handler) return interaction.reply({
      content: "There is no handler for this modal..",
      ephemeral: true
    });

    try {
      handler.handle(client, interaction)
    } catch (err) {
      console.log(chalk.hex('#FFAC1C')(`${err}`))
      console.log(chalk.red(`${err.stack.replace(`${err}`, '')}`))

      return interaction.reply({ content: 'Something happened on our end :(', ephemeral: true });
    }

  }
}