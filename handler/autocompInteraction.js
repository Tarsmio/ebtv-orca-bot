module.exports = async (interaction) => {
    const command = interaction.client.commands.get(interaction.commandName)

    if(!command) return

    command.autocom(interaction)
}