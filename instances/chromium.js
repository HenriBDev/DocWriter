// Puppeteer library for headless browser
const puppeteer = require('puppeteer');

// Instance
module.exports = {
    browser: null,
    async launchChromium(){
        module.exports.browser = await puppeteer.launch();
    }
}