// Node modules
const path = require('path');

// Discord.js' select menu
const { MessageSelectMenu } = require('discord.js');

// pdfStyle methods
const { finishMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);

// Filename sanitizer
const sanitize = require('sanitize-filename');

// Command
module.exports = {
    data: {
        name: 'finishpdf',
        params: ['<file_name>'],
        description: "Finishes mounting the document and export it as PDF"
    },
    async execute(messageSent, parameters){

		// Gets the discord message's data
		const currentChannel = messageSent.channel;
		let fileName = parameters[0];

		// Validates the name of the file
		if(!fileName){
			// User didn't specify a name for the file
			return await currentChannel.send("Please choose a name for the file!");
		}
		fileName = sanitize(fileName)

		// Creates select menu
		const pageSelectMenu = new MessageSelectMenu({
			customId: "select_menu"
		});
		for(let page = 1; page <= totalPages; page++){
			pageSelectMenu.addOptions({
				label: `Page ${page}/${totalPages}`,
				value: `${page}`,
				default: page == totalPages ? true : false
			});
		}

		// Creates PDF file and Responds command
		const pdfFile = await finishMount();
		await currentChannel.send({files:[
			{
				name: fileName + ".pdf", 
				attachment: pdfFile
			}
		]});
    }
}