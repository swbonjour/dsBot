const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if(!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if(!command) {
            console.log(`No command matching ${interaction.commandName} was found`);
        }

        try {
            await command.execute(interaction);
        } catch(error) {
            console.log(`Error executing ${interaction.commandName}`);
            console.log(error);
        }
    }
}