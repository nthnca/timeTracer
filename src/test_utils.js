
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

// this is a mock of the real function that uses the chrome API
async function setActiveUrlIndex(index) {
    index; // silence unused var warning
}

// this is a mock of the real function that uses the chrome API
async function getActiveUrlIndex() {
    return 0;
}

// ===================================================== \\
// ===================================================== \\
//                   Run Tests
// ===================================================== \\
// ===================================================== \\

async function runAllTests() {
    let testCount = 0;
    let passRate = 0;
    console.log("\n------ ---- ---- ---- utils ---- ---- ---- ------")

    passRate += searchDataUrls_found();
    passRate += searchDataUrls_notFound();
    testCount += 2;
    console.log();

    testCount += 3;
    passRate += cleanUrl_basicReddit();
    passRate += cleanUrl_basicGoogleMail();
    passRate += cleanUrl_basicGoogleGemini();
    console.log();

    testCount += 1;
    passRate += minutesFromMilliseconds_basic();
    console.log();

    //testCount += 1;
    //passRate += await endAndRecordSession_basic();
    console.log();

    testCount += 1;
    passRate += await startTrackingSession_basic();
    console.log();

    console.log(`Utils - Total Pass Rate --------------------- ${passRate}/${testCount} `)
}

runAllTests();

// BEGIN_IMPORT_HERE

// ===================================================== \\
// ===================================================== \\
//                      Utilities
// ===================================================== \\
// ===================================================== \\

function createTrackingObj() {
    return {
        activeUrl: null,
        activeUrlStartDate: null,
        urlList: [] // list of {url: "google.com", totalTime: 1000 /* ms */}
    }
}

function createNewUrlListItem(newUrl) {
    return {
        url: newUrl,
        totalTime: 0,
    };
}

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
 * It updates the 'startDate' to the ISO 8601 format of the provided 'currentTime'
 * (or the current timestamp if no 'currentTime' is provided) and sets 'isActive'
 * to true for the website object at the given index in the site list.
 * It also sets this index as the currently active site.
 * Logs an error if 'startDate' or 'isActive' are already truthy before starting.
 *
 * @async
 * @param {Array<object>} siteList - An array of website objects being tracked.
 * Each object is expected to have properties like 'url', 'startDate', 'isActive', and 'totalTime'.
 * @param {number} newUrlIndex - The index in the siteList of the website to start tracking.
 * @param {Date} [currentTime=new Date()] - An optional Date object representing the starting time.
 * Defaults to the current timestamp if not provided, allowing for easier testing.
 * @returns {Promise<void>} - A Promise that resolves when the session is started and the active index is set.
 */
async function startTrackingSession(siteList, newUrlIndex, currentTime = new Date()) {
    let newItem = siteList[newUrlIndex];

    // log error if (startDate, isActive) are not (null, false)
    if (newItem.startDate || newItem.isActive) {
        // TODO: write a test for this path
        console.error("Error: startDate should never be true on enter ", newItem);
    }

    // set new values
    newItem.startDate = currentTime.toISOString();
    newItem.isActive = true;
    setActiveUrlIndex(newUrlIndex);
}

/**
 * Asynchronously ends the tracking session for a previously active website and records the usage time.
 * It retrieves the website object at the provided 'prevActiveIndex', calculates the time
 * elapsed between its 'startDate' and the provided 'currentTime' (or the current
 * timestamp if no 'currentTime' is provided), adds this elapsed time to its 'totalTime',
 * and then resets its 'startDate' to null and 'isActive' to false.
 *
 * @async
 * @param {Array<object>} siteList - An array of website objects being tracked.
 * Each object is expected to have properties like 'startDate', 'isActive', and 'totalTime'.
 * @param {number} prevActiveIndex - The index in the siteList of the website whose session is ending.
 * @param {Date} [currentTime=new Date()] - An optional Date object representing the ending time.
 * Defaults to the current timestamp if not provided, allowing for easier testing.
 * @returns {Promise<void>} - A Promise that resolves when the session is ended and the usage time is recorded.
 */
async function endAndRecordSession(siteList, prevActiveIndex, currentTime = new Date()) {
    // find prev item
    let prevItem = siteList[prevActiveIndex];

    // calc usage time
    let elapsedTime = calcTimeElapsed(new Date(prevItem.startDate), currentTime);
    // update values
    prevItem.totalTime += elapsedTime;
    prevItem.startDate = null;
    prevItem.isActive = false;
}

// END_IMPORT_HERE


/* ===================================================== *\
|| ===================================================== ||
||                      TESTS START                      ||
|| ===================================================== ||
\* ===================================================== */


// ===================================================== \\
// search index tests
// ===================================================== \\

// test basic string match and search
function searchDataUrls_found() {
    // setup
    let target = "google.com";
    let data = [
        {
            url: target // stored in obj at index 0
        },
        {
            url: "poodle.com"
        }
    ]

    // exercises
    let index = searchDataUrls(target, data);

    // check / test
    if (index == 0) {
        // pass if the string match is found in obj at index 0
        console.log(`searchDataUrls_found ------------------------ ✔️ `);
        return 1;
    } else {
        console.log(`searchDataUrls_found ------------------------ ❗ `);
        return 0;
    }
}

// test basic string match and search
//      target obj not in list
function searchDataUrls_notFound() {
    // setup
    let data = [
        {
            url:  "google.com"
        },
        {
            url: "poodle.com"
        }
    ]

    // exercises
    let index = searchDataUrls("taco.com", data); // target not in list

    // check / test
    if (index == -1) {
        // pass if the string match is not found in list (-1 return)
        console.log(`searchDataUrls_notFound --------------------- ✔️ `);
        return 1;
    } else {
        console.log(`searchDataUrls_notFound --------------------- ❗ `);
        return 0;
    }
}


// ===================================================== \\
// clean url tests
// ===================================================== \\

function cleanUrl_basicReddit() {
    // setup
    let dirtyUrl = "https://www.reddit.com/r/linux/";

    // exercises
    let cleanedUrl = cleanUrl(dirtyUrl);

    // check / test
    if (cleanedUrl == "www.reddit.com") {
        console.log(`cleanUrl_basicReddit ------------------------ ✔️ `);
        return 1;
    } else {
        console.log(`cleanUrl_basicReddit ------------------------ ❗ `);
        return 0;
    }
}

// does this read as a sub domain of google?
function cleanUrl_basicGoogleMail() {
    // setup
    let dirtyUrl = "https://mail.google.com/mail/u/0/#inbox";

    // exercises
    let cleanedUrl = cleanUrl(dirtyUrl);

    // check / test
    if (cleanedUrl == "mail.google.com") {
        console.log(`cleanUrl_basicGoogleMail -------------------- ✔️ `);
        return 1;
    } else {
        console.log(`cleanUrl_basicGoogleMail -------------------- ❗ `);
        return 0;
    }
}

// does this read as a sub domain of google?
function cleanUrl_basicGoogleGemini() {
    // setup
    let dirtyUrl = "https://gemini.google.com/app/";

    // exercises
    let cleanedUrl = cleanUrl(dirtyUrl);

    // check / test
    if (cleanedUrl == "gemini.google.com") {
        console.log(`cleanUrl_basicGoogleGemini ------------------ ✔️ `);
        return 1;
    } else {
        console.log(`cleanUrl_basicGoogleGemini ------------------ ❗ `);
        return 0;
    }
}

// minutes from milli-secs test
function minutesFromMilliseconds_basic() {
    //setup
    let milliSecs = 600000;

    //exercise
    const time = minutesFromMilliseconds(milliSecs);

    // check / test
    if (time == 10) { // should come to 10 minutes
        console.log(`minutesFromMilliseconds --------------------- ✔️ `);
        return 1;
    } else {
        console.log(`minutesFromMilliseconds --------------------- ❗ `);
        return 0;
    }
}

// test that endAndRecordSession sets:
//      activeItem.totalTime =+ elpsed time
//      this.activeUrl = null;
//      this.startTime = null;
async function endAndRecordSession_basic() {
    // setup
    let testList = [
        { // this is the active url
            url: "google.com",
            startDate: new Date(2024, 0, 7, 11, 0, 0, 0),   // Example: January 7, 2024, 11:00 AM
            totalTime: 10, // in ms
            isActive: true,
        },
        {
            url: "reddit.com",
            startDate: null,
            totalTime: 0, // in ms
            isActive: false,
        }
    ]

    // exercise
    await endAndRecordSession(testList, 0, new Date(2024, 0, 7, 11, 10, 0, 0));

    // check / test
    let updatedItemIndex = await getActiveUrlIndex(); // a mock of the function in endAndRecordSession
    let url = testList[updatedItemIndex].url;
    let startDate = testList[updatedItemIndex].startDate;
    let totalTime = testList[updatedItemIndex].totalTime;
    let isActive = testList[updatedItemIndex].isActive;

    if (
        url === "google.com"
            && !isActive
            && startDate == null
            && totalTime === 600010 // should be 600,000 ms
    ) {
        console.log(`endAndRecordSession_basic ------------------- ✔️ `);
        return 1;
    } else {
        console.log(`endAndRecordSession_basic --------------------❗ `);
        console.log(`url:        ${url} == google.com = ${url === "google.com"}`)
        console.log(`isActive:   ${isActive} == false = ${!isActive}`)
        console.log(`startDate:  ${startDate} == null = ${startDate == null}`)
        console.log(`total Time: ${totalTime} == 600010 = ${600010}`)
        return 0;
    }
}

// test startTrackingSession basic
async function startTrackingSession_basic() {

    // setup
    let testList = [
        { // this is the active url
            url: "google.com",
            startDate: null,
            totalTime: 10, // in ms
            isActive: false,
        },
        {
            url: "reddit.com",
            startDate: null,
            totalTime: 0, // in ms
            isActive: false,
        }
    ]

    let currentDate = new Date(2024, 0, 7, 11, 10, 0, 0); // Example: January 7, 2024, 11:10 AM

    // exercise
    await startTrackingSession(testList, 0, currentDate);

    // check / test
    let updatedItemIndex = await getActiveUrlIndex(); // a mock of the function used in endAndRecordSession
    let url = testList[updatedItemIndex].url;
    let startDate = testList[updatedItemIndex].startDate; // not tested due to date obj use
    let totalTime = testList[updatedItemIndex].totalTime;
    let isActive = testList[updatedItemIndex].isActive;

    if (
        url === "google.com"
            && isActive
            && totalTime == 10
            && startDate === currentDate.toISOString()
    ) {
        console.log(`startTrackingSession_basic ------------------ ✔️ `);
        return 1;
    } else {
        console.log(`startTrackingSession_basic ------------------ ❗ `);
        console.log(`url:        ${url} == google.com = ${url === "google.com"}`)
        console.log(`isActive:   ${isActive} == false = ${!isActive}`)
        console.log(`startDate:  ${startDate} == ${currentDate.toISOString()} = ${startDate == null}`)
        return 0;
    }
}
