// Node modules
const path = require('path');

// Filename sanitizer
const sanitize = require('sanitize-filename');

// Command
module.exports = {
    data: {
        name: 'finishpdf',
        params: ['<file_name>'],
        description: "Finishes mounting the document and export it as PDF"
    },
    async execute(messageSent){
        const messageSplit = messageSent.content.split(' ')
		let fileName = messageSplit[1];

		if(!fileName){
			// User didn't specify a name for the file
			return await messageSent.reply("Please choose a name for the file!");
		}

		fileName = sanitize(fileName)
        const { finishMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		const docFinished = await finishMount();
		let pdfFile;
		pdfFile = await docFinished.pdf();
		let pdfPreview;
		pdfPreview = await docFinished.screenshot({fullPage: true});
		return await messageSent.reply({files: [
			{
				name: "preview.png",
				attachment: pdfPreview
			},
			{
				name: fileName + ".pdf", 
				attachment: pdfFile
			}
		]});
    }
}