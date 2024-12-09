const fs = require('node:fs');
const { readyLog } = require('../../utils/logs');
const { loadCommandIds } = require('../../utils/loaders');
const { url } = require('node:inspector');
const { deploySlashCommands, deployPrivateSlashCommands } = require('../../utils/slashDeployer');

module.exports = async (client) => {
    try{
        const username = (client.args[0] == "dev") ? 'O.R.C.A_d.e.v' : 'O.R.C.A'

        await client.user.setUsername(username);

        if(client.args[0] != "dev"){
            const newAvatar = fs.readFileSync('./images/Orca.png');
            await client.user.setAvatar(newAvatar);
        }

        /*await client.channels.cache.get("743460063917637682").send({
            content: "Oui",
            reply: { 
                messageReference: '1314175372706840646'
            }
        })*/

        deploySlashCommands(client)
        deployPrivateSlashCommands(client)

        const newBanner = fs.readFileSync('./images/banner.png');
        await client.user.setBanner(newBanner)

        await client.user.setPresence({
            activities : [
                {
                    name: "Ligue ebTV Saison 3",
                    state: "/help",
                    type: 5,
                    url: "https://www.youtube.com/@eSportBrosTV"
                }
            ]
        })

    } catch (error){
        console.error('Error updating bot name and avatar:', error);
    }

    client.commandIds = await loadCommandIds(client)

    console.log(`Ready! Logged in as ${client.user.tag}`);

    readyLog(client)
}