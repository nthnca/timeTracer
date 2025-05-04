
// ===================================================== \\
// ===================================================== \\
//                      Utilities
// ===================================================== \\
// ===================================================== \\

/**
 * Searches an array of data objects for a specific URL and returns its index.
 *
 * This function iterates through an array of data objects, comparing the 'url' property of each
 * object to the provided target URL.  It returns the index of the first object where the URLs match.
 *
 * @param {string} targetUrl - The URL to search for.
 * @param {Array<{url: string}>} dataList - An array of data objects, each containing a 'url' property (string).
 * @returns {number} The index of the object with the matching URL, or -1 if no match is found.
 *
 * @example
 * const data = [{ url: 'a' }, { url: 'b' }, { url: 'c' }];
 * // Returns 1
 * searchDataUrls('b', data);
 *
 * @example
 * const data = [{ url: 'a' }, { url: 'b' }, { url: 'c' }];
 * // Returns -1
 * searchDataUrls('d', data);
 */
function searchDataUrls(targetUrl, dataList) {
    for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].url === targetUrl) {
            return i;
        }
    };
    return -1;
}

/**
 * Cleans and simplifies a URL string.
 *
 * This function takes a URL string, removes any path, query parameters, or hash fragments,
 * and optionally removes the "https://" protocol. It returns the cleaned URL origin.
 *
 * @param {string} url - The URL string to clean.
 * @returns {string|null} The cleaned URL origin (e.g., "example.com"), or null if the URL is invalid or empty.
 *
 * @example
 * // Returns "example.com"
 * cleanUrl("https://example.com/path/to/resource?query=string#hash");
 */
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

/**
 * Calculates the time elapsed between a given start date and the current time, in milliseconds.
 *
 * @param {Date} useStartDate - The starting date to calculate the elapsed time from.
 * @returns {number} The time elapsed in milliseconds.
 */
function calcTimeElapsed(startDate, endDate) {

    // TODO: the line below this might be better then the current one
    //if (Object.prototype.toString.call(startDate) !== '[object Date]' || isNaN(startDate)) {
    if (Object.prototype.toString.call(startDate) !== '[object Date]') {
        console.error("TypeError: Parameter 'startDate' in calcTimeElapsed() must be a Date object.", startDate);
        console.trace();
        return null; // Or throw error
    }

    return endDate - startDate;
}

/**
 * Calculates the number of minutes from a given number of milliseconds.
 *
 * @param {number} milliseconds - The number of milliseconds.
 * @returns {number} The number of minutes.
 */
function minutesFromMilliseconds(milliseconds) {
  return milliseconds / (1000 * 60);
}

/**
 * Asynchronously starts a new tracking session for a website.
 * It updates the 'startDate' to the current timestamp in ISO 8601 format
 * and sets 'isActive' to true for the website object at the given index
 * in the site list. It also sets this index as the currently active site.
 * Logs an error if 'startDate' or 'isActive' are already truthy before starting.
 *
 * @async
 * @param {Array<object>} siteList - An array of website objects being tracked.
 * Each object is expected to have properties like 'url', 'startDate', 'isActive', and 'totalTime'.
 * @param {number} newUrlIndex - The index in the siteList of the website to start tracking.
 * @returns {Promise<void>} - A Promise that resolves when the session is started and the active index is set.
 */
async function startTrackingSession(siteList, newUrlIndex) {
    let newItem = siteList[newUrlIndex];

    // log error if (startDate, isActive) are not (null, false)
    if (newItem.startDate || newItem.isActive) {
        // TODO: write a test for this path
        console.error("Error: startDate should never be true on enter ", newItem);
    }

    // set new values
    newItem.startDate = (new Date()).toISOString();
    newItem.isActive = true;
    setActiveUrlIndex(newUrlIndex);
}

/**
 * Asynchronously ends the tracking session for a previously active website and records the usage time.
 * It retrieves the website object at the provided 'prevActiveIndex', calculates the time
 * elapsed since its 'startDate', adds this time to its 'totalTime', and then resets
 * its 'startDate' to null and 'isActive' to false.
 *
 * @async
 * @param {Array<object>} siteList - An array of website objects being tracked.
 * Each object is expected to have properties like 'startDate', 'isActive', and 'totalTime'.
 * @param {number} prevActiveIndex - The index in the siteList of the website whose session is ending.
 * @returns {Promise<void>} - A Promise that resolves when the session is ended and the usage time is recorded.
 */
async function endAndRecordSession(siteList, prevActiveIndex) {
    // find prev item
    let prevItem = siteList[prevActiveIndex];

    // calc usage time
    let elapsedTime = calcTimeElapsed(new Date(prevItem.startDate), new Date());
    // update values
    prevItem.totalTime += elapsedTime;
    prevItem.startDate = null;
    prevItem.isActive = false;
}


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
 */
// TODO: change name to update activeUrlSession?
async function updateStoredData(newActiveUrl, stopTracking) {
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
                startDate: (new Date()).toISOString(),
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



