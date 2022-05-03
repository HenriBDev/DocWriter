// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}docStyle`);

module.exports = {
    data: {
        name: 'subscript',
        params: [null],
        description: "Toggles subscript on the current font",
        type: "formatting"
    },
    async execute(messageSent, parameters = null){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Checks if subscript is enabled
        let returnMessage = "";
        if(getStyleObjProperty("fontSuperscript")){
            await setStyleObjProperty("fontSuperscript", false);
            returnMessage += "Superscript font: **Disabled**\n";
        }

        // Toggles Superscript
        const subscriptEnabled = await setStyleObjProperty("fontSubscript", !getStyleObjProperty("fontSubscript"));

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}docStyle`);
		if(!mounting){
			startMount();
		}

        // Responds command
		return await currentChannel.send(returnMessage + `Subscript font: **${subscriptEnabled ? "Enabled" : "Disabled"}**`);
    }
}