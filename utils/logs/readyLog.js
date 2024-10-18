const { EmbedBuilder } = require("discord.js");
const { loadCommandIds } = require("../loaders");

module.exports = async (client) => {

    const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID).then((result) => {
        return result
    }).catch((err) => {
        console.error("Impossible de récuperer le serveur du bot", err)
        return false
    });

    let userNumber = 0

    if(guild){
        userNumber = guild.memberCount.toString()
    }

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