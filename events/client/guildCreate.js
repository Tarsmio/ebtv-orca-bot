module.exports = async (guild) => {
    if((guild.id != process.env.DEV_SERV) || (guild.id != process.env.EBTV_SERVER_ID)){
        await guild.leave()
    }
}