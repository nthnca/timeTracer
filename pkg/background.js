
// ===================================================== \\
// ===================================================== \\
//                     UrlDataObj
// ===================================================== \\
// ===================================================== \\

class UrlDataObj {
    constructor() {
        this.activeUrl = null;
        this.startTime = null
        this.urlList = [];
    }

    /**
    * Retrieves the currently active URL being tracked.
    *
    * @returns {string} - The currently active URL, or an empty string if no URL is active.
    */
    getActiveUrl() {
        return this.activeUrl;
    }

    /**
    * Sets the currently active URL being tracked and updates the tracking start time.
    *
    * @param {string} url - The URL to set as the currently active one.
    * @param {Date} [currentTime=new Date()] - An optional Date object representing the
    * starting time for this active URL. Defaults to the current timestamp if not provided,
    * allowing for easier testing.
    */
    appendListItem(url) {
        if (!this.urlList.some(item => item.url === url)) {
            this.urlList.push( { url: url, totalTime: 0 } );
            return true; // Indicate that a new item was appended
        }
        return false; // Indicate that the item already existed
    }

    /**
    * Starts a new tracking session for a given URL.
    * It sets the 'activeUrl' to the provided URL and the 'startTime' to the
    * provided 'currentTime' (or the current timestamp if not provided).
    * Logs an error and returns false if 'startTime' or 'activeUrl' are already
    * truthy when attempting to start a new session.
    *
    * @param {string} url - The URL to set as the currently active one to start tracking.
    * @param {Date} [currentTime=new Date()] - An optional Date object representing the
    * starting time of the session. Defaults to the current timestamp if not provided,
    * allowing for easier testing.
    * @returns {boolean} - True if the session was started successfully, false otherwise
    * (e.g., if a session was already active).
    */
    startSession(url, currentTime = new Date()) {
        if (this.startTime || this.activeUrl) {
            console.error("Error: startTime / activeUrl should never be true on enter ",
                "old startTime: ", this.startTime,
                "old activeUrl: ", this.activeUrl,
                "new startTime: ", currentTime,
                "new activeUrl: ", url
            );
        }

        this.activeUrl = url;
        this.startTime = currentTime;
    }

    /**
    * Ends the currently active tracking session and records the elapsed time.
    * It finds the active URL in the urlList, calculates the time elapsed since
    * the 'startTime', adds it to the 'totalTime' of the corresponding item,
    * and resets the 'startDate' and 'isActive' properties of that item.
    * It also resets the 'activeUrl' and 'startTime' of the TrackingData object.
    * Logs an error if no active item is found.
    *
    * @param {Date} [currentTime=new Date()] - An optional Date object representing the
    * ending time of the session. Defaults to the current timestamp if not provided,
    * allowing for easier testing.
    */
    endSession(currentTime = new Date()) {
        if (this.activeUrl == null) {
            console.error("Error: activeItem was null when endSession was called.");
        }

        const activeItem = this.urlList.find(item => item.url === this.activeUrl);
        const elapsedTime = this.calcTimeElapsed(this.startTime, currentTime);

        if (activeItem) {
            activeItem.totalTime += elapsedTime;

        } else {
            // TODO: update tests to cover this case
            // add item to list
            this.urlList.push( {
                url: this.activeUrl,
                totalTime: elapsedTime
            })
        }
        this.activeUrl = null;
        this.startTime = null;
    }

    /**
     * Converts the TrackingData object into a JSON string.
     * Date objects are converted to ISO 8601 string format for serialization.
     *
     * @returns {string} - A JSON string representing the TrackingData.
     * The string includes 'activeUrl', 'startTime' (as an ISO string or null), and
     * 'urlList' (an array of objects with 'url' and 'totalTime' properties).
     */
    toJSONString() {
        const jsonObject = {
            activeUrl: this.activeUrl,
            startTime: this.startTime ? this.startTime.toISOString() : null,
            urlList: this.urlList.map(item => ({
                url: item.url,
                totalTime: item.totalTime
            }))
        };
        return JSON.stringify(jsonObject);
    }

    /**
    * Creates a new UrlDataObj instance from a JSON string.
    * It attempts to parse the JSON string and populate the properties
    * of a new UrlDataObj. Date strings in the JSON are converted back
    * to Date objects. Handles potential JSON parsing errors and returns null
    * in case of an error.
    *
    * @param {string} jsonString - The JSON string to parse.
    * @returns {UrlDataObj|null} - A new UrlDataObj instance populated with
    * data from the JSON string, or null if an error occurred during parsing.
    */
    fromJSONString(jsonString) {
        try {
            // check the obj is of the right type
            if (!(typeof jsonString === "string")) {
                console.error("Error: jsonString not instance of String - fromJSONString()");
                console.error("jsonString Typeof:", typeof jsonString);
            }
            const jsonObj = JSON.parse(jsonString);

            const trackingData = new UrlDataObj();
            trackingData.activeUrl = jsonObj.activeUrl;
            trackingData.startTime = jsonObj.startTime ? new Date(jsonObj.startTime) : null;
            trackingData.urlList = jsonObj.urlList ? jsonObj.urlList.map(item => ({
                url: item.url,
                totalTime: item.totalTime
            })) : [];

            return trackingData;

        } catch (error) {
            console.error("Error parsing JSON:", error);
            return null;
        }
    }

    /**
    * Calculates the time elapsed between a given start date and the current time, in milliseconds.
    *
    * @param {Date} useStartDate - The starting date to calculate the elapsed time from.
    * @returns {number} The time elapsed in milliseconds.
    */
    calcTimeElapsed(startDate, endDate) {

        // TODO: the line below this might be better then the current one
        //if (Object.prototype.toString.call(startDate) !== '[object Date]' || isNaN(startDate)) {
        if (Object.prototype.toString.call(startDate) !== '[object Date]') {
            console.error("TypeError: Parameter 'startDate' in calcTimeElapsed() must be a Date object.", startDate);
            console.trace();
            return null; // Or throw error
        }

        return endDate - startDate;
    }
}


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
            console.log(`Stored - key: ${key}, value: ${data}`);
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
        updateStoredData("", true);

    } else {
        console.log(`Chrome window with ID ${windowId} is now focused.`);

        // When focused, query for the active tab in the currently focused window.
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs && tabs.length > 0) {
                const activeTab = tabs[0];
                const activeUrl = cleanUrl(activeTab.url);

                console.log("Active Tab URL on focus:", activeUrl);
                updateStoredData(activeUrl, false); // Start tracking the newly active URL
            } else {
                console.log("No active tab found in the newly focused window.");
            }
        });
    }
});



