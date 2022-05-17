// Node modules
const path = require('path');

// Client instance
const { instantiateClient, BOT_TOKEN } = require(`.${path.sep}instances${path.sep}client`);
const client = instantiateClient();

(async function launchBot(){
    // Login to Discord with the bot token
    await client.login(BOT_TOKEN); 
    await client.user.setActivity("doc|help",{type: "PLAYING"});
})();
