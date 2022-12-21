const { SlashCommandBuilder } = require('discord.js');

const wait = require('timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('secret_ping')
    .setDescription('Replies with secret Pong!')
    .addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back'))
    .addChannelOption(option =>
		option.setName('channel')
			.setDescription('The channel to echo into'))
    .addChannelOption(option => 
        option.setName('embed')
            .setDescription('Whether or not the echo should be embedded')),
  async execute(interaction) {
    const locales = {
        ru: 'Секретный Понг',
    }
    await interaction.reply({ content: locales[interaction.locale], ephemeral: true });
    await wait(2000);
    await interaction.editReply('secretPongAgain');
  },
};