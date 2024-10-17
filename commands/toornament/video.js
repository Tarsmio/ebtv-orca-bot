const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkUserPermissions } = require('./../../utils/logging/logger');
const { setVideo } = require('./../../utils/toornament/video');
const { getMatchId } = require('./../../utils/matchUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lielienvideo')
        .setDescription('Commande pour liée une vidéo à un match !')
        .addRoleOption(option => option.setName('equipe1').setDescription('Le rôle de la première équipe du match.').setRequired(true))
        .addRoleOption(option => option.setName('equipe2').setDescription('Le rôle de la seconde équipe du match.').setRequired(true))
        .addStringOption(option => option.setName('url').setDescription('L\'url de la vidéo').setRequired(true)),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            await checkUserPermissions(interaction, [process.env.ROLE_ID_STAFF_EBTV, process.env.ROLE_ID_ASSISTANT_TO, process.env.ROLE_ID_CASTER_INDE]);

            const titre = interaction.options.getString('titre');
            const url = interaction.options.getString('url');

            const urlPattern = new RegExp(/^https:\/\/(www\.)?(youtube\.com)\/(.+?)+$/) //Check for a youtube url
            if (!urlPattern.test(interaction.options.getString('url'))) {
                await interaction.editReply({ content: `L'url donné n'est pas d'une vidéo Youtube.`, ephemeral: false })
                return;
            }

            const equipe1 = interaction.options.getRole("equipe1").name;
            const equipe2 = interaction.options.getRole('equipe2').name;
            const matchId = await getMatchId(equipe1, equipe2);

            if (matchId === 0) {
                await interaction.editReply({ content: `Il n'y a pas de match entre ${equipe1} et ${equipe2}, vérifier les teams.` })
                return;
            }

            setVideo(`${equipe1} vs ${equipe2}`, url, matchId);
            await interaction.editReply(`Le lien de la vidéo a bien été ajoutée.`);
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: `${error}` });
        }

    },
};
