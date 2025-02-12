const { SlashCommandBuilder } = require('@discordjs/builders');
const { STAFF_EBTV, TO } = require('../../utils/roleEnum');
const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const mIndex = require("../../utils/modeIndex");
const { mapDB } = require('../../db');

module.exports.execute = async (interaction) => {
    let selectedModes = []

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

        if (selectedModes.length > 0) {
            let textePre = []

            for (let j = 0; j < selectedModes.length; j++) {
                textePre.push(`- Manche n°${j + 1} - ${mIndex[selectedModes[j]]}`)
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

        let row = new ActionRowBuilder()
            .addComponents(selectModeMenu)

        let response = null

        if (toUpdate.isCommand()) {
            response = await toUpdate.editReply({
                content: "",
                embeds: [embed],
                components: [row]
            })
        } else {
            response = await toUpdate.update({
                content: "",
                embeds: [embed],
                components: [row]
            })
        }


        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
            if (confirmation.customId === 'modeActSelectMenu') {
                selectedModes.push(parseInt(confirmation.values[0]))
                return await recursiveModeSelection(nb + 1, confirmation)
            }
        } catch {
            return false
        }
    }

    if (!await recursiveModeSelection(1, interaction)) return interaction.editReply({
        content: "Trop long :middle_finger:",
        embeds: [],
        components: []
    })

    let textePre = []

    for (let k = 0; k < selectedModes.length; k++) {
        textePre.push(`- Manche n°${k + 1} - ${mIndex[selectedModes[k]]}`)
    }

    const confirmationEmbed = new EmbedBuilder()
        .setTitle("Confirmation des modes")
        .setDescription(`Voici la liste des modes choisie :\n${textePre.join("\n")}`)

    const okBut = new ButtonBuilder()
        .setCustomId("okMode")
        .setStyle(ButtonStyle.Success)
        .setLabel("Confirmer")

    const noBut = new ButtonBuilder()
        .setCustomId("noMode")
        .setStyle(ButtonStyle.Danger)
        .setLabel("Annuler")

    let row = new ActionRowBuilder()
        .addComponents(okBut, noBut)

    let rep = await interaction.editReply({
        content: "",
        embeds: [confirmationEmbed],
        components: [row]
    })


    const collectorFilter = i => i.user.id === interaction.user.id;

    try {
        const confirmation = await rep.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        if (confirmation.customId === 'okMode') {
            let formatedlModListe= {
                mUn: selectedModes[0],
                mDeux: selectedModes[1],
                mTrois: selectedModes[2],
                mQuatre: selectedModes[3],
                mCinq: selectedModes[4],
                mSix: selectedModes[5],
                mSept: selectedModes[6],
            }

            if(await mapDB.modeActuel.changeModeActuel(formatedlModListe)){
                return interaction.editReply({
                    content: "C'est fait !",
                    embeds: [],
                    components: []
                })
            } else {
                return interaction.editReply({
                    content: "Oups",
                    embeds: [],
                    components: []
                })
            }
        } else {
            return interaction.editReply({
                content: "Bye Bye :wave:",
                embeds: [],
                components: []
            })
        }
    } catch {
        return interaction.editReply({
            content: "Trop long :middle_finger:",
            embeds: [],
            components: []
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
    isPublic: false
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)