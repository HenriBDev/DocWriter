// Node modules
const path = require('path');

// pdfStyle methods
const { finishMount } = require(`..${path.sep}instances${path.sep}docStyle`);

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
		let fileName = parameters[0];

		// Validates the name of the file
		if(!fileName){
			// User didn't specify a name for the file
			return await currentChannel.send("Please choose a name for the file!");
		}
		fileName = sanitize(fileName);

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