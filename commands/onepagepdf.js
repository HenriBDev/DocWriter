// Node modules
const path = require('path');

// Discord.js' select menu
const { MessageSelectMenu } = require('discord.js');

// Filename sanitizer
const sanitize = require('sanitize-filename');

// pdfStyle methods
const { startMount, addContent, finishMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);

// Browser interactions
const { getPagePreview } = require(`..${path.sep}instances${path.sep}browser`)

// Event
module.exports = {
	data: {
		name: 'onepagepdf',
		params: ['<file_name>'],
		description: "Generates a one-page PDF file using the user's last text message"
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
		await addContent(senderLastMessage, currentChannel);
		const { totalPages } = require(`..${path.sep}instances${path.sep}pdfStyle`);

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

		// Creates PDF and preview files and responds command
		const pdfFile = await finishMount();
		const previewFile = await getPagePreview(totalPages);
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