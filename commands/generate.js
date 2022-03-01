// Node modules
const path = require('path');

// Filename sanitizer
const sanitize = require('sanitize-filename');

// Event
module.exports = {
	data: {
		name: 'generate',
		params: ['<file_name>'],
		description: "Generate a .pdf file formatted in HTML, using the user's last text message"
	},
	async execute(messageSent){
		let fileName = messageSent.content.split(' ')[1];

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
		const { browser } = require(`..${path.sep}instances${path.sep}chromium`);
		pdfPage = await browser.newPage();
		await pdfPage.setContent(senderLastMessage);
		let pdfFile;
		await pdfPage.pdf().then(file => pdfFile = file);
		let pdfPreview;
		await pdfPage.screenshot().then(preview => pdfPreview = preview);
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