
// BEGIN_IMPORT_HERE

// ===================================================== \\
// ===================================================== \\
//                      Utilities
// ===================================================== \\
// ===================================================== \\

/* ===================================================== *\
|| Format and display the collected data for each site   ||
\* ===================================================== */
function formatDisplaySiteStats() {
    let urlData = retrieveData("urlData");
    let display = "DATA:";

    urlData.foreach((item) => {
        display += "\n" + item;
    })

    return display;
}

/* ===================================================== *\
|| Display data to html page                             ||
\* ===================================================== */
function dispayToPage(currentUrl) {
    document.getElementById('currUrl').textContent = "Curr Page " + currentUrl;

    formatDisplaySiteStats().then(display => {
        document.getElementById('urlData').textContent = display;
    });
}

// ===================================================== \\
// ===================================================== \\
//                      Main Script
// ===================================================== \\
// ===================================================== \\


// END_IMPORT_HERE

