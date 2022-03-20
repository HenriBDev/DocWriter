// Node modules
const path = require('path');

// Text Parser
const { toHTML } = require('discord-markdown');

// Page (A4 paper) height in pixels (96 dpi)
const PAGE_DEFAULT_HEIGHT = 1123;

module.exports = {
    style: {
        padding: {
            top: "2.5cm",
            bottom: "2.5cm",
            left: "3cm",
            right: "3cm"
        },
        font: {
            family: 'calibri',
            bold: false,
            italic: false,
            dashed: false,
            underline: false,
            overline: false,
            superscript: false,
            subscript: false,
            size: "11pt",
            color: 'black',
            bgcolor: false
        },
        paragraph: {
            align: "left",
            linesHeight: "0.5cm",
            firstLineIndentation: false
        }
    },
    pdfHtmlContent: null,
    pdfStyleContent: null,
    mounting: false,
    spans: 0,
    pages: 1, 
    startMount(){
        const styleObject = module.exports.style;
        module.exports.pdfHtmlContent = (
            '<!DOCTYPE html>' +
            '<html>' +
                '<body>' +
                    '<div class="page" id="page1">'
        );
        module.exports.pdfStyleContent = (
            '.page{' +
                `padding: ${styleObject.padding.top} ${styleObject.padding.right} ${styleObject.padding.bottom} ${styleObject.padding.left};` +
                'overflow-wrap: anywhere;' +
                `min-height: ${PAGE_DEFAULT_HEIGHT - (convertToPixels(styleObject.padding.top) + convertToPixels(styleObject.padding.bottom))}px;` +
            '}'
        )
        module.exports.mounting = true;
        module.exports.spans = 0;
        module.exports.pages = 1;
    },
    async finishMount(){
        module.exports.pdfHtmlContent += (
                    "</div>" +
                "</body>" +
            "</html>"
        );
        const { browser } = require(`.${path.sep}browser`);
        const finishedFile = await browser.newPage();
        await finishedFile.setContent(module.exports.pdfHtmlContent);
        await finishedFile.addStyleTag({content: module.exports.pdfStyleContent});
        module.exports.mounting = false;
        return finishedFile;
    },
    async addContent(textMessage, discordChannel){

        // Parses Discord's Markdown and HTML entities
        textMessage = toHTML(textMessage);

        // Adds new span
        let spanContent;

        // Adds style of the content
        const styleObject = module.exports.style;

        // Breaks pages if needed
        const { browser } = require(`.${path.sep}browser`);
        const testPage = await browser.newPage();
        let currentPageHeight = await getPageHeight(styleObject, textMessage, testPage);
        if (currentPageHeight > PAGE_DEFAULT_HEIGHT){

            const waitingMessage = await discordChannel.send("Hold on, this might take a while...");

            let currentHeightIsHigher = true;
            let nextPageNeedsBreak = true;
            let nextPageContent = [];
            let previousPageText = textMessage.split('');

            let htmlTagsExist = !!previousPageText.find(value => value == "<");
            if(htmlTagsExist){
                previousPageText = groupHtmlElements("tags", previousPageText);
            }
            let htmlEntitiesExist = !!previousPageText.find(value => value == "&");
            if(htmlEntitiesExist){
                previousPageText = groupHtmlElements("entities", previousPageText);
            }

            while(nextPageNeedsBreak){
                while(currentHeightIsHigher){
                    nextPageContent.unshift(previousPageText.pop());
                    spanContent = mountSpan(styleObject, previousPageText.join(''));
                    currentPageHeight = await getPageHeight(styleObject, spanContent, testPage);
                    if(currentPageHeight <= PAGE_DEFAULT_HEIGHT){
                        module.exports.spans++;
                        spanContent = mountSpan(styleObject, previousPageText.join(''));
                        module.exports.pdfStyleContent += addSpanStyle(styleObject);
                        module.exports.pages++;
                        module.exports.pdfHtmlContent += spanContent + `</div><div class="page" id="page${module.exports.pages}">`;
                        currentHeightIsHigher = false;
                    }
                    console.log(previousPageText.length, nextPageContent.length);
                }
                spanContent = mountSpan(styleObject, nextPageContent.join(''));
                currentPageHeight = await getPageHeight(styleObject,spanContent, testPage);
                if(currentPageHeight > PAGE_DEFAULT_HEIGHT){
                    currentHeightIsHigher = true;
                    previousPageText = nextPageContent;
                    nextPageContent = [];
                }
                else{
                    module.exports.spans++;
                    spanContent = mountSpan(styleObject, nextPageContent.join(''));
                    nextPageNeedsBreak = false;
                }
            }

            // Tries to delete the waiting message if it's still there
            try{
                await waitingMessage.delete();
            }catch{}
        }
        else{  
            module.exports.spans++;    
            spanContent = mountSpan(styleObject, textMessage);
        }

        // Adds the rest of the content
        module.exports.pdfStyleContent += addSpanStyle(styleObject);
        module.exports.pdfHtmlContent += spanContent;
        
    },
    async getPreviewPages(){
        const { browser } = require(`.${path.sep}browser`);
        const previewPdf = await browser.newPage();
        await previewPdf.setContent(module.exports.pdfHtmlContent + 
                    "</div>" +
                "</body>" +
            "</html>");
        await previewPdf.addStyleTag({content: module.exports.pdfStyleContent});
        const pagesArray = await previewPdf.$$(".page");
        return pagesArray;
    }
}

// Other functions
function addSpanStyle(styleObject){
    let styleString = (
        `#span${module.exports.spans}{` +
            'display: table;' +
            `font-family: ${styleObject.font.family}; ` +
            `font-weight: ${styleObject.font.bold ? "bold; " : "normal; "}` +
            `${styleObject.font.italic ? "font-style: italic; " : ""}`
    );
    if(styleObject.font.dashed || styleObject.font.underline || styleObject.font.overline){
        styleString += "text-decoration:";
        if(styleObject.font.dashed){
            styleString += ` line-through${styleObject.font.dashed == "double" ? " double; " : "; "}`;
        }
        else{
            styleString += (
                (styleObject.font.underline ? " underline" : "") +
                (styleObject.font.overline ? " overline" : "") + "; "
            );
        }
    }
    styleString += (
            `font-size: ${styleObject.font.size}; ` +
            `color: ${styleObject.font.color}; ` +
            (styleObject.font.bgcolor ? `background-color: ${styleObject.font.bgcolor}; ` : "") +
            `text-align: ${styleObject.paragraph.align}; ` +
            `line-height: ${styleObject.paragraph.linesHeight}; ` +
            `${styleObject.paragraph.firstLineIndentation ? `text-indent: ${styleObject.paragraph.firstLineIndentation};` : ""}` +
        '}'
    );
    return styleString;
}

function mountSpan(styleObject, text){
    let mountedSpan = '';
    if (styleObject.font.superscript) mountedSpan += "<sup>";
    if (styleObject.font.subscript) mountedSpan += "<sub>";
    mountedSpan = `<span id="span${module.exports.spans}">${text}</span>`;
    if (styleObject.font.superscript) mountedSpan += "</sup>";
    if (styleObject.font.subscript) mountedSpan += "</sub>";
    return mountedSpan;
}

async function getPageHeight(styleObject, textMessage, testPage){
    let mountedSpan = mountSpan(styleObject, textMessage);
    await testPage.setContent(module.exports.pdfHtmlContent + mountedSpan +
                "</div>" +
            "</body>" +
        "</html>"
    );
    await testPage.addStyleTag({content: module.exports.pdfStyleContent});
    return await testPage.$eval(`#span${module.exports.spans}`, spanContent => spanContent.closest(".page").clientHeight);
}

function groupHtmlElements(elementType, text){
    tagsAreSeparated = true;
    let tagLength = 0;
    while(tagsAreSeparated){
        let tagStartIndex;
        tagStartIndex = text.findIndex(value => value == (elementType == "tags" ? "<" : "&"));
        if(tagStartIndex != -1){
            let tagEndIndex;
            tagEndIndex = text.findIndex(value => value == (elementType == "tags" ? ">" : ";"));
            for(var currentIndex = tagStartIndex + 1; currentIndex <= tagEndIndex; currentIndex++){
                text[tagStartIndex] += text[currentIndex]
                tagLength++;
            }
            text.splice(tagStartIndex + 1, tagLength);
            tagLength = 0;
        }else{
            tagsAreSeparated = false;
        }
    }
    return text
}

function convertToPixels(value){
    const unitStartIndex = value.search(/[a-z]/);
    const unit = value.substring(unitStartIndex);
    const numericalValue = parseFloat(value.substring(0, unitStartIndex));
    let conversionFactor = 1;

    switch(unit){
        case "mm":
            conversionFactor = 3.7795275591;
            break;
        case "cm":
            conversionFactor = 37.795275591;
            break;
        case "pt":
            conversionFactor = 1.3;
            break;
        case "pc":
            conversionFactor = 16;
            break;
        case "in":
            conversionFactor = 96;
            break;
    }

    return Math.round(numericalValue * conversionFactor * 10) / 10;
}