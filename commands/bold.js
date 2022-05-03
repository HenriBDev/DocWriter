// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}docStyle`);

module.exports = {
    data: {
        name: 'bold',
        params: [null],
        description: "Toggles bold on the current font"
    },
    async execute(messageSent, parameters = null){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Toggles bold
        const boldEnabled = await setStyleObjProperty("fontBold", !getStyleObjProperty("fontBold"));

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}docStyle`);
		if(!mounting){
			startMount();
		}

        // Responds command
		return await currentChannel.send(`Bold font: **${boldEnabled ? "Enabled" : "Disabled"}**`);
    }
}