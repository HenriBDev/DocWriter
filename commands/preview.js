// Node modules
const path = require('path');

// Discord.js' select menu
const { MessageSelectMenu } = require('discord.js');

// Browser interactions
const { getPagePreview, mountDocument } = require(`..${path.sep}instances${path.sep}browser`);

// pdfStyle methods
const { startMount } = require(`..${path.sep}instances${path.sep}docStyle`);

module.exports = {
    data: {
        name: 'preview',
        params: [null],
        description: "Shows the preview of the current document",
		type: "utility"
    },
    async execute(messageSent, parameters = null){

        // Gets the channel in which the message was sent
        const currentChannel = messageSent.channel;

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}docStyle`);
		if(!mounting){
			startMount();
		}

		// Creates select menu
		const { totalPages } = require(`..${path.sep}instances${path.sep}docStyle`);
		const pageSelectMenu = new MessageSelectMenu({
			customId: "selectPage_Menu"
		});
		for(let page = 1; page <= totalPages; page++){
			pageSelectMenu.addOptions({
				label: `Page ${page}/${totalPages}`,
				value: `${page}`,
				default: page == totalPages ? true : false
			});
		}

		// Creates file preview and responds command
        const { docHtmlContent, docStyleContent } = require(`..${path.sep}instances${path.sep}docStyle`);
        await mountDocument(docHtmlContent, docStyleContent);
		const previewFile = await getPagePreview(totalPages);
		return await currentChannel.send(
			{
				content: "Pages preview:", 
				files: [{
					name: "preview.png",
					attachment: previewFile
				}],
				components: [{
					type: 1,
					components: [{
						type: 2,
						label: "◀️",
						customId: "selectPage_Previous",
						style: "PRIMARY"
					},
					{
						type: 2,
						label: "▶️",
						customId: "selectPage_Next",
						style: "PRIMARY"
					}]
				},
				{
					type: 1,
					components: [pageSelectMenu]
				}]	
			}
		);
    }
}