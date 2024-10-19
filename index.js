require('dotenv').config();

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { loadCommands, loadEvents } = require('./utils/loaders');
const { getNbStage, getParticipants } = require('./utils/toornamentUtils');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
client.args = process.argv.slice(2)

async function test() {
    const participant = await getParticipants(50, 75)
    participant.data.forEach(element => {
        console.log(`"${element.name}" : "${element.id}",`)
    })
}

loadCommands(client)
loadEvents(client)

client.login(process.env.DISCORD_TOKEN);