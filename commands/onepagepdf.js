// Node modules
const path = require('path');

// Filename sanitizer
const sanitize = require('sanitize-filename');

// pdfStyle methods
const { startMount, addContent, finishMount, reloadBrowserContent } = require(`..${path.sep}instances${path.sep}docStyle`);

// Browser interactions
const { closeChromium, getPagePreview } = require(`..${path.sep}instances${path.sep}browser`)

// Event
module.exports = {
	data: {
		name: 'onepagepdf',
		params: ['<file_name>'],
		description: "Generates a single page PDF file using the user's last text message",
		type: "utility"
	},
	async execute(messageSent, parameters){
		
		let senderMessages, senderLastMessage;

		// Gets the discord message's data
		const currentChannel = messageSent.channel, senderId = messageSent.author.id;
		let fileName = parameters[0];

		// Validates the name of the file
		if(!fileName){
			// User didn't specify a name for the file
			return await currentChannel.send("Please choose a name for the file!");
		}
		fileName = sanitize(fileName)

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

		// Mounts document with the sent message
		senderLastMessage = senderMessages.at(1).content;
		startMount();
		await reloadBrowserContent();
		await addContent(senderLastMessage, currentChannel);
		const { totalPages } = require(`..${path.sep}instances${path.sep}docStyle`);

		// Creates PDF and preview files and responds command
		const pdfFile = await finishMount();
		const previewFile = await getPagePreview(totalPages);
		await closeChromium();
		await currentChannel.send({files:[
			{
				name: fileName + ".pdf", 
				attachment: pdfFile
			}
		]});
		return await currentChannel.send(
			{
				content: "Page preview:", 
				files: [{
					name: "preview.png",
					attachment: previewFile
				}]
			}
		);
	}
};