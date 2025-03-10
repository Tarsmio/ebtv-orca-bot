const { SlashCommandBuilder } = require('@discordjs/builders');
const { findMatch, setPlanif, fetchUniqueMatch } = require("../../utils/matchUtils");
const { parseAndFormatDate } = require("../../utils/planification/date");
const { STAFF_EBTV, TO, CASTER_INDE } = require('../../utils/roleEnum');
const { caster } = require('../../db');

module.exports.execute = async (interaction) => {

    let channelId = interaction.channel.id

    let cast = await caster.cast.getCast(channelId)


    let annonceMessage = `## Un nouveau cast commence ! :tv:\nLe match **${cast.equipeA} vs ${cast.equipeB}** est cast par ${cast.coCaster != 'NULL' ? `<@${cast.caster}> et <@${cast.coCaster}>` : `<@${cast.caster}>`} !\nIl est à suivre en direct des maintenant juste ici : ${cast.stream}\n\n<@&${process.env.ANNONCE_CAST_ROLE}>`

    await interaction.client.channels.cache.get(process.env.ANNONCE_CAST_ID).send(annonceMessage)

    await interaction.reply("Annonce effectué !")

}

module.exports.info = {
    name: "annoncecast",
    description: 'Annoncer le debut d\'un cast !',
    rolePermission: [STAFF_EBTV, TO, CASTER_INDE],
    userPersmission: [],
    helpReportType: 1,
    category: "cast",
    active: true,
    isPublic: true
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)
