// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}docStyle`);

module.exports = {
    data: {
        name: 'italic',
        params: [null],
        description: "Toggles italic on the current font",
        type: "formatting"
    },
    async execute(messageSent, parameters = null){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Toggles Italic
        const italicEnabled = await setStyleObjProperty("fontItalic", !getStyleObjProperty("fontItalic"));

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}docStyle`);
		if(!mounting){
			startMount();
		}

        // Responds command
		return await currentChannel.send(`Italic font: **${italicEnabled ? "Enabled" : "Disabled"}**`);
    }
}