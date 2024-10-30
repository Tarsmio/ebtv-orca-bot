const { SlashCommandBuilder } = require('@discordjs/builders');
const { readdirSync, copyFileSync } = require("fs")
const { EmbedBuilder } = require('discord.js');
const permIndex = require('../../utils/permIndex');
const categoryList = readdirSync("./commands")

const catEmote = {
    Bot: ":robot:",
    Cast: ":red_circle:",
    Fun: ":game_die:",
    Ligue: ":squid:",
    Toornament: ":computer:",
    Outils: ":tools:"
}

function hasAcces(cmd, roles) {
    if (cmd.info.rolePermission.length == 0) return true

    if (cmd.info.rolePermission.some(roleId => roles.cache.has(roleId))) return true

    return false
}


//(g == 0 || (g == 1 && hasAcces()))

module.exports.execute = async (interaction) => {

    const commandName = interaction.options.getString("commande")

    if (!commandName) {
        const helpEmbed = new EmbedBuilder()
            .setTitle("Commandes de O.R.C.A")
            .setThumbnail(interaction.client.user.avatarURL({
                extension: 'png',
                size: 128
            }))
            .setColor("#35aa27")
            .setDescription("## Voici la liste des commandes du bot\n\n*Les commandes présentes dans cette liste sont uniquement celles auxquelles vous avez accès*\n")

        categoryList.forEach((async cat => {
            var commandListe = interaction.client.commands.filter(cmd => {
                return cmd.info.category === cat.toLocaleLowerCase() && (cmd.info.helpReportType == 0 || (cmd.info.helpReportType == 1 && hasAcces(cmd, interaction.member.roles)))
            }).map(cmd => {
                var cmdId = interaction.client.commandIds.application.find((value, key) => key == cmd.info.name)

                if(!cmdId) cmdId = interaction.client.commandIds.guild.find((value, key) => key == cmd.info.name)

                return cmdId ? `</${cmd.info.name}:${cmdId}> - ${cmd.info.description}` : `/${cmd.name} - ${cmd.info.description}`
            })

            if (commandListe.length > 0) {

                helpEmbed.addFields({
                    name: `${catEmote[cat]} ---- ${cat} ---- ${catEmote[cat]}`,
                    value: `${commandListe.join("\n")}`
                })
            }
        }))

        if (!helpEmbed.data.fields) helpEmbed.setDescription("Vous n'avez acces a aucune commande !")

        interaction.reply({
            embeds: [helpEmbed]
        })
    }
    else {
        const command = interaction.client.commands.get(commandName)

        if (!command) return interaction.reply({
            content: `La commande **${commandName}** n'existe pas !`,
            ephemeral: true
        })

        if (!hasAcces(command, interaction.member.roles)) return interaction.reply({
            content: `Je ne peut pas vous montrer la commande **${commandName}** car vous n'y avez pas acces`,
            ephemeral: true
        })

        let cmdId = await interaction.client.application.commands.fetch().then(r => {
            return r.find(cmd => cmd.name === command.info.name).id
        }).catch(err => {
            return false
        })

        if (!cmdId) {
            cmdId = await interaction.guild.commands.fetch().then(r => {
                return r.find(cmd => cmd.name === command.info.name).id
            }).catch(err => {
                return false
            })
        }

        const commandJSON = command.dataSlash.toJSON()

        const commandEmbed = new EmbedBuilder()
            .setDescription(command.info.description)
            .setThumbnail(interaction.client.user.avatarURL({
                extension: 'png',
                size: 128
            }))
            .setColor("#35aa27")
            .setFooter({
                text: `Categorie : ${command.info.category}`
            })

        if (cmdId) {
            commandEmbed.setTitle(`Commande </${command.info.name}:${cmdId}>`)
        }
        else {
            commandEmbed.setTitle(`Commande ${command.info.name}`)
        }

        if (commandJSON.options.length > 0) {
            var optionListe = []

            commandJSON.options.forEach(opt => {
                optionListe.push(`**\`${opt.name}\`** - ${opt.description}`)
            })

            commandEmbed.addFields({
                name: "Options",
                value: optionListe.join('\n'),
                inline: true
            })
        }

        if (command.info.userPersmission.length > 0) {
            var permListe = []

            command.info.permissions.forEach((perm) => {
                permListe.push(`\`${permIndex[perm]}\``)
            })

            permListe = permListe.join(", ")

            commandEmbed.addFields({
                name: "Permissions",
                value: permListe
            })
        }

        interaction.reply({
            embeds: [commandEmbed]
        })
    }

}

module.exports.autocom = async (interaction) => {
    const option = interaction.options.getFocused(true);

    if (option.name === 'commande') {
        const commandeListe = interaction.client.commands.filter(cmd => hasAcces(cmd, interaction.member.roles) && cmd.info.helpReportType != 2).map(cmd => cmd.info.name)

        const filterElement = commandeListe.filter(el => el.startsWith(option.value))

        await interaction.respond(
            filterElement.map(el => ({ name: el, value: el }))
        )
    }
}

module.exports.info = {
    name: "help",
    description: 'Affiche la liste des commandes du bot',
    rolePermission: [],
    userPersmission: [],
    helpReportType: 2,
    category: "autre"
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)
    .addStringOption(option =>
        option.setName("commande")
            .setDescription("Nom d'une commande pour un help specifique a celle ci")
            .setRequired(false)
            .setAutocomplete(true)
    )