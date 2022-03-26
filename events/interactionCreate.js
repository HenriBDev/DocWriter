// Node modules
const path = require('path')

const { MessageSelectMenu } = require('discord.js');

// Event
module.exports = {
    eventType: "on",
    name: 'interactionCreate',
    async execute(interaction){
        interaction.deferUpdate();

        if(!interaction.isButton() && !interaction.isSelectMenu()){
            return;
        }
        else{
            const { getPreviewPage, totalPages, selectPage, pageSelected } = require(`..${path.sep}instances${path.sep}pdfStyle`);
            let interactionMessage, previewFile, newPageSelection, messageOptions = {};
		   
            await interaction.channel.messages.fetch().then(channelMessages => {
                interactionMessage = channelMessages.filter(message => message.author.id == interaction.client.user.id).at(0);
            })
            if(interaction.isButton()){
                newPageSelection = parseInt(pageSelected) + (interaction.customId == "forward_button" ? 1 : -1);
            }
            else{
                newPageSelection = interaction.values[0];
            }
            if(newPageSelection > 0 && newPageSelection <= totalPages){
                const pageSelectMenu = new MessageSelectMenu({
                    customId: "select_menu"
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
            else{
                newPageSelection = pageSelected;
            }
            selectPage(newPageSelection);
            previewFile = await getPreviewPage();
            messageOptions.files = [{
                name: "preview.png",
                attachment: previewFile
            }];
            interactionMessage.edit(messageOptions);
        }
    }
}