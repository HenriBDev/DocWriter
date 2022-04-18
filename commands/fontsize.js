// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);

module.exports = {
    data: {
        name: 'fontsize',
        params: ['<font_size>'],
        description: "Changes the font's current size (measured in PTs)"
    },
    async execute(messageSent, parameters){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Verifies if sender chose correctly (positive integer number) the new size
        if(!parameters || Number(parameters[0]) <= 0 || Number(parameters[0]) % 1 != 0){
            return await currentChannel.send("Please select a valid size!");
        }
        let newFontSize = parameters[0] + "pt";

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		if(!mounting){
			startMount();
		}

        // Sets new font size
        newFontSize = await setStyleObjProperty("fontSize", newFontSize);
		return await currentChannel.send(`Current font-size: **${getStyleObjProperty("fontSize")}**`);
    }
}