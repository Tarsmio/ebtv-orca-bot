const { commandHandle, autocompHandle } = require("../../handler")

module.exports = async (interaction) => {
    
    if(interaction.isCommand()) commandHandle(interaction)
    if (interaction.isAutocomplete()) autocompHandle(interaction)
}