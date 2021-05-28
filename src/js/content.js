// content script runs whenever we have a match

var dateObjectToString = (d) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let a =
    d.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }) +
    ", " +
    monthNames[d.getMonth()] +
    " " +
    d.getDay() +
    ", " +
    d.getFullYear();

  return a;
};

var intervalID = window.setInterval(checkIfContentLoaded, 100);

function checkIfContentLoaded() {
  let view_words = document.getElementsByClassName(
    "view-count style-scope ytd-video-view-count-renderer"
  )[0];
  // console.log(view_words);
  if (view_words) {
    // then document has finished loading, execute stuff
    window.clearInterval(intervalID);
    changeUIBack();
    fireContentLoadedEventTimeout();
  }
}

var fireReplayButtonCheck = window.setInterval(replayCheck, 500);
var wasReplay = false;

function replayCheck() {
  let playButton = document.querySelector("button.ytp-play-button.ytp-button");
  // console.log(playButton.title);
  if (playButton.title === "Replay") {
    wasReplay = true;
  } else if (playButton.title === "Pause (k)") {
    if (wasReplay) {
      // if the button went from replay to play/pause, then we know we must've replayed
      wasReplay = false;
      changeReplayUIBack();
      fireContentLoadedEventTimeout();
    }
  }
}

function changeReplayUIBack() {
  let view_words = document
    .getElementsByClassName(
      "view-count style-scope ytd-video-view-count-renderer"
    )[0]
    .innerText.split(" ");

  document.getElementsByClassName(
    "view-count style-scope ytd-video-view-count-renderer"
  )[0].innerText = view_words[0] + " views";
}

var sidePanelCount = 0;

var fireSidepanelViewLabeler = window.setInterval(sidepanelViewLabeler, 1000);

function labelSidePanel(sidePanel) {
  let url = sidePanel.href.substr(0, 43);
  // ask local storage how many times this was viewed
  // console.log("asking " + url);
  chrome.runtime.sendMessage(
    {
      type: "getData",
      url,
    },
    (response) => {
      // console.log(response.views);
      let updated_num_of_views = response.views;
      let viewListing = sidePanel.querySelector(
        "span.style-scope.ytd-video-meta-block"
      );

      viewListing.innerText += ", " + updated_num_of_views + " by you";
      // console.log("updated sidepanel " + url + " to " + updated_num_of_views);
    }
  );
}

function sidepanelViewLabeler() {
  chrome.runtime.sendMessage(
    {
      type: "isYTContentEnabled",
    },
    (res) => {
      if (res.enabled === true) {
        let allSidePanels = document.querySelectorAll(
          "a.yt-simple-endpoint.style-scope.ytd-compact-video-renderer"
        );

        if (allSidePanels.length !== sidePanelCount) {
          // then more side panels must've been added
          let numAdded = allSidePanels.length - sidePanelCount;
          sidePanelCount = allSidePanels.length;
          for (let i = 0; i < numAdded; i++) {
            labelSidePanel(allSidePanels[allSidePanels.length - 1 - i]);
          }
        }
      }
    }
  );
}

function fireContentLoadedEventTimeout() {
  setTimeout(function () {
    fireContentLoadedEvent();
  }, 500);
}

function changeUIBack() {
  // first change views back to normal format
  // also change all side panel views
  let view_words = document
    .getElementsByClassName(
      "view-count style-scope ytd-video-view-count-renderer"
    )[0]
    .innerText.split(" ");

  document.getElementsByClassName(
    "view-count style-scope ytd-video-view-count-renderer"
  )[0].innerText = view_words[0] + " views";

  // sidepanel UI revert
  let allSidePanels = document.querySelectorAll(
    "a.yt-simple-endpoint.style-scope.ytd-compact-video-renderer"
  );

  for (let i = 0; i < allSidePanels.length; i++) {
    let viewListing = allSidePanels[i].querySelector(
      "span.style-scope.ytd-video-meta-block"
    );
    let words = viewListing.innerText.split(" ");
    viewListing.innerText = words[0] + " " + words[1].slice(0, -1);
  }
  // console.log("change back to normal format");
}

function fireContentLoadedEvent() {
  // console.log("everything has loaded, starting UI changes");

  // let videoTitle =
  //   document.querySelector("h1").firstChild.nextSibling.innerText;
  // console.log(videoTitle);

  let addView = () => {
    console.log("view added");
    const d = new Date();
    let dateString = dateObjectToString(d);

    // url should always be first 43 characters
    // id is always characters 33-43 inclusive
    // this way timestamps + first time views count for the same video

    chrome.runtime.sendMessage(
      {
        type: "add-view",
        url: window.location.href.substr(0, 43),
        date: dateString,
      },
      (response) => {
        // after we receive the number of views on this video, update it in UI
        // but only update UI if it is enabled as dictated by trackedInfo.html
        if (response.enabled === true) {
          let updated_num_of_views = response.views;

          document.getElementsByClassName(
            "view-count style-scope ytd-video-view-count-renderer"
          )[0].innerText += ", " + updated_num_of_views + " by you";
        }

        console.log("updated views UI");
      }
    );
  };
  addView();

  //   let play_button = document.getElementsByClassName(
  //     "ytp-play-button ytp-button"
  //   )[0];

  //   play_button.addEventListener("click", () => {
  //     console.log(play_button);
  //     let title = play_button.getAttribute("title");
  //     console.log("title is " + title);
  //     if (title == "Replay") {
  //       // this counts as a view
  //       addView();
  //     }
  //   });
}
