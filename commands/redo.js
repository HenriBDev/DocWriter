// Node modules
const path = require('path');

// pdfStyle methods
const { redoAddition } = require(`..${path.sep}instances${path.sep}docStyle`);

// Browser methods
const { getPagePreview } = require(`..${path.sep}instances${path.sep}browser`);

// Discord.js' select menu
const { MessageSelectMenu } = require('discord.js');

module.exports = {
    data: {
        name: 'redo',
        params: [null],
        description: "Redoes the previous undone addition on the file"
    },
    async execute(messageSent, parameters = null){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Redoes latest addition
        if(!await redoAddition()){
            return currentChannel.send("Redo limit reached.");
        }

        // Creates select menu
		const { totalPages } = require(`..${path.sep}instances${path.sep}docStyle`);
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