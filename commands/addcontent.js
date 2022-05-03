// Node modules
const path = require('path');

// Discord.js' select menu
const { MessageSelectMenu } = require('discord.js');

// pdfStyle methods
const { startMount, addContent } = require(`..${path.sep}instances${path.sep}docStyle`);

// Browser interactions
const { getPagePreview } = require(`..${path.sep}instances${path.sep}browser`);

module.exports = {
    data: {
        name: 'addcontent',
        params: [null],
        description: "Adds last message to the document without finishing the mounting",
		type: "utility"
    },
    async execute(messageSent, parameters = null){

		let senderMessages, senderLastMessage;

		// Gets the discord message's data
        const senderId = messageSent.author.id, currentChannel = messageSent.channel;

		// Filters the sender's messages
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

		// Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}docStyle`);
		if(!mounting){
			startMount();
		}

		// Adds text to document
		senderLastMessage = senderMessages.at(1).content;
		await addContent(senderLastMessage, currentChannel);

		// Creates select menu
		const { totalPages } = require(`..${path.sep}instances${path.sep}docStyle`);
		const pageSelectMenu = new MessageSelectMenu({
			customId: "selectPage_Menu"
		});
		for(let page = 1; page <= totalPages; page++){
			pageSelectMenu.addOptions({
				label: `Page ${page}/${totalPages}`,
				value: `${page}`,
				default: page == totalPages ? true : false
			});
		}

		// Creates file preview and responds command
		const previewFile = await getPagePreview(totalPages);
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
						customId: "selectPage_Previous",
						style: "PRIMARY"
					},
					{
						type: 2,
						label: "▶️",
						customId: "selectPage_Next",
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
}