const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType, PermissionsBitField } = require('discord.js');
const { getNbStage } = require('../../utils/toornamentUtils');
const { embedBuilder } = require("../../utils/embedBuilder");
const { STAFF_EBTV } = require('../../utils/roleEnum');

module.exports.execute = async (interaction) => {
    try {
        // Get the guild from the interaction
        const guild = interaction.guild;
        const user = interaction.user;

        const nbDivToCreate = await getNbStage();

        interaction.reply({ content: "Les divisions sont en cours de création, vérifiez bien que toutes les divisions sont créer. Ne pas oublier d'autoriser la permission pour modifier les permissions des utilisateurs d'un salon (Manage Permissions) dans les catégories des divisions avant d'utiliser la commande /permissiondivisionligue." })

        for (let i = 1; i < nbDivToCreate + 1; i++) {
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
        }
    } catch (error) {
        console.error(error);
        interaction.reply({ content: `Une erreur s'est produite lors de l'exécution de la commande : ${error}`, ephemeral: true });
    }
}

module.exports.info = {
    name: "creerdivisionligue",
    description: 'Commande pour créer automatiquement les divisions de la ligue !',
    rolePermission: [STAFF_EBTV],
    userPersmission: [],
    helpReportType: 1,
    category : "ligue"
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)