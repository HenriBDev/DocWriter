// Node modules
const path = require('path');

// helpString assembler
const { getHelpString } = require(`..${path.sep}commands${path.sep}help`);

module.exports = {
	data: {
		name: 'selectCommands',
	},

	async execute(interaction){
		
		let interactionMessage, 
            newCommandsSelection = interaction.customId.split("_")[1], 
            // Assembles the helpString and creates the command types buttons again
            messageOptions = {
                content: getHelpString(newCommandsSelection),
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
            };

        // Gets message with the help message
        await interaction.channel.messages.fetch().then(channelMessages => {
            interactionMessage = channelMessages.filter(message => message.author.id == interaction.client.user.id).at(0);
        })
        
        // Responds interaction
        interactionMessage.edit(messageOptions);
	}
}