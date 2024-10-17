const { commandHandle } = require("../../handler")

module.exports = async (interaction) => {
    
    if(interaction.isCommand()) commandHandle(interaction)
}