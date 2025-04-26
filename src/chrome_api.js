
// ==================================================== \\
// ==================================================== \\
// functions dependent on chrome API                    \\
// ==================================================== \\
// ==================================================== \\

/**
 * Stores data in Chrome's local storage.
 *
 * This function saves the provided data under the specified key in Chrome's local storage.
 * It handles potential errors during the storage process and logs the outcome.
 *
 * @param {string} key - The key under which to store the data.
 * @param {any} data - The data to be stored.  This can be any JavaScript object that is serializable.
 */
function storeData(key, data) {
    chrome.storage.local.set({ [key]: data }, function() {
        if (chrome.runtime.lastError) {
            console.error('Error saving to local storage:', chrome.runtime.lastError);
        } else {
            console.log(`Stored - key: ${key}, value: ${JSON.stringify(data)}`);
        }
    });
}

/**
 * Retrieves data from Chrome's local storage.
 *
 * This asynchronous function retrieves data from Chrome's local storage using the provided key.
 * It handles potential errors during retrieval and returns the data or undefined if an error occurs.
 *
 * @param {string} key - The key of the data to retrieve.
 * @returns {Promise<any | undefined>} A Promise that resolves with the retrieved data, or undefined if an error occurred.
 */
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

/**
 * Updates stored data for a given URL.
 *
 * This asynchronous function updates the stored data in Chrome's local storage for a given URL.
 * It retrieves the existing data, updates it, and then stores the updated data back.
 *
 * @param {string} activeUrl - The URL to update data for.
 * @returns {Promise<void>}  A Promise that resolves when the data has been successfully updated.
 */
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
            startDate: "", // date TODO: this needs current date / time
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
        let itemDate = item.startDate;
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



