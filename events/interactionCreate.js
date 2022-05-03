// Node modules
const path = require('path');

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

        // Checks if interaction is a button press or a selection from a select menu
        if(!interaction.isButton() && !interaction.isSelectMenu()){
            return;
        }
        else{

            const { client } = require(`..${path.sep}instances${path.sep}client`);
            let interactionId = interaction.customId;

            toggleCommandExecution();
            await client.interactions.get(interactionId.split("_")[0]).execute(interaction);
            toggleCommandExecution();

            console.log(`[${new Date().toTimeString()}] Interaction finished execution.`);
        }
    }
}