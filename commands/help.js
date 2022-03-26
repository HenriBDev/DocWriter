// Node modules
const path = require('path');

// Event
module.exports = {
	data: {
		name: 'help',
        params: [null],
		description: "Show all available commands for PDFMaker"
	},
	execute(messageSent){
		const currentChannel = messageSent.channel;
		return currentChannel.send(module.exports.helpString);
	},
	helpString: "",
	setHelpString(client){
		module.exports.helpString = "**Available commands:**\n\n**pdf|help** -> Show all available commands for PDFMaker";
		client.commands.forEach(command => {
		    if(command.data.name !== "help"){
			
				//**pdf|<comand_name>** ...`<command_params>` -> <command_description>
			
				// Command name
		        module.exports.helpString += "\n\n**pdf|" + command.data.name + "** "; 
			
				// Command parameters
				command.data.params.forEach(param => {
					module.exports.helpString += param ? "\`" + param + "\` " : "";
				});
			
				// Command description
				module.exports.helpString += "-> " + command.data.description;
		    }
		})
	}
};
