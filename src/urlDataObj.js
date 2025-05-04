

// BEGIN_IMPORT_HERE

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
            // TODO: write a test for this path
            console.error("Error: startTime / activeUrl should never be true on enter ",
                "old startTime: ", this.startTime,
                "old activeUrl: ", this.activeUrl,
                "new startTime: ", currentTime,
                "new activeUrl: ", url
            );
            return false;
        }

        this.activeUrl = url;
        this.startTime = currentTime.toISOString();
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
        const activeItem = this.urlList.find(item => item.url === this.activeUrl);

        if (activeItem) {
            const elapsedTime = calcTimeElapsed(this.startTime, currentTime);

            activeItem.totalTime += elapsedTime;
            activeItem.startDate = null;
            activeItem.isActive = false;

            this.activeUrl = null;
            this.startTime = null;
        }
        console.error("Error: activeItem was null when endSession was called.");
    }

    /**
    * Converts the TrackingData object into a JSON-compatible object.
    * Date objects are converted to ISO 8601 string format for serialization.
    *
    * @returns {object} - An object representing the TrackingData, suitable for JSON stringification.
    * The object includes 'activeUrl', 'startTime' (as an ISO string or null), and
    * 'urlList' (an array of objects with 'url' and 'totalTime' properties).
    */
    toJSON() {
        return {
            activeUrl: this.activeUrl,
            startTime: this.startTime ? this.startTime.toISOString() : null, // Convert Date to ISO string for JSON
            urlList: this.urlList.map(item => ({
                url: item.url,
                totalTime: item.totalTime
            }))
        };
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
    static fromJSON(jsonString) {
        try {
            const jsonObj = JSON.parse(jsonString);
            const trackingData = new UrlDataObj();

            trackingData.activeUrl = jsonObj.activeUrl || "";
            trackingData.startTime = jsonObj.startTime ? new Date(jsonObj.startTime) : null;
            trackingData.urlList = jsonObj.urlList ? jsonObj.urlList.map(item => ({
                url: item.url || "",
                totalTime: item.totalTime || 0
            })) : [];

            return trackingData;

        } catch (error) {
            console.error("Error parsing JSON:", error);
            return null;
        }
    }
}

// END_IMPORT_HERE

// ===================================================== \\
// ===================================================== \\
//                   Run Tests
// ===================================================== \\
// ===================================================== \\

async function runAllTests() {
    let testCount = 0;
    let passRate = 0;
    console.log("\n\n------ ---- ---- - urlDataObj  - ---- ---- ------")

    passRate += test_appendListItem_basic();
    passRate += test_AppendListItem_existing();
    testCount += 2;
    console.log();

    passRate += test_startSession_newSession();
    passRate += test_startSession_existingSession();
    testCount += 2;
    console.log();

    console.log(`urlDataObj - Total Pass Rate ---------------- ${passRate}/${testCount} `)
}

runAllTests();


/* ===================================================== *\
|| ===================================================== ||
||                TESTS FUNCTIONS START                  ||
|| ===================================================== ||
\* ===================================================== */

// test if the url gets inserted and all data match's
function test_appendListItem_basic() {
    // setup
    const trackerObj = new UrlDataObj();
    const initialLength = trackerObj.urlList.length;
    const urlToAppend = "simple-test.com";

    // exercise
    const result = trackerObj.appendListItem(urlToAppend);

    // check / test
    const finalLength = trackerObj.urlList.length;
    const addedItem = trackerObj.urlList[finalLength -1];
    const itemUrl = addedItem.url;
    const itemTime = addedItem.totalTime;

    if ( result === true
        && finalLength === initialLength + 1
        && itemUrl == urlToAppend
        && itemTime == 0
    ) {
        console.log(`test_appendListItem_basic ------------------- ✔️ `);
        return 1;
    } else {
        console.log(`test_appendListItem_basic ------------------- ❗ `);
        return 0;
    }
}

// this tests that the function returns false and does not insert
//      if the url is already in the list
function test_AppendListItem_existing() {
    // setup
    const trackerObj = new UrlDataObj();
    const existingUrl = "simple.com";
    trackerObj.urlList.push( { url: existingUrl, totalTime: 4 } );
    const initialLength = trackerObj.urlList.length;

    // exercise
    const result = trackerObj.appendListItem(existingUrl);

    // check / test
    const finalLength = trackerObj.urlList.length;

    if ( result === false && finalLength === initialLength ) {
        console.log(`test_AppendListItem_existing ---------------- ✔️ `);
        return 1;
    } else {
        console.log(`test_AppendListItem_existing ---------------- ❗ `);
        return 0;
    }
}

// this tests the basic if things are set right
function test_startSession_newSession() {
    // setup
    const trackerObj = new UrlDataObj();
    const testUrl = "new-session.com";
    const testTime = new Date(2024, 0, 7, 10, 0, 0, 0); // Example: January 7, 2024, 10:00 AM

    // exercise
    trackerObj.startSession(testUrl, testTime);

    // check / test
    const newStartTime = trackerObj.startTime;
    const newActiveUrl = trackerObj.activeUrl;

    if (newStartTime === testTime.toISOString()
        && newActiveUrl === testUrl
    ) {
        console.log(`test_startSession_newSession ---------------- ✔️ `);
        return 1;
    } else {
        console.log(`test_startSession_newSession ---------------- ❗ `);
        console.log("newStartTime === testTime:", newStartTime === testTime, newStartTime);
        console.log("newActiveUrl === testUrl: ", newActiveUrl === testUrl, newActiveUrl);
        return 0;
    }
}

// this tests if session is set when starting new
//      this should error / return false
function test_startSession_existingSession() {
    // setup
    const trackerObj = new UrlDataObj();
    trackerObj.activeUrl = "initial.com";
    trackerObj.startTime = new Date(2024, 0, 7, 10, 0, 0, 0); // Example: January 7, 2024, 10:00 AM
    const newUrl = "new-session.com";
    const newTime = new Date(2024, 0, 7, 10, 10, 0, 0); // Example: January 7, 2024, 10:10 AM

    // exercise
    const result = trackerObj.startSession(newUrl, newTime);

    // check / test

    if (!result) { // did we error
        console.log(`test_startSession_existingSession ----------- ✔️ `);
        return 1;
    } else {
        console.log(`test_startSession_existingSession ----------- ❗ `);
        return 0;
    }
}
