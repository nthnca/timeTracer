// ==============================================
// Get current active tab URL
//  From Google Gemini (Bard)
// ==============================================
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs && tabs.length > 0) {
        const currentTab = tabs[0];
        const currentUrl = currentTab.url;

        if (currentUrl) {
            console.log("Current URL:", currentUrl);
            // You can now use the 'currentUrl' variable as needed.
            document.getElementById('urlDisplay').textContent = currentUrl;
        } else {
            console.log("Could not get URL");
            document.getElementById('urlDisplay').textContent = "Could not get URL";
        }
    } else {
        console.log("Could not find active tab");
        document.getElementById('urlDisplay').textContent = "Could not find active tab";
    }
});


// NOTE: for website time spent maybe have logic that only sites that are visited more then once
//      or for longer then a user selected time are stored. That way your useage is not clutted
//      by quick hops
