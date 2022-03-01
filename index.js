const { client, BOT_TOKEN, PREFIX } = require('./clientInstance')

function isCommand(message){
	return message.content.startsWith(PREFIX);
}

function getCommand(message){
	return client.commands.get(message.content.split(PREFIX)[1].split(' ')[0]);
}

client.once("ready", () => { 
	console.log(`[${new Date().toTimeString()}] Bot is running!`); 
})

client.on("messageCreate", message => {
	if (isCommand(message)) {
		let command;
		try{
			command = getCommand(message);
			if (!command){
				throw false;
			}
		}
		catch{
			command = client.commands.get('help');
		}
		try {
			command.execute(message).then(() => message.delete());
		} catch (error) {
			console.error(error);
		}
	}
})

// Login to Discord with the client token
client.login(BOT_TOKEN);