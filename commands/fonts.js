// Node modules
const path = require('path');
const { getPagePreview } = require('../instances/browser');

// docStyle methods and properties
const { fonts, startMount, docStyleContent } = require(`..${path.sep}instances${path.sep}docStyle`);

// Browser interactions
const { launchChromium, closeChromium } = require(`..${path.sep}instances${path.sep}browser`);

// Event
module.exports = {
	data: {
		name: 'fonts',
        params: [null],
		description: "Show all available fonts",
		type: "utility"
	},

	async execute(messageSent, parameters = null){
		
		// Gets discord message's data
		const currentChannel = messageSent.channel;

		const { mounting } = require(`..${path.sep}instances${path.sep}docStyle`);
		if(!mounting){
			startMount();
		}
		const { docHtmlContent } = require(`..${path.sep}instances${path.sep}docStyle`);
        let fontFile = '<div id="pageFont" style="padding: 10px;display: grid;grid-template-columns: 396px 396px;">';

        fonts.forEach(fontFamily => {
            fontFile += `<div style="font-family: ${fontFamily};">${fontFamily}</div>`;
        });

        fontFile += "</div></div></body></html>";

        await launchChromium(docHtmlContent + fontFile, docStyleContent);
        const previewFile = await getPagePreview("Font");
		await closeChromium();
        
		// Responds command
		return currentChannel.send({
			content: "Available fonts:",
			files: [{
				name: "fonts.png",
				attachment: previewFile
			}],
		});
	}
}