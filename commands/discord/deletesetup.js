const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkUserPermissions } = require("./../../utils/logging/logger")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('supressiondivisionligue')
        .setDescription('Commande pour créer un channel de cast !'),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            const CHANNEL_CATEGORY_TYPE = 4;

            await checkUserPermissions(interaction, [process.env.ROLE_ID_ADMIN]);

            //Check for a pattern Division followed by a numeric value
            const targetPattern = /^Division \d+$/;

            const divisionCategories = interaction.guild.channels.cache.filter(channel =>
                channel.type === CHANNEL_CATEGORY_TYPE && targetPattern.test(channel.name)
            );

            divisionCategories.forEach(category => {
                const channelsInCategory = category.children.cache;

                channelsInCategory.forEach(channel => {
                    channel.delete();
                })

                category.delete();
            });

            interaction.editReply({ content: `Les divisions de la saison ont bien été supprimée.`, ephemeral: false });
        } catch (error) {
            interaction.editReply({ content: `${error}`, ephemeral: false });
        }
    },
};
