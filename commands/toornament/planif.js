const { SlashCommandBuilder } = require('@discordjs/builders');
const { findMatch, setPlanif } = require("./../../utils/matchUtils");
const { checkUserPermissions } = require("./../../utils/logging/logger");
const { parseAndFormatDate } = require("./../../utils/planification/date");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('planif')
        .setDescription('Commande pour planifier un match !')
        .addRoleOption(option => option.setName("équipe1").setDescription("Equipe1").setRequired(true))
        .addRoleOption(option => option.setName("équipe2").setDescription("Equipe2").setRequired(true))
        .addStringOption(option => option.setName("date").setDescription("Date (JJ/MM/AAAA)").setRequired(true))
        .addStringOption(option => option.setName("heure").setDescription("Heure (HH:mm)").setRequired(true)),
    async execute(interaction) {
        try {
            await interaction.deferReply();

            checkUserPermissions(interaction, [process.env.ROLE_ID_STAFF_EBTV, process.env.ROLE_ID_ASSISTANT_TO])

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

    },
};
