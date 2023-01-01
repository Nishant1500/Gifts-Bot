const chalk = require('chalk')

module.exports = (client, interaction) => {
 // Check if our interaction is a slash command
    if (interaction.isCommand()) {

 // Get the command from our slash command collection
    const command = client.interactions.get(interaction.commandName);

// If command does not exist return an error message
    if (!command) return interaction.reply({
      content: "There is no command like this..",
      ephemeral: true
    });

      if (!interaction.guild) return interaction.reply({
      content: `Use </${interaction.commandName}:1> in an actual server.`,
      ephemeral: true
    });
try {
    command.run(client, interaction);
  } catch(err) {
        console.log(chalk.hex('#FFAC1C')(`${err}`))
          console.log(chalk.red(`${err.stack.replace(`${err}`, '')}`))

  return interaction.reply({ content: 'Something happened on our end :(', ephemeral: true });
      }
  }
}