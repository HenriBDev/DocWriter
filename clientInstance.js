// Node modules
const fs = require('fs');
const process = require('process');
require('dotenv').config();

// Requires the necessary discord.js classes
const { Client, Intents, Collection } = require('discord.js');

// Creates a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();
const clientId = process.env.CLIENT_ID
const guildId = process.env.GUILD_ID
const botToken = process.env.BOT_TOKEN

// Adds command handler on client
const commandsDir = "./commands";
const files = fs.readdirSync(commandsDir)
files.forEach(fileName => {
	const file = require(`${commandsDir}/${fileName}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(file.data.name, file);
});


module.exports = { 
	client: client,
	clientId: clientId,
	guildId: guildId,
	botToken: botToken
} 