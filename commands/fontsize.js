// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}docStyle`);

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

        // Sets new font size
        let newFontSize = parameters[0] + "pt";
        newFontSize = await setStyleObjProperty("fontSize", newFontSize);

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}docStyle`);
		if(!mounting){
			startMount();
		}

        // Responds command
		return await currentChannel.send(`Current font-size: **${getStyleObjProperty("fontSize")}**`);
    }
}