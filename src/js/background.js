// background script always running

// if clicked on icon, open up trackedInfo.html in new tab
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({
    url: chrome.extension.getURL("src/html/trackedInfo.html"),
    selected: true,
  });
});

window.videos = {};

// at the beginning we want to get whatever was left from last session
chrome.storage.local.get("data", function (data) {
  // Notify that we saved.

  window.videos = data["data"];
});

let update = () => {
  // here we set window.videos to currentData
  chrome.storage.local.set({ data: window.videos }, function () {});
};

let eraseLocalStorage = () => {
  chrome.storage.local.set({ data: {} }, function () {});
  window.videos = {};
};

// eraseLocalStorage();

let printStorage = () => {
  chrome.storage.local.get("data", function (data) {
    // Notify that we saved.
  });
};

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  if (req.type == "add-view") {
    if (req.url in window.videos) {
      window.videos[req.url].views = window.videos[req.url].views + 1;
      window.videos[req.url].dates.push(req.date);
    } else {
      window.videos[req.url] = {
        title: req.title,
        views: 1,
        dates: [req.date],
      };
    }
    update();

    sendResponse({ views: window.videos[req.url].views });
  }

  // if bg script detects a reload, run content script to add a view
  if (req.type == "pageRefreshed") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currTab = tabs[0]; // should only be one
      if (currTab) {
        chrome.tabs.executeScript(currTab.id, {
          runAt: "document_end",
          file: "src/js/content.js",
        });
      }
    });
  }

  if (req.type == "reset") {
    eraseLocalStorage();
  }

  if (req.type == "getData") {
    printStorage();
  }
});

let re = "www.youtube.com/watch?v=";
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // we want to run the content script if the page is reloaded from a yt video,
  // or if we visit a yt video from another yt video
  // or if we visit a yt video from a site that isn't a yt video

  // the last 2 cases are covered here via changeInfo.url
  // the reloads case is covered in the part above

  if (tab.url.indexOf(re) > -1) {
    if (changeInfo.url) {
      chrome.tabs.executeScript(tabId, {
        runAt: "document_end",
        file: "src/js/content.js",
      });
    }
  }
});
