const { SlashCommandBuilder } = require('@discordjs/builders');
const { getTeamsGroup } = require('../../utils/groupUtils');
const { embedBuilder } = require("../../utils/embedBuilder");
const { STAFF_EBTV } = require('../../utils/roleEnum');
const { EmbedBuilder } = require('discord.js');

function setReply(interaction, channel, role) {
    let repEmbed = new EmbedBuilder()
        .setTitle("Attribution des permissions ...")
        .setDescription("L'attribution des permissions est en cours !")
        .setColor("f08300")
        .addFields([
            {
                name: "Channel actuel",
                value: channel.name,
                inline: true
            },
            {
                name: "Role actuel",
                value: role.name
            }
        ])

    interaction.editReply({
        embeds: [repEmbed]
    })
}

module.exports.execute = async (interaction) => {
    interaction.deferReply()
    try {
        // Get the guild from the interaction
        const guild = interaction.guild;

        const stageIds = [
            "8649924472267644928",
            "8649925545948495872",
            "8649926833616150528",
            "8649929652070940672",
            "8649931244893724672",
            "8649931899172388864",
            "8649932720540041216",
            "8649933368575942656",
            "8649934028256092160"
        ]

        const targetPattern = /^Division \d+$/;
        await guild.channels.fetch();

        const allTeamsByStage = {};

        for (let i = 0; i < stageIds.length; i++) {
            const stageId = stageIds[i];
            const teamsByDivision = await getTeamsGroup(stageId);
            allTeamsByStage[`Division ${i + 1}`] = teamsByDivision;
        }

        // // Function to get role ID by name
        // const getRoleIdByName = (roleName) => {
        //     const role = guild.roles.cache.find((role) => role.name === roleName);
        //     return role ? role.id : null;
        // };

        const getRoleIdByName = (roleName) => {
            // Convert roleName to lowercase and sanitize multiple whitespace characters
            const roleNameSanitized = roleName.toLowerCase().replace(/\s+/g, ' ');
            const role = guild.roles.cache.find((role) => {
                // Convert role.name to lowercase and sanitize multiple whitespace characters
                const roleNameLowerSanitized = role.name.toLowerCase().replace(/\s+/g, ' ');
                return roleNameLowerSanitized === roleNameSanitized;
            });
            return role ? role.id : null;
        };

        const categories = guild.channels.cache.filter(channel => channel.type === 4 && targetPattern.test(channel.name));

        const categoriesArray = [...categories.values()];

        const sortedCategories = categoriesArray.sort((a, b) => {
            const divisionNumberA = parseInt(a.name.match(/\d+/)[0]);
            const divisionNumberB = parseInt(b.name.match(/\d+/)[0]);

            return divisionNumberA - divisionNumberB;
        });

        if (categories.size === 0) {
            return await interaction.reply('Aucune catégorie de division trouvés dans le serveur.');
        }

        for (const [incrementIndex, category] of sortedCategories.entries()) {

            const divisionTeams = allTeamsByStage[`Division ${incrementIndex + 1}`];
            const divisionRoleID = divisionTeams.map((teamName) => getRoleIdByName(teamName));

            //Set permission for TO Organiser
            //await category.permissionOverwrites.edit(process.env.ROLE_ID_STAFF_EBTV, {
            //ViewChannel: true,
            //SendMessages: true,
            //CreatePublicThreads: true,
            //SendMessagesInThreads: true
            //})

            //await category.permissionOverwrites.edit(process.env.ROLE_ID_ASSISTANT_TO, {
            //ViewChannel: true,
            //SendMessages: true,
            //CreatePublicThreads: true,
            //SendMessagesInThreads: true
            //})

            const filteredDivisionRoleId = divisionRoleID.filter(id => id != null)
            for (const roleId of filteredDivisionRoleId) {
                const role = await guild.roles.fetch(roleId);
                if (role) {
                    setReply(interaction, category, role)
                    await category.permissionOverwrites.edit(roleId, {
                        ViewChannel: true,
                        SendMessages: false,
                        SendMessagesInThreads: true,
                        CreatePublicThreads: false,
                        CreatePrivateThreads: false
                    });
                }
            }

            const match = category.name.match(/\d+/); // Match any digit (\d+)
            const divNumber = match ? match[0] : null;

            const channelsInCategory = category.children.cache;

            for (const [channelId, channel] of channelsInCategory) {

                if (channel.name == `division-${divNumber}`) {
                    const divisionTeams = allTeamsByStage[`Division ${incrementIndex + 1}`];
                    const divisionRoleID = divisionTeams.map((teamName) => getRoleIdByName(teamName));

                    const filteredDivisionRoleId = divisionRoleID.filter(id => id != null)
                    for (const roleId of filteredDivisionRoleId) {
                        const role = await guild.roles.fetch(roleId);
                        if (role) {
                            setReply(interaction, channel, role)
                            await channel.permissionOverwrites.edit(roleId, {
                                SendMessages: false,
                                ViewChannel: true
                            });
                        }
                    }
                }

                if (channel.name == `div-${divNumber}-planif`) {
                    const divisionTeams = allTeamsByStage[`Division ${incrementIndex + 1}`];
                    const divisionRoleID = divisionTeams.map((teamName) => getRoleIdByName(teamName));

                    const filteredDivisionRoleId = divisionRoleID.filter(id => id != null)
                    setReply(interaction, channel, { name: "Cap ligue" })

                    await channel.permissionOverwrites.edit(process.env.ROLE_ID_CAPITAINE, {
                        SendMessages: true
                    })

                    for (const roleId of filteredDivisionRoleId) {
                        const role = await guild.roles.fetch(roleId);
                        if (role) {
                            setReply(interaction, channel, role)
                            await channel.permissionOverwrites.edit(roleId, {
                                ViewChannel: true,
                                SendMessages: false
                            });
                        }
                    }
                }

                if (channel.name == `div-${divNumber}-support`) {
                    const divisionTeams = allTeamsByStage[`Division ${incrementIndex + 1}`];
                    const divisionRoleID = divisionTeams.map((teamName) => getRoleIdByName(teamName));

                    const filteredDivisionRoleId = divisionRoleID.filter(id => id != null)
                    for (const roleId of filteredDivisionRoleId) {
                        const role = await guild.roles.fetch(roleId);
                        if (role) {
                            setReply(interaction, channel, role)
                            await channel.permissionOverwrites.edit(roleId, {
                                ViewChannel: true,
                                SendMessages: true
                            });
                        }
                    }
                }

                if (channel.name == `div-${divNumber}-récaps-manches`) {
                    const divisionTeams = allTeamsByStage[`Division ${incrementIndex + 1}`];
                    const divisionRoleID = divisionTeams.map((teamName) => getRoleIdByName(teamName));

                    const filteredDivisionRoleId = divisionRoleID.filter(id => id != null)
                    setReply(interaction, channel, { name: "Cap ligue" })

                    await channel.permissionOverwrites.edit(process.env.ROLE_ID_CAPITAINE, {
                        SendMessages: true,
                        AttachFiles: true
                    })

                    for (const roleId of filteredDivisionRoleId) {
                        const role = await guild.roles.fetch(roleId);
                        if (role) {
                            setReply(interaction, channel, role)
                            await channel.permissionOverwrites.edit(roleId, {
                                SendMessages: false,
                                ViewChannel: true
                            });
                        }
                    }
                }

                if (channel.name == `div-${divNumber}-discussion`) {
                    const divisionTeams = allTeamsByStage[`Division ${incrementIndex + 1}`];
                    const divisionRoleID = divisionTeams.map((teamName) => getRoleIdByName(teamName));

                    const filteredDivisionRoleId = divisionRoleID.filter(id => id != null)
                    for (const roleId of filteredDivisionRoleId) {
                        const role = await guild.roles.fetch(roleId);
                        if (role) {
                            setReply(interaction, channel, role)
                            await channel.permissionOverwrites.edit(roleId, {
                                SendMessages: true,
                                ViewChannel: true
                            });
                        }
                    }
                }
            }

        }

        let endEmbed = new EmbedBuilder()
            .setTitle("Permissions attribuées !")
            .setDescription("Les salon sont ouvert bonne saison !!!!")
            .setThumbnail("attachment://check-tic.png")
            .setColor("#55ff33")

        interaction.editReply({
            content: "",
            embeds: [endEmbed],
            files: [{
                name: "check-tic.png",
                attachment: "./images/check-tic.png"
            }]
        })
    } catch (error) {
        console.error(error);
        interaction.editReply({ content: `Une erreur s'est produite lors de l'exécution de la commande : ${error}`, ephemeral: true });
    }
}

module.exports.info = {
    name: "permissiondivisionligue",
    description: 'Setup les permissions',
    rolePermission: [STAFF_EBTV],
    userPersmission: [],
    helpReportType: 1,
    category: "ligue",
    active: true,
    isPublic: true
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)