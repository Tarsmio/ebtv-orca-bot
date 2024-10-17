const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkUserPermissions } = require('./../../utils/logging/logger');
const { addPlayerToTeam, removePlayerFromTeam } = require('./../../utils/toornament/participant');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfertjoueur')
        .setDescription('Commande pour transférer un joueur d\'une équipe à une autre sur Toornament !')
        .addRoleOption(option => option.setName('retrait').setDescription('Le nom de l\'équipe que le joueur quitte.').setRequired(true))
        .addRoleOption(option => option.setName('transfertvers').setDescription('Le nom de l\'équipe vers laquelle le joueur est transféré.').setRequired(true))
        .addStringOption(option => option.setName('pseudoplayer').setDescription('Le pseudo du joueur transféré').setRequired(true)),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            await checkUserPermissions(interaction, [process.env.ROLE_ID_STAFF_EBTV, process.env.ROLE_ID_ASSISTANT_TO]);

            const teamNameRetrait = interaction.options.getRole("retrait").name;
            const teamNameAjout = interaction.options.getRole("transfertvers").name;
            const playerName = interaction.options.getString("pseudoplayer");

            await removePlayerFromTeam(teamNameRetrait, playerName);
            await addPlayerToTeam(teamNameAjout, playerName);

            await interaction.editReply(`Le joueur/La joueuse ${playerName} a été correctement ajouté à l'équipe ${teamNameAjout}.`);
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: `${error}` });
        }

    },
};
