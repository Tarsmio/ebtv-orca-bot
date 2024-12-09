const { SlashCommandBuilder } = require('@discordjs/builders');
const { STAFF_EBTV, TO, ADMIN } = require('../../utils/roleEnum');

module.exports.execute = async (interaction) => {
    interaction.deferReply()

    const channel = interaction.channel
    const numberToDelete = interaction.options.getNumber("nombre_messages")

    channel.bulkDelete(numberToDelete).then(rep => {
        interaction.editReply({
            content: `${rep.size} messages viennent d'être supprimer`,
            ephemeral: true
        })
    }).catch(err => {
        interaction.editReply({
            content: `Une erreur est survenue lors de la suppression des messages : ${err}`,
            ephemeral: true
        })
    })
}

module.exports.info = {
    name: "bulkdelete",
    description: 'Supprime plusieurs messages en même temps',
    rolePermission: [ADMIN, STAFF_EBTV, TO],
    userPersmission: [],
    helpReportType: 1,
    category : "outils",
    active: true,
    isPublic: true
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)
    .addNumberOption(opt =>
        opt.setName("nombre_messages")
            .setDescription("le nombre de message a delete")
            .setMinValue(1)
            .setMaxValue(50)
            .setRequired(true)
    )
