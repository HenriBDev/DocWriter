// Event
module.exports = {
    eventType: "once",
    name: 'ready',
    async execute(){
        console.log(`[${new Date().toTimeString()}] Bot is running.`); 
    }
}