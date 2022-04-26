// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);

module.exports = {
    data: {
        name: 'firstlineindent',
        params: ['<line_indent/nothing>'],
        description: "Changes/disables the indentation before the first line (measured in centimeters)"
    },
    async execute(messageSent, parameters = null){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Verifies if sender chose correctly (positive number or 0) the indentation
        if(parameters && Number(parameters[0].replace(/,/g, '.')) < 0){
            return await currentChannel.send("Please select a valid indent!");
        }

        // Sets new first line indentation
        let newIndentation = (parameters ? parameters[0].replace(/,/g, '.') : 0) + "cm";
        newIndentation = await setStyleObjProperty("paragraphFirstLineIndentation", newIndentation);

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		if(!mounting){
			startMount();
		}

        // Responds command
		return await currentChannel.send(`Current first line indent: **${getStyleObjProperty("paragraphFirstLineIndentation")}**`);
    }
}