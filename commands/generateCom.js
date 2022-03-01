const { jsPDF } = require('jspdf');

module.exports = {
	data: {
		name: 'generate',
		params: '<file_name>',
		description: "Generate a .pdf file without formatting, using the user's last text message"
	},
	async execute(messageSent){
		const fileName = messageSent.content.split(' ')[1];
		if(fileName){
			const senderId = messageSent.author.id;
			let senderMessages, senderLastMessage;
			await messageSent.channel.messages.fetch()
				.then(channelMessages => {
					senderMessages = channelMessages.filter(message => message.author.id === senderId ? true : false);
				});
			if(senderMessages.size > 1){
				senderLastMessage = senderMessages.at(1).content;
				pdfFile = new jsPDF();
				pdfFile.text(senderLastMessage, 10, 10);
				return messageSent.reply({files: [
					{
						name: fileName + ".pdf", 
						attachment: Buffer.from(pdfFile.output("arraybuffer"), 'utf16le')
					}
				]});
			}
			// User didn't send any messages before command
			else{
				return messageSent.reply("No text messages available.")
			}
		}
		// User didn't specify a name for the file
		else{
			return messageSent.reply("Please choose a name for the file!");
		}
	}
};