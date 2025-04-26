
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
 */
async function updateStoredData(newActiveUrl) {
    let key = "siteList";
    let siteList = await getChromeLocalData(key);

    // create list if null
    if (!siteList) {
        siteList = [];
    }

    // find urls index in list
    let newUrlIndex = searchDataUrls(newActiveUrl, siteList);

    // if not in list
    if (newUrlIndex == -1) {

        // data storage struc
        let newListItem = {
            url: newActiveUrl,
            startDate: (new Date()).toISOString(),
            totalTime: 0,
            isActive: true,
        };

        // update list
        siteList.push(newListItem);
        setActiveUrlIndex(siteList.length - 1);

    } else { // if in list

        // find prev item index
        let prevActiveIndex = await getActiveUrlIndex();
        let prevItem = siteList[prevActiveIndex];

        // calc usage time
        let elapsedTime = calcTimeElapsed(new Date(prevItem.startDate), new Date());
        // update values
        prevItem.totalTime += elapsedTime;
        prevItem.startDate = null;
        prevItem.isActive = false;

        // set new current url obj values
        let newItem = siteList[newUrlIndex];
        newItem.startDate = (new Date()).toISOString();
        newItem.isActive = true;
        setActiveUrlIndex(newUrlIndex);
    }

    storeChromeLocalData(key, siteList);
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
        if(chrome.runtime.lastError) {
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
        // TODO: need an exit active site / url

    } else {
        console.log(`Chrome window with ID ${windowId} is now focused.`);
        // TODO: enter active site / url
    }
});



