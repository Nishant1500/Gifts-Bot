require('dotenv').config()
const { ActivityType, REST, Routes } = require('discord.js');
const chalk = require('chalk')
const whitelistModel = require('../../schema/whitelist.js');

const { createDjsClient } =  require("discordbotlist");

function setAc(client) {
  client.user.setPresence({
    activities: [{ name: `Giveaways on ${client.guilds.cache.size} servers`, type: ActivityType.Watching }],
    status: 'online',
  });
}

module.exports = async (client) => {

  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

  const s = await whitelistModel.find();

  (async () => {
    try {
      console.log(chalk.blueBright('[SlashCommand]') + ` Started refreshing ${client.slashArr.length} application ` + chalk.blueBright.bold('/slash') + ` commands.`);

      /*rest.put(Routes.applicationCommands(client.user.id), { body: [] })
        .then(() => console.log(chalk.blueBright('[SlashCommand]') + ' Successfully deleted all application commands.'))
        .catch(console.error);*/

      const data = await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: client.slashArr },
      );
      s.forEach(async (obj) => {
        await rest.put(
          Routes.applicationGuildCommands(client.user.id, obj.guildId),
          { body: client.slashPrivateArr },
        );
      });

      console.log(chalk.blueBright('[SlashCommand]') + ` Successfully reloaded ${data.length} application ` + chalk.blueBright.bold('/slash') + ` commands.`);
    } catch (error) {
      console.error(error);
    }
  })();


  console.log(chalk.blueBright('[SlashCommand]') + '- Loaded all slash commands!')

  console.log(chalk.greenBright('[Status]') + ` ${client.user.tag} is now online!`);
  const dbl = createDjsClient(process.env.DBL_API_TOKEN, client);


  dbl.startPosting();

  client.user.setPresence({
    activities: [{ name: `Giveaways on ${client.guilds.cache.size} servers`, type: ActivityType.Watching }/*{ name: `rip, reached daily slash limit (200)`, type: ActivityType.Watching }*/],
    status: 'online',
  });

  setInterval(() => setAc(client), (2 * 60 * 1000))

};
