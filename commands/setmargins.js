// Node modules
const path = require('path');

// pdfStyle methods
const { setStyleObjProperty, getStyleObjProperty, startMount } = require(`..${path.sep}instances${path.sep}pdfStyle`);

// browser methods
const { setPageMarginLength, mountDocument } = require(`..${path.sep}instances${path.sep}browser`);

module.exports = {
    data: {
        name: 'setmargins',
        params: ['<margin_top/.>','<margin_right/.>','<margin_bottom/.>','<margin_left/.>'],
        description: "Changes the margin measurements (use `.` if you don't want to change, example: `pdf|setmargins . . 3 .` -> will set margin-bottom to 3cm)"
    },
    async execute(messageSent, parameters){

		// Gets the discord message's data
        const currentChannel = messageSent.channel; 

        // Verifies if sender chose correctly (positive number) the new length
        if(!parameters || parameters.length < 4){
            return await currentChannel.send("Please select new margin lengths!");
        }else{
            let marginDimension;
            // Checks if a document is already in the making
		    const { mounting } = require(`..${path.sep}instances${path.sep}pdfStyle`);
		    if(!mounting){
			    startMount();
                const { pdfHtmlContent, pdfStyleContent } = require(`..${path.sep}instances${path.sep}pdfStyle`);
                mountDocument(pdfHtmlContent, pdfStyleContent);
		    }
            // Gets last span added
            const { totalPages } = require(`..${path.sep}instances${path.sep}pdfStyle`);
            for(let i = 0; i < 4; i++){
                if(parameters[i] != "." && Number(parameters[i].replace(/,/g, '.')) <= 0){
                    return await currentChannel.send("Please select valid lengths!");
                }else{
                    if (parameters[i] != "."){
                        switch(i){
                            case 0:
                                marginDimension = "paddingTop";
                                break;
                            case 1:
                                marginDimension = "paddingRight";
                                break;
                            case 2:
                                marginDimension = "paddingBottom";
                                break;
                            case 3:
                                marginDimension = "paddingLeft";
                                break;
                        }
                        // Sets new margin length
                        setStyleObjProperty(marginDimension, parameters[i].replace(/,/g, '.') + "cm");
                        await setPageMarginLength(totalPages, marginDimension, parameters[i].replace(/,/g, '.') + "cm");
                    }
                }
            }
            return await currentChannel.send("Current margin dimensions' length:\n\n" + 
                                             `Margin-top: **${getStyleObjProperty("paddingTop")}**\n` +
                                             `Margin-right: **${getStyleObjProperty("paddingRight")}**\n` + 
                                             `Margin-bottom: **${getStyleObjProperty("paddingBottom")}**\n` + 
                                             `Margin-left: **${getStyleObjProperty("paddingLeft")}**\n` 
            );
        }
    }
}