const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkUserPermissions } = require('../../utils/logging/logger');
const { STAFF_EBTV, TO } = require('../../utils/roleEnum');

module.exports.execute = async (interaction) => {
    try {
        await interaction.deferReply();

        await interaction.editReply(`:popcorn:`);
    } catch (error) {
        console.error(error);
        await interaction.editReply({ content: `${error}` });
    }

}

module.exports.info = {
    name: "popcorn",
    description: 'Enjoy your popcorn !',
    rolePermission: [STAFF_EBTV, TO],
    userPersmission: [],
    helpReportType: 1,
    category : "fun",
    active: true,
    isPublic: true
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)