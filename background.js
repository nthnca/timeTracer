
// ===================================================== \\
// ===================================================== \\
//                      Utilities
// ===================================================== \\
// ===================================================== \\

/* ===================================================== *\
|| Extract the top level domain from the URL             ||
\* ===================================================== */
function cleanUrl(url) {
    if (!url) {
        return null;
    }

    try {
        // remove all other gunk after target
        const urlObj = new URL(url);
        let baseUrl = urlObj.origin;

        // remove `https://`
        if (baseUrl.startsWith("https://")) {
            return baseUrl.substring(8)
        }

        return baseUrl;

    } catch (error) {
        console.error("Invalid URL:", url, error);
        return null;
    }
}

// ===================================================== \\
// ===================================================== \\
//                      Main Script
// ===================================================== \\
// ===================================================== \\


chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        console.log("URL changed: " + cleanUrl(changeInfo.url));
    }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    console.log(`Tab activated: Tab ID = ${activeInfo.tabId}`);

    chrome.tabs.get(activeInfo.tabId, function(tab){
        if(chrome.runtime.lastError){
            console.error(chrome.runtime.lastError);
            return;
        }
        console.log("Active Tab URL: ", cleanUrl(tab.url));
    });
});
