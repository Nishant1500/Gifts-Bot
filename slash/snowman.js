const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, ComponentType, AttachmentBuilder } = require('discord.js');
const Snowman = require('../core/snowman.js')
const progressBar = require('../core/progressBar.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('snowman')
    .setDescription('⛄ Interactive Snowman minigame')
    .addSubcommand(subcommand =>
      subcommand
        .setName('fight')
        .setDescription('⚔️ Fight with another user\'s snowman.')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('The user who wanna fight with.')
            .setRequired(true)
        )
    ),
  guildOnly: true,
  private: true,
  run: async (client, interaction) => {
    const user2 = interaction.options.getUser('user');
    const snowman1 = new Snowman(interaction.user.username, 10, 5, ['carrot nose', 'coal eyes', 'buttons'], 'ice sword');
    const snowman2 = new Snowman(user2.username, 10, 5, ['carrot nose', 'top hat', 'scarf'], 'shield');
    let turn = 1;
    let over = false;

    const row = (state) => new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('attack')
          .setLabel('Attack')
          .setDisabled(state ?? false)
          .setStyle(ButtonStyle.Primary),
      );
    const barG = (h) => progressBar('<:pg_1:1060894137148256256>', '<:pg_2:1060894156416880710>', '<:pg_3:1060894175496769557>', '<:pe_1:1060898541326831646>', '<:pe_2:1060898573648154666>', '<:pe_3:1060898688647577671>', h, 100, 5)

    const embed = (s1, s2) => new EmbedBuilder()
      .setTitle('Snowman Minigame')
      .addFields({
        name: `${s1.name}`,
        value: `${barG(s1.health)}\nHealth: ${s1.health}`
      },
        {
          name: `${s2.name}`,
          value: `${barG(s2.health)}\nHealth: ${s2.health}`
        });
    const img = snowman1.draw().toBuffer();
    console.log(img)

    const interactionCol = await interaction.reply({
      content: `<@${(turn % 2 === 1) ? interaction.user.id : user2.id}>'s Turn`,
      embeds: [embed(snowman1, snowman2)],
      components: [row()]
    });

    const collector = interactionCol.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60 * 5 * 1000 });
    function overF() {
      if (!over) {
        interaction.editReply({
          content: `Seems like <@${(turn % 2 === 1) ? interaction.user.id : user2.id}> ran away (nah, they just didn't responded to this interaction)..`,
          components: [row(true)]
        })
        return over = true;
      }
    }

    collector.on('collect', i => {
      if (i.user.id === interaction.user.id || i.user.id === user2.id) {
        if (over) return i.reply({
          content: 'This fight already ended.',
          ephemeral: true
        })

        const t = turn % 2 === 1
        if (t && i.user.id === interaction.user.id) {
          snowman1.attack(snowman2);
          collector.resetTimer({
            time: 20 * 1000
          })
          turn++;
        } else if (!t && i.user.id === user2.id) {
          snowman2.attack(snowman1);
          collector.resetTimer({
            time: 20 * 1000
          })
          turn++;
        } else i.reply({
          content: `It's <@${(t) ? interaction.user.id : user2.id}>'s turn`,
          ephemeral: true
        });

        if (snowman1.health <= 0) {
          over = true;
          collector.stop()
          return i.update({
            content: `${snowman1.name} has been defeated!`,
            embeds: [embed(snowman1, snowman2)],
            components: [row(true)]
          });
        } else if (snowman2.health <= 0) {
          over = true;
          collector.stop()
          return i.update({
            content: `${snowman2.name} has been defeated!`,
            embeds: [embed(snowman1, snowman2)],
            components: [row(true)]
          });
        } else {
          i.update({
            content: `<@${(turn % 2 === 1) ? interaction.user.id : user2.id}>'s Turn`,
            embeds: [embed(snowman1, snowman2)],
            components: [row()]
          });
        }
      } else {
        i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
      }
    });

    collector.on('end', (_collected, reason) => {
      if (reason == "time") overF();
    })
  }
}
