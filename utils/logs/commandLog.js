const { EmbedBuilder, Options, CommandInteraction } = require("discord.js")

module.exports = (cmdInteraction) => {
    const command = cmdInteraction.client.commands.get(cmdInteraction.commandName)
    const member = cmdInteraction.member
    const commandJSON = command.dataSlash.toJSON()

    const logEmbed = new EmbedBuilder()
        .setTitle("Log O.R.C.A")
        .setDescription(`La commande </${cmdInteraction.commandName}:${cmdInteraction.commandId}> vient d'etre effectuer`)
        .setColor("#1882f9")
        .setThumbnail(member.displayAvatarURL())
        .setTimestamp()
        .addFields(
            {
                name: 'Surnom utilisateur',
                value: member.nickname !== null ? `${member.nickname}` : "Pas de surnom sur le serveur.",
                inline: true
            },
            {
                name: "Utilisateur",
                value: cmdInteraction.user.tag,
                inline: true
            },
            {
                name: "Salon",
                value: `<#${cmdInteraction.channelId}>`,
                inline: true
            }
        )

    if (commandJSON.options.length > 0) {
        var optionListe = []

        commandJSON.options.forEach(opt => {
            optionListe.push(opt.name)
        })

        var optString = []

        optionListe.forEach(opt => {
            optInteraction = cmdInteraction.options.get(opt)
            type = optInteraction.type
            let formatedValue = optInteraction.value

            switch (type) {
                case 8 : 
                    formatedValue = `<@&${optInteraction.value}>`
                    break
                
                case 6 :
                    formatedValue = `<@${optInteraction.value}>`
                    break
            }

            if (optInteraction) {
                optString.push(`- \`${optInteraction.name}\` : ${formatedValue}`)
            }
        })

        if (optString.length != 0) {
            logEmbed.addFields({
                name: "Options",
                value: optString.join("\n")
            })
        }
    }

    cmdInteraction.client.channels.cache.get(process.env.CHANNEL_ID_LOG_BOT).send({ embeds: [logEmbed] })
}
