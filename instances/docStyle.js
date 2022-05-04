// Node modules
const path = require('path');
const fs = require('fs');

// Text Parser
const { toHTML } = require('discord-markdown');

// Browser interactions
const { getPageHeight, getPdfFile, mountDocument, getParagraphStyleProperty } = require(`.${path.sep}browser`);

// Page (A4 paper) height and width in pixels (96 dpi)
const PAGE_DEFAULT_HEIGHT = 1122.5;
const PAGE_DEFAULT_WIDTH =  793.5;

// Reset CSS string
const RESET_CSS = "/* http://meyerweb.com/eric/tools/css/reset/ v2.0 (public domain)*/html, body, div, span, applet, object, iframe,h1, h2, h3, h4, h5, h6, p, blockquote, pre,a, abbr, acronym, address, big, cite, code,del, dfn, img, ins, kbd, q, s, samp,small, strike, tt, var,b, u, i, center,dl, dt, dd, ol, ul, li,fieldset, form, label, legend,table, caption, tbody, tfoot, thead, tr, th, td,article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary,time, mark, audio, video {margin: 0;padding: 0;border: 0;font-size: 100%;font: inherit;vertical-align: baseline;}/* HTML5 display-role reset for older browsers */article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {display: block;}body {line-height: 1;}ol, ul {list-style: none;}blockquote, q {quotes: none;}blockquote:before, blockquote:after,q:before, q:after {content: '';content: none;}table {border-collapse: collapse;border-spacing: 0;}";

// Default html5 opening and closing tags
const OPENING_TAG_HTML = "<!DOCTYPE html><html><body>",
      CLOSING_TAG_HTML = "</body></html>";

// Default page and paragraph settings on CSS
const DEFAULT_PAGE = '.page{overflow-wrap: anywhere;}',
      DEFAULT_PARAGRAPH = '.paragraph{display: flex}',
      CUSTOM_FONTS = `@font-face{font-family: "Times New Roman";src: url("data:font/ttf;base64,${fs.readFileSync(`.${path.sep}fonts${path.sep}times.ttf`).toString('base64')}";}`;

// Page content instances
let pageInstances = [],
    currentInstance = 0;

module.exports = {

    style: {
        paddingTop: "2.5cm",
        paddingBottom: "2.5cm",
        paddingLeft: "3cm",
        paddingRight: "3cm",
        fontFamily: 'Times New Roman',
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
        paragraphFirstLineIndentation: "0cm"
    },

    async setStyleObjProperty(property, value){
        module.exports.style[property] = value;

        // If it's an invalid font family, sets it to "Times New Roman"
        if(property == "fontFamily"){
            await mountDocument(OPENING_TAG_HTML + '<div><div id="paragraphTest">test', 
                "#paragraphTest{" +
                    `font-family: ${value};` +
                "}"
            );
            module.exports.style[property] = await getParagraphStyleProperty("font-family", "Test");
        }
        
        return module.exports.style[property];
    },

    getStyleObjProperty(property){
        return module.exports.style[property];
    },

    docHtmlContent: null,
    docStyleContent: RESET_CSS + DEFAULT_PAGE + DEFAULT_PARAGRAPH + CUSTOM_FONTS,
    mounting: false,
    totalPages: 1,
    pageSelected: 1, 

    startMount(){

        const styleObject = module.exports.style;
        module.exports.docHtmlContent = (
            OPENING_TAG_HTML +   
            '<div class="page" id="page1" style="'+ 
                                                `padding: ${convertToPixels(styleObject.paddingTop)}px ${convertToPixels(styleObject.paddingRight)}px ${convertToPixels(styleObject.paddingBottom)}px ${convertToPixels(styleObject.paddingLeft)}px; ` +
                                                `min-height: ${PAGE_DEFAULT_HEIGHT - (convertToPixels(styleObject.paddingTop) + convertToPixels(styleObject.paddingBottom))}px; ` + 
                                                `max-width: ${PAGE_DEFAULT_WIDTH - (convertToPixels(styleObject.paddingRight) + convertToPixels(styleObject.paddingLeft))}px; ">`
        
        );
        module.exports.mounting = true;
        module.exports.totalPages = 1;
        pageInstances = [[module.exports.docHtmlContent, module.exports.totalPages]];
        currentInstance = 0;

    },

    async finishMount(){

        module.exports.mounting = false;
        return await getPdfFile(module.exports.docHtmlContent, module.exports.docStyleContent, module.exports.totalPages);

    },

    async addContent(textMessage, discordChannel){

        // Gets module properties for better reading
        const styleObject = module.exports.style,
              docStyleContent = module.exports.docStyleContent;
        let docHtmlContent = module.exports.docHtmlContent,
            totalPages = module.exports.totalPages;

        // Parses Discord's Markdown and HTML entities
        textMessage = toHTML(textMessage);
        
        // Turns text into an array
        textMessage = textMessage.split('');

        // Groups HTML tags and entities in single elements of the array
        let htmlTagsExist = !!textMessage.find(value => value == "<");
        if(htmlTagsExist){
            textMessage = groupHtmlElements("tags", textMessage);
        }
        let htmlEntitiesExist = !!textMessage.find(value => value == "&");
        if(htmlEntitiesExist){
            textMessage = groupHtmlElements("entities", textMessage);
        }

        // Adds paragraphs when there are consecutive line breaks
        textMessage = addParagraphs(textMessage);

        // Gets page height
        let currentPageHeight = await getPageHeight(docHtmlContent + textMessage.join('') + "</div>" + CLOSING_TAG_HTML, 
                                                    docStyleContent, totalPages);

        // Breaks pages if needed
        if (currentPageHeight > PAGE_DEFAULT_HEIGHT){

            // Warns user that this process may be slow
            const waitingMessage = await discordChannel.send("Hold on, this process can take several minutes...");

            let currentPageContent = textMessage, 
                nextPageContent = [], 
                nextPageHeight,
                contentLength, 
                contentBiggerThanPage = false,
                thereAreOpenTags = false, 
                closingTags = [], openingTags = [], i = 0;

            // Breaks text into pages
            while(currentPageHeight > PAGE_DEFAULT_HEIGHT && contentBiggerThanPage == false){

                // Closes tag on current page if it's closing tag went to the next page
                contentLength = currentPageContent.length;
                if(contentLength > 0){
                    if(currentPageContent[contentLength - 1].startsWith("<") && currentPageContent[contentLength - 1] != "<br>" && currentPageContent[contentLength - 1].includes("/")){
                        thereAreOpenTags = true;
                        closingTags.unshift(currentPageContent[contentLength - 1]);
                    } else if (currentPageContent[contentLength - 2].startsWith("<") && !currentPageContent[contentLength - 2].includes("/") && currentPageContent[contentLength - 2] != "<br>"){
                        nextPageContent.unshift(currentPageContent.pop());
                        closingTags.shift();
                        if(closingTags.length < 1){
                            thereAreOpenTags = false;
                        }
                    }
                }

                // Measures the new height of the current page
                nextPageContent.unshift(currentPageContent.pop());
                if(nextPageContent.indexOf(undefined) > -1){ 
                    contentBiggerThanPage = true;
                    continue;
                }
                currentPageHeight = await getPageHeight(docHtmlContent + 
                                                        currentPageContent.join('') + (thereAreOpenTags ? closingTags.join('') : "") + "</div>" + CLOSING_TAG_HTML,
                                                        docStyleContent, totalPages);
                // Goes to the next page if the current page height is valid
                if(currentPageHeight <= PAGE_DEFAULT_HEIGHT){
                    totalPages++;
                    docHtmlContent += (currentPageContent.join('') + (thereAreOpenTags ? closingTags.join('') : "") + 
                        `</div><div class="page" id="page${totalPages}" style="` + 
                                                                            `padding: ${convertToPixels(styleObject.paddingTop)}px ${convertToPixels(styleObject.paddingRight)}px ${convertToPixels(styleObject.paddingBottom)}px ${convertToPixels(styleObject.paddingLeft)}px; ` +
                                                                            `min-height: ${PAGE_DEFAULT_HEIGHT - (convertToPixels(styleObject.paddingTop) + convertToPixels(styleObject.paddingBottom))}px; ` + 
                                                                            `min-width: ${PAGE_DEFAULT_WIDTH - (convertToPixels(styleObject.paddingRight) + convertToPixels(styleObject.paddingLeft))}px; ">`
                    );
                
                    // Opens tags that were to close on the next page
                    if(thereAreOpenTags){
                        openingTags = closingTags.map(tag => {
                            if(tag.includes("div")){
                                return `<div class="paragraph" style="${mountParagraphStyle(module.exports.style, true)}">`;
                            }else{
                                tag = tag.split('');
                                tag.splice(1,1);
                                return tag.join('');
                            }
                        });
                        nextPageContent = openingTags.reverse().concat(nextPageContent);
                    }

                    // Checks if next page needs break and loops back in case it does
                    nextPageHeight = await getPageHeight(docHtmlContent + nextPageContent.join('') + "</div>" + CLOSING_TAG_HTML, 
                                                         docStyleContent, totalPages);
                    if(nextPageHeight > PAGE_DEFAULT_HEIGHT){
                        currentPageContent = nextPageContent;
                        nextPageContent = [];
                        currentPageHeight = nextPageHeight;
                    }
                    else{
                        docHtmlContent += nextPageContent.join('');
                    }
                }
            }

            // Throws error if content is too big to fit in a page
            if(contentBiggerThanPage){
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
            docHtmlContent += textMessage.join('');
        }

        // Updates the rest of the module and the document
        module.exports.docHtmlContent = docHtmlContent;
        module.exports.pageSelected = totalPages;
        if(pageInstances.length - 1 > currentInstance){
            pageInstances.splice(currentInstance + 1);
        }
        if(pageInstances.length == 20){
            pageInstances.shift();
        }else{
            currentInstance++;
        }
        pageInstances.push([docHtmlContent, totalPages]);
        await mountDocument(docHtmlContent, docStyleContent);
        
    },

    async undoAddition(){
        if(currentInstance > 0){
            currentInstance--;
            module.exports.docHtmlContent = pageInstances[currentInstance][0];
            module.exports.selectedPage = pageInstances[currentInstance][1];
            await mountDocument(module.exports.docHtmlContent, module.exports.docStyleContent);
            return true;
        }
        return false;
    },

    async redoAddition(){
        if(currentInstance != 19 && pageInstances.length > currentInstance + 1){
            currentInstance++;
            module.exports.docHtmlContent = pageInstances[currentInstance][0];
            module.exports.selectedPage = pageInstances[currentInstance][1];
            await mountDocument(module.exports.docHtmlContent, module.exports.docStyleContent);
            return true;
        }
        return false;
    },

    selectPage(page){
        module.exports.pageSelected = page;
    }
    
}

// Other functions
function mountParagraphStyle(styleObject, nextPage = false){

    let styleString = "";
    if(nextPage == false){
        styleString += `text-indent: ${module.exports.style.paragraphFirstLineIndentation}; `;
    }
    styleString += (
            `justify-content: ${module.exports.style.paragraphAlign == "justify" ? "space-between" : module.exports.style.paragraphAlign}; ` +
            `max-width: ${PAGE_DEFAULT_WIDTH - (convertToPixels(styleObject.paddingRight) + convertToPixels(styleObject.paddingLeft))}px;` +
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
    styleString += `line-height: ${styleObject.paragraphLinesHeight}; `;
    return styleString;
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

function addParagraphs(textSeparated){
    textSeparated.unshift(`<div class="paragraph" style="${mountParagraphStyle(module.exports.style)}">`);
    textSeparated.push("</div>");
    for(i = 0; i < textSeparated.length - 1; i++){
        if(i > 0 && 
           textSeparated[i] == "<br>" &&  
           textSeparated[i + 1] != "<br>"){
            textSeparated.splice(i + 1, 0, "</div>", `<div class="paragraph" style="${mountParagraphStyle(module.exports.style)}">`);
        }
    }
    return textSeparated;
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