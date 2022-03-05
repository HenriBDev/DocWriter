// Node modules
const path = require('path');

// Chromium launcher
const { launchChromium } = require(`.${path.sep}instances${path.sep}browser`);

// Client instance
const { instantiateClient, BOT_TOKEN } = require(`.${path.sep}instances${path.sep}client`);
const client = instantiateClient();

(async function launchBot(){ 
    await launchChromium();
    // Login to Discord with the bot token
    client.login(BOT_TOKEN); 
})();
