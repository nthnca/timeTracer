
//
//// RUN TESTS
//
searchDataUrls_found();
searchDataUrls_notFound();

cleanUrl_basicReddit();
cleanUrl_basicGoogleMail();
cleanUrl_basicGoogleGemini();

/* ===================================================== *\
|| search the data for a target url                      ||
||      return index (-1 if not found)
\* ===================================================== */
function searchDataUrls(targetUrl, dataList) {
    for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].url === targetUrl) {
            return i;
        }
    };
    return -1;
}

//
//// search index tests
//

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
    } else {
        console.log(`searchDataUrls_found ------------------------ ❗ `);
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
    } else {
        console.log(`searchDataUrls_notFound --------------------- ❗ `);
    }
}


/* ===================================================== *\
|| Extract the top level domain from the URL             ||
\* ===================================================== */
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

//
//// clean url tests
//

function cleanUrl_basicReddit() {
    // setup
    let dirtyUrl = "https://www.reddit.com/r/linux/";

    // exercises
    let cleanedUrl = cleanUrl(dirtyUrl);

    // check / test
    if (cleanedUrl == "www.reddit.com") {
        console.log(`cleanUrl_basicReddit ------------------------ ✔️ `);
    } else {
        console.log(`cleanUrl_basicReddit ------------------------ ❗ `);
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
    } else {
        console.log(`cleanUrl_basicGoogleMail -------------------- ❗ `);
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
    } else {
        console.log(`cleanUrl_basicGoogleGemini ------------------ ❗ `);
    }
}
