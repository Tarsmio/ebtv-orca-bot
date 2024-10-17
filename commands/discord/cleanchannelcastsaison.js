const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { checkUserPermissions } = require("./../../utils/logging/logger")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cleancastsaison')
        .setDescription('Commande pour nettoyer les salons de cast de la saison.'),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            const MINUTE_IN_MILLISECONDS = 60_000;
            const CHANNEL_CATEGORY_TYPE = 4;

            const CHANNELS_TO_DELETE = [];

            await checkUserPermissions(interaction, [process.env.ROLE_ID_ADMIN]);

            //Check for Division followed by a digit
            const targetPattern = /^Division \d+$/;
            //Get channels which doesn't have div- or division- in their name
            const channelPattern = /^(?!(div-\d+|division-\d+)).*/;

            const seasonCategory = interaction.guild.channels.cache.filter(channel => channel.type === CHANNEL_CATEGORY_TYPE && targetPattern.test(channel.name));

            if (!seasonCategory || seasonCategory.size === 0) {
                return await interaction.editReply('La catégorie de présaison n\'a pas été trouvée.');
            }

            seasonCategory.forEach(category => {
                const seasonChannels = category.children.cache;

                const channelCast = seasonChannels.filter(channel => channelPattern.test(channel.name))

                if (channelCast.size > 0) {
                    CHANNELS_TO_DELETE.push(channelCast)
                }
            });

            const channelsCategoryDelete = CHANNELS_TO_DELETE.flatMap(collection => Array.from(collection.values()));
            const channelNamesToDelete = channelsCategoryDelete.map(channel => channel.name);

            const channelsWillBeDeleted = channelNamesToDelete.map(channel => `- ${channel}`).join('\n');

            //Set up like an embed message, to make it clear what the bot will delete
            const confirm = new ButtonBuilder()
                .setCustomId('confirm')
                .setLabel('Supprimer salon cast')
                .setStyle(ButtonStyle.Danger);

            const cancel = new ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('Annuler')
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder()
                .addComponents(confirm, cancel);

            const response = await interaction.editReply({
                content: `Êtes-vous sûr de vouloir supprimer les salons \n${channelsWillBeDeleted}`,
                components: [row],
            });

            const collectorFilter = i => i.user.id === interaction.user.id;

            try {
                const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: MINUTE_IN_MILLISECONDS });

                if (confirmation.customId === 'confirm') {
                    channelsCategoryDelete.forEach(channel => {
                        channel.delete();
                    })
                    await confirmation.update({ content: "Les salons de cast de saison ont bien été supprimé.", components: [] });
                } else if (confirmation.customId === 'cancel') {
                    await confirmation.update({ content: "Action annulé", components: [] });
                }
            } catch (e) {
                await interaction.editReply({ content: 'Aucune confirmation reçu dans la minute, annulation', components: [] });
            }
        } catch (error) {
            interaction.editReply({ content: `${error}`, ephemeral: false });
        }
    },
};
