const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkUserPermissions } = require('./../../utils/logging/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('popcorn')
        .setDescription('Enjoy your popcorn !'),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            await checkUserPermissions(interaction, [process.env.ROLE_ID_STAFF_EBTV, process.env.ROLE_ID_ASSISTANT_TO]);
            await interaction.editReply(`:popcorn:`);
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: `${error}` });
        }

    },
};
