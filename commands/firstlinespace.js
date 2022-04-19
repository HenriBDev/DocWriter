// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);

module.exports = {
    data: {
        name: 'firstlinespace',
        params: ['<line_space/nothing>'],
        description: "Changes/disables the spacing before the first line (measured in centimeters)"
    },
    async execute(messageSent, parameters = null){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Verifies if sender chose correctly (positive number or 0) the spacing
        if(parameters && Number(parameters[0].replace(/,/g, '.')) < 0){
            return await currentChannel.send("Please select a valid spacing!");
        }

        let newSpacing = (parameters ? parameters[0].replace(/,/g, '.') : 0) + "cm";

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		if(!mounting){
			startMount();
		}

        // Sets new first line spacing
        newSpacing = await setStyleObjProperty("paragraphFirstLineIndentation", newSpacing);
		return await currentChannel.send(`Current first line spacing: **${getStyleObjProperty("paragraphFirstLineIndentation")}**`);
    }
}