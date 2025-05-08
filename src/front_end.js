
// TODO:
//      __MVP__
//      [ ] get the data on display (live update???)
//      [ ] format the data
//      [ ] inject the data
//
//      __after__
//      [ ] allow cleaing of data (with confirm msg)
//      [ ] pause collection

// BEGIN_IMPORT_HERE

// ===================================================== \\
// ===================================================== \\
//                      Utilities
// ===================================================== \\
// ===================================================== \\

/**
 * Generates an HTML table string from an array of URL objects.
 * The table includes columns for an example index, the site URL, and the time spent (in hours).
 * It assumes each object in the urlList has 'url' and 'totalTime' properties (in milliseconds).
 *
 * @param {Array<object>} urlList - An array of objects, where each object contains
 * at least 'url' (string) and 'totalTime' (number in milliseconds) properties.
 * @returns {string} - An HTML string representing a table displaying the URL data.
 */
function getUrlListAsTable(urlList) {
    let display = "<table>";
    display += "<thead><tr><th>#</th><th>Site Name</th><th>Time Spent</th></tr></thead>";
    display += "<tbody>";

    for (let i = 0; i < urlList.length; i++) {
        const totalHours = (urlList[i].totalTime / (1000 * 60 * 60)).toFixed(2); // Assuming totalTime is in milliseconds
        display += `<tr>`;
        display += `<td>${i + 1}</td>`; // Example 'Ex' column (row number)
        display += `<td>${urlList[i].url}</td>`;
        display += `<td>${totalHours} hours</td>`;
        display += `</tr>`;
    }

    display += "</tbody>";
    display += "</table>";
    return display;
}

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

// ===================================================== \\
// ===================================================== \\
//                      Main Script
// ===================================================== \\
// ===================================================== \\

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
    // [ ] get the data on display (live update???)
    let data = await getSiteObjData();

    // [ ] format the data
    let html = getUrlListAsTable(data.urlList);

    // [ ] inject the data
    setHtmlById('content-div', html);
}

dispayUrlData();

// END_IMPORT_HERE

// ===================================================== \\
// ===================================================== \\
//                    Tests Runner
// ===================================================== \\
// ===================================================== \\

async function runAllTests() {
    let testCount = 0;
    let passRate = 0;
    console.log("\n------ ---- ---- -- front_end -- ---- ---- ------")

    testCount += 1;
    passRate += testGetUrlListDisplay_basic();
    console.log();

    console.log(`Front_end - Total Pass Rate ----------------- ${passRate}/${testCount} `)
}

runAllTests();

// ===================================================== \\
// ===================================================== \\
//                      Tests
// ===================================================== \\
// ===================================================== \\

function testGetUrlListDisplay_basic() {
    // setup
    const testData = {
        activeUrl: null,
        startTime: null,
        urlList: [
            { url: "reddit.com", totalTime: 0},
            { url: "google.com", totalTime: 0}
        ],
    };
    const expectedOutput = `
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Site Name</th>
              <th>Time Spent</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>reddit.com</td>
              <td>0.00 hours</td>
            </tr>
            <tr>
              <td>2</td>
              <td>google.com</td>
              <td>0.00 hours</td>
            </tr>
          </tbody>
        </table>
    `.split('\n').map(line => line.trim()).filter(line => line !== '').join(''); // removes the newlines and tabs

    // exercise
    const actualOutput = getUrlListAsTable(testData.urlList);

    // check / test
    if (actualOutput === expectedOutput) {
        console.log(`testGetUrlListDisplay_basic ----------------- ✔️`);
        return 1;
    } else {
        console.log(`testGetUrlListDisplay_basic ----------------- ❗`);
        console.log(`Expected: "${expectedOutput}"`);
        console.log()
        console.log(`Actual:   "${actualOutput}"`);
        return 0;
    }
}
