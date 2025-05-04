
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
    chrome.storage.local.set({ [key]: JSON.stringify(data)}, function() {
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
async function getChromeLocalData(key) {
    try {
        const result = await chrome.storage.local.get([key]);
        console.log(`retrieve - key: ${key}, value: ${result[key]}`);
        return JSON.parse(result[key]);
    } catch (error) {
        console.error("Error retrieving data:", error);
        return undefined;
    }
}

/**
 * Asynchronously retrieves the list of tracked websites from Chrome's local storage.
 *
 * @async
 * @returns {Promise<Array<object>|null|undefined>} - A Promise that resolves with the stored array of website objects,
 * or null/undefined if no data is found for the specified key. Each website object
 * is expected to have properties like 'url', 'startDate', 'totalTime', and 'isActive'.
 */
async function getSiteList() {
  let key = "siteList";
  return getChromeLocalData(key);
}

/**
 * Asynchronously stores the provided list of tracked websites in Chrome's local storage.
 *
 * @async
 * @param {Array<object>} siteList - An array of website objects to store.
 * Each website object is expected to have properties like 'url', 'startDate', 'totalTime', and 'isActive'.
 * @returns {Promise<void>} - A Promise that resolves when the site list is successfully stored.
 */
async function setSiteList(siteList) {
  let key = "siteList";
  storeChromeLocalData(key, siteList);
}
/**
 * Asynchronously sets the index of the currently active URL in local storage.
 *
 * @async
 * @param {number} activeUrlIndex - The index of the currently active URL to store.
 * @returns {Promise<void>} - A Promise that resolves when the active URL index is successfully stored.
 */
async function setActiveUrlIndex(activeUrlIndex) {
  let key = "activeSiteIndex";
  storeChromeLocalData(key, activeUrlIndex);
}

/**
 * Asynchronously retrieves the index of the currently active URL from local storage.
 *
 * @async
 * @returns {Promise<number|null|undefined>} - A Promise that resolves with the stored active URL index,
 * or null/undefined if no data is found for the key.
 */
async function getActiveUrlIndex() {
  let key = "activeSiteIndex";
  return getChromeLocalData(key);
}

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
async function updateStoredData(newActiveUrl, stopTracking, currentTime = new Date()) {
    let key = "siteList";
    let siteList = await getChromeLocalData(key); // TODO: swap this to getSiteList
    

    // create list if null
    // TODO: add a log here to track this
    if (!siteList) {
        siteList = [];
    }

    // exit session
    if (stopTracking) {
        //let activeUrlIndex = searchDataUrls(activeUrl??, siteList);
        endAndRecordSession(siteList, activeUrlIndex);

    } else { // start new session / update url of active session
        // find urls index in list
        let newUrlIndex = searchDataUrls(newActiveUrl, siteList);

        // if not in list
        if (newUrlIndex == -1) {
            // data storage struc
            let newListItem = {
                url: newActiveUrl,
                startDate: currentTime.toISOString(),
                totalTime: 0,
                isActive: true,
            };

            // update list
            siteList.push(newListItem);
            setActiveUrlIndex(siteList.length - 1);

        } else { // if in list
            endAndRecordSession(siteList, await getActiveUrlIndex());
            startTrackingSession(siteList, newUrlIndex);
        }
    }

    storeChromeLocalData(key, siteList); // TODO: change this to setSiteList
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
        console.log("URL changed: " + activeUrl); // DEBUG:
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
        console.log("Active Tab URL: ", activeUrl); // DEBUG:
    });
});

// chrome window leave, enter
chrome.windows.onFocusChanged.addListener(function(windowId) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        console.log("All Chrome windows are now unfocused.");
        // TODO: need an exit active site / url
        //updateStoredData(activeUrl, true);

    } else {
        console.log(`Chrome window with ID ${windowId} is now focused.`);
        // TODO: enter active site / url
    }
});



