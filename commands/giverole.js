const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giverole')
        .setDescription('gives role')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to give role')
                .setRequired(true))
        .addStringOption(option =>
			option.setName('role')
				.setDescription('The role')
				.setRequired(true)
				.addChoices(
					{ name: 'Human', value: 'human' },
					{ name: 'Robot', value: 'robot' },
                    { name: 'Admin', value: 'admin' },
				)),
    async execute(interaction) {
        //console.log(interaction.member.roles.cache.has('1054772380305723432'));
        //interaction.reply(`${interaction.member.roles.cache.has('1054772380305723432')}`);

        const target = interaction.options.getMember('target');
        const hasRole = target.roles.cache.has('1054772380305723432');
        console.log(hasRole);

        const role = interaction.guild.roles.cache.find(role => role.name == interaction.options.getString('role'));
        console.log(role);
        target.roles.add(role);
        interaction.reply(`giving the ${role} to the ${target}`);
    },
}