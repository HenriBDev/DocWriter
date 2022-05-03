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
    executingInteraction: false,
    BOT_TOKEN: process.env.BOT_TOKEN,
    PREFIX: "doc|",

    toggleCommandExecution(){
        module.exports.executingCommand = !module.exports.executingCommand
    },

    instantiateClient(){
        module.exports.client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });

        // Creates handlers
        createHandler('commands');
        createHandler('events');
        createHandler('interactions');

        return module.exports.client;
    }
}

// Other functions
function createHandler(handlerType){
    if(handlerType != "events"){
        module.exports.client[handlerType] = new Collection();
    }
    const dirName = `..${path.sep}${handlerType}`;
    const files = fs.readdirSync(handlerType);
    files.forEach(fileName => {
        const file = require(dirName + path.sep + fileName);
        if(handlerType != "events"){
            // Set a new item in the Collection with the key as the command/interaction name and the value as the exported module
            module.exports.client[handlerType].set(file.data.name, file);
        }
        else{
            module.exports.client[file.eventType](file.name, (...args) => file.execute(...args));
        }
    });
}