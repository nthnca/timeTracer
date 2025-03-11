
import { extractBaseUrl } from './src/utils'

// ===================================================== \\
// ===================================================== \\
//                      Utilities
// ===================================================== \\
// ===================================================== \\



// ===================================================== \\
// ===================================================== \\
//                      Main Script
// ===================================================== \\
// ===================================================== \\


chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
  if (changeInfo.url) {
    console.log("URL changed: " + extractBaseUrl(changeInfo.url));
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  console.log(`Tab activated: Tab ID = ${activeInfo.tabId}`);

  chrome.tabs.get(activeInfo.tabId, function(tab){
    if(chrome.runtime.lastError){
      console.error(chrome.runtime.lastError);
      return;
    }
    console.log("Active Tab URL: ", extractBaseUrl(tab.url));
  });
});
