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

		const currentChannel = messageSent.channel;
        const messageSplit = messageSent.content.split(' ')
		let fileName = messageSplit[1];

		if(!fileName){
			// User didn't specify a name for the file
			return await currentChannel.send("Please choose a name for the file!");
		}

		fileName = sanitize(fileName)
        const { finishMount, getPreviewPages } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		const docFinished = await finishMount();
		let pdfFile;
		pdfFile = await docFinished.pdf({format: "A4"});
		let previewFiles = await getPreviewPages();
		previewFiles = await Promise.all(previewFiles.map(async (page, index) => ({
			name: `preview${index}.png`, 
			attachment: await page.screenshot()
		})));
		return await currentChannel.send({files: previewFiles.concat([
			{
				name: fileName + ".pdf", 
				attachment: pdfFile
			}
		])});
    }
}