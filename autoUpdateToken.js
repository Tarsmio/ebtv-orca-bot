require('dotenv').config();
const { getTournamentToken, updateTokenInEnvFile } = require('./utils/toornamentUtils');

async function autoUpdateToken(){
    const token = await getTournamentToken();
    await updateTokenInEnvFile(token);
}

autoUpdateToken();
