

// BEGIN_IMPORT_HERE

// ===================================================== \\
// ===================================================== \\
//                     UrlDataObj
// ===================================================== \\
// ===================================================== \\

class UrlDataObj {
    constructor() {
        this.activeUrl = "";
        this.startTime = new Date();
        this.urlList = [];
    }

    getActiveUrl() {
        return this.activeUrl;
    }

    setActiveUrl(url) {
        this.activeUrl = url;
        this.startTime = new Date(); // Reset start time when active URL changes
    }

    appendListItem(url) {
        if (!this.urlList.some(item => item.url === url)) {
            this.urlList.push( { url: url, totalTime: 0 } );
            return true; // Indicate that a new item was appended
        }
        return false; // Indicate that the item already existed
    }

    updateUrlTime(url, currentTime = new Date()) {
        const urlObj = this.urlList.find(item => item.url === url);

        if (urlObj) {
            let elapsedTime = calcTimeElapsed(new Date(prevItem.startDate), currentTime);

            // update active item's totalTime usage
            urlObj.totalTime += elapsedTime;
            return true; // Indicate that the total time was updated
        }

        console.error(`Error: Url to be updated was not found, url: ${url}`);
        return false;
    }

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
        this.startTime = currentTime;
    }

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

    console.log(`urlDataObj - Total Pass Rate ---------------- ${passRate}/${testCount} `)
}

runAllTests();


/* ===================================================== *\
|| ===================================================== ||
||                TESTS FUNCTIONS START                  ||
|| ===================================================== ||
\* ===================================================== */

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
