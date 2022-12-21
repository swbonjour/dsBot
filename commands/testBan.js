const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test_ban')
        .setDescription('Select member to ban')
        .addUserOption(option => 
            option
                .setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option => 
            option
                .setName('reason')
                .setDescription('The reason for banning'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('The gif category')
                .addChoices(
                    {name: 'F', value: 'f'},
                    {name: 'M', value: 'm'},
                    {name: 'M', value: 'm'},
                )),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        const category = interaction.options.getString('category');

        await interaction.reply(`Banning ${target.username} for reason: ${reason} category: ${category}`);
    }
}