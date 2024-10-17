const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const { checkUserPermissions } = require("./../../utils/logging/logger");
const { formatingString, checkDivPickBan } = require("./../../utils/utilityTools");
const { fetchUniqueMatch } = require("./../../utils/matchUtils");
const { fetchUniqueGroup } = require('../../utils/groupUtils');
const { getCategoryCastMatch, checkExistingChannels, createCastChannel, castAnnouncement } = require('../../utils/castChannel/castChannelUtils');
const { setStreamMatch } = require("./../../utils/toornamentUtils")

const streamManager = require("./../../utils/streamManager")
const STREAM_IDS = require("./../../data/streamer_ids.json");
const { STAFF_EBTV, TO, CASTER_INDE } = require('../../utils/roleEnum');

module.exports.execute = async (interaction) => {
    try {
        await interaction.deferReply();

        const guild = interaction.guild;
        let member;

        try {
            member = await guild.members.fetch(interaction.user.id);
        } catch (error) {
            console.error(error);
            throw new Error("Échec lors de la récupération des données du caster pour les autorisations du salon.")
        }

        await checkUserPermissions(interaction, [process.env.ROLE_ID_STAFF_EBTV, process.env.ROLE_ID_ASSISTANT_TO, process.env.ROLE_ID_CASTER_INDE]);

        const coCaster = interaction.options.getUser("co_caster");
        let memberCoCaster;

        try {
            memberCoCaster = coCaster ? await guild.members.fetch(coCaster.id) : null;
        } catch (error) {
            console.error(error);
            throw new Error("Échec lors de la récupération des données du CoCaster pour les autorisations du salon.")
        }

        const team1Role = interaction.options.getRole('équipe1_cast');
        const team2Role = interaction.options.getRole('équipe2_cast');

        const teamRoles = {
            team1: {
                role: team1Role,
                id: team1Role?.id,
                name: team1Role?.name
            },
            team2: {
                role: team2Role,
                id: team2Role?.id,
                name: team2Role?.name
            }
        };

        if (!teamRoles.team1.id || !teamRoles.team2.id) {
            await interaction.editReply({ content: "Le rôle ou les rôles n'ont pas été trouvés", ephemeral: false });
            return;
        }

        const channelBaseNameFormated = formatingString(`${teamRoles.team1.name}-${teamRoles.team2.name}-cast`);
        const channelBaseNameFormatedReverse = formatingString(`${teamRoles.team2.name}-${teamRoles.team1.name}-cast`);

        const matchData = await fetchUniqueMatch(teamRoles.team1.name, teamRoles.team2.name);

        if (!matchData || matchData.length === 0) {
            throw new Error('Aucun match planifié correspondant n\'a été trouvé.');
        }

        if (!matchData[0].opponents || matchData[0].opponents.length === 0) {
            throw new Error('Aucun adversaire trouvé pour le match sélectionné.');
        }

        const opponent1Name = matchData[0].opponents[0]?.participant?.name;
        const opponent2Name = matchData[0].opponents[1]?.participant?.name;

        //Check if name of both teams correspond to the fetched match
        if (!(teamRoles.team1.name === opponent1Name || teamRoles.team1.name === opponent2Name) ||
            !(teamRoles.team2.name === opponent1Name || teamRoles.team2.name === opponent2Name)) {
            throw new Error('Aucun match planifié a été trouvée pour ces deux équipes.');
        }

        const divisionName = await fetchUniqueGroup(matchData[0]?.group_id);
        //Regular expression which check for the category presaison name, regardless of emoji if they are any in the category name
        // const targetPattern = /.*pr[eé]saison.*/i; check for presaison

        //Match any string that contain divisionPattern as a substring
        const divisionPattern = divisionName.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const castCategory = await getCategoryCastMatch(guild, divisionPattern);

        // const castCategory = guild.channels.cache.filter(channel => channel.type === 4 && targetPattern.test(channel.name)).first(); check for presaison

        if (!castCategory || castCategory.size === 0) {
            return await interaction.editReply('La catégorie où doit être placé le salon n\'a pas été trouvée.');
            // return await interaction.reply('La catégorie de présaison n\'a pas été trouvée.');
        }

        const pinPickAndBan = checkDivPickBan(castCategory.name);

        const channelCastExisting = await checkExistingChannels(castCategory, channelBaseNameFormated, channelBaseNameFormatedReverse)

        if (channelCastExisting) {
            return await interaction.editReply("Le match a déjà été planifié par un autre caster.");
        }

        //Set the stream url of the caster to the match
        if (STREAM_IDS[member.id] !== undefined) {
            await setStreamMatch(matchData[0].id, STREAM_IDS[member.id])
            await streamManager.setStreamUrl(member.id)
        }

        const permissionOverwrites = [
            {
                id: guild.roles.everyone, // @everyone role
                deny: [PermissionsBitField.Flags.ViewChannel], // Deny access to everyone
            },
            {
                id: teamRoles.team1.id, // Role ID for "équipe1 cast"
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], // Allow access to "équipe1 cast"
            },
            {
                id: teamRoles.team2.id, // Role ID for "équipe2 cast"
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], // Allow access to "équipe2 cast"
            },
            {
                id: process.env.ROLE_ID_STAFF_EBTV,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels],
            },
            {
                id: process.env.ROLE_ID_ASSISTANT_TO,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels],
            },
            {
                id: member,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            },
            {
                id: process.env.BOT_ROLE_ID,
                allow: [PermissionsBitField.Flags.ViewChannel]
            },
        ]

        const castChannel = await createCastChannel(guild, castCategory, `${teamRoles.team1.name}-${teamRoles.team2.name}-cast`, permissionOverwrites);
        const castPreparation = `
 Pour bien préparer le cast, merci d’indiquer :\n
 \u2022 Les pronoms des membres de vos équipes
 \u2022 S’il va y avoir des changements entre les manches
 \u2022 La prononciation du nom de l'équipe ou des pseudos si elle n’est pas simple \n
 Merci également de rejoindre le lobby ingame avec un pseudo reconnaissable !
 
 ${streamManager.getStreamUrl() !== null ? `La diffusion en direct du match est disponible à l'adresse suivante : <${streamManager.getStreamUrl()}>` : ''}`;

        await castAnnouncement(castChannel, teamRoles, member, coCaster, memberCoCaster, matchData, castPreparation);

        if (pinPickAndBan) {
            const msg = await castChannel.send({ files: ['images/s15_pick_ban.png'] });
            await msg.pin();
        }

        return await interaction.editReply({ content: `Le salon de cast ${castChannel.name} a été crée par ${member.nickname !== null && member.nickname !== "null" ? member.nickname : member.user.username} (${member.user.username} le ${new Date().toLocaleString()})`, ephemeral: false })
    } catch (error) {
        await interaction.editReply({ content: `${error}` });
    }
}

module.exports.info = {
    name: "creerchannelcast",
    description: 'Commande pour créer un channel de cast !',
    rolePermission: [STAFF_EBTV, TO, CASTER_INDE],
    userPersmission: [],
    helpReportType: 1
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)
    .addRoleOption(option =>
        option.setName("équipe1_cast")
            .setDescription("Nom de la première équipe à être cast")
            .setRequired(true))
    .addRoleOption(option =>
        option.setName("équipe2_cast")
            .setDescription("Nom de la seconde équipe à être cast")
            .setRequired(true))
    .addUserOption(option =>
        option.setName("co_caster")
            .setDescription("@ de l'utilisateur co_caster")
            .setRequired(false))