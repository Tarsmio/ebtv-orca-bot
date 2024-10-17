const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { checkUserPermissions } = require("./../../utils/logging/logger")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cleancastpresaison')
        .setDescription('Commande pour nettoyer les salons de cast de la présaison.'),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            const MINUTE_IN_MILLISECONDS = 60_000;
            const CHANNEL_CATEGORY_TYPE = 4;

            await checkUserPermissions(interaction, [process.env.ROLE_ID_ADMIN]);

            //Check for présaison or presaison pattern
            const targetPattern = /.*pr[eé]saison.*/i;

            const preSaisonCategory = interaction.guild.channels.cache.filter(channel => channel.type === CHANNEL_CATEGORY_TYPE && targetPattern.test(channel.name)).first();

            if (!preSaisonCategory || preSaisonCategory.size === 0) {
                return await interaction.editReply('La catégorie de présaison n\'a pas été trouvée.');
            }

            const presaisonChannels = preSaisonCategory.children.cache;

            const channelsNotStartingWithPrésaison = presaisonChannels.filter(channel => !targetPattern.test(channel.name));

            const channelNamesToDeleteString = channelsNotStartingWithPrésaison.map(channel => `- ${channel.name}`).join('\n');

            if (channelNamesToDeleteString.length === 0) {
                return await interaction.editReply({ content: `Aucun salon de cast de présaison à supprimer.`, ephemeral: false });
            }

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
                content: `Êtes-vous sûr de vouloir supprimer les salons \n${channelNamesToDeleteString} :`,
                components: [row],
            });

            const collectorFilter = i => i.user.id === interaction.user.id;

            try {
                const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: MINUTE_IN_MILLISECONDS });

                if (confirmation.customId === 'confirm') {
                    channelsNotStartingWithPrésaison.forEach(channel => {
                        channel.delete();
                    })
                    await confirmation.update({ content: "Les salons de cast de présaison ont bien été supprimé.", components: [] });
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
