// Node modules
const path = require('path')

// Discord.js' select menu
const { MessageSelectMenu } = require('discord.js');

// pdfStyle methods
const { selectPage } = require(`..${path.sep}instances${path.sep}docStyle`);

// Browser interactions
const { getPagePreview } = require(`..${path.sep}instances${path.sep}browser`);

// Client interaction execution toogle
const { toggleCommandExecution } = require(`..${path.sep}instances${path.sep}client`);

// Event
module.exports = {
    eventType: "on",
    name: 'interactionCreate',
    async execute(interaction){

        // Delays interaction answer to prevent the "This interaction failed" error
        interaction.deferUpdate();

        // Check if there is another command/interaction in execution
        const { executingCommand } = require(`..${path.sep}instances${path.sep}client`);
        if (executingCommand) return

        // Checks if interaction is with a button or the select menu
        if(!interaction.isButton() && !interaction.isSelectMenu()){
            return;
        }
        else{

            toggleCommandExecution();

            let interactionMessage, newPageSelection, messageOptions = {};

            // Gets current number of pages and which one is selected
            const { totalPages, pageSelected } = require(`..${path.sep}instances${path.sep}docStyle`);
		   
            // Gets message with the preview image
            await interaction.channel.messages.fetch().then(channelMessages => {
                interactionMessage = channelMessages.filter(message => message.author.id == interaction.client.user.id).at(0);
            })

            // Changes page according to the type of interaction
            if(interaction.isButton()){
                newPageSelection = parseInt(pageSelected) + (interaction.customId == "forward_button" ? 1 : -1);
            }
            else{
                newPageSelection = interaction.values[0];
            }

            // Checks if new page is valid
            if(newPageSelection > 0 && newPageSelection <= totalPages){

                // Creates select menu
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
            // If new page isn't valid just keep the same page
            else{
                newPageSelection = pageSelected;
            }
            selectPage(newPageSelection);

            // Creates preview file and responds interaction
            const previewFile = await getPagePreview(newPageSelection);
            messageOptions.files = [{
                name: "preview.png",
                attachment: previewFile
            }];
            interactionMessage.edit(messageOptions);
            toggleCommandExecution();
            console.log(`[${new Date().toTimeString()}] Interaction finished execution.`);
        }
    }
}