// Node modules
const path = require('path');

// Color validator
const { validateHTMLColorName, validateHTMLColorHex } = require('validate-color');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}docStyle`);

module.exports = {
    data: {
        name: 'bgcolor',
        params: ['<bg_color>'],
        description: "Changes the font background color (`<bg_color>` can be a name or a hex code, ex: `#E0E0E0` or `lightblue`)"
    },
    async execute(messageSent, parameters){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Verifies if sender selected a valid color
        if(!parameters || (validateHTMLColorName(parameters.join('')) == false && validateHTMLColorHex(parameters[0]) == false)){
            return await currentChannel.send("Please select a valid color!");
        }

        // Sets new background color
        let newBgColor = parameters.join('');
        newBgColor = await setStyleObjProperty("fontBgColor", newBgColor);

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}docStyle`);
		if(!mounting){
			startMount();
		}

        // Responds command
		return await currentChannel.send(`Font-background-color selected: **${getStyleObjProperty('fontBgColor')}**`);
    }
}