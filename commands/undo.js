// Node modules
const path = require('path');

// pdfStyle methods
const { undoAddition } = require(`..${path.sep}instances${path.sep}docStyle`);

// Browser methods
const { launchChromium, getPagePreview, closeChromium } = require(`..${path.sep}instances${path.sep}browser`);

// Discord.js' select menu
const { MessageSelectMenu } = require('discord.js');

module.exports = {
    data: {
        name: 'undo',
        params: [null],
        description: "Undoes the previous addition on the file",
		type: "utility"
    },
    async execute(messageSent, parameters = null){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Undoes latest addition
		await launchChromium();
        if(!await undoAddition()){
            return currentChannel.send("Undo limit reached.");
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
		const previewFile = await getPagePreview(totalPages);
		await closeChromium();
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