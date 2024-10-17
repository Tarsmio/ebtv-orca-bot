const {commandLog } = require("../utils/logs");

module.exports = async (interaction) => {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    if(command.info.rolePermission.length > 0){
        const member = interaction.member

        if(!command.info.rolePermission.some(roleId => member.roles.cache.has(roleId))) return interaction.reply({
            ephemeral : true,
            content : "Désolé tu n'as pas le droit d'utiliser cette commande !"
        })
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }

    commandLog(interaction)
}