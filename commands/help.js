// Event
module.exports = {
	data: {
		name: 'help',
        params: [null],
		description: "Show all available commands for PDFMaker"
	},

	execute(messageSent, parameters = null){
		
		// Gets discord message's data
		const currentChannel = messageSent.channel;

		// Responds command
		return currentChannel.send(module.exports.helpString);
	},

	helpString: "",

	setHelpString(client){

		// Initializes helpString
		module.exports.helpString = "**Available commands:**\n" +
									"(You can chain commands using `|`)\n" +
									"For example: `pdf|addcontent|finishpdf myPdfFile`\n" +
									"\n" +
									"**pdf|help** -> Show all available commands for PDFMaker";

		// Adds all available commands to the helpString
		client.commands.forEach(command => {
		    if(command.data.name !== "help"){
			
				//**pdf|<command_name>** ...`<command_params>` -> <command_description>
			
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
