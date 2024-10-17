const fs = require('node:fs');
const { readyLog } = require('../../utils/logs');

module.exports = async (client) => {
    try{
        const username = (client.args[0] == "dev") ? 'O.R.C.A_d.e.v' : 'O.R.C.A'

        await client.user.setUsername(username);

        if(client.args[0] != "dev"){
            const newAvatar = fs.readFileSync('./images/Orca.png');
            await client.user.setAvatar(newAvatar);
        }
    
    } catch (error){
        console.error('Error updating bot name and avatar:', error);
    }

    console.log(`Ready! Logged in as ${client.user.tag}`);
    readyLog(client)
}