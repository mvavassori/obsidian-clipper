/* global chrome */
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    // Redirect to the options page
    chrome.runtime.openOptionsPage();
  }
  if (details.reason === "update") {
    chrome.runtime.openOptionsPage();
  }
});
