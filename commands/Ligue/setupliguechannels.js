const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType, PermissionsBitField, ForumChannel, Guild, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getNbStage, getRoundIdsOf } = require('../../utils/toornamentUtils');
const { embedBuilder } = require("../../utils/embedBuilder");
const { STAFF_EBTV } = require('../../utils/roleEnum');
const { getMatchsOfRounds } = require('../../utils/matchUtils');

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
    "https://bit.ly/EBTV-SP3-S4-STATSD1",
    "https://bit.ly/EBTV-SP3-S4-STATSD2",
    "https://bit.ly/EBTV-SP3-S4-STATSD3",
    "https://bit.ly/EBTV-SP3-S4-STATSD4",
    "https://bit.ly/EBTV-SP3-S4-STATSD5",
    "https://bit.ly/EBTV-SP3-S4-STATSD6",
    "https://bit.ly/EBTV-SP3-S4-STATSD7",
    "https://bit.ly/EBTV-SP3-S4-STATSD8",
    "https://bit.ly/EBTV-SP3-S4-STATSD9"
]

var statChannels = []

function setReply(interaction, division, channelName) {
    let repEmbed = new EmbedBuilder()
        .setTitle("Création des divisions")
        .setDescription("La création des divisions est en cours ...")
        .setColor("f08300")
        .addFields([
            {
                name: "Division actuel",
                value: division,
                inline: true
            },
            {
                name: "Channel actuel",
                value: channelName,
                inline: true
            }
        ])

    interaction.editReply({
        embeds: [repEmbed]
    })
}

function setReplyForum(interaction, forum, match) {
    let repEmbed = new EmbedBuilder()
        .setTitle("Création des divisions")
        .setDescription("Remplissage des forum de stat ...\n*Une attente de 1min30 entre chaque forum est necessaire*")
        .setColor("f08300")
        .addFields([
            {
                name: "Forum actuel",
                value: forum,
                inline: true
            },
            {
                name: "Match actuel",
                value: match,
            }
        ])

    interaction.editReply({
        embeds: [repEmbed]
    })
}

module.exports.execute = async (interaction) => {
    await interaction.deferReply()
    try {
        // Get the guild from the interaction
        const guild = interaction.guild;
        const user = interaction.user;

        const nbDivToCreate = await getNbStage();

        //interaction.reply({ content: "Les divisions sont en cours de création, vérifiez bien que toutes les divisions sont créer. Ne pas oublier d'autoriser la permission pour modifier les permissions des utilisateurs d'un salon (Manage Permissions) dans les catégories des divisions avant d'utiliser la commande /permissiondivisionligue. (L'éxecution de cette commande prend enormement de temps)" })

        for (let i = 1; i < nbDivToCreate + 1; i++) {
            setReply(interaction, `Division ${i}`, "Categorie")
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

            setReply(interaction, `Division ${i}`, `division-${i}`)
            await guild.channels.create({
                name: `division-${i}`,
                parent: category.id,
                type: ChannelType.GuildText,
            });

            setReply(interaction, `Division ${i}`, `div-${i}-planif`)
            await guild.channels.create({
                name: `div-${i}-planif`,
                parent: category.id,
                type: ChannelType.GuildText,
            });


            setReply(interaction, `Division ${i}`, `div-${i}-support`)
            await guild.channels.create({
                name: `div-${i}-support`,
                parent: category.id,
                type: ChannelType.GuildText,
            });

            setReply(interaction, `Division ${i}`, `div-${i}-récaps-manches`)
            await guild.channels.create({
                name: `div-${i}-récaps-manches`,
                parent: category.id,
                type: ChannelType.GuildText,
            });

            setReply(interaction, `Division ${i}`, `div-${i}-discussion`)
            await guild.channels.create({
                name: `div-${i}-discussion`,
                parent: category.id,
                type: ChannelType.GuildText,
            });

            setReply(interaction, `Division ${i}`, `div-${i}-stats`)
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
                        name: "🟥"
                    }
                })

                taglist.push({
                    name: "Terminé",
                    emoji: {
                        name: "🟩"
                    }
                })

                for (let k = 0; k < roundOfDivIds.length; k++) {
                    taglist.push({
                        name: `Semaine ${k + 1}`,
                        moderated: true,
                        emoji: {
                            name: tagEmoteRoundIndex[k + 1]
                        }
                    })
                }

                await actChannel.setAvailableTags(taglist)

                let toDoTag = actChannel.availableTags.find(tag => tag.name == "A faire")

                for (let l = 0; l < roundOfDivIds.length; l++) {
                    let matches = await getMatchsOfRounds(roundOfDivIds[l])
                    let roudTag = actChannel.availableTags.find(tag => tag.name == `Semaine ${l + 1}`)

                    let test = []



                    matches.forEach(async match => {
                        setReplyForum(interaction, actChannel.name, `${match.opponents[0].participant.name} - ${match.opponents[1].participant.name}`)

                        await actChannel.threads.create({
                            name: `${match.opponents[0].participant.name} contre ${match.opponents[1].participant.name}`,
                            message: {
                                content: `## Avancement des stats du match ${match.opponents[0].participant.name} contre ${match.opponents[1].participant.name}\n\n**Lien vers le sheet de la division => ${lienStat}**`
                            },
                            appliedTags: [roudTag.id, toDoTag.id]
                        })

                        if ((j == nbDivToCreate - 1) && (l == roundOfDivIds.length - 1) && match.id == matches[matches.length - 1].id) {
                            let endEmbed = new EmbedBuilder()
                                .setTitle("Les divisions sont crée !")
                                .setDescription("Les salon sont prêt ! Il faut encors donner les perms")
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
                        }
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
    category: "ligue",
    active: true,
    isPublic: true
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)