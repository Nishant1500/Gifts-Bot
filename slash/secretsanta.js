const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const lodash = require('lodash');
const whitelistedUserModel = require('../schema/whitelistUser.js')
const secretSantaUserModel = require('../schema/secretSantaUser.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('secretsanta')
    .setDescription('🎅 The famous and awesome secret santa game now on Discord!')
    .addSubcommand(subcommand =>
      subcommand.setName('signup')
        .setDescription('Signup to participate in the event.')
    )
    .addSubcommand(subcommand =>
      subcommand.setName('start')
        .setDescription('Starts the event.')
    )
    .addSubcommand(subcommand =>
      subcommand.setName('leave')
        .setDescription('Take you name off the rolls.')
    )
    .addSubcommand(subcommand =>
      subcommand.setName('list')
        .setDescription('Shows a list of participants.')
        .addStringOption(option =>
          option.setName('format')
            .setDescription('The format of the list. ex. JSON, Normal')
            .setRequired(true)
            .addChoices(
              { name: 'JSON', value: 'json' },
              { name: 'Normal', value: 'normal' },
            )
        ),
    ),
  guildOnly: true,
  private: false,
  run: async (client, interaction) => {
    const whitelistedUser = await whitelistedUserModel.findOne({ id: interaction.user.id });
    if (!whitelistedUser) return interaction.reply({
      content: "🎅 Ho Ho Ho, This feature is still in testing. Come back soon!"
    })
    let guildModel;

    guildModel = await secretSantaUserModel.findOne({ guildId: interaction.guild.id })
    if (!guildModel) guildModel = new secretSantaUserModel({
      guildId: interaction.guild.id,
      participants: []
    });
    await guildModel.save();

    const sub = interaction.options.getSubcommand();
    if (sub == 'signup') {
      await interaction.deferReply({ ephemeral: true });

      const signedUpEmbed = new EmbedBuilder()
        .setTitle('✨ Signed Up!')
        .setDescription('You are signed up for secret santa event 🎅!\n\nYou will be informed about the user for whom you will become the secret santa, when the event starts\n**Good luck!** 🎄');

      const alreadyEmbed = new EmbedBuilder()
        .setTitle('Already Signedup')
        .setDescription('You are already signed up!\n\n> Use </secretsanta leave:1> to take your name off the list.')

      const alreadyStartedEmbed = new EmbedBuilder()
        .setTitle('🎄 Already Started')
        .setDescription('The event have already started!\nYou cannot singup anymore, Try again later.')

      if(guildModel.started == true) return interaction.editReply({
        embeds: [alreadyStartedEmbed],
        ephemeral: true
      });
      
      if (guildModel.participants.some(u => u.userId == interaction.user.id)) return interaction.editReply({
        embeds: [alreadyEmbed],
        ephemeral: true
      });

      guildModel.participants.push({
        userId: interaction.user.id,
      })
      guildModel.save()

      return interaction.editReply({
        embeds: [signedUpEmbed],
        ephemeral: true
      })


      // participants is an array of objects, each with a name and a Discord ID

      // shuffle the array of participants
      participants = lodash.shuffle(guildModel.participants);

      // assign each participant a gift recipient
      for (let i = 0; i < participants.length; i++) {
        let recipient = participants[(i + 1) % participants.length];  // the recipient is the next participant in the array
        participants[i].recipient = recipient.name;  // add the recipient's name to the participant object
      }

    } else if (sub == 'leave') {
      await interaction.deferReply({ ephemeral: true })
      const exists = guildModel.participants.filter(u => u.userId == interaction.user.id).length;
      const existsEmbed = new EmbedBuilder()
        .setTitle('🫠 Not Found')
        .setDescription('You haven\'t even enrolled for the event.\n\nYou can signup using </secretsanta signup:1> before the event begins.');
      console.log('What: ' + exists)
      if (!exists) return interaction.editReply({
        embeds: [existsEmbed],
        ephemeral: true
      });

      const newParticipants = guildModel.participants.filter(u => u.userId != interaction.user.id);

      guildModel.participants = newParticipants;
      await guildModel.save();
      const removed = new EmbedBuilder()
        .setTitle('✌️ Signed Out')
        .setDescription('Successfully signed out of the event.\n\nYou no longer will be receiving any news related to this event.\n\n🎁 ~~(surely you will be missing the gifts and the fun out there, so don\'t worry, you still can signup using </secretsanta signup:1> before the event begins.)~~');

      return interaction.editReply({
        embeds: [removed],
        ephemeral: true
      });
    } else if (sub == 'start') {
      await interaction.deferReply({ ephemeral: true })
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEvents)) return interaction.editReply({
        content: ':x: You need to have the **manage events** permissions to start secret santa event.',
        ephemeral: true
      });

      const startedEmbed = new EmbedBuilder()
        .setTitle('🎄 Ho Ho Ho')
        .setDescription(`Event Started! Slowly people will be getting an announcement in thier respective DMs.\n\n🎅 Total Participants: ${guildModel.participants.length}\n> Use </secretsanta list:1> for the updated list.`)

      const alreadyEmbed = new EmbedBuilder()
        .setTitle('Already Started')
        .setDescription(`This event have already began!\n\n🎅 Participants: ${guildModel.participants.length}\n> Use </secretsanta list:1> to see the list of the secret santas.`)
      if (guildModel.started == true) return interaction.editReply({
        embeds: [alreadyEmbed],
        ephemeral: true
      });
      // participants is an array of objects, each with a name and a Discord ID

      // shuffle the array of participants
      let newParticipants = []
      const participants = lodash.shuffle(guildModel.participants);

      // assign each participant a gift recipient
      for (let i = 0; i < participants.length; i++) {
        let recipient = participants[(i + 1) % participants.length];  // the recipient is the next participant in the array
        newParticipants.push({
          ...participants[i], recipientId: recipient.userId
        })

        

        if (i == (participants.length - 1)) saveAfter()
      }

      async function saveAfter() {
        guildModel.choosen = newParticipants;
        guildModel.started = true;
        guildModel.startedBy = interaction.user.id;
        await guildModel.save();

        return interaction.editReply({
          embeds: [startedEmbed],
          ephemeral: true
        });
      }

    } else if (sub == 'list') {
      await interaction.deferReply({ ephemeral: true });

      if (!guildModel.choosen) return interaction.editReply({
        content: "🎅 Ho Ho Ho, This feature is still in testing. Come back soon!"
      })
      if (interaction.options.getString('format') == 'json') return interaction.editReply({
        content: "🎅 Ho Ho Ho, This feature is still in testing, use **`Normal`** Format instead!"
      })

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEvents)) return interaction.editReply({
        content: ':x: You need to have the **manage events** permissions to see the list of secret santas.',
        ephemeral: true
      });

      const Readable1 = guildModel.choosen
      const embed = new EmbedBuilder()
        .setTitle('🎄 Secret Santa List');
      let liI = 0;
      Readable1.forEach((li) => {
        embed.addFields({ name: `Team ${liI + 1}`, value: `🎅 <@${li.userId}> ~ <@${li.recipientId}> ` })
        liI += 1;
        if (liI == Readable1.length) {
          return interaction.editReply({
            embeds: [embed],
            ephemeral: true
          });
        }
      })
    }
  },
};
