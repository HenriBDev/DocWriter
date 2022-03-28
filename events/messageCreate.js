// Node modules
const path = require('path');

// Getting prefix and command execution toggle
const clientPath = `..${path.sep}instances${path.sep}client`
const { PREFIX, toggleCommandExecution } = require(clientPath);

// Event
module.exports = {
    eventType: "on",
    name: 'messageCreate',
    async execute(message){

        // Check if the message isn't a bot command (has prefix)
        if (isNotCommand(message.content)) return 

        // Check if there is another command in execution
        const { executingCommand } = require(clientPath);
        if (executingCommand) return

        const { client } = require(clientPath);
        let commandsArray = [];
        let parametersArray = [];
        let parameters;
        let command;
        let showHelp = false;
        

        // Checks if message contains multiple commands
        let commandsSeparated = message.content.split('|');
        for(let messageIndex = 1; messageIndex < commandsSeparated.length; messageIndex++){
            
            // Checks if command exists
            command = getCommand(client, commandsSeparated[messageIndex]);
            parameters = getParameters(commandsSeparated[messageIndex]);
            if (!command){
                if(showHelp == false){
                    showHelp = true;
                }
            }
            else{
                commandsArray.push(command);
                parametersArray.push(parameters)
            }
        }

        if(showHelp){
            commandsArray.push(client.commands.get('help'));
        }
        
        try {

            // Responds command(s)
            toggleCommandExecution();

            for(let commandIndex = 0; commandIndex < commandsArray.length; commandIndex++){
                await commandsArray[commandIndex].execute(message, parametersArray[commandIndex]);
            }
            try{
                await message.delete();
            }catch{}
    
            // Finishes command(s) execution
            toggleCommandExecution();
            console.log(`[${new Date().toTimeString()}] Command(s) finished execution.`);

        } catch (error) {
            console.error(error);
        }
    }
}

// Other functions
function isNotCommand(message){
	return !message.startsWith(PREFIX);
}

function getCommand(client, message){
	return client.commands.get(message.split(' ')[0]);
}

function getParameters(command){
    if(command.split(' ').length > 1){
        return command.split(' ').splice(1);
    }
    else{
        return null;
    }
}