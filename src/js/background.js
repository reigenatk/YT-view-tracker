// background script always running

// add jquery
var script = document.createElement("script");
script.src = "src/js/jquery.js";
script.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(script);

var script = document.createElement("script");
script.src = "src/js/config.js";
script.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(script);

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
  console.log(window.videos);
};

let eraseLocalStorage = () => {
  chrome.storage.local.set({ data: {} }, function () {});
  window.videos = {};
  console.log(window.videos);
};
// eraseLocalStorage();

let getStorage = () => {
  chrome.storage.local.get("data", function (data) {
    return data["data"];
  });
};

var isYTContentEnabled = true;
let re = "www.youtube.com/watch?v=";

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
  if (req.type == "add-view") {
    if (req.url in window.videos) {
      window.videos[req.url].views = window.videos[req.url].views + 1;
      window.videos[req.url].dates.push(req.date);
      update();
      sendResponse({
        views: window.videos[req.url].views,
        enabled: isYTContentEnabled,
      });
    } else {
      $.getJSON(
        "https://noembed.com/embed",
        { format: "json", url: req.url },
        function (data) {
          let videoTitle = data.title;
          window.videos[req.url] = {
            title: videoTitle,
            views: 1,
            dates: [req.date],
          };
          update();
          sendResponse({
            views: window.videos[req.url].views,
            enabled: isYTContentEnabled,
          });
        }
      );
    }
  }

  // if bg script detects a reload, run content script to add a view
  if (req.type == "pageRefreshed") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currTab = tabs[0]; // should only be one

      if (currTab.url.indexOf(re) > -1) {
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

  if (req.type == "getDataSize") {
    chrome.storage.local.get("data", function (data) {
      let size = roughSizeOfObject(data);
      let sizeInKB = size / 1024;
      sizeInKB = sizeInKB.toFixed(2);
      console.log(sizeInKB);
      sendResponse({ spaceTaken: sizeInKB });
    });
  }

  if (req.type == "getData") {
    console.log(window.videos);
    let numViews = window.videos[req.url];
    if (numViews) {
      sendResponse({
        views: numViews.views,
      });
    } else {
      sendResponse({
        views: 0,
      });
    }
    // console.log("sending " + numViews + " views for " + req.url);
  }

  if (req.type == "isYTContentEnabled") {
    sendResponse({
      enabled: isYTContentEnabled,
    });
  }

  if (req.type == "toggleYTEnable") {
    isYTContentEnabled = !isYTContentEnabled;
    sendResponse({ enabled: isYTContentEnabled });
  }
  return true;
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // we want to run the content script if the page is reloaded from a yt video,
  // or if we visit a yt video from another yt video
  // or if we visit a yt video from a site that isn't a yt video

  // the last 2 cases are covered here via changeInfo.url
  // the reloads case is covered in the part above

  if (tab.url.indexOf(re) > -1) {
    if (changeInfo.url) {
      chrome.tabs.executeScript(tabId, {
        runAt: "document_start",
        file: "src/js/content.js",
      });
    }
  }
});

// chrome.tabs.onActivated.addListener(function (changeInfo) {
//   chrome.tabs.executeScript(changeInfo.tabId, {
//     runAt: "document_start",
//     file: "src/js/content.js",
//   });
// });

// taken from https://stackoverflow.com/questions/1248302/how-to-get-the-size-of-a-javascript-object
function roughSizeOfObject(object) {
  var objectList = [];
  var stack = [object];
  var bytes = 0;

  while (stack.length) {
    var value = stack.pop();

    if (typeof value === "boolean") {
      bytes += 4;
    } else if (typeof value === "string") {
      bytes += value.length * 2;
    } else if (typeof value === "number") {
      bytes += 8;
    } else if (typeof value === "object" && objectList.indexOf(value) === -1) {
      objectList.push(value);

      for (var i in value) {
        stack.push(value[i]);
      }
    }
  }
  return bytes;
}
