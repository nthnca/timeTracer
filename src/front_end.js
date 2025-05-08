


//  TODO: - DOCUMENTATION -- add file commnets to each js file also add a smaller
//      but similer to the readme layout
//
//  TODO: - MAINTENANCE -- see if there is a way to easily test extension performance impact
//
//  TODO: - FEATURE -- add a button to clear / reset all local data (check the chrome API)
//  TODO: - FEATURE -- add % of total time spent on each site (later)
//  TODO: - FEATURE -- get the data on display (live update???)
//  TODO: - FEATURE -- allow pausing of tracking
//  TODO: - FEATURE -- store dates in a obj and use dates as the key for a days url tracking
//          { dayX: date-xyz, dayY: date-abc } also if you can get a list of keys stored in
//          local this will be easy to clean up and check if days need to be cleaned

// BEGIN_IMPORT_HERE

// ===================================================== \\
// ===================================================== \\
//                      Main Script
// ===================================================== \\
// ===================================================== \\

/**
 * Sets the innerHTML of a specified HTML element by its ID.
 * If the element with the given ID is not found, it logs an error to the console.
 *
 * @param {string} htmlId - The ID of the HTML element to modify.
 * @param {string} htmlContent - The HTML string to inject into the element.
 */
function setHtmlById(htmlId, htmlContent) {
  const contentDiv = document.getElementById(htmlId);

  if (contentDiv) {
    contentDiv.innerHTML = htmlContent;
  } else {
    console.error(`HTML element with ID "${htmlId}" not found.`);
  }
}

/**
 * Asynchronously retrieves website tracking data and displays it in an HTML table
 * within the element having the ID 'content-div'.
 * It fetches the data using 'getSiteObjData', formats it into an HTML table using
 * 'getUrlListAsTable', and then injects the HTML into the specified DOM element.
 *
 * @async
 * @returns {Promise<void>} - A Promise that resolves after the data is fetched and displayed.
 */
async function dispayUrlData() {
    // get the data on display (live update???)
    let data = await getSiteObjData();

    // format the data
    let html = getUrlListAsTable(data.urlList);

    // inject the data
    setHtmlById('content-div', html);
}

dispayUrlData();

// END_IMPORT_HERE
