const { EmbedBuilder } = require('discord.js')

module.exports = async (client, guild) => {
  const j = new EmbedBuilder().setTitle('New Guild Joined')
  .addFields({ name: 'Name', value: `${guild.name}` })
  .addFields({ name: 'ID', value: `${guild.id}`})
  .addFields({ name: 'Verified', value: guild.verified ? 'Verified' : 'Not Verified'})
    .addFields({ name: 'Partnered', value: guild.partnered ? 'Partnered' : 'Not Partnered'})
  .addFields({ name: 'Description', value: `${guild.description}`})
  .addFields({ name: 'Members', value: `${guild.memberCount}`})
  .addFields({ name: 'My Permission', value: `${guild.members.me.permissions.toArray()}`})
  client.channels.cache.get('1058766175703683142').send({ embeds: [j]})
};
