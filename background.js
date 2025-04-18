
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
        console.log(`Key: ${key}, Value: ${data}`);
    });
}

/* ===================================================== *\
|| Retrieve data from to local                           ||
\* ===================================================== */
function retrieveData(key) {
    return chrome.storage.local.get([key]).then((result) => {
        console.log(`Key: ${key}, Value: ${result.key}`);
    });
}

/* ===================================================== *\
|| Update Data points in local storage                   ||
\* ===================================================== */
async function updateStoredData(activeUrl) {
    var key = "siteList"
    var siteList = await retrieveData(key);

    // data storage struc
    let newListItem = {
        url: activeUrl, // string
        lastAccses: "", // date TODO: this needs current date / time
        totalTime: 0,   // in hours
    }

    // create list if null
    if (!siteList) {
        siteList = [];
    }

    // update list
    siteList.push(newListItem);
    console.log(siteList)           // DEBUG:
    storeData(key, siteList);
}


/* ===================================================== *\
|| Extract the top level domain from the URL             ||
\* ===================================================== */
// TODO: maybe change this function name??
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

// EXAMPLE DATA
// let urlData = [
//     {
//         url: "google.com",
//         time: 60             // in minutes
//     },
//     {
//         url: "search.brave.com",
//         time: 60             // in minutes
//     },
// ];

// checking if the current tab URL / site has changed
chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        // get url, then update siteList
        let activeUrl = cleanUrl(changeInfo.url);
        updateStoredData(activeUrl);
        console.log("URL changed: " + activeUrl); // DEBUG:
    }
});

// get current URL on tab change
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        // handle tab errors
        if(chrome.runtime.lastError){
            console.error(chrome.runtime.lastError); // DEBUG:
            return;
        }

        // get url, then update siteList
        let activeUrl = cleanUrl(tab.url); // get new URL
        updateStoredData(activeUrl);
        console.log("Active Tab URL: ", activeUrl); // DEBUG:
    });
});

