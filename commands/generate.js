// Node modules
const path = require('path');

// Discord.js' select menu
const { MessageSelectMenu } = require('discord.js');

// Filename sanitizer
const sanitize = require('sanitize-filename');

// pdfStyle functions
const { startMount, addContent, getPreviewPage, finishMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);

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
		startMount();
		await addContent(senderLastMessage, currentChannel);
		const { totalPages } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		const docFinished = await finishMount();
		let pdfFile;
		pdfFile = await docFinished.pdf({format: "A4", pageRanges: `1-${totalPages}`});
		let previewFile = await getPreviewPage();

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
		return await currentChannel.send(
			{
				content: "Pages preview:", 
				files: [{
					name: "preview.png",
					attachment: previewFile
				}],
				components: [{
					type: 1,
					components: [{
						type: 2,
						label: "◀️",
						customId: "backward_button",
						style: "PRIMARY"
					},
					{
						type: 2,
						label: "▶️",
						customId: "forward_button",
						style: "PRIMARY"
					}]
				},
				{
					type: 1,
					components: [pageSelectMenu]
				}]	
			}
		);
	}
};