const { SlashCommandBuilder } = require('@discordjs/builders');
const { findMatch, setReport } = require("./../../utils/matchUtils");

module.exports.execute = async (interaction) => {
    await interaction.deferReply();

    findMatch(interaction,
        interaction.options.getRole("équipe1").name,
        interaction.options.getRole("équipe2").name,
        interaction.options.getRole("reporte_par").name,
        setReport);
}

module.exports.info = {
    name: "report",
    description: 'Reporter un match !',
    rolePermission: [STAFF_EBTV, TO],
    userPersmission: [],
    helpReportType: 1,
    category: "toornament"
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName('report')
    .setDescription('Commande pour reporter un match !')
    .addRoleOption(option =>
        option.setName("équipe1")
            .setDescription("Equipe1")
            .setRequired(true))
    .addRoleOption(option =>
        option.setName("équipe2")
            .setDescription("Equipe2")
            .setRequired(true))
    .addRoleOption(option =>
        option.setName("reporte_par")
            .setDescription("Reporté par :")
            .setRequired(true))
