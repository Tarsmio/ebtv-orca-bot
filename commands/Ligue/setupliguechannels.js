const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType, PermissionsBitField, ForumChannel, Guild, PermissionFlagsBits } = require('discord.js');
const { getNbStage, getRoundIdsOf } = require('../../utils/toornamentUtils');
const { embedBuilder } = require("../../utils/embedBuilder");
const { STAFF_EBTV } = require('../../utils/roleEnum');
const { getMatchsOfRounds } = require('../../utils/matchUtils');

const stageIds = [
    "8264675124462264320",
    "8264737497420021760",
    "8264738600411373568",
    "8264739402440654848",
    "8264740916637990912",
    "8264741890458460160",
    "8264742868431765504",
    "8264743548782149632",
    "8264744252364947456",
    "8264744933675859968",
    "8264745766931554304"
]

const tagEmoteRoundIndex = [
    "0️⃣",
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟"
]

var statChannels = []

module.exports.execute = async (interaction) => {
    try {
        // Get the guild from the interaction
        const guild = interaction.guild;
        const user = interaction.user;

        const nbDivToCreate = await getNbStage();

        interaction.reply({ content: "Les divisions sont en cours de création, vérifiez bien que toutes les divisions sont créer. Ne pas oublier d'autoriser la permission pour modifier les permissions des utilisateurs d'un salon (Manage Permissions) dans les catégories des divisions avant d'utiliser la commande /permissiondivisionligue." })

        for (let i = 1; i < nbDivToCreate + 1; i++) {
            const roleStat = await guild.roles.create({
                name: `Stat D${i}`,
            })

            const category = await guild.channels.create({
                name: `Division ${i}`,
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone, // @everyone role
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], // Deny access to everyone
                    },
                    {
                        id: process.env.BOT_ROLE_ID,
                        allow: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: process.env.ROLE_ID_STAFF_EBTV,
                        allow: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: process.env.ROLE_ID_ASSISTANT_TO,
                        allow: [PermissionsBitField.Flags.ViewChannel]
                    },
                ]
            });

            await guild.channels.create({
                name: `division-${i}`,
                parent: category.id,
                type: ChannelType.GuildText,
            });

            await guild.channels.create({
                name: `div-${i}-planif`,
                parent: category.id,
                type: ChannelType.GuildText,
            });

            await guild.channels.create({
                name: `div-${i}-support`,
                parent: category.id,
                type: ChannelType.GuildText,
            });

            await guild.channels.create({
                name: `div-${i}-récaps-manches`,
                parent: category.id,
                type: ChannelType.GuildText,
            });

            await guild.channels.create({
                name: `div-${i}-discussion`,
                parent: category.id,
                type: ChannelType.GuildText,
            });

            let statChannel = await guild.channels.create({
                name: `div-${i}-stats`,
                parent: category.id,
                type: ChannelType.GuildForum,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone, // @everyone role
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages], // Deny access to everyone
                    },
                    {
                        id: process.env.BOT_ROLE_ID,
                        allow: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: process.env.ROLE_ID_STAFF_EBTV,
                        allow: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: process.env.ROLE_ID_ASSISTANT_TO,
                        allow: [PermissionsBitField.Flags.ViewChannel]
                    },
                    {
                        id: roleStat.id,
                        allow: [PermissionsBitField.Flags.CreatePublicThreads, PermissionsBitField.Flags.SendMessages, PermissionFlagsBits.SendMessagesInThreads, PermissionFlagsBits.ViewChannel]
                    }
                ]
            })

            statChannels.push(statChannel)

            await statChannel.setAvailableTags([
                {
                    name: "En attente",
                    moderated: true
                }
            ])

            await statChannel.setPosition(5)

            await statChannel.setTopic("test test test")
        }

        for (let j = 0; j < nbDivToCreate; j++) {
            const actChannel = statChannels[j]
            console.log(j)
            setTimeout(async () => {
                let roundOfDivIds = await getRoundIdsOf(stageIds[j])

                let taglist = []

                taglist.push({
                    name: "A faire",
                    emoji: {
                        name:"🟥"
                    }
                })

                taglist.push({
                    name: "Fait",
                    emoji: {
                        name:"🟩"
                    }
                })

                for (let k = 0; k < roundOfDivIds.length; k++){
                    taglist.push({
                        name: `Semaine ${k+1}`,
                        moderated: true,
                        emoji: {
                            name : tagEmoteRoundIndex[k+1]
                        }
                    })
                }

                await actChannel.setAvailableTags(taglist)

                let toDoTag = actChannel.availableTags.find(tag => tag.name == "A faire")

                for(let l = 0; l < roundOfDivIds.length; l++){
                    let matches = await getMatchsOfRounds(roundOfDivIds[l])
                    let roudTag = actChannel.availableTags.find(tag => tag.name == `Semaine ${l+1}`)

                    matches.forEach(async match => {

                        await actChannel.threads.create({
                            name: `${match.opponents[0].participant.name} contre ${match.opponents[1].participant.name}`,
                            message: {
                                content: "Test"
                            },
                            appliedTags: [roudTag.id, toDoTag.id]
                        })
                    })
                }
            }, 90000 * j)
        }
    } catch (error) {
        console.error(error);
        interaction.editReply({ content: `Une erreur s'est produite lors de l'exécution de la commande : ${error}`, ephemeral: true });
    }
}

module.exports.info = {
    name: "creerdivisionligue",
    description: 'Créer les divisions de la ligue !',
    rolePermission: [STAFF_EBTV],
    userPersmission: [],
    helpReportType: 1,
    category: "ligue"
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)