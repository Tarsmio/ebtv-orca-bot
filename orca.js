require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { loadCommands, loadEvents } = require('./utils/loaders');
const { getNbStage, getParticipants, getStreamIds, getStageIds } = require('./utils/toornamentUtils');
const { ToornamentTokenGest } = require('./utils/ToornamenTokenGest');
const { map } = require('./db');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();
client.args = process.argv.slice(2)
client.toornamentToken = ToornamentTokenGest.getInstance()

loadCommands(client)
loadEvents(client)

client.login(process.env.DISCORD_TOKEN);

app.get('/', (req, res) => {
    res.send('Orca est en vie !');
});
  
app.listen(port, () => {
    console.log(`Serveur de monitoring lancé sur le port ${port}`);
});