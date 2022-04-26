// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);

module.exports = {
    data: {
        name: 'underline',
        params: [null],
        description: "Toggles underline on the current font"
    },
    async execute(messageSent, parameters = null){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Toggles Underline
        const underlineEnabled = await setStyleObjProperty("fontUnderline", !getStyleObjProperty("fontUnderline"));

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		if(!mounting){
			startMount();
		}

        // Responds command
		return await currentChannel.send(`Underline font: **${underlineEnabled ? "Enabled" : "Disabled"}**`);
    }
}