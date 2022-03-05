// Node modules
const path = require('path');

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
    pdfContent: null,
    mounting: false,
    startMount(){
        const styleObj = module.exports.style;
        module.exports.pdfContent = (
            '<!DOCTYPE html>' +
            '<html>' +
                '<body>' +
                    '<div style=" ' +
                        `padding: ${styleObj.margin.top} ${styleObj.margin.right} ${styleObj.margin.bottom} ${styleObj.margin.left}; ` +
                        'overflow-wrap: anywhere;' +
                    '">'
        );
        module.exports.mounting = true;
    },
    async finishMount(){
        module.exports.pdfContent += (
                    "</div>" +
                "</body>" +
            "</html>");
        const { browser } = require(`.${path.sep}browser`);
        const finishedFile = await browser.newPage();
        finishedFile.setContent(module.exports.pdfContent);
        module.exports.mounting = false;
        return finishedFile;
    },
    addContent(content){

        // Adds style to the content
        const styleObj = module.exports.style;
        let newPdfContent = module.exports.pdfContent;
        let mountedStyle = mountStyle(styleObj);
        newPdfContent += "<span " + mountedStyle;

        // Adds line breaks
        content = content.replace(/(\n)/g,"<br>");

        // Finishes style
        newPdfContent += `${content}</span>`;
        if (styleObj.font.superscript) newPdfContent += "</sup>";
        if (styleObj.font.subscript) newPdfContent += "</sub>";
        module.exports.pdfContent = newPdfContent;
        
    },
    async getPreviewFile(){
        const { browser } = require(`.${path.sep}browser`);
        const previewFile = await browser.newPage();
        await previewFile.setContent(module.exports.pdfContent + 
                    "</div>" +
                "</body>" +
            "</html>");
        return previewFile;
    }
}

// Other functions
function mountStyle(styleObj){
    let styleString = ('style=" display: table; ' +
        `font-family: ${styleObj.font.family}; ` +
        `font-weight: ${styleObj.font.bold ? "bold; " : "normal; "}` +
        `${styleObj.font.italic ? "font-style: italic; " : ""}`
    );
    if(styleObj.font.dashed || styleObj.font.underline || styleObj.font.overline){
        styleString += "text-decoration:";
        if(styleObj.font.dashed){
            styleString += ` line-through${styleObj.font.dashed == "double" ? " double; " : "; "}`;
        }
        else{
            styleString += (
                (styleObj.font.underline ? " underline" : "") +
                (styleObj.font.overline ? " overline" : "") + "; "
            );
        }
    }
    styleString += (`font-size: ${styleObj.font.size}; ` +
                    `color: ${styleObj.font.color}; ` +
                    (styleObj.font.bgcolor ? `background-color: ${styleObj.font.bgcolor}; ` : "") +
                    `text-align: ${styleObj.paragraph.align}; ` +
                    `line-height: ${styleObj.paragraph.linesHeight}; ` +
                    `${styleObj.paragraph.firstLineIndentation ? `text-indent: ${styleObj.paragraph.firstLineIndentation};` : ""}` +
                    '">'
    );
    if (styleObj.font.superscript) styleString += "<sup>"
    if (styleObj.font.subscript) styleString += "<sub>"
    return styleString
}