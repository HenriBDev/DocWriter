// Node modules
const path = require('path');

// Text Parser
const { toHTML } = require('discord-markdown');

// Browser interactions
const { getPageHeight, getPdfFile, mountDocument, getSpanStyleProperty } = require(`.${path.sep}browser`);

// Page (A4 paper) height in pixels (96 dpi)
const PAGE_DEFAULT_HEIGHT = 1122.5;

// Reset CSS string
const RESET_CSS = "/* http://meyerweb.com/eric/tools/css/reset/ v2.0 (public domain)*/html, body, div, span, applet, object, iframe,h1, h2, h3, h4, h5, h6, p, blockquote, pre,a, abbr, acronym, address, big, cite, code,del, dfn, img, ins, kbd, q, s, samp,small, strike, tt, var,b, u, i, center,dl, dt, dd, ol, ul, li,fieldset, form, label, legend,table, caption, tbody, tfoot, thead, tr, th, td,article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary,time, mark, audio, video {margin: 0;padding: 0;border: 0;font-size: 100%;font: inherit;vertical-align: baseline;}/* HTML5 display-role reset for older browsers */article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {display: block;}body {line-height: 1;}ol, ul {list-style: none;}blockquote, q {quotes: none;}blockquote:before, blockquote:after,q:before, q:after {content: '';content: none;}table {border-collapse: collapse;border-spacing: 0;}";

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
        fontBgColor: false,
        paragraphAlign: "left",
        paragraphLinesHeight: "0.5cm",
        paragraphFirstLineIndentation: false
    },

    async setStyleObjProperty(property, value){
        module.exports.style[property] = value;

        // If it's an invalid font family, sets it to "Times New Roman"
        if(property == "fontFamily"){
            await mountDocument(module.exports.pdfHtmlContent + '<span id="spanTest">test</span>', 
                "#spanTest{" +
                    `font-family: ${value};` +
                "}"
            );
            module.exports.style[property] = await getSpanStyleProperty("font-family", "Test");
        }
        
        return module.exports.style[property];
    },

    getStyleObjProperty(property){
        return module.exports.style[property];
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

        module.exports.mounting = false;
        return await getPdfFile(module.exports.pdfHtmlContent, module.exports.pdfStyleContent, module.exports.totalPages);

    },

    async addContent(textMessage, discordChannel){

        // Parses Discord's Markdown and HTML entities
        textMessage = toHTML(textMessage);

        // Gets module properties for better reading
        const styleObject = module.exports.style;
        let pdfHtmlContent = module.exports.pdfHtmlContent, 
            pdfStyleContent = module.exports.pdfStyleContent, 
            totalSpans = module.exports.totalSpans,
            totalPages = module.exports.totalPages;

        // Gets page height
        let currentPageHeight = await getPageHeight(pdfHtmlContent + mountSpan(styleObject, textMessage, totalSpans), 
                                                    pdfStyleContent + mountSpanStyle(styleObject, totalSpans),
                                                    totalPages);

        // Breaks pages if needed
        if (currentPageHeight > PAGE_DEFAULT_HEIGHT){

            // Warns user that this process may be slow
            const waitingMessage = await discordChannel.send("Hold on, this process can take several minutes...");

            let nextPageNeedsBreak = true, currentPageContent = textMessage.split(''), nextPageContent = [], nextPageHeight, contentIsTooBig = false;

            // Groups HTML tags and entities in single elements of the array
            let htmlTagsExist = !!currentPageContent.find(value => value == "<");
            if(htmlTagsExist){
                currentPageContent = groupHtmlElements("tags", currentPageContent);
            }
            let htmlEntitiesExist = !!currentPageContent.find(value => value == "&");
            if(htmlEntitiesExist){
                currentPageContent = groupHtmlElements("entities", currentPageContent);
            }

            // Breaks text into pages
            while(nextPageNeedsBreak && contentIsTooBig == false){

                // Breaks current page
                while(currentPageHeight > PAGE_DEFAULT_HEIGHT && contentIsTooBig == false){
                    nextPageContent.unshift(currentPageContent.pop());
                    if(nextPageContent.indexOf(undefined) > -1){ 
                        contentIsTooBig = true;
                        continue;
                    }
                    currentPageHeight = await getPageHeight(pdfHtmlContent + mountSpan(styleObject, currentPageContent.join(''), totalSpans), 
                                                            pdfStyleContent + mountSpanStyle(styleObject, totalSpans),
                                                            totalPages);
                    if(currentPageHeight <= PAGE_DEFAULT_HEIGHT){
                        totalSpans++;
                        pdfStyleContent += mountSpanStyle(styleObject, totalSpans);
                        totalPages++;
                        pdfHtmlContent += mountSpan(styleObject, currentPageContent.join(''), totalSpans) + `</div><div class="page" id="page${totalPages}">`;
                    }
                }

                // If the content is not bigger than the page size continue the page breaking
                if(contentIsTooBig == false){

                    // Checks if next page needs break and loops back in case it does
                    nextPageHeight = await getPageHeight(pdfHtmlContent + mountSpan(styleObject, nextPageContent.join(''), totalSpans), 
                                                         pdfStyleContent + mountSpanStyle(styleObject, totalSpans),
                                                         totalPages);
                    if(nextPageHeight > PAGE_DEFAULT_HEIGHT){
                        currentPageContent = nextPageContent;
                        nextPageContent = [];
                    }
                    else{
                        totalSpans++;
                        pdfHtmlContent += mountSpan(styleObject, nextPageContent.join(''), totalSpans);
                        pdfStyleContent += mountSpanStyle(styleObject, totalSpans);
                        nextPageNeedsBreak = false;
                    }
                }
            }

            // Throws error if content is too big to fit in any page
            if(contentIsTooBig){
                await discordChannel.send("An error has occured: the content added was too big to fit on the page.");
            }

            // Updates number of pages
            module.exports.totalPages = totalPages;

            // Tries to delete the waiting message if it's still there
            try{
                await waitingMessage.delete();
            }catch{}
        }
        else{  
            totalSpans++;    
            pdfHtmlContent += mountSpan(styleObject, textMessage, totalSpans);
            pdfStyleContent += mountSpanStyle(styleObject, totalSpans);
        }

        // Updates the rest of the module and the document
        module.exports.pdfStyleContent = pdfStyleContent;
        module.exports.pdfHtmlContent = pdfHtmlContent;
        module.exports.totalSpans = totalSpans;
        module.exports.selectPage(totalPages);
        await mountDocument(pdfHtmlContent, pdfStyleContent);
        
    },

    selectPage(pageNumber){
        module.exports.pageSelected = pageNumber;
    },
}

// Other functions
function mountSpanStyle(styleObject, spanId){

    let styleString = (
        `#span${spanId}{` +
            'display: flex;' +
            `font-family: ${styleObject.fontFamily}; ` +
            `font-weight: ${styleObject.fontBold ? "bold; " : "normal; "}` +
            `${styleObject.fontItalic ? "font-style: italic; " : ""}`
    );
    if(styleObject.fontDashed || styleObject.fontUnderline || styleObject.fontOverline){
        styleString += "text-decoration:";
        styleString += (
            (styleObject.fontUnderline ? " underline" : "") +
            (styleObject.fontOverline ? " overline" : "")
        );
        if(styleObject.fontDashed){
            styleString += ` line-through${styleObject.fontDashed == "double" ? " double; " : ""}`;
        }
        styleString += ";";
    }
    styleString += (
            `font-size: ${styleObject.fontSize}; ` +
            `color: ${styleObject.fontColor}; ` +
            (styleObject.fontBgColor ? `background-color: ${styleObject.fontBgColor}; ` : "") +
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

function mountSpan(styleObject, spanText, spanId){

    let mountedSpan = `<span id="span${spanId}">`;
    if (styleObject.fontSuperscript) mountedSpan += "<sup>";
    if (styleObject.fontSubscript) mountedSpan += "<sub>";
    mountedSpan += spanText;
    if (styleObject.fontSuperscript) mountedSpan += "</sup>";
    if (styleObject.fontSubscript) mountedSpan += "</sub>";
    mountedSpan += "</span>";

    return mountedSpan;
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