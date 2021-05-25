// popup script will run when extension icon is clicked

document.addEventListener("DOMContentLoaded", function () {
  // when button is clicked, display the contents of our trackings
  document.querySelector("button").addEventListener("click", onclick, false);
  function onclick() {
    chrome.tabs.create({ url: "src/html/trackedInfo.html" });
  }
});
