// Puppeteer library for headless browser
const puppeteer = require('puppeteer');

// Instance
module.exports = {
    browser: null,
    document: null,

    async launchChromium(){
        module.exports.browser = await puppeteer.launch();
        module.exports.document = await module.exports.browser.newPage();
    },

    async getPageHeight(htmlContent, styleContent, pageNumber){
        await module.exports.mountDocument(htmlContent, styleContent);
        return await module.exports.document.$eval(`#page${pageNumber}`, page => page.getBoundingClientRect().height);
    },

    async getPagePreview(pageNumber){
        const pageSelected = await module.exports.document.$(`#page${pageNumber}`);
        return await pageSelected.screenshot();
    },

    async getPdfFile(htmlContent, styleContent, totalPages){
        await module.exports.mountDocument(htmlContent, styleContent);
        return await module.exports.document.pdf({format: "A4", pageRanges: `1-${totalPages}`});
    },

    async mountDocument(htmlContent, styleContent){
        await module.exports.document.setContent(htmlContent + "</div></body></html>");
        await module.exports.document.addStyleTag({content: styleContent});
    },

    async getSpanStyleProperty(property, spanId){
        return await module.exports.document.$eval(`#span${spanId}`, (testText, property) => {
            let propertyValue = window.getComputedStyle(testText).getPropertyValue(property);
            if(property == "font-family"){
                let fontSize = window.getComputedStyle(testText).getPropertyValue("font-size");
                if(!document.fonts.check(`${fontSize} ${propertyValue}`)){
                    propertyValue = "Times New Roman";
                    testText.style['font-family'] = propertyValue;
                }
            }
            return propertyValue;
        }, property);
    }
}