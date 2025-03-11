
// TODO: remove all `// DEBUG:` log statements


// ===================================================== \\
// ===================================================== \\
//                      Utilities
// ===================================================== \\
// ===================================================== \\

/* ===================================================== *\
|| Store data to local                                   ||
\* ===================================================== */
function storeData(key, data) {
    chrome.storage.local.set({ [key]: data }).then(() => {
        console.log("Value is set");
    });
}

/* ===================================================== *\
|| Retrieve data from to local                           ||
\* ===================================================== */
function retrieveData(key) {
    return chrome.storage.local.get([key]).then((result) => {
        console.log("Value is " + result.key);
    });
}

/* ===================================================== *\
|| Update Data points in local storage                   ||
\* ===================================================== */
function updateStoredData(url) {

}


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

let urlData = [
    {
        url: "google.com",
        time: 60             // in minutes
    },
    {
        url: "search.brave.com",
        time: 60             // in minutes
    },
];

let activeUrl = null;

chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        activeUrl = cleanUrl(changeInfo.url);
        console.log("URL changed: " + activeUrl); // DEBUG:
    }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        // handle tab errors
        if(chrome.runtime.lastError){
            console.error(chrome.runtime.lastError); // DEBUG:
            return;
        }

        activeUrl = cleanUrl(changeInfo.url);
        console.log("Active Tab URL: ", activeUrl); // DEBUG:
    });
});

let dataPoint = {
    url: activeUrl, // string
    lastAccses: "", // date TODO: this needs current date / time
    totalTime: 0,   // in hours
}

updateStoredData(dataPoint);



