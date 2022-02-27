const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder().setName('generate').setDescription("Generates a .txt file with the user's last message."),
	execute(interaction){
		const senderId = interaction.user.id;
		interaction.channel.messages.fetch()
			.then(channelMessages => {
				// Using values() and next().value because userMessages is a Collection (extends Map)
				const senderMessages = channelMessages.filter(message => message.author.id === senderId ? true : false).values();
				const senderLastMessage = senderMessages.next().value.content;
				interaction.reply({files: [
					{
						name: "test.txt", 
						attachment: Buffer.from(senderLastMessage, "utf8")
					}
				]});
			})
	}
};