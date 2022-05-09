// Node modules
const path = require('path');

// pdfStyle methods
const { finishMount, reloadBrowserContent } = require(`..${path.sep}instances${path.sep}docStyle`);

// Browser insteractions
const { closeChromium } = require(`..${path.sep}instances${path.sep}browser`);

// Filename sanitizer
const sanitize = require('sanitize-filename');

// Command
module.exports = {
    data: {
        name: 'exportpdf',
        params: ['<file_name>'],
        description: "Finishes mounting the document and export it as PDF",
		type: "utility"
    },
    async execute(messageSent, parameters){

		// Gets the discord message's data
		const currentChannel = messageSent.channel;

		// Checks if there are parameters on the message
		let fileName;
		if(parameters){
			fileName = parameters[0];
		}
		else{
			// User didn't specify a name for the file
			return await currentChannel.send("Please choose a name for the file!");
		}
		

		// Validates the name of the file
		fileName = sanitize(fileName);

		// Creates PDF file and Responds command
		await reloadBrowserContent();
		const pdfFile = await finishMount();
		await closeChromium();
		await currentChannel.send({files:[
			{
				name: fileName + ".pdf", 
				attachment: pdfFile
			}
		]});
    }
}