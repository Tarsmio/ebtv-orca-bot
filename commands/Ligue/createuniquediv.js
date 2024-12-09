const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType, PermissionsBitField } = require('discord.js');
const { checkUserPermissions } = require("../../utils/logging/logger");
const { STAFF_EBTV } = require('../../utils/roleEnum');

module.exports.execute = async (interaction) => {
    try {
        await interaction.deferReply();

        const guild = interaction.guild;
        const numDiv = interaction.options.getString('numdiv');

        if (isNaN(numDiv)) {
            throw new Error('Le paramètre numdiv n\'est pas une valeur numérique.');
        }

        const category = await guild.channels.create({
            name: `Division ${numDiv}`,
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
            name: `division-${numDiv}`,
            parent: category.id,
            type: ChannelType.GuildText,
        });

        await guild.channels.create({
            name: `div-${numDiv}-planif`,
            parent: category.id,
            type: ChannelType.GuildText,
        });

        await guild.channels.create({
            name: `div-${numDiv}-support`,
            parent: category.id,
            type: ChannelType.GuildText,
        });

        await guild.channels.create({
            name: `div-${numDiv}-récaps-manches`,
            parent: category.id,
            type: ChannelType.GuildText,
        });

        await guild.channels.create({
            name: `div-${numDiv}-discussion`,
            parent: category.id,
            type: ChannelType.GuildText,
        });

        return await interaction.editReply({ content: "La division a été créer." })

    } catch (error) {
        console.error(error);
        interaction.editReply({ content: `Une erreur s'est produite lors de l'exécution de la commande`, ephemeral: false });
    }
}

module.exports.info = {
    name: "creeruniquedivision",
    description: 'Créer une unique division !',
    rolePermission: [STAFF_EBTV],
    userPersmission: [],
    helpReportType: 1,
    category : "ligue",
    active: true,
    isPublic: true
}

module.exports.dataSlash = new SlashCommandBuilder()
    .setName(this.info.name)
    .setDescription(this.info.description)
    .addStringOption(option =>
        option.setName('numdiv')
            .setDescription('Numéro de la division à créer')
            .setRequired(true))