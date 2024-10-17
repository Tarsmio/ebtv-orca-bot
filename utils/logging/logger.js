const { embedBuilder } = require("./../../utils/embedBuilder");

/**
 * Checks if the user has one of the allowed roles.
 * @param {Interaction} interaction - The interaction object.
 * @param {string[]} allowedRolesId - An array of role IDs.
 * @returns {boolean} Returns true if the user has one of the allowed roles, otherwise throws an error.
 * @throws {Error} Throws an error User Missing Permission.
 */
async function checkUserPermissions(interaction, allowedRolesId) {
    const guild = interaction.guild;
    const user = interaction.user;

    let channel;
    let member;

    try {
        channel = await guild.channels.cache.get(process.env.CHANNEL_ID_LOG_BOT);
    } catch (error) {
        console.error(error);
        throw new Error('Salon de log inexistant ou inaccessible');
    }

    try {
        member = await guild.members.fetch(user.id);
    } catch (error) {
        console.error(error);
        throw new Error('Echec de récupération des données de l\'utilisateur pour les données de log.')
    }

    embedBuilder("Log O.R.C.A", member, channel, interaction.commandName);

    const hasAllowedRole = allowedRolesId.some(roleId => member.roles.cache.has(roleId));

    if (!hasAllowedRole) {
        throw new Error('Permissions Discord de l\'utilisateur insuffisantes.');
    }

    return true;
}

module.exports = {
    checkUserPermissions,
}