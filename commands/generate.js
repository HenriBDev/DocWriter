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
		const messageSplit = messageSent.content.split(' ')
		let fileName = messageSplit[1];

		if(!fileName){
			// User didn't specify a name for the file
			return await messageSent.reply("Please choose a name for the file!");
		}

		fileName = sanitize(fileName)
		const senderId = messageSent.author.id;
		let senderMessages, senderLastMessage;

		// Filters the user's messages
		await messageSent.channel.messages.fetch()
			.then(channelMessages => {
				senderMessages = channelMessages.filter(message => message.author.id === senderId ? true : false);
			});

		// Filters no-text messages
		await senderMessages.filter(message => message.content);

		if(senderMessages.size <= 1){
			// User didn't send any text messages before command
			return messageSent.reply("No text messages available.");
		}

		senderLastMessage = senderMessages.at(1).content;
		const { startMount, addContent, finishMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		startMount();
		addContent(senderLastMessage);
		const docFinished = await finishMount();
		let pdfFile;
		pdfFile = await docFinished.pdf();
		let pdfPreview;
		await docFinished.screenshot({fullPage: true}).then(preview => pdfPreview = preview);
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
};