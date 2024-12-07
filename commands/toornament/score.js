const { SlashCommandBuilder } = require('@discordjs/builders');
const { findMatch, setResult, fetchUniqueMatch } = require("../../utils/matchUtils");
const { checkUserPermissions } = require("../../utils/logging/logger");
const { STAFF_EBTV, TO } = require('../../utils/roleEnum');

module.exports.execute = async (interaction) => {
    await interaction.deferReply();

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

    let match = await fetchUniqueMatch(
        interaction.options.getRole("équipe1").name,
        interaction.options.getRole("équipe2").name
    );

    if(match == null){
        return interaction.editReply({
            content : "Match introuvable !"
        })
    }

    let scoreFinal = await setResult(score, match[0].id, team1, match[0].opponents[0].participant, match[0].opponents[1].participant)

    if (scoreFinal != null){
        if(interaction.user.id == "362246536286961665"){
            return await interaction.editReply({
                content: `Mon tres cher Gaby t'as de la chance que je sois obliger de repondre a ta demande ||:middle_finger:||`
            })
        } else {
            return await interaction.editReply({
                content:`**${team1}** ${score} ${team2}`
            })
        }
    }
}

module.exports.info = {
    name: "score",
    description: 'Mettre le score d\'un match un match !',
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
    .addStringOption(option =>
        option.setName("score")
        .setDescription("Score du match (ex: 4-0)")
        .setRequired(true))
    .addRoleOption(option =>
        option.setName("équipe2")
        .setDescription("Equipe2")
        .setRequired(true))
