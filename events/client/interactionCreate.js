const { commandHandle, autocompHandle, buttonHandle } = require("../../handler")

module.exports = async (interaction) => {
    if((interaction.guild.id != process.env.DEV_SERV) && (interaction.guild.id != process.env.EBTV_SERVER_ID)) return 
    
    if(interaction.isCommand()) commandHandle(interaction)
    if (interaction.isAutocomplete()) autocompHandle(interaction)
    if(interaction.isButton()) buttonHandle(interaction)
}