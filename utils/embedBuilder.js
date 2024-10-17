const { EmbedBuilder } = require('discord.js');

function embedBuilder(title, member, channel, commandName){
    const embed = new EmbedBuilder()
            .setTitle(title)
            .setThumbnail(member.displayAvatarURL())
            .addFields(
                { name: 'Surnom utilisateur', value: member.nickname !== null ? `${member.nickname}` : "Pas de surnom sur le serveur.", inline: true },
                { name: 'Identifiant utilisateur', value: `${member.user.username}`, inline: true },
                { name: 'Commande utilisée', value: `${commandName}`, inline: true },
            )
    channel.send({embeds: [embed]});
}

module.exports = {
    embedBuilder,
};
