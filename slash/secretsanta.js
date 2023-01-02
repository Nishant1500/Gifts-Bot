const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
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
    ),
  guildOnly: true,
  private: false,
  run: async (client, interaction) => {
    const whitelistedUser = whitelistedUserModel.findOne({ id: interaction.user.id })
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

      const signedUpEmbed = new EmbedBuilder()
        .setTitle('✨ Signed Up!')
        .setDescription('You are signed up for secrer santa event 🎅!\n\nYou will be informed about the user for whom you will become the secret santa for, when the event starts\n**Good luck!** 🎄');

      const alreadyEmbed = new EmbedBuilder()
        .setTitle('Already Signedup')
        .setDescription('You are already signed up!\n\n> Use </secretsanta leave:1> to take your name off the list.')
      if (guildModel.participants.some(u => u.userId == interaction.user.id)) return interaction.reply({
        embeds: [alreadyEmbed],
        ephemeral: true
      });

      guildModel.participants.push({
        userId: interaction.user.id,
      })
      guildModel.save()

      return interaction.reply({
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
      const exists = guildModel.participants.filter(u => u.userId == interaction.user.id);
      const existsEmbed = new EmbedBuilder()
        .setTitle('🫠 Not Found')
        .setDescription('You haven\'t even enrolled for the event.\n\nYou can signup using </secretsanta signup:1> before the event begins.');
console.log('What: ' + exists)
      if (!exists) return interaction.reply({
        embeds: [existsEmbed],
        ephemeral: true
      });

      const newParticipants = guildModel.participants.filter(u => u.userId != interaction.user.id);

      guildModel.participants = newParticipants;
      await guildModel.save();
      const removed = new EmbedBuilder()
        .setTitle('✌️ Signed Out')
        .setDescription('Successfully signed out of the event.\n\nYou no longer will be receiving any news related to this event.\n\n🎁 ~~(surely you will be missing the gifts and the fun out there, so don\'t worry, you still can signup using </secretsanta signup:1> before the event begins.)~~');

      return interaction.reply({
        embeds: [removed],
        ephemeral: true
      });
    } else if (sub == 'start') {
      return interaction.reply({
        content: "🎅 Ho Ho Ho, This feature is still in testing. Come back soon!"
      })
    }
  },
};
