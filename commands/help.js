// Node modules
const path = require('path');

// Importing the bot's prefix
const { PREFIX, client } = require(`..${path.sep}instances${path.sep}client`);

// Event
module.exports = {
	data: {
		name: 'help',
        params: [null],
		description: "Show all available commands for DocWriter",
		type: "utility"
	},

	execute(messageSent, parameters = null){
		
		// Gets discord message's data
		const currentChannel = messageSent.channel;

		// Responds command
		return currentChannel.send({
			content: module.exports.getHelpString(),
			components: [{
				type: 1,
				components: [{
					type: 2,
					label: "Utility commands",
					customId: "selectCommands_utility",
					style: "PRIMARY"
				},
				{
					type: 2,
					label: "Formatting commands",
					customId: "selectCommands_formatting",
					style: "PRIMARY"
				}]
			}]
		});
	},

	getHelpString(helpType = null){

		let helpString;

		// Adds all available commands to the helpString
		if(helpType != null){
			helpString = "**Available commands:**\n" +
						 "(You can chain commands using `|`)\n" +
						 "For example: `" + PREFIX + "addcontent|exportpdf myPdfFile`";
			client.commands.forEach(command => {
				if(command.data.type == helpType){
					//**doc|<command_name>** ...`<command_params>` -> <command_description>
				
					// Command name
					helpString += `\n\n**${PREFIX}${command.data.name}** `; 
					
					// Command parameters
					command.data.params.forEach(param => {
						helpString += param ? "\`" + param + "\` " : "";
					});

					// Command description
					helpString += "-> " + command.data.description;
				}
			})
		}else{
			helpString = "Select the type of commands you're looking for:\n\n**Utility**: Related to mounting the document\n**Formatting**: Related to formatting the text of the document"
		}

		return helpString;
	}

};
