require('dotenv').config();

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { loadCommands, loadEvents } = require('./utils/loaders');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

loadCommands(client)
loadEvents(client)

client.login(process.env.DISCORD_TOKEN);
