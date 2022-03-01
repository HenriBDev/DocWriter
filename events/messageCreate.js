// Node modules
const path = require('path');

// Getting prefix
const { PREFIX } = require(`..${path.sep}instances${path.sep}client`);

// Event
module.exports = {
    eventType: "on",
    name: 'messageCreate',
    execute(message){

        // Check if the message is a bot command (has prefix)
        if (isCommand(message)) {
            const { client } = require(`..${path.sep}instances${path.sep}client`)
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

                // Executes response
                command.execute(message).then(() => message.delete());
            } catch (error) {
                console.error(error);
            }
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