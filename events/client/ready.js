const fs = require('node:fs');

module.exports = async (client) => {
    try{
        await client.user.setUsername('O.R.C.A');

        const newAvatar = fs.readFileSync('./images/Orca.png');
        await client.user.setAvatar(newAvatar);
    } catch (error){
        console.error('Error updating bot name and avatar:', error);
    }

    console.log(`Ready! Logged in as ${client.user.tag}`);
}