// Node modules
const path = require('path');

// Text Parser
const { toHTML } = require('discord-markdown');

// Page (A4 paper) height in pixels (96 dpi)
const PAGE_DEFAULT_HEIGHT = 1122.5;

// Reset CSS string
const RESET_CSS = "/* http://meyerweb.com/eric/tools/css/reset/ v2.0 | 20110126License: none (public domain)*/html, body, div, span, applet, object, iframe,h1, h2, h3, h4, h5, h6, p, blockquote, pre,a, abbr, acronym, address, big, cite, code,del, dfn, em, img, ins, kbd, q, s, samp,small, strike, strong, sub, sup, tt, var,b, u, i, center,dl, dt, dd, ol, ul, li,fieldset, form, label, legend,table, caption, tbody, tfoot, thead, tr, th, td,article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary,time, mark, audio, video {margin: 0;padding: 0;border: 0;font-size: 100%;font: inherit;vertical-align: baseline;}/* HTML5 display-role reset for older browsers */article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {display: block;}body {line-height: 1;}ol, ul {list-style: none;}blockquote, q {quotes: none;}blockquote:before, blockquote:after,q:before, q:after {content: '';content: none;}table {border-collapse: collapse;border-spacing: 0;}";

module.exports = {
    style: {
        marginTop: "2.5cm",
        marginBottom: "2.5cm",
        marginLeft: "3cm",
        marginRight: "3cm",
        fontFamily: 'calibri',
        fontBold: false,
        fontItalic: false,
        fontDashed: false,
        fontUnderline: false,
        fontOverline: false,
        fontSuperscript: false,
        fontSubscript: false,
        fontSize: "11pt",
        fontColor: 'black',
        fontBgcolor: false,
        paragraphAlign: "right",
        paragraphLinesHeight: "0.5cm",
        paragraphFirstLineIndentation: false
    },
    pdfHtmlContent: null,
    pdfStyleContent: null,
    mounting: false,
    totalSpans: 0,
    totalPages: 1,
    pageSelected: 1, 
    startMount(){
        const styleObject = module.exports.style;
        module.exports.pdfHtmlContent = (
            '<!DOCTYPE html>' +
            '<html>' +
                '<body>' +
                    '<div class="page" id="page1">'
        );
        module.exports.pdfStyleContent = RESET_CSS + (
            '.page{' +
                `padding: ${convertToPixels(styleObject.marginTop)}px ${convertToPixels(styleObject.marginRight)}px ${convertToPixels(styleObject.marginBottom)}px ${convertToPixels(styleObject.marginLeft)}px;` +
                'overflow-wrap: anywhere;' +
                `min-height: ${PAGE_DEFAULT_HEIGHT - (convertToPixels(styleObject.marginTop) + convertToPixels(styleObject.marginBottom))}px;` +
            '}'
        )
        module.exports.mounting = true;
        module.exports.totalSpans = 0;
        module.exports.totalPages = 1;
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

            const waitingMessage = await discordChannel.send("Hold on, this process can take several minutes...");

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
                        module.exports.totalSpans++;
                        spanContent = mountSpan(styleObject, previousPageText.join(''));
                        module.exports.pdfStyleContent += addSpanStyle(styleObject);
                        module.exports.totalPages++;
                        module.exports.pdfHtmlContent += spanContent + `</div><div class="page" id="page${module.exports.totalPages}">`;
                        currentHeightIsHigher = false;
                    }
                }
                spanContent = mountSpan(styleObject, nextPageContent.join(''));
                currentPageHeight = await getPageHeight(styleObject,spanContent, testPage);
                if(currentPageHeight > PAGE_DEFAULT_HEIGHT){
                    currentHeightIsHigher = true;
                    previousPageText = nextPageContent;
                    nextPageContent = [];
                }
                else{
                    module.exports.totalSpans++;
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
            module.exports.totalSpans++;    
            spanContent = mountSpan(styleObject, textMessage);
        }

        // Adds the rest of the content
        module.exports.pdfStyleContent += addSpanStyle(styleObject);
        module.exports.pdfHtmlContent += spanContent;
        module.exports.selectPage(module.exports.totalPages);
        
    },
    async getPreviewPage(){
        const { browser } = require(`.${path.sep}browser`);
        const previewPdf = await browser.newPage();
        await previewPdf.setContent(module.exports.pdfHtmlContent + 
                    "</div>" +
                "</body>" +
            "</html>");
        await previewPdf.addStyleTag({content: module.exports.pdfStyleContent});
        const pageElement = await previewPdf.$(`#page${module.exports.pageSelected}`);
        pagePreview = await pageElement.screenshot();
        return pagePreview;
    },
    selectPage(pageNumber){
        module.exports.pageSelected = pageNumber;
    },
}

// Other functions
function addSpanStyle(styleObject){
    let styleString = (
        `#span${module.exports.totalSpans}{` +
            'display: flex;' +
            `font-family: ${styleObject.fontFamily}; ` +
            `font-weight: ${styleObject.fontBold ? "bold; " : "normal; "}` +
            `${styleObject.fontItalic ? "font-style: italic; " : ""}`
    );
    if(styleObject.fontDashed || styleObject.fontUnderline || styleObject.fontOverline){
        styleString += "text-decoration:";
        if(styleObject.fontDashed){
            styleString += ` line-through${styleObject.fontDashed == "double" ? " double; " : "; "}`;
        }
        else{
            styleString += (
                (styleObject.fontUnderline ? " underline" : "") +
                (styleObject.fontOverline ? " overline" : "") + "; "
            );
        }
    }
    styleString += (
            `font-size: ${styleObject.fontSize}; ` +
            `color: ${styleObject.fontColor}; ` +
            (styleObject.fontBgcolor ? `background-color: ${styleObject.fontBgcolor}; ` : "") +
            `text-align: ${styleObject.paragraphAlign}; `
    );

    if(styleObject.paragraphAlign == "right" || styleObject.paragraphAlign == "center"){
        styleString += "justify-content: " + (styleObject.paragraphAlign == "right" ? "flex-end; " : "center; ");
    }
    styleString += (
            `line-height: ${styleObject.paragraphLinesHeight}; ` +
            `${styleObject.paragraphFirstLineIndentation ? `text-indent: ${styleObject.paragraphFirstLineIndentation};` : ""}` +
        '}'
    );
    return styleString;
}

function mountSpan(styleObject, text){
    let mountedSpan = '';
    if (styleObject.fontSuperscript) mountedSpan += "<sup>";
    if (styleObject.fontSubscript) mountedSpan += "<sub>";
    mountedSpan = `<span id="span${module.exports.totalSpans}">${text}</span>`;
    if (styleObject.fontSuperscript) mountedSpan += "</sup>";
    if (styleObject.fontSubscript) mountedSpan += "</sub>";
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
    return await testPage.$eval(`#page${module.exports.totalPages}`, page => page.getBoundingClientRect().height);
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

    return Math.floor(numericalValue * conversionFactor * 100) / 100;
}