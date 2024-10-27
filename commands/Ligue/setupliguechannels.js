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
    "8264745766931554304",
    "8279666790566993920"
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

const lienStatIndex = [
    "https://docs.google.com/spreadsheets/d/1L-lpAAhnED8gc_K2ddz3fooTXoa7-jcyyGFXqWkG8Ek/",
    "https://docs.google.com/spreadsheets/d/1U-0KfsSnoK7WO94BFV62iGAjpnMADCNtqPeoIvGcqyg/",
    "https://docs.google.com/spreadsheets/d/1v1E5J58r9wE_wGco3fu-FDDfqBG8nFdbRwf-AiesHro/",
    "https://docs.google.com/spreadsheets/d/1hLYuf6uFSxwk1tdTSYct2luhmaHpgc6sVbtnxzbpshE/",
    "https://docs.google.com/spreadsheets/d/1qV5GPmK3kmpRNybLsbosn7RWL7JebWsnyfuI3fadDxM/",
    "https://docs.google.com/spreadsheets/d/1BxlKGGW8L-81N5qV1ATuNdwlkOQ_lcLS8LUG3oqQnPs/",
    "https://docs.google.com/spreadsheets/d/1_UKIht-OaQI2ZN8mtk_fZIJbCFfpl8Uc2XNw2SkUJW4/",
    "https://docs.google.com/spreadsheets/d/1XV3ngUzs-T4yn4eFyqcd_DiBX1UnfRtBxyHZXA3hDdg/",
    "https://docs.google.com/spreadsheets/d/1H_IAGWrSqtKwMeaRSXGHvZhbMsu7fLkdAmoOqXWTFqs/",
    "https://docs.google.com/spreadsheets/d/1RDzNir9Gkh98kbk7yokqlwM6zNnBkM6-DSsRPQ8OUFs/",
    "https://docs.google.com/spreadsheets/d/1RPGsg9lTGnHFi5UO0vmHT36B7wyztaI8mDnCbx_7-uk/",
    "https://docs.google.com/spreadsheets/d/1D1qSr8A6c3dt3FNkMgsY6Rmtnv4Vbyd66ZPhssB9DeA/",
]

var statChannels = []

module.exports.execute = async (interaction) => {
    try {
        // Get the guild from the interaction
        const guild = interaction.guild;
        const user = interaction.user;

        const nbDivToCreate = await getNbStage();

        interaction.reply({ content: "Les divisions sont en cours de création, vérifiez bien que toutes les divisions sont créer. Ne pas oublier d'autoriser la permission pour modifier les permissions des utilisateurs d'un salon (Manage Permissions) dans les catégories des divisions avant d'utiliser la commande /permissiondivisionligue. (L'éxecution de cette commande prend enormement de temps)" })

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
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                    },
                    {
                        id: process.env.ROLE_ID_STAFF_EBTV,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                    },
                    {
                        id: process.env.ROLE_ID_ASSISTANT_TO,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
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
                        deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.CreatePublicThreads, PermissionFlagsBits.SendMessagesInThreads], // Deny access to everyone
                    },
                    {
                        id: process.env.BOT_ROLE_ID,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.CreatePublicThreads, PermissionFlagsBits.SendMessagesInThreads]
                    },
                    {
                        id: process.env.ROLE_ID_STAFF_EBTV,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.CreatePublicThreads, PermissionFlagsBits.SendMessagesInThreads]
                    },
                    {
                        id: process.env.ROLE_ID_ASSISTANT_TO,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.CreatePublicThreads, PermissionFlagsBits.SendMessagesInThreads]
                    },
                    {
                        id: roleStat.id,
                        allow: [PermissionsBitField.Flags.SendMessages, PermissionFlagsBits.SendMessagesInThreads, PermissionFlagsBits.ViewChannel],
                        deny: [PermissionsBitField.Flags.CreatePublicThreads]
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
            const lienStat = lienStatIndex[j]
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
                    name: "Terminé",
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
                                content: `## Avancement des stats du match ${match.opponents[0].participant.name} contre ${match.opponents[1].participant.name}\n\n**Lien vers le sheet de la division => ${lienStat}**`
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