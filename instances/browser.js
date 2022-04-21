// Puppeteer library for headless browser
const puppeteer = require('puppeteer');

// Page (A4 paper) height and width in pixels (96 dpi)
const PAGE_DEFAULT_HEIGHT = 1122.5, PAGE_DEFAULT_WIDTH = 793.5;

// Instance
module.exports = {
    browser: null,
    document: null,

    async launchChromium(){
        module.exports.browser = await puppeteer.launch();
        module.exports.document = await module.exports.browser.newPage();
        await module.exports.document.exposeFunction("convertToPixels", convertToPixels);
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
    },

    async setPageMarginLength(pageId, marginDimension, value){
        await module.exports.document.$eval(`#page${pageId}`, async (page, marginDimension, value, PAGE_DEFAULT_HEIGHT, PAGE_DEFAULT_WIDTH) => {
            page.style[marginDimension] = await convertToPixels(value) + "px";
            switch(marginDimension){
                case "paddingTop":
                case "paddingBottom":
                    page.style.minHeight = PAGE_DEFAULT_HEIGHT - ((await convertToPixels(page.style.paddingTop) + await convertToPixels(page.style.paddingBottom))) + "px";
                    break;
                case "paddingRight":
                case "paddingLeft":
                    page.style.minWidth = PAGE_DEFAULT_WIDTH - ((await convertToPixels(page.style.paddingRight) + await convertToPixels(page.style.paddingLeft))) + "px";
                    break;
            }
        }, marginDimension, value, PAGE_DEFAULT_HEIGHT, PAGE_DEFAULT_WIDTH);
    }
}

// Other functions
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

