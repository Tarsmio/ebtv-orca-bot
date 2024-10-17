const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkUserPermissions } = require('./../../utils/logging/logger');
const { removePlayerFromTeam } = require('./../../utils/toornament/participant');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('retraitjoueur')
        .setDescription('Commande pour retirer un joueur à une équipe sur Toornament !')
        .addRoleOption(option => option.setName('équiperetrait').setDescription('Equipe où le joueur sera retiré.').setRequired(true))
        .addStringOption(option => option.setName('pseudojoueur').setDescription('Le pseudo du joueur à ajouter à l\'équipe').setRequired(true)),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            await checkUserPermissions(interaction, [process.env.ROLE_ID_STAFF_EBTV, process.env.ROLE_ID_ASSISTANT_TO]);

            const teamName = interaction.options.getRole("équiperetrait").name;
            const playerName = interaction.options.getString("pseudojoueur");

            await removePlayerFromTeam(teamName, playerName);

            await interaction.editReply(`Le joueur/La joueuse ${playerName} a été correctement retiré de l'équipe ${teamName}.`);

        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: `${error}` });
        }

    },
};
