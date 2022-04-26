// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);

module.exports = {
    data: {
        name: 'fontfamily',
        params: ['<font_family>'],
        description: "Changes the current font family"
    },
    async execute(messageSent, parameters){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Verifies if sender selected a font family
        if(!parameters){
            return await currentChannel.send("Please select a font family!");
        }

        // Sets new font family
        let newFontFamily = parameters.join(' ');
        newFontFamily = await setStyleObjProperty("fontFamily", newFontFamily);

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		if(!mounting){
			startMount();
		}

        // Responds command
		return await currentChannel.send(`Font-family selected: **${getStyleObjProperty('fontFamliy')}**`);
    }
}