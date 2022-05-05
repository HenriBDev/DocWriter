// Node modules
const path = require('path');

// Client instance
const { instantiateClient, BOT_TOKEN } = require(`.${path.sep}instances${path.sep}client`);
const client = instantiateClient();

(function launchBot(){
    // Login to Discord with the bot token
    client.login(BOT_TOKEN); 
})();
