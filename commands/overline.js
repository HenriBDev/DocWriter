// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);

module.exports = {
    data: {
        name: 'overline',
        params: [null],
        description: "Toggles overline on the current font"
    },
    async execute(messageSent, parameters = null){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		if(!mounting){
			startMount();
		}

        // Toggles Overline
        const overlineEnabled = await setStyleObjProperty("fontOverline", !getStyleObjProperty("fontOverline"));
		return await currentChannel.send(`Overline font: **${overlineEnabled ? "Enabled" : "Disabled"}**`);
    }
}