// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}docStyle`);

module.exports = {
    data: {
        name: 'dashed',
        params: ["<double/nothing>"],
        description: 'Toggles dashed or double dashed on the current font, add "double" as a parameter to toggle double dashed',
        type: "formatting"
    },
    async execute(messageSent, parameters = null){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        let currentDashed = getStyleObjProperty("fontDashed");
        let returnMessage = "";

        // Toggles Dashed/Double dashed
        switch(currentDashed){
            case true:
                returnMessage += "Dashed font: **Disabled**\n";
                if(parameters != null && parameters[0] == "double"){
                    returnMessage += "Double dashed font: **Enabled**";
                    await setStyleObjProperty("fontDashed", "double");
                }else{
                    await setStyleObjProperty("fontDashed", false);
                }
            break;
            case false:
                if(parameters != null && parameters[0] == "double"){
                    returnMessage += "Double dashed font: **Enabled**";
                    await setStyleObjProperty("fontDashed", "double");
                }else{
                    returnMessage += "Dashed font: **Enabled**";
                    await setStyleObjProperty("fontDashed", true);
                }
            break;
            case "double":
                returnMessage += "Double dashed font: **Disabled**\n";
                if(parameters == null){
                    returnMessage += "Dashed font: **Enabled**";
                    await setStyleObjProperty("fontDashed", true);
                }else{
                    await setStyleObjProperty("fontDashed", false);
                }
            break;
        }

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}docStyle`);
		if(!mounting){
			startMount();
		}

        // Responds command
		return await currentChannel.send(returnMessage);
    }
}