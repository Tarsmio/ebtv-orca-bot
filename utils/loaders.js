const { readdirSync } = require("fs")
const { Collection } = require('discord.js');

const loadCommands = (botClient, dir = "./commands/") => {
    readdirSync(dir).forEach(dirs => {
        const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith('.js'));

        for (const file of commands) {
            const getFileName = require(`../${dir}/${dirs}/${file}`)
            botClient.commands.set(getFileName.info.name, getFileName)
            console.log('info', `La commande ${getFileName.info.name} est chargé !`)
        }
    })
}

const loadEvents = (botClient, dir = "./events/") => {
    readdirSync(dir).forEach(dirs => {
        const events = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith('.js'));

        for (const event of events) {
            const evt = require(`../${dir}/${dirs}/${event}`)
            const evtName = event.split(".")[0]
            botClient.on(evtName, evt.bind(null))
            console.log('info', `L'evenement ${evtName} est chargé !`)
        }
    })
}

const loadCommandIds = async (client) => {
    const guild = client.guilds.cache.find(guild => guild.id = process.env.DEV_SERV)
    var ids = {
        application : new Collection(),
        guild : new Collection()
    }
    
    let fetchedAppCommands = await client.application.commands.fetch()
    let fetchedGuildCommands = await guild.commands.fetch()

    fetchedAppCommands.each(cmd => {
        ids.application.set(cmd.name, cmd.id)
    })

    fetchedGuildCommands.each(cmd => {
        ids.guild.set(cmd.name, cmd.id)
    })

    return ids
}

module.exports = {
    loadCommands,
    loadEvents,
    loadCommandIds
}