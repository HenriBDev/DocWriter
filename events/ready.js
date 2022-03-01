// Node modules
const path = require('path');

// Chromium launcher
const { launchChromium } = require(`..${path.sep}instances${path.sep}chromium`);

// Event
module.exports = {
    eventType: "once",
    name: 'ready',
    execute(){
        launchChromium();
        console.log(`[${new Date().toTimeString()}] Bot is running!`); 
    }
}