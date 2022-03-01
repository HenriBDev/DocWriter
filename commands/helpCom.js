module.exports = {
	data: {
		name: 'help',
        params: null,
		description: "Show all available commands for PDFMaker"
	},
	execute(messageSent){
		return messageSent.reply(helpString);
	}
};

// Create command handler
const commands = require('../createCommandHandler')();

let helpString = "**Available commands:**\n\n**pdf|help** -> Show all available commands for PDFMaker";
commands.forEach(command => {
    if(command.data.name !== "help"){
        helpString += ("\n\n**pdf|" + command.data.name + "** " 
                        + (command.data.params ? "\`" + command.data.params + "\`" : "") +  
                        " -> " + command.data.description);
    }
})