// background script always running
chrome.runtime.onInstalled.addListener(function () {
  console.log("ran bg scripts");
  window.videos = {};

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

      sendResponse({ views: window.videos[req.url].views });
    }
    if (req.type == "pageRefreshed") {
      console.log("page refresh");
      console.log("executing script");
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currTab = tabs[0];
        if (currTab) {
          console.log(currTab.id);
          chrome.tabs.executeScript(currTab.id, {
            runAt: "document_end",
            file: "src/js/content.js",
          });
        }
      });
    }
  });

  let re = "www.youtube.com/watch?v=";
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // we want to run the content script if the page is reloaded from a yt video,
    // or if we visit a yt video from another yt video
    // or if we visit a yt video from a site that isn't a yt video

    // changeInfo === undefined if it is a reload
    // first expression checks for a reload on yt
    //

    // if (PerformanceNavigationTiming.type == "reload") {
    //   console.log("reload detected");
    //   chrome.runtime.sendMessage({
    //     type: "reload",
    //   });
    // }

    console.log(tab.url);
    if (tab.url.indexOf(re) > -1) {
      console.log(changeInfo);
      if (changeInfo.url) {
        console.log("executing script");
        chrome.tabs.executeScript(tabId, {
          runAt: "document_end",
          file: "src/js/content.js",
        });
      }
      //   chrome.tabs.sendMessage(tabId, {
      //     message: "TabUpdated",
      //   });
    }
  });
});
