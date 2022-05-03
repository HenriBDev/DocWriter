// Node modules
const path = require('path');

// Importing the bot's prefix
const { PREFIX } = require(`..${path.sep}instances${path.sep}client`);

// Event
module.exports = {
	data: {
		name: 'help',
        params: [null],
		description: "Show all available commands for DocWriter"
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
									"For example: `" + PREFIX + "addcontent|exportpdf myPdfFile`\n" +
									"\n" +
									`**${PREFIX}help** -> Show all available commands for DocWriter`;

		// Adds all available commands to the helpString
		client.commands.forEach(command => {
		    if(command.data.name !== "help"){
			
				//**doc|<command_name>** ...`<command_params>` -> <command_description>
			
				// Command name
		        module.exports.helpString += `\n\n**${PREFIX}${command.data.name}** `; 
			
				// Command parameters
				command.data.params.forEach(param => {
					module.exports.helpString += param ? "\`" + param + "\` " : "";
				});
			
				// Command description
				module.exports.helpString += "-> " + command.data.description;
		    }
		})
		module.exports.helpString = "In maintenance due to character limit.";
	}

};
