const { SlashCommandBuilder } = require('@discordjs/builders');
const { findMatch, setPlanif } = require("../../utils/matchUtils");
const { checkUserPermissions } = require("../../utils/logging/logger");
const { parseAndFormatDate } = require("../../utils/planification/date");
const { STAFF_EBTV, TO } = require('../../utils/roleEnum');

module.exports.execute = async (interaction) => {
    try {
        await interaction.deferReply();

        const formattedDate = parseAndFormatDate(interaction.options.getString("date"), interaction.options.getString("heure"));

        findMatch(interaction,
            interaction.options.getRole("équipe1").name,
            interaction.options.getRole("équipe2").name,
            formattedDate,
            setPlanif
        );
    } catch (error) {
        console.error(error);
        await interaction.editReply({ content: `${error}` });
    }

}

module.exports.info = {
    name: "planif",
    description: 'Commande pour planifier un match !',
    rolePermission: [STAFF_EBTV, TO],
    userPersmission: [],
    helpReportType: 1,
    category : "toornament"
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)
    .addRoleOption(option =>
        option.setName("équipe1")
            .setDescription("Equipe1")
            .setRequired(true))
    .addRoleOption(option =>
        option.setName("équipe2")
            .setDescription("Equipe2")
            .setRequired(true))
    .addStringOption(option =>
        option.setName("date")
            .setDescription("Date (JJ/MM/AAAA)")
            .setRequired(true))
    .addStringOption(option => option.setName("heure")
        .setDescription("Heure (HH:mm)")
        .setRequired(true))
