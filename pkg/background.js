
// TODO: remove all `// DEBUG:` log statements


// ===================================================== \\
// ===================================================== \\
//                      Utilities
// ===================================================== \\
// ===================================================== \\

/* ===================================================== *\
|| search the data for a target url                      ||
||      return index (-1 if not found)
\* ===================================================== */
function searchDataUrls(targetUrl, dataList) {
    for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].url === targetUrl) {
            return i;
        }
    };
    return -1;
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
            return baseUrl.substring(8);
        }

        return baseUrl;

    } catch (error) {
        console.error("Invalid URL:", url, error);
        return null;
    }
}

/* ===================================================== *\
|| calculates the time in milliseconds between           ||
||      useStartDate and the current time.               ||
||  NOTE: no tests
\* ===================================================== */
function calcTimeElapsed(useStartDate) {
    let currDate = new Date();
    console.log(currDate - useStartDate);
    return currDate - useStartDate ;
}

// ==================================================== \\
// ==================================================== \\
// functions dependent on chrome API                    \\
// ==================================================== \\
// ==================================================== \\

/* ===================================================== *\
|| Store data to local                                   ||
\* ===================================================== */
function storeData(key, data) {
    chrome.storage.local.set({ [key]: data }, function() {
        if (chrome.runtime.lastError) {
            console.error('Error saving to local storage:', chrome.runtime.lastError);
        } else {
            console.log(`Stored - key: ${key}, value: ${JSON.stringify(data)}`);
        }
    });
}

/* ===================================================== *\
|| Retrieve data from to local                           ||
\* ===================================================== */
async function getData(key) {
    try {
        const result = await chrome.storage.local.get([key]);
        console.log(`retrieve - key: ${key}, value: ${result[key]}`);
        return result[key];
    } catch (error) {
        console.error("Error retrieving data:", error);
        return undefined;
    }
}

/* ===================================================== *\
|| Update Data points in local storage                   ||
\* ===================================================== */
async function updateStoredData(activeUrl) {
    let key = "siteList"
    let siteList = await getData(key);

    // create list if null
    if (!siteList) {
        siteList = [];
    }

    // find urls index in list
    let urlIndex = searchDataUrls(activeUrl, siteList);

    // if not in list
    if (urlIndex == -1) {

        // data storage struc
        let newListItem = {
            url: activeUrl, // string
            enterDate: "", // date TODO: this needs current date / time
            totalTime: 0,   // in hours
        }

        // update list
        siteList.push(newListItem);
        console.log(siteList);           // DEBUG:
        storeData(key, siteList);
    } else { // if in list
        let item = siteList[urlIndex];
        // TODO: handle time increment and other bits

        // calc usage time
        let currDate = new Date();
        let itemDate = item.enterDate;
        let timeDiff = currDate.getTime() - itemDate.getTime();
        console.log(timeDiff);
    }
}

// ===================================================== \\
// ===================================================== \\
//              Chromium API Event Listeners             \\
// ===================================================== \\
// ===================================================== \\

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

// chrome window leave, enter
chrome.windows.onFocusChanged.addListener(function(windowId) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        console.log("All Chrome windows are now unfocused.");
        // Your logic for when Chrome is unfocused

    } else {
        console.log(`Chrome window with ID ${windowId} is now focused.`);
        // Your logic for when a Chrome window is focused
    }
});



