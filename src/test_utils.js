
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

searchDataUrls_found();
searchDataUrls_notFound();
console.log()

cleanUrl_basicReddit();
cleanUrl_basicGoogleMail();
cleanUrl_basicGoogleGemini();
console.log()

calcTimeElapsed_minutes();
calcTimeElapsed_hours();
calcTimeElapsed_doubleDate();
calcTimeElapsed_doubleDateFix();
console.log()

minutesFromMilliseconds_basic();

// BEGIN_IMPORT_HERE

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

    // TODO: 
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
        return true;
    } else {
        console.log(`searchDataUrls_found ------------------------ ❗ `);
        return false;
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
        return true;
    } else {
        console.log(`searchDataUrls_notFound --------------------- ❗ `);
        return false;
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
        return true;
    } else {
        console.log(`cleanUrl_basicReddit ------------------------ ❗ `);
        return false;
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
        return true;
    } else {
        console.log(`cleanUrl_basicGoogleMail -------------------- ❗ `);
        return false;
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
        return true;
    } else {
        console.log(`cleanUrl_basicGoogleGemini ------------------ ❗ `);
        return false;
    }
}

// Calc time Elapsed tests
function calcTimeElapsed_minutes() {
    //setup
    const startDate = new Date(2024, 0, 7, 10, 30, 0, 0); // Example: January 7, 2024, 10:30 AM
    const endDate = new Date(2024, 0, 7, 10, 40, 0, 0); // Example: January 7, 2024, 10:40 AM

    //exercise
    const time = calcTimeElapsed(startDate, endDate);

    // check / test
    if (time == 600000) {
        console.log(`calcTimeElapsed_minutes --------------------- ✔️ `);
        return true;
    } else {
        console.log(`calcTimeElapsed_minutes --------------------- ❗ `);
        return false;
    }
}

// Calc time Elapsed tests
function calcTimeElapsed_hours() {
    //setup
    const startDate = new Date(2024, 0, 7, 10, 30, 0, 0); // Example: January 7, 2024, 10:00 AM
    const endDate = new Date(2024, 0, 7, 11, 30, 0, 0);   // Example: January 7, 2024, 11:00 AM

    //exercise
    const time = calcTimeElapsed(startDate, endDate);

    // check / test
    // 1 hour = 60 minutes * 60 seconds/minute * 1000 milliseconds/second = 3,600,000
    if (time == 3600000) {
        console.log(`calcTimeElapsed_hours ----------------------- ✔️ `);
        return true;
    } else {
        console.log(`calcTimeElapsed_hours ----------------------- ❗ `);
        console.log(time);
        return false;
    }
}

// Calc time Elapsed tests
//      test if startDate is a date obj
//      if not trough err
function calcTimeElapsed_doubleDate() {
    //setup
    const startDate = "January 7, 2024, 11:00 AM";
    const endDate = new Date(2024, 0, 7, 11, 30, 0, 0);   // Example: January 7, 2024, 11:00 AM

    //exercise
    muteConsole();
    const time = calcTimeElapsed(startDate, endDate);
    unmuteConsole();

    // check / test
    // error and return null
    if (time == null) {
        console.log(`calcTimeElapsed_doubleDate ------------------ ✔️ `);
        return true;
    } else {
        console.log(`calcTimeElapsed_doubleDate------------------- ❗ `);
        console.log(time);
        return false;
    }
}

// Calc time Elapsed tests
//      test if startDate is a date obj
//      if not trough err
function calcTimeElapsed_doubleDateFix() {
    //setup
    let startDate = new Date(2024, 0, 7, 11, 0, 0, 0);   // Example: January 7, 2024, 11:00 AM
    const endDate = new Date(2024, 0, 7, 11, 0, 0, 0);   // Example: January 7, 2024, 11:00 AM
    startDate = JSON.stringify(startDate.toISOString());
    startDate = JSON.parse(startDate);
    startDate = new Date(startDate);

    // BUG: get this to work
    //exercise
    muteConsole();
    const time = calcTimeElapsed(startDate, endDate);
    unmuteConsole();

    // check / test
    if (time == 0) {
        console.log(`calcTimeElapsed_doubleDateFix --------------- ✔️ `);
        return true;
    } else {
        console.log(`calcTimeElapsed_doubleDateFix --------------- ❗ `);
        console.log(time);
        return false;
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
        return true;
    } else {
        console.log(`minutesFromMilliseconds --------------------- ❗ `);
        return false;
    }
}

// test_endAndRecordSession_basic
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
    await endAndRecordSession(testList);

    // check / test
    let updatedItemIndex = await getActiveUrlIndex(); // a mock of the function in endAndRecordSession
    let url = testList[updatedItemIndex].url;
    let startDate = testList[updatedItemIndex].startDate;
    let totalTime = testList[updatedItemIndex].totalTime;
    let isActive = testList[updatedItemIndex].isActive;
    let timeElapsed = calcTimeElapsed(new Date(2024, 0, 7, 11, 0, 0, 0), new Date()); // new Date is used in endAndRecSess
    const tolerance = 100; // the new Date in the test is made slightly earlier then in the function being tested

    if (
        url === "google.com"
            && !isActive
            && startDate == null
            && Math.abs(totalTime - timeElapsed) <= tolerance
    ) {
        console.log(`endAndRecordSession_basic ------------------- ✔️ `);
        return 1;
    } else {
        console.log(`endAndRecordSession_basic --------------------❗ `);
        console.log(`url:        ${url} == google.com = ${url === "google.com"}`)
        console.log(`isActive:   ${isActive} == false = ${!isActive}`)
        console.log(`startDate:  ${startDate} == null = ${startDate == null}`)
        console.log(`total Time: ${totalTime} == ${timeElapsed} = ${Math.abs(totalTime - timeElapsed) <= tolerance}`)
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

    // exercise
    await startTrackingSession(testList, 0);

    // check / test
    let updatedItemIndex = await getActiveUrlIndex(); // a mock of the function used in endAndRecordSession
    let url = testList[updatedItemIndex].url;
    //let startDate = testList[updatedItemIndex].startDate; // not tested due to date obj use
    let totalTime = testList[updatedItemIndex].totalTime;
    let isActive = testList[updatedItemIndex].isActive;

    if (
        url === "google.com"
            && isActive
            && totalTime == 10
    ) {
        console.log(`startTrackingSession_basic ------------------ ✔️ `);
        return 1;
    } else {
        console.log(`startTrackingSession_basic ------------------ ❗ `);
        return 0;
    }
}
