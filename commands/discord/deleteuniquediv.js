const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkUserPermissions } = require("./../../utils/logging/logger")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('supressionuniquedivision')
        .setDescription('Commande pour supprimer une division !')
        .addStringOption(option => option.setName('numdiv').setDescription('Numéro de la division à supprimer').setRequired(true)),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            await checkUserPermissions(interaction, [process.env.ROLE_ID_ADMIN]);

            const CHANNEL_CATEGORY_TYPE = 4; //Type for category channel
            const numDiv = interaction.options.getString('numdiv');

            if(isNaN(numDiv)){
                throw new Error('Le paramètre numdiv n\'est pas une valeur numérique.');
            }

            const divisionCategories = interaction.guild.channels.cache.filter(channel =>
                channel.type === CHANNEL_CATEGORY_TYPE && channel.name === `Division ${numDiv}`
            );

            if(!divisionCategories || divisionCategories.size === 0){
                throw new Error('Aucune division correspondante n\'a été trouvée.');
            }

            divisionCategories.forEach(category => {
                const channelsInCategory = category.children.cache;

                if(channelsInCategory && channelsInCategory.size > 0) {
                    channelsInCategory.forEach(channel => {
                        channel.delete();
                    })
                }
                category.delete();
            });

           return await interaction.editReply({ content: `La division choisie a été supprimée.`, ephemeral: false });
        } catch (error) {
            console.error(error)
            await interaction.editReply({ content: `${error}`, ephemeral: false });
        }
    },
};
