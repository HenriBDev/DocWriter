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
		const { client } = require(`..${path.sep}instances${path.sep}client`)
		let helpString = "**Available commands:**\n\n**pdf|help** -> Show all available commands for PDFMaker";
		client.commands.forEach(command => {
		    if(command.data.name !== "help"){
			
				//**pdf|<comand_name>** ...`<command_params>` -> <command_description>
			
				// Command name
		        helpString += "\n\n**pdf|" + command.data.name + "** "; 
			
				// Command parameters
				command.data.params.forEach(param => {
					helpString += param ? "\`" + param + "\`" : "";
				});
			
				// Command description
				helpString += " -> " + command.data.description;
		    }
		})
		return messageSent.reply(helpString);
	}
};
