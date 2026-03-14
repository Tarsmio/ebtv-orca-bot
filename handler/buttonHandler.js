module.exports = async(interaction) => {
    const buId = interaction.customId

    let butInfo = buId.split("_")

    if(butInfo[0] != "g") return

    const command = interaction.client.commands.get(butInfo[1])

    if(!command) return

    command.but(interaction, butInfo[2],butInfo[3].split('&'))
}