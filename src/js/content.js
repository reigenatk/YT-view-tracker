// content script runs whenever we have a match

console.log("content script");

if (document.readyState !== "loading") {
  console.log("document is already ready, just execute code here");
  fireContentLoadedEventTimeout();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("document was not ready, place code here");
    fireContentLoadedEventTimeout();
  });
}

function fireContentLoadedEventTimeout() {
  setTimeout(function () {
    changeUIBack();
  }, 100);
  setTimeout(function () {
    fireContentLoadedEvent();
  }, 1000);
  // 1 second for the scripts to load the right values
  // this isn't the most elegant solution but I think it will work
  // basically the issue I was having is that the script is running too early, and
  // so when I do the query selectors to get innerHTML there isn't anything in the
  // h1 yet. That's why we do a short pause. For a decently fast internet
  // connection this should suffice
}

function changeUIBack() {
  // first change views back to normal format
  let view_words = document
    .getElementsByClassName(
      "view-count style-scope ytd-video-view-count-renderer"
    )[0]
    .innerText.split(" ");

  document.getElementsByClassName(
    "view-count style-scope ytd-video-view-count-renderer"
  )[0].innerText = view_words[0] + " views";
  console.log("change back to normal format");
}

function fireContentLoadedEvent() {
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
  console.log("everything has loaded, starting UI changes");

  let videoTitle =
    document.querySelector("h1").firstChild.nextSibling.innerText;
  console.log(videoTitle);

  let addView = () => {
    console.log("view added");
    const d = new Date();
    let dateString =
      d.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }) +
      monthNames[d.getMonth()] +
      " " +
      d.getDay() +
      ", " +
      d.getFullYear();

    chrome.runtime.sendMessage(
      {
        type: "add-view",
        url: window.location.href,
        title: videoTitle,
        date: dateString,
      },
      (response) => {
        // after we receive the number of views on this video, update it in UI
        let updated_num_of_views = response.views;

        document.getElementsByClassName(
          "view-count style-scope ytd-video-view-count-renderer"
        )[0].innerText += ", " + updated_num_of_views + " by you";
        console.log("updated UI");
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
