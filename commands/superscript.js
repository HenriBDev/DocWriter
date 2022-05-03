// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}docStyle`);

module.exports = {
    data: {
        name: 'superscript',
        params: [null],
        description: "Toggles superscript on the current font"
    },
    async execute(messageSent, parameters = null){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Toggles Superscript
        const superscriptEnabled = await setStyleObjProperty("fontSuperscript", !getStyleObjProperty("fontSuperscript"));

        // Checks if subscript is enabled
        let returnMessage = "";
        if(getStyleObjProperty("fontSubscript")){
            await setStyleObjProperty("fontSubscript", false);
            returnMessage += "Subscript font: **Disabled**\n";
        }
        
        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}docStyle`);
		if(!mounting){
			startMount();
		}

        // Responds command
		return await currentChannel.send(returnMessage + `Superscript font: **${superscriptEnabled ? "Enabled" : "Disabled"}**`);
    }
}