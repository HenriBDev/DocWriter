// Node modules
const path = require('path');

// Text Parser
const { toHTML } = require('discord-markdown');

module.exports = {
    style: {
        margin: {
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
            align: "justify",
            linesHeight: "0.5cm",
            firstLineIndentation: false
        }
    },
    pdfHtmlContent: null,
    pdfStyleContent: null,
    mounting: false,
    spans: 0,
    startMount(){
        const styleObject = module.exports.style;
        module.exports.pdfHtmlContent = (
            '<!DOCTYPE html>' +
            '<html>' +
                '<body>' +
                    '<div class="page">'
        );
        module.exports.pdfStyleContent = (
            '.page{' +
                `padding: ${styleObject.margin.top} ${styleObject.margin.right} ${styleObject.margin.bottom} ${styleObject.margin.left};` +
                'overflow-wrap: anywhere;' +
            '}'
        )
        module.exports.mounting = true;
    },
    async finishMount(){
        module.exports.pdfHtmlContent += (
                    "</div>" +
                "</body>" +
            "</html>");
        const { browser } = require(`.${path.sep}browser`);
        const finishedFile = await browser.newPage();
        await finishedFile.setContent(module.exports.pdfHtmlContent);
        await finishedFile.addStyleTag({content: module.exports.pdfStyleContent});
        module.exports.mounting = false;
        return finishedFile;
    },
    addContent(textMessage){

        // Parses Discord's Markdown and HTML entities
        textMessage = toHTML(textMessage);

        // Adds new span
        module.exports.spans++;
        const currentSpan = module.exports.spans;
        let spanContent = "";

        // Adds style of the content
        const styleObject = module.exports.style;
        module.exports.pdfStyleContent += mountStyle(styleObject, currentSpan);

        // Mounts span
        if (styleObject.font.superscript) spanContent += "<sup>";
        if (styleObject.font.subscript) spanContent += "<sub>";
        spanContent = `<span id="span${module.exports.spans}">${textMessage}</span>`;
        if (styleObject.font.superscript) spanContent += "</sup>";
        if (styleObject.font.subscript) spanContent += "</sub>";
        module.exports.pdfHtmlContent += spanContent;
        
    },
    async getPreviewFile(){
        const { browser } = require(`.${path.sep}browser`);
        const previewFile = await browser.newPage();
        await previewFile.setContent(module.exports.pdfHtmlContent + 
                    "</div>" +
                "</body>" +
            "</html>");
        await previewFile.addStyleTag({content: module.exports.pdfStyleContent});
        return previewFile;
    }
}

// Other functions
function mountStyle(styleObject, currentSpan){
    let styleString = (
        `#span${currentSpan}{` +
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