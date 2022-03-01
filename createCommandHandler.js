const { Collection } = require("discord.js");
const fs = require('fs');

module.exports = function(){
    const commandHandler = new Collection();
    const commandsDir = "./commands";
    
    const files = fs.readdirSync(commandsDir)
    files.forEach(fileName => {
        const file = require(`${commandsDir}/${fileName}`);
        // Set a new item in the Collection
        // With the key as the command name and the value as the exported module
        commandHandler.set(file.data.name, file);
    });
    return commandHandler;
}

