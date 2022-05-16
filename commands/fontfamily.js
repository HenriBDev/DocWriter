// Node modules
const path = require('path');

// docStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount, reloadBrowserContent } = require(`..${path.sep}instances${path.sep}docStyle`);

// Browser interactions
const { closeChromium } = require(`..${path.sep}instances${path.sep}browser`);


module.exports = {
    data: {
        name: 'fontfamily',
        params: ['<font_family>'],
        description: "Changes the current font family",
        type: "formatting"
    },
    async execute(messageSent, parameters){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Verifies if sender selected a font family
        if(!parameters){
            return await currentChannel.send("Please select a font family!");
        }

        let newFontFamily = parameters.join(' ').toLowerCase();

        // Verifies if font exists
        const { fonts } = require(`..${path.sep}instances${path.sep}docStyle`);
        if(fonts.indexOf(newFontFamily) == -1){
            return await currentChannel.send("Please select a valid font family!\nTo see which fonts are available use `doc|fonts`");
        }

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}docStyle`);
		if(!mounting){
			startMount();
		}
        // Sets new font family
        await reloadBrowserContent();
        newFontFamily = await setStyleObjProperty("fontFamily", newFontFamily);
        await closeChromium();

        // Responds command
		return await currentChannel.send(`Font-family selected: **${getStyleObjProperty('fontFamily')}**`);
    }
}