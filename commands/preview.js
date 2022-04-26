// Node modules
const path = require('path');

// Discord.js' select menu
const { MessageSelectMenu } = require('discord.js');

// Browser interactions
const { getPagePreview, mountDocument } = require(`..${path.sep}instances${path.sep}browser`);

// pdfStyle methods
const { startMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);

module.exports = {
    data: {
        name: 'preview',
        params: [null],
        description: "Shows the preview of the current document"
    },
    async execute(messageSent, parameters = null){

        // Gets the channel in which the message was sent
        const currentChannel = messageSent.channel;

        // Checks if a document is already in the making
		const { mounting } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		if(!mounting){
			startMount();
		}

		// Creates select menu
		const { totalPages } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		const pageSelectMenu = new MessageSelectMenu({
			customId: "select_menu"
		});
		for(let page = 1; page <= totalPages; page++){
			pageSelectMenu.addOptions({
				label: `Page ${page}/${totalPages}`,
				value: `${page}`,
				default: page == totalPages ? true : false
			});
		}

		// Creates file preview and responds command
        const { pdfHtmlContent, pdfStyleContent } = require(`..${path.sep}instances${path.sep}pdfStyle`);
        await mountDocument(pdfHtmlContent, pdfStyleContent);
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
						customId: "backward_button",
						style: "PRIMARY"
					},
					{
						type: 2,
						label: "▶️",
						customId: "forward_button",
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