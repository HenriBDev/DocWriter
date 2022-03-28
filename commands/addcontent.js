const path = require('path');
const { MessageSelectMenu } = require('discord.js');

module.exports = {
    data: {
        name: 'addcontent',
        params: [null],
        description: "Adds last message to the PDF without finishing the mounting"
    },
    async execute(messageSent, parameters = null){
        const senderId = messageSent.author.id;
		const currentChannel = messageSent.channel;
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

		// Adds text to document
		senderLastMessage = senderMessages.at(1).content;
        const { mounting, startMount, addContent, getPreviewPage } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		if(!mounting){
			startMount();
		}
		await addContent(senderLastMessage, currentChannel);
		let previewFile = await getPreviewPage();

		// Creates select menu
		const { totalPages } = require(`..${path.sep}instances${path.sep}pdfStyle`);
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
}