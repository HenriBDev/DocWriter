// Node modules
const fs = require('fs')
const path = require('path');
const process = require('process');

// Adds .env to process
require('dotenv').config();

// Discord.js classes
const { Client, Intents, Collection } = require('discord.js');

// Instance
module.exports = {
    client: null,
    executingCommand: false,
    toggleCommandExecution(){module.exports.executingCommand = !module.exports.executingCommand},
    BOT_TOKEN: process.env.BOT_TOKEN,
    PREFIX: "pdf|",
    instantiateClient(){
        module.exports.client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });

        // Creates handlers
        createHandler('commands');
        createHandler('events');

        return module.exports.client;
    }
}

// Other functions
function createHandler(handlerType){
    if(handlerType == "commands"){
        module.exports.client.commands = new Collection();
    }
    const dirName = `..${path.sep}${handlerType}`;
    const files = fs.readdirSync(handlerType);
    files.forEach(fileName => {
        const file = require(dirName + path.sep + fileName);
        if(handlerType == "commands"){
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            module.exports.client.commands.set(file.data.name, file);
        }
        else{
            module.exports.client[file.eventType](file.name, (...args) => file.execute(...args));
        }
    });
}