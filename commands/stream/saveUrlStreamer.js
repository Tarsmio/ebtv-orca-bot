const { SlashCommandBuilder } = require('@discordjs/builders');

const { checkUserPermissions } = require("./../../utils/logging/logger");
const { setStreamUrl } = require("../../utils/toornamentUtils");
const { STAFF_EBTV, TO } = require('../../utils/roleEnum');

module.exports.execute = async (interaction) => {
    try {
        await interaction.deferReply();

        checkUserPermissions(interaction, [process.env.ROLE_ID_STAFF_EBTV, process.env.ROLE_ID_ASSISTANT_TO, process.env.ROLE_ID_CASTER_INDE]);

        const urlPattern = new RegExp(/^https:\/\/(www\.)?(youtube\.com|twitch\.tv)\/(.+?)+$/) //Check for a youtube or twitch url
        if (!urlPattern.test(interaction.options.getString('url'))) {
            await interaction.editReply({ content: `L'url donné n'est pas d'une chaîne Youtube ou Twitch.`, ephemeral: false })
            return;
        }

        await setStreamUrl(interaction.options.getString('nom_stream'), interaction.options.getString('url'));

        await interaction.editReply({ content: `Donnée sauvegardé avec succès !`, ephemeral: false })

    } catch (error) {
        console.error(error);
        await interaction.editReply({ content: `Une erreur s'est produite lors de l'exécution de la commande, veuillez réessayer ultérieurement.` });
    }
}

module.exports.info = {
    name: "urlcaster",
    description: 'Commande pour enregistrer l\'url lié à une chaîne Youtube ou Twitch !',
    rolePermission: [STAFF_EBTV, TO],
    userPersmission: [],
    helpReportType: 1
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)
    .addStringOption(option =>
        option.setName("nom_stream")
            .setDescription("Nom du stream.")
            .setRequired(true))
    .addStringOption(option =>
        option.setName("url")
            .setDescription("Url de la chaîne de stream (Youtube ou Twitch)")
            .setRequired(true))