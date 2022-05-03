// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}docStyle`);

module.exports = {
    data: {
        name: 'overline',
        params: [null],
        description: "Toggles overline on the current font"
    },
    async execute(messageSent, parameters = null){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Toggles Overline
        const overlineEnabled = await setStyleObjProperty("fontOverline", !getStyleObjProperty("fontOverline"));

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}docStyle`);
		if(!mounting){
			startMount();
		}

        // Responds command
		return await currentChannel.send(`Overline font: **${overlineEnabled ? "Enabled" : "Disabled"}**`);
    }
}