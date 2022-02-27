const { client, clientId, guildId, botToken } = require('./clientInstance')
require('./deployCommands')(client, clientId, guildId, botToken)

client.once("ready", () => { console.log(`[${new Date().toTimeString()}] Bot is running!`) })

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) {
		console.log("This is not a command interaction!");
		return;
	}

	const command = client.commands.get(interaction.commandName);

	if (!command){
		console.log("This is not a valid command!");
		return; 
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
	}
})

// Login to Discord with the client token
client.login(botToken);