

// TODO: for website time spent maybe have logic that only sites that are visited more then once
//      or for longer then a user selected time are stored. That way your usage is not clutted
//      by quick hops
// TODO: added the key to urlData in local as the date for the day it was collected, this way
//      time spent can be tracked per day

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
 * Calculates the number of minutes from a given number of milliseconds.
 *
 * @param {number} milliseconds - The number of milliseconds.
 * @returns {number} The number of minutes.
 */
function minutesFromMilliseconds(milliseconds) {
  return milliseconds / (1000 * 60);
}

// END_IMPORT_HERE

// ===================================================== \\
// ===================================================== \\
//                    Test Helpers
// ===================================================== \\
// ===================================================== \\

// this mute code is from:
//   https://www.bomberbot.com/javascript/how-to-silence-your-javascript-console-for-cleaner-unit-testing/
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

    console.log(`Utils - Total Pass Rate --------------------- ${passRate}/${testCount} `)
}

runAllTests();



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
