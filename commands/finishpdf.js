// Node modules
const path = require('path');

// Discord.js' select menu
const { MessageSelectMenu } = require('discord.js');

// pdfStyle functions
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

		const currentChannel = messageSent.channel;
		let fileName = parameters[0];

		if(!fileName){
			// User didn't specify a name for the file
			return await currentChannel.send("Please choose a name for the file!");
		}

		fileName = sanitize(fileName)
        const { totalPages } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		const docFinished = await finishMount();
		let pdfFile;
		pdfFile = await docFinished.pdf({format: "A4", pageRanges: `1-${totalPages}`});

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

		// Responds command
		await currentChannel.send({files:[
			{
				name: fileName + ".pdf", 
				attachment: pdfFile
			}
		]});
    }
}