const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkUserPermissions } = require('./../../utils/logging/logger');
const { addPlayerToTeam } = require('./../../utils/toornament/participant');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ajoutjoueur')
        .setDescription('Commande pour ajouter un joueur à une équipe sur Toornament !')
        .addRoleOption(option => option.setName('équipeajout').setDescription('Equipe où est ajouté le joueur.').setRequired(true))
        .addStringOption(option => option.setName('pseudojoueur').setDescription('Le pseudo du joueur à ajouter à l\'équipe').setRequired(true)),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            await checkUserPermissions(interaction, [process.env.ROLE_ID_STAFF_EBTV, process.env.ROLE_ID_ASSISTANT_TO]);

            const teamName = interaction.options.getRole('équipeajout').name;
            const playerName = interaction.options.getString("pseudojoueur");

            await addPlayerToTeam(teamName, playerName);

            await interaction.editReply(`Le joueur/La joueuse ${playerName} a été correctement ajouté à l'équipe ${teamName}.`);
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: `${error}` });
        }

    },
};
