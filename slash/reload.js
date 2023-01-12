const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ComponentType } = require('discord.js');
const chalk = require('chalk')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('🤖 [Dev] Reloads a command within Discord.')
  .addStringOption(option => option
                   .setName('file')
                   .setDescription('Name of the command that will be reloaded.')
                   ),
  guildOnly: false,
  private: true,
  run: async (client, interaction) => {

    const commandName = interaction.options.getString('file');

		/**
		 * @type {Object}
		 * @description The command object itself which is specified.
		 */

		const command =
			client.interactions.get(commandName)

		// Command returns if there is no such command with the specific command name or alias.
		if (!command) {
			return interaction.reply({
				content: `There is no command with name \`${commandName}\`, ${interaction.user}!`,
        ephemeral: true
			});
		}

		/**
		 * @type {String[]}
		 * @description Array of all command categories aka folders.
		 */

		// const commandFolders = fs.readdirSync("../slash");

		/**
		 * @type {String}
		 * @description Name of the command category/folder of the specified command.
		 */

		/* const folderName = commandFolders.find((folder) =>
			fs.readdirSync(`../slash/${folder}`).includes(`${command.name}.js`)
		);*/

    client.tempCommand = require(`./${commandName}.js`)

		// Deletes current cache of that specified command.

		delete require.cache[
			require.resolve(`./${commandName}.js`)
		];

		// Tries Registering command again with new code.

		try {

			const newCommand = require(`./${commandName}.js`);
      
			client.interactions.set(commandName, newCommand);
      console.log("Data  " + newCommand.data)
      
      console.log(chalk.hex('#FFAC1C')(`[!] ${commandName}.js `) + `was reloaded by ${interaction.user.username}#${interaction.user.discriminator}`)

			return await interaction.reply({
				content: (`${newCommand.run}` == `${client.tempCommand.run}`) ? `Tried to reload command \`${commandName}\` but the content was same!` : `Command \`${commandName}\` was reloaded!`,
        ephemeral: true
			});
      		} catch (error) {
			// Catch block executes if there is any error in your code. It logs the error in console and also sends back in discord GUI.
      client.interactions.set(commandName, client.tempCommand);
			console.error(error);
			return await interaction.reply({
				content: `**Will be using the previous content of the command.**\n\nThere was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``,
        ephemeral: true
			});
		}
    
  },
};
