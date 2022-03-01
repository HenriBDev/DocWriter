// Node modules
const process = require('process');
require('dotenv').config();

// Requires the necessary discord.js classes
const { Client, Intents } = require('discord.js');

// Creates a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });
client.commands = require('./createCommandHandler')();

module.exports = { 
	client: client,
	BOT_TOKEN: process.env.BOT_TOKEN,
	PREFIX: "pdf|"
} 