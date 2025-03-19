const { SlashCommandBuilder } = require('@discordjs/builders');
const { findMatch, setPlanif, fetchUniqueMatch } = require("../../utils/matchUtils");
const { checkUserPermissions } = require("../../utils/logging/logger");
const { parseAndFormatDate } = require("../../utils/planification/date");
const { STAFF_EBTV, TO } = require('../../utils/roleEnum');
const { randomInt, getDayOfWeekWithDate } = require('../../utils/utilityTools');
const { fetchUniqueGroup } = require('../../utils/groupUtils');
const { getCategoryCastMatch } = require('../../utils/castChannel/castChannelUtils');

function isEster(channelId) {
    easterNumber = randomInt(1, 10)

    if ((channelId == process.env.PRIVATE_CMD_CHANNEL) && (easterNumber == 6)) {
        return true
    } else {
        return false
    }
}

module.exports.execute = async (interaction) => {

    try {
        await interaction.deferReply();

        const formattedDate = parseAndFormatDate(interaction.options.getString("date"), interaction.options.getString("heure"));

        let team1 = interaction.options.getRole("équipe1").name
        let team2 = interaction.options.getRole("équipe2").name

        let match = await fetchUniqueMatch(
            team1,
            team2
        );

        if (match == null) {
            return interaction.editReply({
                content: "Match introuvable !"
            })
        }


        if (await setPlanif(formattedDate, match[0].id)) {
            const divisionName = await fetchUniqueGroup(match[0]?.group_id);

            const divisionPattern = divisionName.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            const divCat = await getCategoryCastMatch(interaction.guild, divisionPattern);

            let forumPattern = /^div-[0-9]{1,2}-stats$/

            let statChannel = divCat.children.cache.find(c => forumPattern.test(c.name))

            let statMatchChannel = statChannel.threads.cache.find(t => t.name == `${team1} contre ${team2}` || t.name == `${team2} contre ${team1}`)

            let castNextMatchChannel = await interaction.client.channels.fetch(process.env.NEXT_MATCH_CHANNEL)

            await statMatchChannel.send(`Le match est prevu pour le ${getDayOfWeekWithDate(formattedDate.substring(0, 10))} à ${formattedDate.substring(11, 16)}.`)
            await castNextMatchChannel.send(`## Nouveau match planifié ! :calendar_spiral:\n**${team1}** contre **${team2}** est prévu pour le **${getDayOfWeekWithDate(formattedDate.substring(0, 10))} à ${formattedDate.substring(11, 16)}**`)
            if (isEster(interaction.channel.id)) {
                return await interaction.editReply({
                    content: `Eh ben putain t'as bien pris ton temps à planif ducon hein ? Tout ça pour le planifier pour le ${getDayOfWeekWithDate(formattedDate.substring(0, 10))} à ${formattedDate.substring(11, 16)} ?! Non mais quelle plaie je te jure... Et t'as pensé au caster ? Non évidemment que non ! Peuchère...\n\nBisous`
                })
            } else if (interaction.user.id == "362246536286961665") {
                return await interaction.editReply({
                    content: `Mon tres cher Gaby t'as de la chance que je sois obliger de repondre a ta demande ||:middle_finger:||`
                })
            } else {
                return await interaction.editReply({ content: `Le match entre ${match[0].opponents[0].participant.name} et ${match[0].opponents[1].participant.name} a été planifié pour le ${getDayOfWeekWithDate(formattedDate.substring(0, 10))} à ${formattedDate.substring(11, 16)}.` })
            }
        } else {
            return await interaction.editReply({
                content: "Le match n'as pas pu être planifié"
            })
        }

    } catch (error) {
        console.error(error);
        await interaction.editReply({ content: `${error}` });
    }

}

module.exports.info = {
    name: "planif",
    description: 'Planifier un match !',
    rolePermission: [STAFF_EBTV, TO],
    userPersmission: [],
    helpReportType: 1,
    category: "toornament",
    active: true,
    isPublic: true
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
