const { SlashCommandBuilder } = require('@discordjs/builders');
const { STAFF_EBTV, TO } = require('../../utils/roleEnum');
const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const mIndex = require("../../utils/modeIndex");
const { mapDB } = require('../../db');
const emoteModeIndex = require('../../utils/emoteModeIndex');
const { embedBuilder } = require('../../utils/embedBuilder');

module.exports.execute = async (interaction) => {
    let selectedModes = []
    let testAnulation = "ahaha"

    const tooLongEmbed = new EmbedBuilder()
        .setTitle("Trop long !")
        .setDescription("Vous avez pris trop de temps a repondre !")
        .setThumbnail("attachment://sablier.png")
        .setColor("#0721dc")
        .setFooter({
            text: "J'ai pas tout ton temps"
        })

    await interaction.reply("Merci d'attendre ...")

    const recursiveModeSelection = async (nb, toUpdate) => {

        if (nb > 7) {
            toUpdate.update({
                content: "Merci d'attendre ...",
                embeds: [],
                components: []
            })
            return true
        }

        const embed = new EmbedBuilder()
            .setTitle(`Liste des modes (${nb} / 7)`)
            .setDescription(`Veuillez choisir le mode pour la manche n°${nb}`)
            .setThumbnail("attachment://a.png")
            .setColor("#900C3F")

        if (selectedModes.length > 0) {
            let textePre = []

            for (let j = 0; j < selectedModes.length; j++) {
                textePre.push(`- Manche n°${j + 1} - ${emoteModeIndex[selectedModes[j]]} ${mIndex[selectedModes[j]]}`)
            }

            embed.addFields({
                name: "Mode déjà choisi",
                value: textePre.join("\n")
            })
        }

        let selectModeMenu = new StringSelectMenuBuilder()
            .setCustomId("modeActSelectMenu")
            .setPlaceholder("Choisi un mode !")
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Defense de zone")
                    .setEmoji(process.env.DDZ_EMOTE_ID)
                    .setValue("0"),

                new StringSelectMenuOptionBuilder()
                    .setLabel("Expedition risqué")
                    .setEmoji(process.env.ER_EMOTE_ID)
                    .setValue("1"),

                new StringSelectMenuOptionBuilder()
                    .setLabel("Mission Bazookarpe")
                    .setEmoji(process.env.MB_EMOTE_ID)
                    .setValue("2"),

                new StringSelectMenuOptionBuilder()
                    .setLabel("Pluie de palourde")
                    .setEmoji(process.env.PDP_EMOTE_ID)
                    .setValue("3")
            )

        let annulerBut = new ButtonBuilder()
            .setCustomId("annuler")
            .setLabel("Annuler")
            .setEmoji(process.env.U_EMOTE_ID)
            .setStyle(ButtonStyle.Danger)

        let row = new ActionRowBuilder()
            .addComponents(selectModeMenu)

        let rowAn = new ActionRowBuilder()
            .addComponents(annulerBut)

        let response = null

        if (toUpdate.isCommand()) {
            response = await toUpdate.editReply({
                content: "",
                embeds: [embed],
                components: [row, rowAn],
                files: [{
                    name: "a.png",
                    attachment: "./images/setting.png"
                }]
            })
        } else {
            response = await toUpdate.update({
                content: "",
                embeds: [embed],
                components: [row, rowAn],
                files: [{
                    name: "a.png",
                    attachment: "./images/setting.png"
                }]
            })
        }


        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
            if (confirmation.customId === 'modeActSelectMenu') {
                selectedModes.push(parseInt(confirmation.values[0]))
                return await recursiveModeSelection(nb + 1, confirmation)
            } else {
                let stopEmbed = new EmbedBuilder()
                    .setTitle("Liste des modes")
                    .setDescription(`Vous avez anuler la mise en place de la liste des modes`)
                    .setThumbnail("attachment://bad.png")
                    .setColor("#dc1d07")

                testAnulation = await interaction.editReply({
                    content: "",
                    embeds: [stopEmbed],
                    components: [],
                    files: [{
                        name: "bad.png",
                        attachment: "./images/setAbort.png"
                    }]
                })

                return testAnulation
            }
        } catch {
            return false
        }
    }

    let resultExecution = await recursiveModeSelection(1, interaction)

    if(testAnulation == resultExecution){
        return
    }

    if (!resultExecution) return interaction.editReply({
        content: "",
        embeds: [tooLongEmbed],
        components: [],
        files: [{
            name: "sablier.png",
            attachment: "./images/sablier.png"
        }]
    })


    let textePre = []

    for (let k = 0; k < selectedModes.length; k++) {
        textePre.push(`- Manche n°${k + 1} - ${emoteModeIndex[selectedModes[k]]} ${mIndex[selectedModes[k]]}`)
    }

    const confirmationEmbed = new EmbedBuilder()
        .setTitle("Confirmation des modes")
        .setDescription(`Voici la liste des modes choisie :\n${textePre.join("\n")}`)
        .setThumbnail("attachment://a.png")
        .setColor("#f18e00")

    const okBut = new ButtonBuilder()
        .setCustomId("okMode")
        .setStyle(ButtonStyle.Success)
        .setEmoji(process.env.Y_EMOTE_ID)
        .setLabel("Confirmer")

    const noBut = new ButtonBuilder()
        .setCustomId("noMode")
        .setStyle(ButtonStyle.Danger)
        .setEmoji(process.env.U_EMOTE_ID)
        .setLabel("Annuler")

    let row = new ActionRowBuilder()
        .addComponents(okBut, noBut)

    let rep = await interaction.editReply({
        content: "",
        embeds: [confirmationEmbed],
        components: [row],
        files: [{
            name: "a.png",
            attachment: "./images/setting.png"
        }]
    })


    const collectorFilter = i => i.user.id === interaction.user.id;

    try {
        const confirmation = await rep.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        if (confirmation.customId === 'okMode') {
            let formatedlModListe = {
                mUn: selectedModes[0],
                mDeux: selectedModes[1],
                mTrois: selectedModes[2],
                mQuatre: selectedModes[3],
                mCinq: selectedModes[4],
                mSix: selectedModes[5],
                mSept: selectedModes[6],
            }

            if (await mapDB.modeActuel.changeModeActuel(formatedlModListe)) {

                confirmationEmbed.setColor("#07dc14")
                confirmationEmbed.setDescription(`Vous avez confirmer la liste suivante:\n${textePre.join("\n")}`)
                confirmationEmbed.setThumbnail("attachment://good.png")

                return interaction.editReply({
                    content: "",
                    embeds: [confirmationEmbed],
                    components: [],
                    files: [{
                        name: "good.png",
                        attachment: "./images/check-tic.png"
                    }]
                })
            } else {

                confirmationEmbed.setDescription("Oups il semblerait qu'une erreur soit survenue !")
                confirmationEmbed.setThumbnail("attachment://bad.png")
                confirmationEmbed.setColor("#dc1d07")

                return interaction.editReply({
                    content: "",
                    embeds: [confirmationEmbed],
                    components: [],
                    files: [{
                        name: "bad.png",
                        attachment: "./images/setAbort.png"
                    }]
                })
            }
        } else {

            confirmationEmbed.setDescription(`Vous avez anuler la mise en place de la liste des modes suivante :\n${textePre.join("\n")}`)
            confirmationEmbed.setThumbnail("attachment://bad.png")
            confirmationEmbed.setColor("#dc1d07")

            return interaction.editReply({
                content: "",
                embeds: [confirmationEmbed],
                components: [],
                files: [{
                    name: "bad.png",
                    attachment: "./images/setAbort.png"
                }]
            })
        }
    } catch {
        return interaction.editReply({
            content: "",
            embeds: [tooLongEmbed],
            components: [],
            files: [{
                name: "sablier.png",
                attachment: "./images/sablier.png"
            }]
        })
    }
}

module.exports.info = {
    name: "setmodes",
    description: 'Commande qui permet de mettre en place la liste des mode de la semaine (pour les channels de cast)',
    rolePermission: [STAFF_EBTV, TO],
    userPersmission: [],
    helpReportType: 1,
    category: "ligue",
    active: true,
    isPublic: true
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)