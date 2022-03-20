// Node modules
const path = require('path');

// Filename sanitizer
const sanitize = require('sanitize-filename');

// Event
module.exports = {
	data: {
		name: 'generate',
		params: ['<file_name>'],
		description: "Generates a PDF file using the user's last text message"
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
		const senderId = messageSent.author.id;
		let senderMessages, senderLastMessage;

		// Filters the user's messages
		await currentChannel.messages.fetch()
			.then(channelMessages => {
				senderMessages = channelMessages.filter(message => message.author.id === senderId ? true : false);
			});

		// Filters no-text messages
		await senderMessages.filter(message => message.content);

		if(senderMessages.size <= 1){
			// User didn't send any text messages before command
			return currentChannel.send("No text messages available.");
		}

		senderLastMessage = senderMessages.at(1).content;
		const { startMount, addContent, getPreviewPages, finishMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		startMount();
		await addContent(senderLastMessage, currentChannel);
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
};