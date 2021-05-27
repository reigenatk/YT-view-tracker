document.addEventListener("DOMContentLoaded", function () {
  const bg = chrome.extension.getBackgroundPage();
  let parent_div = document.querySelector(".all-videos");
  // every reload let's query the storage for what to displayt
  parent_div.innerHTML = "";

  Object.keys(bg.videos).forEach(function (url) {
    console.log(url);
    const div = document.createElement("div");
    div.classList.add("video");

    var videolink = document.createElement("a");
    videolink.href = url;
    var thumbnail = document.createElement("img");
    thumbnail.classList.add("thumbnail-img");

    // id of a youtube video always after the ?v= part
    let video_id = url.split("?v=")[1].substr(0, 11);
    thumbnail.src =
      "https://img.youtube.com/vi/" + video_id + "/maxresdefault.jpg";

    console.log(thumbnail.src);

    videolink.appendChild(thumbnail);
    div.appendChild(videolink);
    let text = document.createElement("h1");
    text.innerHTML = `${bg.videos[url].title}`;
    div.appendChild(text);

    let viewText = document.createElement("h2");
    viewText.innerHTML = `Views: ${bg.videos[url].views}`;
    div.appendChild(viewText);
    parent_div.appendChild(div);
  });

  document.querySelector("#reset").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "reset" });
    console.log("reset signal sent");
  });

  document.querySelector("#getData").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "getData" });
  });
});
