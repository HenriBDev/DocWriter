// Node modules
const path = require('path');

// Getting prefix and command execution toggle
const clientPath = `..${path.sep}instances${path.sep}client`
const { PREFIX, toggleCommandExecution } = require(clientPath);

// Event
module.exports = {
    eventType: "on",
    name: 'messageCreate',
    execute(message){

        // Check if the message is a bot command (has prefix)
        if (!isCommand(message)) return 

        // Check if there is another command in execution
        const { executingCommand } = require(clientPath);
        if (executingCommand) return

        const { client } = require(clientPath);
        let command;
        try{

            // Checks if command exists
            command = getCommand(client, message);
            if (!command){
                throw false;
            }
            
        }
        catch{

            // Shows help if user types wrong command with the prefix
            command = client.commands.get('help');

        }
        try {

            // Responds command
            toggleCommandExecution();
            command.execute(message).then(() => {

                // Finishes command execution
                message.delete()
                toggleCommandExecution();

            });

        } catch (error) {
            console.error(error);
        }
    }
}

// Other functions
function isCommand(message){
	return message.content.startsWith(PREFIX);
}

function getCommand(client, message){
	return client.commands.get(message.content.split(PREFIX)[1].split(' ')[0]);
}