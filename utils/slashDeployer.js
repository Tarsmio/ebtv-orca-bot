const {REST} = require("@discordjs/rest")
const {Routes} = require("discord-api-types/v9")


module.exports = {
  deploySlashCommands : async (client) => {

    const commands = client.commands.filter(cmd => cmd.info.active === true && cmd.info.isPublic === true).map(cmd => cmd.dataSlash)

    const rest = new REST({
      version : 9
    }).setToken(process.env.DISCORD_TOKEN)

    try {
      console.log('info',"Debut du deploiment des commandes slash ...")

      await rest.put(
        Routes.applicationCommands(client.application.id),
        {
          body : commands
        }
      )

      console.log('info', "Deploiments des commands slash reussi")
    } catch (err) {
      console.log('error', err)
    }
  },

  deployPrivateSlashCommands : async (client) => {
    
    const commands = client.commands.filter(cmd => cmd.info.active === true && cmd.info.isPublic === false).map(cmd => cmd.dataSlash)

    const rest = new REST({
      version : 9
    }).setToken(process.env.DISCORD_TOKEN)

    try {
      console.log('info',"Debut du deploiment des commandes privé slash ...")

      await rest.put(
        Routes.applicationGuildCommands(client.application.id, process.env.DEV_SERV),
        {
          body : commands
        }
      )

      console.log('info',"Deploiments des commands slash privé reussi")
    } catch (err) {
      console.log('error', err)
    }
  }
}