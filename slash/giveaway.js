const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const ms = require("ms")
const messages = require("../utils/message");

module.exports = {
    data: new SlashCommandBuilder()
		.setName('giveaway')
		.setDescription('🎉 Manage giveaways.')
  .addSubcommand(subcommand =>
		subcommand
			.setName('start')
			.setDescription('🎉 Start a giveaway')
			.addStringOption(option => option.setName('duration').setDescription('How long the giveaway should last for. Example values: 1m, 1h, 1d').setRequired(true))
      .addIntegerOption(option => option.setName('winners').setDescription('How many winners the giveaway should have').setRequired(true))
                 .addStringOption(option => option.setName('prize').setDescription('What the prize of the giveaway should be').setRequired(true))
                 .addChannelOption(option => option.setName('channel').setDescription('The channel to start the giveaway in').setRequired(true))
                )
  .addSubcommand(subcommand =>
    subcommand.setName('reroll')
                .setDescription('🎉 Reroll a giveaway')
                .addStringOption(option => option.setName('giveaway')
          .setDescription('The giveawayID (message ID) to reroll.').setRequired(true)
                                )
                )
,
    run: async (client, interaction) => {
      const sub = interaction.options.getSubcommand();
      if(sub == "start") {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) {
      return interaction.reply({
        content: ':x: You need to have the manage messages permissions to start giveaways.',
        ephemeral: true
      });
        }

        const giveawayChannel = interaction.options.getChannel('channel');
    const giveawayDuration = interaction.options.getString('duration');
    const giveawayWinnerCount = interaction.options.getInteger('winners');
    const giveawayPrize = interaction.options.getString('prize');
    const bonusRole = interaction.options.getRole('bonusrole')
    const bonusEntries = interaction.options.getInteger('bonusamount')
    let rolereq = interaction.options.getRole('role')
    let invite = interaction.options.getString('invite')
        let reqinvite;

        if (!giveawayChannel.isTextBased()) return interaction.reply({
        content: ':x: Please select a text channel!',
        ephemeral: true
      });

if(isNaN(ms(giveawayDuration))) return interaction.reply({
      content: ':x: Please select a valid duration!',
      ephemeral: true
    });
        
    if (giveawayWinnerCount < 1) return interaction.reply({
        content: ':x: Please select a valid winner count! greater or equal to one.',
      })

        await interaction.deferReply({ ephemeral: true })

        client.giveawaysManager.start(giveawayChannel, {
      // The giveaway duration
      duration: ms(giveawayDuration),
      // The giveaway prize
      prize: giveawayPrize,
      hostedBy: interaction.user,
      // The giveaway winner count
      winnerCount: parseInt(giveawayWinnerCount),
      // BonusEntries If Provided
      bonusEntries: [
        {
          // Members who have the role which is assigned to "rolename" get the amount of bonus entries which are assigned to "BonusEntries"
          bonus: new Function('member', `return member.roles.cache.some((r) => r.name === \'${bonusRole ?.name}\') ? ${bonusEntries} : null`),
          cumulative: false
        }
      ],
      // Messages
      messages,
      extraData: {
        server: reqinvite == null ? "null" : reqinvite.guild.id,
        role: rolereq == null ? "null" : rolereq.id,
      }
    });
    interaction.editReply({
      content:
        `Giveaway started in ${giveawayChannel}!`,
      ephemeral: true
    })


        
      } else if(sub == "reroll") {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) && !interaction.member.roles.cache.some((r) => r.name === "Giveaways")) return interaction.reply({
                content: ':x: You need to have the manage messages permission to reroll giveaways.',
                ephemeral: true
            });

        const query = interaction.options.getString('giveaway');

        // try to find the giveaway with the provided prize OR with the ID
        const giveaway =
            // Search with giveaway prize
            client.giveawaysManager.giveaways.find((g) => g.prize === query && g.guildId === interaction.guild.id) ||
            // Search with giveaway ID
            client.giveawaysManager.giveaways.find((g) => g.messageId === query && g.guildId === interaction.guild.id);

        // If no giveaway was found
        if (!giveaway) {
            return interaction.reply({
                content: 'Unable to find a giveaway for `' + query + '`.',
                ephemeral: true
            });
        }

        if (!giveaway.ended) {
            return interaction.reply({
                content: `[This Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has not ended yet`,
                ephemeral: true
            });
        }

        // Reroll the giveaway
        giveaway.reroll()
            .then(() => {
                // Success message
                interaction.reply(`Rerolled **[this giveaway](<https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}>)!**`);
            })
            .catch((e) => {
                interaction.reply({
                    content: e,
                    ephemeral: true
                });
            });
        
        
      } else return interaction.reply({
        content: 'There was no command lime that.',
        ephemeral: true
      })
    },
};
