const { ChannelType } = require('discord.js');
const { checkCastTime } = require("./../../utils/utilityTools");

/**
 * Checks for existing channels within a category.
 * @param {CategoryChannel} category - The category channel to search within.
 * @param {string} channelBaseNameFormated - The formatted name of the channel to check.
 * @param {string} channelBaseNameFormatedReverse - The formatted name of the reverse channel to check.
 * @returns {TextChannel|null} Returns the existing channel if found, otherwise returns null.
 */
async function checkExistingChannels(category, channelBaseNameFormated, channelBaseNameFormatedReverse) {
    const existingChannel = category.children.cache.find(channel => channel.name === channelBaseNameFormated.toLowerCase());
    const existingChannelReverse = category.children.cache.find(channel => channel.name === channelBaseNameFormatedReverse.toLowerCase());
    return existingChannel || existingChannelReverse;
}

/**
 * Retrieves the category channel for casting matches based on the division pattern.
 * @param {Guild} guild - The guild where the category channel is located.
 * @param {string} categoryPattern - The pattern used to match the division name.
 * @returns {CategoryChannel|null} Returns the category channel for casting matches if found, otherwise returns null.
 */
async function getCategoryCastMatch(guild, categoryPattern) {
    const targetPattern = new RegExp(`.*${categoryPattern}.*`, 'i');
    const channels = await guild.channels.fetch();
    return channels.find(channel => channel.type === 4 && targetPattern.test(channel.name));
}

/**
 * Creates a text channel for casting matches.
 * @param {Guild} guild - The guild where the channel will be created.
 * @param {CategoryChannel} category - The category channel where the new channel will be placed.
 * @param {string} channelName - The name of the new channel.
 * @param {PermissionOverwrites[]} permissionOverwrites - The permission overwrites for the new channel.
 * @returns {Promise<TextChannel>} Returns a promise that resolves with the newly created text channel.
 */
async function createCastChannel(guild, category, channelName, permissionOverwrites) {
    try {
        return await guild.channels.create({
            name: channelName,
            parent: category.id,
            type: ChannelType.GuildText,
            permissionOverwrites: permissionOverwrites,
        });
    } catch (error) {
        throw new Error('Le bot n\'a pas les permissions requises pour créer le salon de cast.')
    }
}

/**
 * Sends an announcement message to the cast channel.
 * @param {TextChannel} castChannel - The text channel where the announcement will be sent.
 * @param {Object} teamRoles - An object containing information about the roles of the teams.
 * @param {GuildMember} member - The guild member executing the command.
 * @param {User} coCaster - The co-caster user (if any).
 * @param {GuildMember} memberCoCaster - The guild member representing the co-caster.
 * @param {Object[]} matchData - An array containing information about the match.
 * @param {string} castPreparation - Additional information for the cast preparation.
 * @returns {Promise<void>} Returns a promise that resolves once the announcement message is sent.
 */
async function castAnnouncement(castChannel, teamRoles, member, coCaster, memberCoCaster, matchData, castPreparation) {
    const announcementText = matchData[0].scheduled_datetime ? checkCastTime(matchData[0].scheduled_datetime) : 'Votre match va être cast par';

    if (coCaster && memberCoCaster) {
        castChannel.permissionOverwrites.edit(memberCoCaster, { ViewChannel: true, SendMessages: true });
    }

    const casterAnnouncement = coCaster && memberCoCaster ? ` et <@${memberCoCaster.user.id}>` : '';
    const casterAnnouncementText = `${announcementText} <@${member.user.id}>${casterAnnouncement}`

    await castChannel.send(`# 📣  Cast de votre match 📺 \n <@&${teamRoles.team1.id}> <@&${teamRoles.team2.id}> \n ${casterAnnouncementText} \n Ce salon vous permettra d'échanger avec le(s) caster(s) et l'autre équipe pour la bonne préparation et le bon déroulement du match. \n ${castPreparation}`);
}

module.exports = {
    checkExistingChannels,
    getCategoryCastMatch,
    createCastChannel,
    castAnnouncement,
}