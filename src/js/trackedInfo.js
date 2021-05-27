document.addEventListener("DOMContentLoaded", function () {
  const bg = chrome.extension.getBackgroundPage();
  Object.keys(bg.videos).forEach(function (url) {
    if (url !== "data") {
    }
    console.log(url);
    const div = document.createElement("div");
    div.textContent = `${bg.videos[url].title}: ${bg.videos[url].views}`;
    document.body.appendChild(div);
  });

  document.querySelector("#reset").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "reset" });
    console.log("reset signal sent");
  });

  document.querySelector("#getData").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "getData" });
  });
});
