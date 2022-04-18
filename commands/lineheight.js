// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);

module.exports = {
    data: {
        name: 'lineheight',
        params: ['<line_height>'],
        description: "Changes the lines' height (measured in centimeters)"
    },
    async execute(messageSent, parameters){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Verifies if sender chose correctly (positive number) the new height
        if(!parameters || Number(parameters[0].replace(/,/g, '.')) <= 0){
            return await currentChannel.send("Please select a valid height!");
        }
        let newLineHeight = parameters[0].replace(/,/g, '.') + "cm";

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		if(!mounting){
			startMount();
		}

        // Sets new line height
        newLineHeight = await setStyleObjProperty("paragraphLinesHeight", newLineHeight);
		return await currentChannel.send(`Current line-height: **${getStyleObjProperty("paragraphLinesHeight")}**`);
    }
}