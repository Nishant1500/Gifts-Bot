const Discord = require("discord.js")
module.exports = {
  async execute(giveaway, winners) {
    winners.forEach((member) => {
      member.send({
        embeds: [new Discord.EmbedBuilder()
          .setTitle(`🎁 We Have A New Winner!`)
          .setColor("#2F3136")
          .setDescription(`Hello there ${member.user}\n You won **[This Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** (rerolled)\n Congrats on winning **${giveaway.prize}!**`)
          .setTimestamp()
          .setFooter({
            text: `You are blessed!`, 
            iconURL: member.user.displayAvatarURL()
          })
        ]
      }).catch(e => {})
    });
  }
}
