
/**
 * @fileoverview This script contains functions that interact with the Chrome
 * extension APIs for managing and retrieving website tracking data from
 * local storage. It also sets up event listeners to track URL changes,
 * active tab changes, and Chrome window focus changes to update the stored data.
 *
 * NOTE: all code in this file has no automated tests.
 *
 * @author: Calvin Bullock
 * @date Date of creation: April, 2025
 */

// ADD_TO_FRONT_END_START

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
async function storeChromeLocalData(key, data) {
    chrome.storage.local.set({ [key]: data}, function() {
        if (chrome.runtime.lastError) {
            console.error('Error saving to local storage:', chrome.runtime.lastError);
        } else {
            console.log(`LOG - Stored: key: ${key}`);
            //console.log(`LOG - Stored: key: ${key}, value: ${data}`);
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
async function getChromeLocalData(key) {
    try {
        const result = await chrome.storage.local.get([key]);
        //console.log(`LOG - retrieve: key: ${key}, value: ${result[key]}`);
        console.log(`LOG - retrieve: key: ${key}`);
        return result[key];

    } catch (error) {
        console.error("Error retrieving data:", error);
        return undefined;
    }
}

/**
 * Retrieves site data from Chrome local storage.  If no data exists,
 * it creates a new tracking object.
 *
 * @async
 * @function getSiteObjData
 * @returns {Promise<any>} A Promise that resolves with the site data object.
 */
async function getSiteObjData() {
    let key = "siteData";
    let siteDataString = await getChromeLocalData(key);

    let siteDataObj = new UrlDataObj();

    // if the data exists parse it into siteDataObj
    if (siteDataString) {
        siteDataObj = siteDataObj.fromJSONString(siteDataString);
    }

    // check the obj is of the right type
    if (!(siteDataObj instanceof UrlDataObj)) {
        console.error( "Error: siteData is not instance of UrlDataObj - in getSiteObjData()",);
    }
    return siteDataObj;
}

/**
 * Stores site data to Chrome local storage.
 *
 * @async
 * @function setSiteObjData
 * @param {any} siteDataObj - The site data object to store.
 * @returns {Promise<void>} A Promise that resolves when the data is successfully stored.
 */
async function setSiteObjData(siteDataObj) {
    let key = "siteData";
    const siteDataString = siteDataObj.toJSONString();
    storeChromeLocalData(key, siteDataString);
}

// ADD_TO_FRONT_END_END

/**
 * Updates stored data for a given URL.
 *
 * This asynchronous function updates the stored data in Chrome's local storage for a given URL.
 * It retrieves the existing data, updates it, and then stores the updated data back.
 *
 * @param {string} newActiveUrl - The URL to update data for.
 * @returns {Promise<void>}  A Promise that resolves when the data has been successfully updated.
 * @param {Date} [currentTime=new Date()] - An optional Date object representing the starting time.
 */
// TODO: change name to update activeUrlSession?
async function updateStoredData(newActiveUrl, stopTracking) {
    let siteDataObj = await getSiteObjData();

    if (!(siteDataObj instanceof UrlDataObj)) {
        console.error("Error: siteData not instance of UrlDataObj - updateStoredData");
    }

    // exit session
    if (stopTracking) {
        siteDataObj.endSession();

    } else {
        siteDataObj.endSession();
        siteDataObj.startSession(newActiveUrl);
    }

    setSiteObjData(siteDataObj);
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
        updateStoredData(activeUrl, false);
        console.log("LOG - URL changed: " + activeUrl); // DEBUG:
    }
});

// get current URL on tab change
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        // handle tab errors
        if(chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError); // DEBUG:
            return;
        }

        // get url, then update siteList
        let activeUrl = cleanUrl(tab.url); // get new URL
        updateStoredData(activeUrl, false);
        console.log("LOG - Active Tab URL: ", activeUrl); // DEBUG:
    });
});

// chrome window leave, enter
chrome.windows.onFocusChanged.addListener(function(windowId) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        console.log("LOG - All Chrome windows are now unfocused.");
        updateStoredData("", true);

    } else {
        console.log(`LOG - Chrome window with ID ${windowId} is now focused.`);

        // When focused, query for the active tab in the currently focused window.
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs && tabs.length > 0) {
                const activeTab = tabs[0];
                const activeUrl = cleanUrl(activeTab.url);

                console.log("LOG - Active Tab URL on focus:", activeUrl);
                updateStoredData(activeUrl, false); // Start tracking the newly active URL
            } else {
                console.log("LOG - No active tab found in the newly focused window.");
            }
        });
    }
});



