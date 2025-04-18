const { SlashCommandBuilder } = require('@discordjs/builders');
const { checkUserPermissions } = require("../../utils/logging/logger");
const { ADMIN, TO, STAFF_EBTV } = require('../../utils/roleEnum');

function removeSpecials(str) {
    var lower = str.toLowerCase();
    var upper = str.toUpperCase();

    var res = "";
    for(var i=0; i<lower.length; ++i) {
        if(lower[i] != upper[i] || lower[i].trim() === '')
            res += str[i];
    }
    return res;
}

module.exports.execute = async (interaction) => {
    try {
        await interaction.deferReply();

        const CHANNEL_CATEGORY_TYPE = 4;

        //Check for a pattern Division followed by a numeric value
        const targetPattern = /^Division \d+$/;
        const rolePattern = /^Stat D[0-9]+$/

        const divisionCategories = interaction.guild.channels.cache.filter(channel =>
            channel.type === CHANNEL_CATEGORY_TYPE && targetPattern.test(channel.name)
        );

        const roleStat = interaction.guild.roles.cache.filter(role => rolePattern.test(role.name))

        divisionCategories.forEach(category => {
            const channelsInCategory = category.children.cache;

            channelsInCategory.forEach(channel => {
                channel.delete();
            })

            category.delete();
        });

        roleStat.forEach(role => {
            role.delete()
        })

        interaction.editReply({ content: `Les divisions de la saison ont bien été supprimée.`, ephemeral: false });
    } catch (error) {
        interaction.editReply({ content: `${error}`, ephemeral: false });
    }
}

module.exports.info = {
    name: "supressiondivisionligue",
    description: 'Supprimer toute les division de la ligue',
    rolePermission: [ADMIN, TO, STAFF_EBTV],
    userPersmission: [],
    helpReportType: 1,
    category : "ligue",
    active: true,
    isPublic: true
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)