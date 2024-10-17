const { SlashCommandBuilder } = require('@discordjs/builders');
const { findMatch, setResult } = require("./../../utils/matchUtils");
const { checkUserPermissions } = require("./../../utils/logging/logger");
const { STAFF_EBTV, TO } = require('../../utils/roleEnum');

module.exports.execute = async (interaction) => {
    await interaction.deferReply();

    checkUserPermissions(interaction, [process.env.ROLE_ID_STAFF_EBTV, process.env.ROLE_ID_ASSISTANT_TO]);

    let team1 = interaction.options.getRole("équipe1").name
    let team2 = interaction.options.getRole("équipe2").name
    let score = interaction.options.getString("score");

    //Check if score is in format digital-digital (ex: 4-0)
    if (score && /^\d+-\d+$/.test(score)) {
        const [score1, score2] = score.split('-').map(Number);

        if (score1 < score2) { //Si le score est indiqué dans le "mauvais sens" (ex: Si team1 2-4 team2, le sens sera inversé team2 4-2 team1)
            const temp = team1;
            team1 = team2;
            team2 = temp;
            score = `${score2}-${score1}`;
        }
    } else {
        await interaction.editReply({ content: "Format du score invalide.", ephemeral: false });
    }

    findMatch(interaction,
        team1,
        team2,
        score,
        setResult);
}

module.exports.info = {
    name: "score",
    description: 'Commande pour mettre le score d\'un match un match !',
    rolePermission: [STAFF_EBTV, TO],
    userPersmission: [],
    helpReportType: 1
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)
    .addRoleOption(option =>
        option.setName("équipe1")
        .setDescription("Equipe1")
        .setRequired(true))
    .addStringOption(option =>
        option.setName("score")
        .setDescription("Score du match (ex: 4-0)")
        .setRequired(true))
    .addRoleOption(option =>
        option.setName("équipe2")
        .setDescription("Equipe2")
        .setRequired(true))
