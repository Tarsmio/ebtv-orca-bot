const { SlashCommandBuilder } = require('@discordjs/builders');
const { findMatch, setReport } = require("./../../utils/matchUtils");
const { checkUserPermissions } = require("./../../utils/logging/logger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Commande pour reporter un match !')
        .addRoleOption(option => option.setName("équipe1").setDescription("Equipe1").setRequired(true))
        .addRoleOption(option => option.setName("équipe2").setDescription("Equipe2").setRequired(true))
        .addRoleOption(option => option.setName("reporte_par").setDescription("Reporté par :").setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        checkUserPermissions(interaction, [process.env.ROLE_ID_STAFF_EBTV, process.env.ROLE_ID_ASSISTANT_TO]);

        findMatch(interaction,
            interaction.options.getRole("équipe1").name,
            interaction.options.getRole("équipe2").name,
            interaction.options.getRole("reporte_par").name,
            setReport);
    },
};
