const { SlashCommandBuilder } = require('@discordjs/builders');
const { findMatch, setReport, fetchUniqueMatch } = require("./../../utils/matchUtils");
const { STAFF_EBTV, TO } = require('../../utils/roleEnum');
const { fetchUniqueGroup } = require('../../utils/groupUtils');
const { getCategoryCastMatch } = require('../../utils/castChannel/castChannelUtils');

module.exports.execute = async (interaction) => {
    await interaction.deferReply();

    let team1 = interaction.options.getRole("équipe1").name
    let team2 = interaction.options.getRole("équipe2").name

    await findMatch(interaction,
        interaction.options.getRole("équipe1").name,
        interaction.options.getRole("équipe2").name,
        interaction.options.getRole("reporte_par").name,
        setReport);

    let match = await fetchUniqueMatch(
        interaction.options.getRole("équipe1").name,
        interaction.options.getRole("équipe2").name
    );

    const divisionName = await fetchUniqueGroup(match[0]?.group_id);

    const divisionPattern = divisionName.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const divCat = await getCategoryCastMatch(interaction.guild, divisionPattern);

    let forumPattern = /^div-[0-9]{1,2}-stats$/

    let statChannel = divCat.children.cache.find(c => forumPattern.test(c.name))

    let statMatchChannel = statChannel.threads.cache.find(t => t.name == `${team1} contre ${team2}` || t.name == `${team2} contre ${team1}`)

    await statMatchChannel.send(`Le match viens d'etre reporté il n'aura donc pas lieu la semaine indiqué`)
}

module.exports.info = {
    name: "report",
    description: 'Reporter un match !',
    rolePermission: [STAFF_EBTV, TO],
    userPersmission: [],
    helpReportType: 1,
    category: "toornament",
    active: true,
    isPublic: true
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
