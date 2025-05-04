
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
            const elapsedTime = this.calcTimeElapsed(this.startTime, currentTime);

            activeItem.totalTime += elapsedTime;

            this.activeUrl = null;
            this.startTime = null;
        } else {
            console.error("Error: activeItem was null when endSession was called.");
            return false;
        }
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

// END_IMPORT_HERE

// ===================================================== \\
// ===================================================== \\
//                    Test Helpers
// ===================================================== \\
// ===================================================== \\

// this mute code is from: https://www.bomberbot.com/javascript/how-to-silence-your-javascript-console-for-cleaner-unit-testing/
console.original = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  trace: console.trace
};

function muteConsole() {
  console.log = function() {};
  console.info = function() {};
  console.warn = function() {}
  console.error = function() {};
  console.trace = function() {};
}

function unmuteConsole() {
  console.log = console.original.log;
  console.info = console.original.info;
  console.warn = console.original.warn;
  console.error = console.original.error;
  console.trace = console.original.trace;
}


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

    // TODO: add a test to ensure that the totalTime += works right
    // TODO: add a test to ensure that the if item not exists errors right
    passRate += test_endSession_basic();
    testCount += 1;
    console.log();

    testCount += 4;
    passRate += calcTimeElapsed_minutes();
    passRate += calcTimeElapsed_hours();
    passRate += calcTimeElapsed_doubleDate();
    passRate += calcTimeElapsed_doubleDateFix();
    console.log()

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
    muteConsole();
    const result = trackerObj.startSession(newUrl, newTime);
    unmuteConsole();

    // check / test

    if (!result) { // did we error
        console.log(`test_startSession_existingSession ----------- ✔️ `);
        return 1;
    } else {
        console.log(`test_startSession_existingSession ----------- ❗ `);
        return 0;
    }
}

// test that endAndRecordSession sets:
//      activeItem.totalTime =+ elpsed time
//      this.activeUrl = null;
//      this.startTime = null;
function test_endSession_basic() {
    // Setup
    const trackerObj = new UrlDataObj();
    const testUrl = "test-url.com";
    trackerObj.activeUrl = testUrl;
    trackerObj.startTime = new Date(2024, 0, 1, 10, 0, 0); // Example start time
    trackerObj.urlList.push( { url: testUrl, totalTime: 4 } );

    const endTime = new Date(2024, 0, 1, 10, 30, 0); // Example end time (30 minutes later)
    const expectedElapsedTime = (endTime - trackerObj.startTime) + 4; // in milli sec

    // Exercise
    trackerObj.endSession(endTime);

    // Check / Test
    const endedSessionUrl = trackerObj.activeUrl;
    const endedSessionStartTime = trackerObj.startTime;
    const targetItem = trackerObj.urlList.find(item => item.url === testUrl);

    if (
        endedSessionUrl === null &&
        endedSessionStartTime === null &&
        targetItem && // Make sure targetItem exists
        targetItem.totalTime === expectedElapsedTime &&
        trackerObj.startTime === null
    ) {
        console.log(`test_endSession_basic ----------------------- ✔️ `);
        return 1;
    } else {
        console.log(`test_endSession_basic ----------------------- ❗ `);
        console.log("endedSessionUrl:       ", endedSessionUrl === null);
        console.log("endedSessionStartTime: ", endedSessionStartTime === null);
        console.log("targetItem:            ", !!targetItem);
        console.log("targetItem.totalTime:  ", targetItem.totalTime === expectedElapsedTime);
        console.log("targetItem.startDate   ", trackerObj.startTime === null);
        return 0;
    }
}

// Calc time Elapsed tests
function calcTimeElapsed_minutes() {
    //setup
    const trackerObj = new UrlDataObj();
    const startDate = new Date(2024, 0, 7, 10, 30, 0, 0); // Example: January 7, 2024, 10:30 AM
    const endDate = new Date(2024, 0, 7, 10, 40, 0, 0); // Example: January 7, 2024, 10:40 AM

    //exercise
    const time = trackerObj.calcTimeElapsed(startDate, endDate);

    // check / test
    if (time == 600000) {
        console.log(`calcTimeElapsed_minutes --------------------- ✔️ `);
        return 1;
    } else {
        console.log(`calcTimeElapsed_minutes --------------------- ❗ `);
        return 0;
    }
}

// Calc time Elapsed tests
function calcTimeElapsed_hours() {
    //setup
    const trackerObj = new UrlDataObj();
    const startDate = new Date(2024, 0, 7, 10, 30, 0, 0); // Example: January 7, 2024, 10:00 AM
    const endDate = new Date(2024, 0, 7, 11, 30, 0, 0);   // Example: January 7, 2024, 11:00 AM

    //exercise
    const time = trackerObj.calcTimeElapsed(startDate, endDate);

    // check / test
    // 1 hour = 60 minutes * 60 seconds/minute * 1000 milliseconds/second = 3,600,000
    if (time == 3600000) {
        console.log(`calcTimeElapsed_hours ----------------------- ✔️ `);
        return 1;
    } else {
        console.log(`calcTimeElapsed_hours ----------------------- ❗ `);
        console.log(time);
        return 0;
    }
}

// Calc time Elapsed tests
//      test if startDate is a date obj
//      if not trough err
function calcTimeElapsed_doubleDate() {
    //setup
    const trackerObj = new UrlDataObj();
    const startDate = "January 7, 2024, 11:00 AM";
    const endDate = new Date(2024, 0, 7, 11, 30, 0, 0);   // Example: January 7, 2024, 11:00 AM

    //exercise
    muteConsole();
    const time = trackerObj.calcTimeElapsed(startDate, endDate);
    unmuteConsole();

    // check / test
    // error and return null
    if (time == null) {
        console.log(`calcTimeElapsed_doubleDate ------------------ ✔️ `);
        return 1;
    } else {
        console.log(`calcTimeElapsed_doubleDate------------------- ❗ `);
        console.log(time);
        return 0;
    }
}

// Calc time Elapsed tests
//      test if startDate is a date obj
//      if not trough err
function calcTimeElapsed_doubleDateFix() {
    //setup
    const trackerObj = new UrlDataObj();
    let startDate = new Date(2024, 0, 7, 11, 0, 0, 0);   // Example: January 7, 2024, 11:00 AM
    const endDate = new Date(2024, 0, 7, 11, 0, 0, 0);   // Example: January 7, 2024, 11:00 AM
    startDate = JSON.stringify(startDate.toISOString());
    startDate = JSON.parse(startDate);
    startDate = new Date(startDate);

    // BUG: get this to work
    //exercise
    muteConsole();
    const time = trackerObj.calcTimeElapsed(startDate, endDate);
    unmuteConsole();

    // check / test
    if (time == 0) {
        console.log(`calcTimeElapsed_doubleDateFix --------------- ✔️ `);
        return 1;
    } else {
        console.log(`calcTimeElapsed_doubleDateFix --------------- ❗ `);
        console.log(time);
        return 0;
    }
}
