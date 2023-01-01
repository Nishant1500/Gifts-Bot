const { ActivityType, REST, Routes } = require('discord.js');
const chalk = require('chalk')

function setAc(client) {
  client.user.setPresence({
  activities: [{ name: `Giveaways on ${client.guilds.cache.size} servers`, type: ActivityType.Watching }],
  status: 'online',
});
}

module.exports = async (client) => {

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
  
(async () => {
	try {
		console.log(`Started refreshing ${client.slashArr.length} application ` + chalk.blueBright.bold('/slash') +` commands.`);
    
		const data = await rest.put(
			Routes.applicationCommands(client.user.id),
			{ body: client.slashArr },
		);

		console.log(`Successfully reloaded ${data.length} application ` + chalk.blueBright.bold('/slash') +` commands.`);
	} catch (error) {
		console.error(error);
	}
})();

  
  console.log(chalk.blueBright('[SlashCommand]') + '- Loaded all slash commands!')
  
  console.log(chalk.greenBright('[Status]') + ` ${client.user.tag} is now online!`);
  
  client.user.setPresence({
  activities: [{ name: `Giveaways on ${client.guilds.cache.size} servers`, type: ActivityType.Watching }],
  status: 'online',
});

  setInterval(() => setAc(client), (2 * 60* 1000))

};
