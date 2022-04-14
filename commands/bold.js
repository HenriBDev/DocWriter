// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);

module.exports = {
    data: {
        name: 'bold',
        params: [null],
        description: "Toggles bold on the current font"
    },
    async execute(messageSent, parameters = null){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		if(!mounting){
			startMount();
		}

        // Toggles bold
        const boldEnabled = await setStyleObjProperty("fontBold", !getStyleObjProperty("fontBold"));
		return await currentChannel.send(`Bold font: **${boldEnabled ? "Enabled" : "Disabled"}**`);
    }
}