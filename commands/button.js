const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, ButtonStyle } = require("discord.js");

const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('primary')
            .setLabel('Click me!')
            .setStyle(ButtonStyle.Primary),
    );

const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Some title')
			.setURL('https://discord.js.org')
			.setDescription('Some description here');

const button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('primaryy')
            .setLabel('Click me!')
            .setStyle(ButtonStyle.Primary)
    );

module.exports = {
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription('click me'),
    async execute(interaction) {
        const message = await interaction.reply({ content: 'I think you should', embeds: [embed], components: [row, button], fetchReply: true});
        message.react('😄');
    }
}