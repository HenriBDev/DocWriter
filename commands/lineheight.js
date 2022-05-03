// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}docStyle`);

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

        // Sets new line height
        let newLineHeight = parameters[0].replace(/,/g, '.') + "cm";
        newLineHeight = await setStyleObjProperty("paragraphLinesHeight", newLineHeight);

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}docStyle`);
		if(!mounting){
			startMount();
		}
        
        // Responds command
		return await currentChannel.send(`Current line-height: **${getStyleObjProperty("paragraphLinesHeight")}**`);
    }
}