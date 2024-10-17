const { EmbedBuilder } = require("discord.js")

module.exports = (client) => {
    const userNumber = client.users.cache.map(u => {
        if (!u.bot) {
            return u
        }
    }).length.toString()

    const commandNumber = client.commands.map(c => {
        return c
    }).length.toString()

    const logEmbed = new EmbedBuilder()
        .setTitle("En ligne")
        .setDescription(`Le bot est connecter sous le compte \`\`${client.user.tag}\`\``)
        .setColor("#18e000")
        .setTimestamp()
        .setThumbnail(client.user.avatarURL({
            extension: 'png',
            size: 128
        }))
        .addFields(
            {
                name: "Utilisateurs",
                value: userNumber,
                inline: true
            },
            {
                name: "Commandes",
                value: commandNumber,
                inline: true
            }
        )

    client.channels.cache.get(process.env.CHANNEL_ID_LOG_BOT).send({ embeds: [logEmbed] })

}