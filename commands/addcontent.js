const path = require('path');

module.exports = {
    data: {
        name: 'addcontent',
        params: [null],
        description: "Adds last message to the PDF without finishing the mounting"
    },
    async execute(messageSent){
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

		senderLastMessage = senderMessages.at(1).content;
        const { mounting, startMount, addContent, getPreviewPages } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		if(!mounting){
			startMount();
		}
		await addContent(senderLastMessage, currentChannel);
		let previewFiles = await getPreviewPages();
		previewFiles = await Promise.all(previewFiles.map(async (page, index) => ({
			name: `preview${index}.png`, 
			attachment: await page.screenshot()
		})));
		return await currentChannel.send({content: "File preview:", files: previewFiles});
    }
}