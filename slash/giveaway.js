const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('giveaway')
		.setDescription('🎉 Manage giveaways.')
  .addSubcommand(subcommand =>
		subcommand
			.setName('start')
			.setDescription('Start a giveaway')
			.addStringOption(option => option.setName('durarion').setDescription('How long the giveaway should last for. Example values: 1m, 1h, 1d').setRequired(true))
      .addIntegerOption(option => option.setName('winners').setDescription('How many winners the giveaway should have').setRequired(true))
                 .addStringOption(option => option.setName('prize').setDescription('What the prize of the giveaway should be').setRequired(true))
                 .addChannelOption(option => option.setName('channel').setDescription('The channel to start the giveaway in').setRequired(true))
                )
  .addSubcommand(subcommand =>
    subcommand.setName('reroll')
                .setDescription('Reroll a giveaway')
                .addStringOption(option => option.setName('giveaway')
          .setDescription('The giveawayID (message ID) to reroll.').setRequired(true)
                                )
                )
,
    run: async (client, interaction) => {
      let pembed = new EmbedBuilder()
		  .setColor('#2F3136')	
		  .setTitle('Client Ping')
		  .addFields({ name: '**Latency**', 
                   value: `\`${Date.now() - interaction.createdTimestamp}ms\``
                 })
		  .addFields({ name: '**API Latency**', 
                   value: `\`${Math.round(client.ws.ping)}ms\``
                 })
		  .setTimestamp()
                  .setFooter({
                     text: `${interaction.user.username}`,
                     iconURL: interaction.user.displayAvatarURL()
                  })
        interaction.reply({
          embeds: [pembed]
        });
    },
};
