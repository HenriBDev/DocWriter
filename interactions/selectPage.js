// Node modules
const path = require('path');

// Discord.js' select menu
const { MessageSelectMenu } = require('discord.js');

// pdfStyle methods
const { selectPage, reloadBrowserContent } = require(`..${path.sep}instances${path.sep}docStyle`);

// Browser interactions
const { getPagePreview, closeChromium } = require(`..${path.sep}instances${path.sep}browser`);

module.exports = {
	data: {
		name: 'selectPage',
	},

	async execute(interaction){
		
		let interactionMessage, newPageSelection, messageOptions = {};

        // Gets current number of pages and which one is selected
        const { totalPages, pageSelected } = require(`..${path.sep}instances${path.sep}docStyle`);
		
        // Gets message with the preview image
        await interaction.channel.messages.fetch().then(channelMessages => {
            interactionMessage = channelMessages.filter(message => message.author.id == interaction.client.user.id).at(0);
        })
        // Changes page according to the type of interaction
        if(interaction.isButton()){
            newPageSelection = parseInt(pageSelected) + (interaction.customId == "selectPage_Next" ? 1 : -1);
        }
        else{
            newPageSelection = interaction.values[0];
        }
        // Checks if new page is valid
        if(newPageSelection > 0 && newPageSelection <= totalPages){
            // Creates select menu
            const pageSelectMenu = new MessageSelectMenu({
                customId: "selectPage"
            });
            for(let page = 1; page <= totalPages; page++){
                pageSelectMenu.addOptions({
                    label: `Page ${page}/${totalPages}`,
                    value: `${page}`,
                    default: page == newPageSelection
                });
            }
            messageOptions.components = [
            {
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
        // If new page isn't valid just keep the same page
        else{
            newPageSelection = pageSelected;
        }
        selectPage(newPageSelection);

        // Creates preview file and responds interaction
        await reloadBrowserContent();
        const previewFile = await getPagePreview(newPageSelection);
        await closeChromium();
        messageOptions.files = [{
            name: "preview.png",
            attachment: previewFile
        }];
        interactionMessage.edit(messageOptions);
	}
}