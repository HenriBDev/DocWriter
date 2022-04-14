// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);

module.exports = {
    data: {
        name: 'align',
        params: ['<right/left/center/justify>'],
        description: "Changes the content's alignment"
    },
    async execute(messageSent, parameters){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Verifies if sender chose on of the aligns available
        if(!parameters || (parameters[0] != "right" && parameters[0] != "left" && parameters[0] != "center" && parameters[0] != "justify")){
            return await currentChannel.send("Please select a valid alignment!");
        }
        let newAlignment = parameters[0];

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		if(!mounting){
			startMount();
		}

        // Sets new font family
        newAlignment = await setStyleObjProperty("paragraphAlign", newAlignment);
		return await currentChannel.send(`Current alignment: **${getStyleObjProperty("paragraphAlign")}**`);
    }
}