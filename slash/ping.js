const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('🏓Check bot\'s latency!'),
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
