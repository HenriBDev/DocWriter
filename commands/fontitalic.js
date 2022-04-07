// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);

module.exports = {
    data: {
        name: 'fontitalic',
        params: [null],
        description: "Toggles italic on the current font"
    },
    async execute(messageSent, parameters = null){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		if(!mounting){
			startMount();
		}

        // Toggles Italic
        const italicEnabled = await setStyleObjProperty("fontItalic", !getStyleObjProperty("fontItalic"));
		return await currentChannel.send(`Italic font: **${italicEnabled ? "Enabled" : "Disabled"}**`);
    }
}