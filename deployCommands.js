module.exports = function(client, clientId, guildId, botToken) {
	// Discord.js modules
	const { REST } = require('@discordjs/rest');
	const { Routes } = require('discord-api-types/v9');

	// Mapping commands to JSON
	const commands = client.commands.map(command => command.data.toJSON());

	// REST
	const rest = new REST({ version: '9' }).setToken(botToken);
	
	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);
}