const path = require('path');

module.exports = {
    data: {
        name: 'addcontent',
        params: [null],
        description: "Adds last message to the PDF without finishing the mounting"
    },
    async execute(messageSent){
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
        const { mounting, startMount, addContent, getPreviewFile } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		if(!mounting){
			startMount();
		}
		addContent(senderLastMessage);
		const pagePreview = await getPreviewFile();
        let pdfPreview
		pdfPreview = await pagePreview.screenshot({fullPage: true});
		return await messageSent.reply({files: [
			{
				name: "preview.png",
				attachment: pdfPreview
			}
		]});
    }
}